import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function MutasiRek() {
  const [transaksi, setTransaksi] = useState([]);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);
  const [error, setError] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/mutasi?tanggalAwal=${tanggalAwal}&tanggalAkhir=${tanggalAkhir}`
        );
        const result = await response.json();
        if (response.ok) {
          setTransaksi(result.data);
          setFilteredTransaksi(result.data);
        } else {
          setError(result.message || "Gagal mengambil data transaksi.");
        }
      } catch (error) {
        setError("Gagal menghubungi server.");
      }
    };

    fetchTransaksi();
  }, [tanggalAwal, tanggalAkhir]);

  const filterByPeriode = (periode) => {
    const url = `http://localhost:5000/mutasi?periode=${periode}&tanggalAwal=${tanggalAwal}&tanggalAkhir=${tanggalAkhir}`;
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setFilteredTransaksi(result.data);
        }
      });
  };

  const pdfdownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Mutasi Transaksi", 14, 10);

    const headers = ["Keterangan", "Tanggal", "Nominal", "Saldo", "Keterangan Detail"];
    const rows = filteredTransaksi.map((item) => [
      item.keterangan,
      item.tanggalFormatted,
      item.nominalFormatted,
      item.saldoFormatted,
      item.keteranganDetail, 
    ]);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [255, 0, 0],
        textColor: [255, 255, 255],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
    });

    doc.save("mutasi-transaksi.pdf");
  };

  return (
    <div className="btnmut">
      <h1>Mutasi Transaksi</h1>
      <h2>Periode</h2>
      <button onClick={() => filterByPeriode("trakhir")}>transaksi terakhir</button>
      <button onClick={() => filterByPeriode("1minggu")}>transaksi minggu ini</button>
      <button onClick={() => filterByPeriode("1bulan")}>transaksi bulan ini </button>

      <h2>Jangka Waktu</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const url = `http://localhost:5000/mutasi?tanggalAwal=${tanggalAwal}&tanggalAkhir=${tanggalAkhir}`;
          fetch(url)
            .then((response) => response.json())
            .then((result) => {
              setFilteredTransaksi(result.data);
            });
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

      {filteredTransaksi.length > 0 && (
        <div>
          <button onClick={pdfdownload}>Download PDF</button>
          
          <table border="1" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Keterangan</th>
                <th>Tanggal</th>
                <th>Nominal</th>
                <th>Saldo</th>
                <th>Keterangan Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransaksi.map((item, index) => (
                <tr key={index}>
                  <td>{item.keterangan}</td>
                  <td>{item.tanggalFormatted}</td>
                  <td>{item.nominalFormatted}</td>
                  <td>{item.saldoFormatted}</td>
                  <td>{item.keteranganDetail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MutasiRek;
