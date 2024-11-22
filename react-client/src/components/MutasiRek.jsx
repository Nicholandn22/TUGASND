import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

function MutasiRek() {
  const [transaksi, setTransaksi] = useState([]);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);
  const [error, setError] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  // Fetch data transaksi
  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const response = await fetch("http://localhost:5000/mutasi");
        const result = await response.json();
        if (response.ok) {
          setTransaksi(result.data);
          setFilteredTransaksi(result.data); // Default tampilkan semua transaksi
        } else {
          setError(result.message || "Gagal mengambil data transaksi.");
        }
      } catch (error) {
        setError("Gagal menghubungi server.");
      }
    };

    fetchTransaksi();
  }, []);

  // Fungsi untuk memformat tanggal
  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fungsi untuk memfilter berdasarkan tanggal awal dan akhir
  const filterByDateRange = () => {
    if (!tanggalAwal || !tanggalAkhir) {
      setError("Harap masukkan tanggal awal dan akhir.");
      return;
    }

    const start = new Date(tanggalAwal);
    const end = new Date(tanggalAkhir);

    if (start > end) {
      setError("Tanggal awal tidak boleh lebih besar dari tanggal akhir.");
      return;
    }

    const filtered = transaksi.filter((item) => {
      const itemDate = new Date(item.tanggal);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredTransaksi(filtered);
    setError(""); // Hapus pesan error jika ada
  };

  const filterByPeriode = (periode) => {
    const now = new Date();
    let startDate;

    if (periode === "last") {
      // Tampilkan transaksi terakhir
      setFilteredTransaksi([transaksi[transaksi.length - 1]]);
      return;
    } else if (periode === "week") {
      // Seminggu terakhir
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (periode === "month") {
      // Sebulan terakhir
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const filtered = transaksi.filter(
      (item) => new Date(item.tanggal) >= startDate
    );
    setFilteredTransaksi(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Mutasi Transaksi", 14, 10);

    const headers = ["Keterangan", "Tanggal", "Nominal", "Saldo"];
    const rows = filteredTransaksi.map((item) => [
      item.keterangan,
      formatTanggal(item.tanggal),
      item.nominal,
      item.saldo,
    ]);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [255, 0, 0], // Red for header
        textColor: [255, 255, 255], // White text for header
      },
      bodyStyles: {
        textColor: [0, 0, 0], // Black text for body
      },
    });

    // Download PDF
    doc.save("mutasi-transaksi.pdf");
  };

  return (
    <div>
      <h1>Mutasi Transaksi</h1>
      <h2>Periode</h2>
      <button onClick={() => setFilteredTransaksi(transaksi)}>
        Semua Transaksi
      </button>

      <button onClick={() => filterByPeriode("last")}>
        Transaksi Terakhir
      </button>
      <button onClick={() => filterByPeriode("week")}>
        Transaksi 1 Minggu Lalu
      </button>
      <button onClick={() => filterByPeriode("month")}>
        Transaksi 1 Bulan Lalu
      </button>

      <h2>Jangka Waktu</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          filterByDateRange();
        }}
      >
        <label>
          Tanggal Awal:
          <input
            type="date"
            value={tanggalAwal}
            onChange={(e) => setTanggalAwal(e.target.value)}
          />
        </label>
        <label>
          Tanggal Akhir:
          <input
            type="date"
            value={tanggalAkhir}
            onChange={(e) => setTanggalAkhir(e.target.value)}
          />
        </label>
        <button type="submit">Filter</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {filteredTransaksi.length > 0 ? (
        <div>
          <table border="1">
            <thead>
              <tr>
                <th>Keterangan</th>
                <th>Tanggal</th>
                <th>Nominal</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransaksi.map((item) => (
                <tr key={item.id}>
                  <td>{item.keterangan}</td>
                  <td>{formatTanggal(item.tanggal)}</td>
                  <td>{item.nominal}</td>
                  <td>{item.saldo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      ) : (
        <p>Tidak ada data transaksi.</p>
      )}
    </div>
  );
}

export default MutasiRek;
