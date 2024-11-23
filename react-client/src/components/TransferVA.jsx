import React from "react";
import useTransfer from "./useTransfer"; // Import custom hook

function TransferVA() {
  const { message, formData, handleChange, handleSubmit } = useTransfer();

  return (
    <div>
      <h1>Transfer Virtual Account</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nomor VA:
          <input
            type="text"
            name="rekeningTujuan"
            value={formData.rekeningTujuan}
            onChange={handleChange}
            placeholder="Nomor VA"
            required
          />
        </label>
        <br />
        <button type="submit">simpan transaksi</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TransferVA;
