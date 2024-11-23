-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2024 at 03:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pwl_2`
--

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `keterangan` enum('Setor','Transfer') DEFAULT NULL,
  `nominal` decimal(15,2) NOT NULL,
  `tanggal` date NOT NULL,
  `saldo` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rekeningDebit` int(11) DEFAULT NULL,
  `rekeningTujuan` int(11) DEFAULT NULL,
  `KeteranganDetail` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `keterangan`, `nominal`, `tanggal`, `saldo`, `created_at`, `rekeningDebit`, `rekeningTujuan`, `KeteranganDetail`) VALUES
(1, 'Setor', 50000.00, '2024-11-01', 50000.00, '2024-11-23 02:30:28', NULL, NULL, NULL),
(2, '', 5000.00, '2024-11-23', 45000.00, '2024-11-23 02:38:31', 1234567890, 987654321, 'Transfer antar Bank (1234567890) ke (0987654321)'),
(3, '', 2000.00, '2024-11-23', 43000.00, '2024-11-23 02:41:08', 23, 332, 'Transfer antar Bank (23) ke (332)'),
(4, '', 500.00, '2024-11-23', 42500.00, '2024-11-23 02:42:29', 23, 332, 'Transfer antar Bank (23) ke (332)'),
(5, 'Transfer', 2000.00, '2024-11-23', 40500.00, '2024-11-23 02:44:31', 23, 332, 'Transfer antar Bank (23) ke (332)'),
(6, 'Transfer', 2000.00, '2024-11-23', 38500.00, '2024-11-23 02:47:20', NULL, NULL, 'Transfer antar Bank (undefined) ke (undefined)'),
(7, 'Transfer', 2000.00, '2024-11-23', 36500.00, '2024-11-23 02:49:22', NULL, NULL, 'Transfer antar Bank (undefined) ke (undefined)'),
(8, 'Transfer', 222.00, '2024-11-23', 36278.00, '2024-11-23 02:50:41', NULL, NULL, 'Transfer antar Bank (undefined) ke (undefined)'),
(9, 'Transfer', 123.00, '2024-11-23', 36155.00, '2024-11-23 03:00:24', 123, 123, 'Transfer antar Bank (123) ke (123)'),
(10, 'Transfer', 20000.00, '2024-11-23', 16155.00, '2024-11-23 03:03:25', 323, 1233, 'Transfer antar Bank (323) ke (1233)'),
(11, '', 5000.00, '2024-11-23', 11155.00, '2024-11-23 03:18:34', 123, NULL, 'Transfer ke Virtual Account dengan nomor tujuan 123 sebanyak Rp 5000,00 berhasil'),
(12, 'Transfer', 5000.00, '2024-11-23', 6155.00, '2024-11-23 03:19:11', 223344, NULL, 'Transfer ke Virtual Account dengan nomor tujuan 223344 sebanyak Rp 5000,00 berhasil'),
(13, 'Transfer', 5000.00, '2024-11-23', 1155.00, '2024-11-23 03:21:36', NULL, 223, 'Transfer ke Virtual Account dengan nomor tujuan 223 sebanyak Rp 5000,00 berhasil'),
(14, 'Setor', 200000.00, '2024-11-23', 201155.00, '2024-11-23 03:23:38', 123, 123, 'Transfer antar Bank (123) ke (123)'),
(15, 'Transfer', 5000.00, '2024-11-23', 196155.00, '2024-11-23 03:23:47', NULL, 234, 'Transfer ke Virtual Account dengan nomor tujuan 234 sebanyak Rp 5.000,00 berhasil'),
(16, 'Transfer', 6155.00, '2024-11-23', 190000.00, '2024-11-23 03:25:04', 13, 1231, 'Transfer antar Bank (13) ke (1231)'),
(17, 'Transfer', 20000.00, '2024-11-23', 170000.00, '2024-11-23 03:26:39', 2312, 123123, 'Transfer antar Bank (2312) ke (123123) Sebanyak Rp. 20.000,00'),
(18, 'Transfer', 5000.00, '2024-11-23', 165000.00, '2024-11-23 04:51:44', NULL, 2345, 'Transfer ke Virtual Account dengan nomor tujuan 2345 sebanyak Rp 5.000,00 berhasil'),
(19, 'Transfer', 5000.00, '2024-11-23', 160000.00, '2024-11-23 05:19:13', NULL, 1234567890, 'Transfer ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 5.000,00 berhasil'),
(20, 'Transfer', 5000.00, '2024-11-23', 155000.00, '2024-11-23 05:19:42', NULL, 2147483647, 'Transfer ke Virtual Account dengan nomor tujuan 2233445566 sebanyak Rp 5.000,00 berhasil'),
(21, 'Transfer', 15000.00, '2024-11-23', 140000.00, '2024-11-23 05:22:09', 1234567890, 1234567890, 'Transfer antar Bank (1234567890) ke (1234567890) Sebanyak Rp. 15.000,00'),
(22, 'Setor', 10000.00, '2024-11-01', 10000.00, '2024-11-23 05:30:35', 1234567890, NULL, 'Setor ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 10.000,00'),
(23, 'Setor', 5000.00, '2024-11-02', 15000.00, '2024-11-23 05:30:35', 1234567890, NULL, 'Setor ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 5.000,00'),
(24, 'Transfer', 3000.00, '2024-11-03', 12000.00, '2024-11-23 05:30:35', 1234567890, 2147483647, 'Transfer ke Virtual Account dengan nomor tujuan 9876543210 sebanyak Rp 3.000,00'),
(25, 'Setor', 2000.00, '2024-11-04', 14000.00, '2024-11-23 05:30:35', 1234567890, NULL, 'Setor ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 2.000,00'),
(26, 'Transfer', 5000.00, '2024-11-05', 9000.00, '2024-11-23 05:30:35', 1234567890, 2147483647, 'Transfer ke Virtual Account dengan nomor tujuan 9876543210 sebanyak Rp 5.000,00'),
(27, 'Setor', 10000.00, '2024-11-06', 19000.00, '2024-11-23 05:30:35', 1234567890, NULL, 'Setor ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 10.000,00'),
(28, 'Setor', 7000.00, '2024-11-07', 26000.00, '2024-11-23 05:30:35', 1234567890, NULL, 'Setor ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 7.000,00'),
(29, 'Transfer', 8000.00, '2024-11-08', 18000.00, '2024-11-23 05:30:35', 1234567890, 2147483647, 'Transfer ke Virtual Account dengan nomor tujuan 9876543210 sebanyak Rp 8.000,00'),
(30, 'Setor', 6000.00, '2024-11-09', 24000.00, '2024-11-23 05:30:35', 1234567890, NULL, 'Setor ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 6.000,00'),
(31, 'Transfer', 5000.00, '2024-11-10', 19000.00, '2024-11-23 05:30:35', 1234567890, 2147483647, 'Transfer ke Virtual Account dengan nomor tujuan 9876543210 sebanyak Rp 5.000,00'),
(32, 'Transfer', 5000.00, '2024-11-23', 14000.00, '2024-11-23 05:58:29', NULL, 2147483647, 'Transfer ke Virtual Account dengan nomor tujuan 2233445511 sebanyak Rp 5.000,00 berhasil'),
(33, 'Transfer', 5000.00, '2024-11-23', 9000.00, '2024-11-23 06:37:50', NULL, 1234567890, 'Transfer ke Virtual Account dengan nomor tujuan 1234567890 sebanyak Rp 5.000,00 berhasil'),
(34, 'Transfer', 200.00, '2024-11-23', 8800.00, '2024-11-23 08:51:09', 1231123411, 1231231233, 'Transfer antar Bank (1231123411) ke (1231231233) Sebanyak Rp. 200,00'),
(35, 'Transfer', 5000.00, '2024-11-23', 3800.00, '2024-11-23 08:51:21', NULL, 1122336655, 'Transfer ke Virtual Account dengan nomor tujuan 1122336655 sebanyak Rp 5.000,00 berhasil');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
