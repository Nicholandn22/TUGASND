import React, { useState } from "react";

function TranferVA() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    keterangan: "Transfer",
    nominal: "5000",
    rekeningTujuan: "",
    keteranganDetail:
      "Transfer ke Virtual Account berhasil sebanyak Rp 5.000,00",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Membuat keterangan detail dinamis
    const keteranganDetail = `Transfer ke Virtual Account dengan nomor tujuan ${formData.rekeningTujuan} sebanyak Rp ${Number(formData.nominal).toLocaleString("id-ID")},00 berhasil`;

    try {
      const response = await fetch("http://localhost:5000/transaksiva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keterangan: formData.keterangan,
          nominal: formData.nominal,
          rekeningTujuan: formData.rekeningTujuan,
          keteranganDetail: keteranganDetail,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Transaksi berhasil disimpan!");
        // Reset form data setelah berhasil
        setFormData({
          rekeningTujuan: "",
          keterangan: "Transfer",
          nominal: "5000",
          keteranganDetail:
            "Transfer ke Virtual Account berhasil sebanyak Rp 5.000,00",
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
      <h1>Transfer Virtual Billing</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="number"
            name="rekeningTujuan"
            value={formData.rekeningTujuan}
            onChange={handleChange}
            placeholder="Nomor VA"
            required
          />
        </label>
        <button type="submit">Simpan Transaksi</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TranferVA;
