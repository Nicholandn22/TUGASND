import React, { useState } from "react";

function TransferRek() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    keterangan: "",
    nominal: "",
    tanggal: "",
    rekeningtujuan: "",
    rekeningdebit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Data yang dikirim:", {
      keterangan: formData.keterangan,
      nominal: formData.nominal,
      rekeningDebit: formData.rekeningdebit,
      rekeningTujuan: formData.rekeningtujuan,
    });

    try {
      const response = await fetch("http://localhost:5000/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keterangan: formData.keterangan,
          nominal: formData.nominal,
          rekeningDebit: formData.rekeningdebit,
          rekeningTujuan: formData.rekeningtujuan,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Transaksi berhasil disimpan!");
        // Reset form data setelah berhasil
        setFormData({
          keterangan: "",
          nominal: "",
          rekeningtujuan: "",
          rekeningdebit: "",
        });
      } else {
        setMessage(result.error || "Terjadi kesalahan.");
      }
    } catch (error) {
      setMessage("Gagal menghubungi server.");
    }
  };

  return (
    <div>
      <h1>Formulir Transaksi</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="number"
            name="rekeningdebit"
            value={formData.rekeningdebit}
            onChange={handleChange}
            placeholder="Rekening Debit"
            required
          />
        </label>
        <br />
        <label>
          <input
            type="number"
            name="rekeningtujuan"
            value={formData.rekeningtujuan}
            onChange={handleChange}
            placeholder="Rekening Tujuan"
            required
          />
        </label>
        <br />
        <label>
          <input
            type="number"
            name="nominal"
            placeholder="Masukkan nominal"
            value={formData.nominal}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          <select
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
          >
            <option value="">Pilih Keterangan</option>
            <option value="Setor">Setor</option>
            <option value="Transfer">Transfer</option>
          </select>
        </label>
        <br />
        <br />
        <button type="submit">Simpan Transaksi</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TransferRek;
