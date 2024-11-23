const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Untuk parsing JSON

// Koneksi ke database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "pwl_2",
});

// Rute GET: Mengambil semua transaksi
// Rute GET: Mengambil semua transaksi berdasarkan tanggal terbaru
app.get("/mutasi", (req, res) => {
  console.log("GET request received at /mutasi");

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ message: "Koneksi database gagal." });
    }

    const query = "SELECT * FROM transaksi ORDER BY created_at DESC ";

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error fetching data:", err);
        return res
          .status(500)
          .json({ message: "Gagal mengambil data transaksi." });
      }

      res.status(200).json({ data: rows });
    });
  });
});

app.post("/transaksiva", (req, res) => {
  console.log("POST request received at /transaksi");
  const { keterangan, nominal, rekeningTujuan, keteranganDetail } = req.body;

  // Validasi input
  if (!keterangan || !nominal || !rekeningTujuan) {
    console.error("Data tidak lengkap:", {
      keterangan,
      nominal,
      rekeningTujuan,
    });
    return res.status(400).json({
      error: "No VA tujuan wajib diisi.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ error: "Koneksi database gagal." });
    }

    // Ambil saldo terbaru
    connection.query(
      "SELECT saldo FROM transaksi ORDER BY created_at DESC LIMIT 1",
      (err, rows) => {
        if (err) {
          connection.release();
          console.error("Error fetching saldo:", err);
          return res.status(500).json({ error: "Gagal mengambil saldo." });
        }

        let saldoTerbaru = rows.length > 0 ? parseFloat(rows[0].saldo) : 0; // Default saldo 0 jika tidak ada transaksi

        // Perbarui saldo berdasarkan keterangan
        if (keterangan === "Setor") {
          saldoTerbaru += parseFloat(nominal);
        } else if (keterangan === "Tarik") {
          if (saldoTerbaru < nominal) {
            connection.release();
            return res
              .status(400)
              .json({ error: "Saldo tidak mencukupi untuk penarikan." });
          }
          saldoTerbaru -= parseFloat(nominal);
        } else if (keterangan === "Transfer") {
          if (saldoTerbaru < nominal) {
            connection.release();
            return res
              .status(400)
              .json({ error: "Saldo tidak mencukupi untuk transfer." });
          }
          saldoTerbaru -= parseFloat(nominal);
        } else {
          connection.release();
          return res.status(400).json({ error: "Keterangan tidak valid." });
        }

        // Insert data transaksi
        const query = `
        INSERT INTO transaksi (keterangan, nominal, tanggal, saldo, rekeningTujuan, keteranganDetail)
        VALUES (?, ?, NOW(), ?, ?, ?)
      `;
        connection.query(
          query,
          [keterangan, nominal, saldoTerbaru, rekeningTujuan, keteranganDetail],
          (err, result) => {
            connection.release();

            if (err) {
              console.error("Error inserting transaction:", err);
              return res
                .status(500)
                .json({ error: "Gagal menyimpan transaksi." });
            }

            res.status(200).json({
              message:
                "Transaksi berhasil disimpan. Silakan transaksi lagi yaa",
              data: {
                id: result.insertId,
                keterangan,
                nominal,
                saldo: saldoTerbaru,
                rekeningTujuan,
                keteranganDetail,
              },
            });
          }
        );
      }
    );
  });
});

app.post("/transaksi", (req, res) => {
  console.log("POST request received at /transaksi");
  const { keterangan, nominal, rekeningDebit, rekeningTujuan } = req.body;

  // Validasi input
  if (!keterangan || !nominal || !rekeningDebit || !rekeningTujuan) {
    console.error("Data tidak lengkap:", {
      keterangan,
      nominal,
      rekeningDebit,
      rekeningTujuan,
    });
    return res.status(400).json({
      error:
        "Kolom keterangan, nominal, rekeningDebit, dan rekeningTujuan wajib diisi.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ error: "Koneksi database gagal." });
    }

    // Ambil saldo terbaru
    connection.query(
      "SELECT saldo FROM transaksi ORDER BY created_at DESC LIMIT 1",
      (err, rows) => {
        if (err) {
          connection.release();
          console.error("Error fetching saldo:", err);
          return res.status(500).json({ error: "Gagal mengambil saldo." });
        }

        let saldoTerbaru = rows.length > 0 ? parseFloat(rows[0].saldo) : 0; // Default saldo 0 jika tidak ada transaksi

        // Perbarui saldo berdasarkan keterangan
        if (keterangan === "Setor") {
          saldoTerbaru += parseFloat(nominal);
        } else if (keterangan === "Tarik") {
          if (saldoTerbaru < nominal) {
            connection.release();
            return res
              .status(400)
              .json({ error: "Saldo tidak mencukupi untuk penarikan." });
          }
          saldoTerbaru -= parseFloat(nominal);
        } else if (keterangan === "Transfer") {
          if (saldoTerbaru < nominal) {
            connection.release();
            return res
              .status(400)
              .json({ error: "Saldo tidak mencukupi untuk transfer." });
          }
          saldoTerbaru -= parseFloat(nominal);
        } else {
          connection.release();
          return res.status(400).json({ error: "Keterangan tidak valid." });
        }

        // Generate KeteranganDetail
        const keteranganDetail = `Transfer antar Bank (${rekeningDebit}) ke (${rekeningTujuan}) Sebanyak Rp. ${Number(nominal).toLocaleString("id-ID")},00`;

        // Insert data transaksi
        const query = `
        INSERT INTO transaksi (keterangan, nominal, tanggal, saldo, rekeningDebit, rekeningTujuan, KeteranganDetail)
        VALUES (?, ?, NOW(), ?, ?, ?, ?)
      `;
        connection.query(
          query,
          [
            keterangan,
            nominal,
            saldoTerbaru,
            rekeningDebit,
            rekeningTujuan,
            keteranganDetail,
          ],
          (err, result) => {
            connection.release();

            if (err) {
              console.error("Error inserting transaction:", err);
              return res
                .status(500)
                .json({ error: "Gagal menyimpan transaksi." });
            }

            res.status(200).json({
              message:
                "Transaksi berhasil disimpan. Silakan transaksi lagi yaa",
              data: {
                id: result.insertId,
                keterangan,
                nominal,
                saldo: saldoTerbaru,
                rekeningDebit,
                rekeningTujuan,
                keteranganDetail,
              },
            });
          }
        );
      }
    );
  });
});
// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
