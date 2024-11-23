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

// Helper function to format the date
const formatTanggal = (tanggal) => {
  const date = new Date(tanggal);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Function to filter transactions by date range
const filterByDateRange = (transaksi, tanggalAwal, tanggalAkhir) => {
  const awal = new Date(tanggalAwal);
  const akhir = new Date(tanggalAkhir);

  awal.setHours(0, 0, 0, 0);
  akhir.setHours(23, 59, 59, 999);

  if (awal > akhir) {
    throw new Error("Tanggal awal tidak boleh lebih besar dari tanggal akhir");
  }

  return transaksi.filter((item) => {
    const itemDate = new Date(item.tanggal);
    return itemDate >= awal && itemDate <= akhir;
  });
};

// Function to filter transactions by period
const filterByPeriode = (transaksi, periode) => {
  const now = new Date();
  let startDate;

  if (periode === "trakhir") {
    return [transaksi[0]]; // Transaksi terakhir
  } else if (periode === "1minggu") {
    startDate = new Date(now.setDate(now.getDate() - 7)); // Seminggu terakhir
  } else if (periode === "1bulan") {
    startDate = new Date(now.setMonth(now.getMonth() - 1)); // Sebulan terakhir
  }

  return transaksi.filter((item) => new Date(item.tanggal) >= startDate);
};
app.get("/mutasi", (req, res) => {
  console.log("GET request received at /mutasi");

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ message: "koneksi database gagal" });
    }

    const query = "SELECT * FROM transaksi ORDER BY created_at DESC";

    connection.query(query, (err, rows) => {
      connection.release();

      if (err) {
        console.error("Error fetching data:", err);
        return res
          .status(500)
          .json({ message: "gagal mengambil data transaksi" });
      }

      let filteredTransaksi = rows;

      // Handle date range filtering if parameters are provided
      if (req.query.tanggalAwal && req.query.tanggalAkhir) {
        try {
          filteredTransaksi = filterByDateRange(
            rows,
            req.query.tanggalAwal,
            req.query.tanggalAkhir
          );
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      // Handle period filtering if 'periode' parameter is provided
      if (req.query.periode) {
        filteredTransaksi = filterByPeriode(
          filteredTransaksi,
          req.query.periode
        );
      }

      // Format tanggal for each transaction and include keteranganDetail
      const result = filteredTransaksi.map((item) => ({
        ...item,
        tanggalFormatted: formatTanggal(item.tanggal),
        nominalFormatted: `Rp. ${Number(item.nominal).toLocaleString(
          "id-ID"
        )},00`,
        saldoFormatted: `Rp. ${Number(item.saldo).toLocaleString("id-ID")},00`,
        keteranganDetail: item.KeteranganDetail || "", // Ensure it's sent even if empty
      }));

      res.status(200).json({ data: result });
    });
  });
});

app.post("/transaksiva", (req, res) => {
  console.log("POST berhaisl at /transaksi");
  const { keterangan, nominal, rekeningTujuan, keteranganDetail } = req.body;

  // Validasi input
  if (!keterangan || !nominal || !rekeningTujuan) {
    console.error("Data tidak lengkap:", {
      keterangan,
      nominal,
      rekeningTujuan,
    });
    return res.status(400).json({
      error: "keterangan, nominal, rekening tujuan, dan nomor VA wajib diisi",
    });
  }

  const rekeningRegex = /^\d{10}$/;
  if (!rekeningRegex.test(rekeningTujuan)) {
    return res.status(400).json({
      error: "nomor rekening tujuan HARUS berupa 10 digit numerik",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ error: "koneksi database gagal" });
    }

    // Ambil saldo terbaru
    connection.query(
      "SELECT saldo FROM transaksi ORDER BY created_at DESC LIMIT 1",
      (err, rows) => {
        if (err) {
          connection.release();
          console.error("Error fetching saldo:", err);
          return res.status(500).json({ error: "gagal mengambil saldo" });
        }

        let saldoTerbaru = rows.length > 0 ? parseFloat(rows[0].saldo) : 0;

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
        "Kolom keterangan, nominal, rekeningDebit, dan rekeningTujuan wajib diisi",
    });
  }

  // Validasi rekening debit (10 digit numerik)
  const rekeningRegex = /^\d{10}$/; // Add this line to define rekeningRegex

  if (
    !rekeningRegex.test(rekeningDebit) &&
    !rekeningRegex.test(rekeningTujuan)
  ) {
    return res.status(400).json({
      error:
        "Nomor rekening debit dan rekening tujuan HARUS berupa 10 digit numerik",
    });
  }

  if (!rekeningRegex.test(rekeningDebit)) {
    return res.status(400).json({
      error: "Nomor rekening debit HARUS berupa 10 digit numerik",
    });
  }

  // Validasi rekening tujuan (10 digit numerik)
  if (!rekeningRegex.test(rekeningTujuan)) {
    return res.status(400).json({
      error: "Nomor rekening tujuan HARUS berupa 10 digit numerik",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).json({ error: "koneksi database gagal" });
    }

    // Ambil saldo terbaru
    connection.query(
      "SELECT saldo FROM transaksi ORDER BY created_at DESC LIMIT 1",
      (err, rows) => {
        if (err) {
          connection.release();
          console.error("Error fetching saldo:", err);
          return res.status(500).json({ error: "gagal mengambil saldo" });
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
              .json({ error: "saldo tidak mencukupi untuk penarikan" });
          }
          saldoTerbaru -= parseFloat(nominal);
        } else if (keterangan === "Transfer") {
          if (saldoTerbaru < nominal) {
            connection.release();
            return res
              .status(400)
              .json({ error: "saldo tidak mencukupi untuk transfer" });
          }
          saldoTerbaru -= parseFloat(nominal);
        } else {
          connection.release();
          return res.status(400).json({ error: "keterangan tidak valid" });
        }

        // Generate KeteranganDetail
        const keteranganDetail = `Transfer antar Bank (${rekeningDebit}) ke (${rekeningTujuan}) Sebanyak Rp. ${Number(
          nominal
        ).toLocaleString("id-ID")},00`;

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
                .json({ error: "gagal menyimpan transaksi" });
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
