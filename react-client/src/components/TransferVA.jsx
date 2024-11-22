import React, { useState } from "react";

function TranferVA() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    keterangan: "Tarik",
    nominal: "5000",
    tanggal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keterangan: formData.keterangan,
          nominal: formData.nominal,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Transaksi berhasil disimpan!");
        // Reset form data setelah berhasil
        setFormData({
          rekeningdebit: "",
          keterangan: "Tarik",
          nominal: "5000",
          tanggal: "",
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
            name="rekeningdebit"
            value={formData.rekeningdebit}
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
