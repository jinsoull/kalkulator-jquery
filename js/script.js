$(function () {   // jalan setelah halaman (DOM) siap

  // Angka disimpan sebagai teks dengan TITIK (format komputer),
  // tapi ditampilkan ke layar dengan KOMA (format Indonesia).
  let angka1 = "";       // angka pertama
  let operator = "";     // + - * /
  let angka2 = "";       // angka kedua
  let selesai = false;   // true setelah menekan "="

  // Ubah titik jadi koma untuk tampilan
  function format(teks) {
    return String(teks).replace(".", ",");
  }

  // Menampilkan isi ke layar
  function tampilkan() {
    let teks = format(angka1);
    if (operator !== "") {
      teks += " " + operator + " " + format(angka2);
    }
    $("#layar").text(teks === "" ? "0" : teks);
  }

  // Mengosongkan semua
  function reset() {
    angka1 = "";
    operator = "";
    angka2 = "";
    selesai = false;
    tampilkan();
  }

  // Menghitung angka1 (operator) angka2. Mengembalikan angka, atau "Error"
  function hitung() {
    const a = parseFloat(angka1);
    const b = parseFloat(angka2);
    if (isNaN(a) || isNaN(b)) return "Error";
    let hasil;

    switch (operator) {
      case "+": hasil = a + b; break;
      case "-": hasil = a - b; break;
      case "*": hasil = a * b; break;
      case "/":
        if (b === 0) return "Error";   // tidak boleh dibagi 0
        hasil = a / b;
        break;
    }
    // pembulatan agar 0.1 + 0.2 tidak menjadi 0.30000000000000004
    return Math.round(hasil * 100000000) / 100000000;
  }

  // Menambah digit ke angka yang sedang diketik
  function tambahDigit(digit) {
    if (selesai) { reset(); }              // mulai hitungan baru setelah "="
    let sekarang = (operator === "") ? angka1 : angka2;

    if (sekarang === "0") {
      sekarang = digit;                    // hindari 007, jadi 7
    } else if (sekarang === "-0") {
      sekarang = "-" + digit;
    } else {
      sekarang += digit;
    }

    if (operator === "") { angka1 = sekarang; } else { angka2 = sekarang; }
    tampilkan();
  }

  // Klik tombol angka 0-9
  $(".btn-angka").on("click", function () {
    tambahDigit($(this).text());
  });

  // Klik tombol koma (desimal)
  $("#koma").on("click", function () {
    if (selesai) { reset(); }
    let sekarang = (operator === "") ? angka1 : angka2;

    if (sekarang.indexOf(".") !== -1) return;   // hanya boleh satu koma
    if (sekarang === "" || sekarang === "-") {
      sekarang += "0";                           // ",5" menjadi "0,5"
    }
    sekarang += ".";

    if (operator === "") { angka1 = sekarang; } else { angka2 = sekarang; }
    tampilkan();
  });

  // Klik tombol operator
  $(".btn-operator").on("click", function () {
    const op = $(this).data("op");

    // Boleh mulai dengan minus untuk bilangan negatif, misal -5 + 2
    if (angka1 === "" && operator === "") {
      if (op === "-") { angka1 = "-"; tampilkan(); }
      return;
    }
    if (angka1 === "-") return;                  // minus saja belum angka

    // Ganti operator kalau angka kedua belum diketik
    if (operator !== "" && angka2 === "") {
      operator = op;
      tampilkan();
      return;
    }

    // Perhitungan berantai: 2 + 3 + ... hitung dulu 2 + 3
    if (angka2 !== "") {
      const hasil = hitung();
      if (hasil === "Error") {
        reset();
        $("#layar").text("Error");
        selesai = true;
        return;
      }
      angka1 = String(hasil);
      angka2 = "";
    }
    selesai = false;
    operator = op;
    tampilkan();
  });

  // Klik tombol =
  $("#sama").on("click", function () {
    if (angka1 === "" || operator === "" || angka2 === "") return;

    const hasil = hitung();

    if (hasil === "Error") {
      const pesan = (parseFloat(angka2) === 0 && operator === "/")
        ? "Error: tidak bisa bagi 0" : "Error";
      $("#layar").text(pesan);
      angka1 = ""; operator = ""; angka2 = "";
      selesai = true;
      return;
    }

    // tampilkan seperti sketsa: 12 + 5 = 17
    $("#layar").text(format(angka1) + " " + operator + " " + format(angka2) + " = " + format(hasil));
    angka1 = String(hasil);   // hasil bisa dipakai lanjut hitung
    operator = "";
    angka2 = "";
    selesai = true;
  });

  // Klik tombol C
  $("#hapus").on("click", reset);

});