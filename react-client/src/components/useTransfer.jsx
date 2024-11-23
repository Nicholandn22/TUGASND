import { useState } from "react";

const useTransfer = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    keterangan: "Transfer",
    nominal: "5000", // Nilai nominal sudah tetap
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
        setMessage("transaksi berhasil disimpan");
        // Reset form data setelah berhasil
        setFormData({
          rekeningTujuan: "",
          keterangan: "Transfer",
          nominal: "5000", // Tetap
          keteranganDetail:
            "Transfer ke Virtual Account berhasil sebanyak Rp 5.000,00",
        });
      } else {
        setMessage(result.error || "terjadi kesalahan");
      }
    } catch (error) {
      setMessage("gagal menghubungi server");
    }
  };

  return {
    message,
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useTransfer;
