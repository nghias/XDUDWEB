-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quan_ly_phong_tro
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cuoc_tro_chuyen`
--

DROP TABLE IF EXISTS `cuoc_tro_chuyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuoc_tro_chuyen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_nguoi_tim_phong` int NOT NULL,
  `ma_chu_nha` int NOT NULL,
  `ma_tin_dang` int DEFAULT NULL,
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ma_nguoi_tim_phong` (`ma_nguoi_tim_phong`),
  KEY `ma_chu_nha` (`ma_chu_nha`),
  KEY `ma_tin_dang` (`ma_tin_dang`),
  CONSTRAINT `cuoc_tro_chuyen_ibfk_1` FOREIGN KEY (`ma_nguoi_tim_phong`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cuoc_tro_chuyen_ibfk_2` FOREIGN KEY (`ma_chu_nha`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cuoc_tro_chuyen_ibfk_3` FOREIGN KEY (`ma_tin_dang`) REFERENCES `tin_dang` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuoc_tro_chuyen`
--

LOCK TABLES `cuoc_tro_chuyen` WRITE;
/*!40000 ALTER TABLE `cuoc_tro_chuyen` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuoc_tro_chuyen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goi_dich_vu`
--

DROP TABLE IF EXISTS `goi_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goi_dich_vu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_goi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gia_tien` decimal(10,2) NOT NULL,
  `thoi_han_ngay` int NOT NULL,
  `muc_uu_tien` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goi_dich_vu`
--

LOCK TABLES `goi_dich_vu` WRITE;
/*!40000 ALTER TABLE `goi_dich_vu` DISABLE KEYS */;
/*!40000 ALTER TABLE `goi_dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hinh_anh_tin`
--

DROP TABLE IF EXISTS `hinh_anh_tin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hinh_anh_tin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_tin_dang` int NOT NULL,
  `duong_dan_anh` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `la_anh_bia` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ma_tin_dang` (`ma_tin_dang`),
  CONSTRAINT `hinh_anh_tin_ibfk_1` FOREIGN KEY (`ma_tin_dang`) REFERENCES `tin_dang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinh_anh_tin`
--

LOCK TABLES `hinh_anh_tin` WRITE;
/*!40000 ALTER TABLE `hinh_anh_tin` DISABLE KEYS */;
/*!40000 ALTER TABLE `hinh_anh_tin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_mua_goi`
--

DROP TABLE IF EXISTS `lich_su_mua_goi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_su_mua_goi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_chu_nha` int NOT NULL,
  `ma_goi` int NOT NULL,
  `ngay_bat_dau` timestamp NOT NULL,
  `ngay_ket_thuc` timestamp NOT NULL,
  `trang_thai` enum('dang_hoat_dong','het_han','cho_thanh_toan') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_chu_nha` (`ma_chu_nha`),
  KEY `ma_goi` (`ma_goi`),
  CONSTRAINT `lich_su_mua_goi_ibfk_1` FOREIGN KEY (`ma_chu_nha`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_mua_goi_ibfk_2` FOREIGN KEY (`ma_goi`) REFERENCES `goi_dich_vu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_mua_goi`
--

LOCK TABLES `lich_su_mua_goi` WRITE;
/*!40000 ALTER TABLE `lich_su_mua_goi` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_mua_goi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_phong`
--

DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_phong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_loai` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_phong`
--

LOCK TABLES `loai_phong` WRITE;
/*!40000 ALTER TABLE `loai_phong` DISABLE KEYS */;
/*!40000 ALTER TABLE `loai_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vai_tro` enum('nguoi_tim_phong','chu_nha','quan_tri') COLLATE utf8mb4_unicode_ci NOT NULL,
  `anh_dai_dien` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` enum('hoat_dong','khoa') COLLATE utf8mb4_unicode_ci DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tien_ich`
--

DROP TABLE IF EXISTS `tien_ich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tien_ich` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_tien_ich` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bieu_tuong` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tien_ich`
--

LOCK TABLES `tien_ich` WRITE;
/*!40000 ALTER TABLE `tien_ich` DISABLE KEYS */;
/*!40000 ALTER TABLE `tien_ich` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tien_ich_tin_dang`
--

DROP TABLE IF EXISTS `tien_ich_tin_dang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tien_ich_tin_dang` (
  `ma_tin_dang` int NOT NULL,
  `ma_tien_ich` int NOT NULL,
  PRIMARY KEY (`ma_tin_dang`,`ma_tien_ich`),
  KEY `ma_tien_ich` (`ma_tien_ich`),
  CONSTRAINT `tien_ich_tin_dang_ibfk_1` FOREIGN KEY (`ma_tin_dang`) REFERENCES `tin_dang` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tien_ich_tin_dang_ibfk_2` FOREIGN KEY (`ma_tien_ich`) REFERENCES `tien_ich` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tien_ich_tin_dang`
--

LOCK TABLES `tien_ich_tin_dang` WRITE;
/*!40000 ALTER TABLE `tien_ich_tin_dang` DISABLE KEYS */;
/*!40000 ALTER TABLE `tien_ich_tin_dang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_dang`
--

DROP TABLE IF EXISTS `tin_dang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tin_dang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_chu_nha` int NOT NULL,
  `tieu_de` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `gia_thue` decimal(12,2) NOT NULL,
  `dien_tich` decimal(8,2) NOT NULL,
  `ma_loai_phong` int DEFAULT NULL,
  `trang_thai` enum('hoat_dong','an','da_cho_thue','cho_duyet') COLLATE utf8mb4_unicode_ci DEFAULT 'cho_duyet',
  `luot_xem` int DEFAULT '0',
  `ngay_dang` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ma_chu_nha` (`ma_chu_nha`),
  KEY `ma_loai_phong` (`ma_loai_phong`),
  CONSTRAINT `tin_dang_ibfk_1` FOREIGN KEY (`ma_chu_nha`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tin_dang_ibfk_2` FOREIGN KEY (`ma_loai_phong`) REFERENCES `loai_phong` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_dang`
--

LOCK TABLES `tin_dang` WRITE;
/*!40000 ALTER TABLE `tin_dang` DISABLE KEYS */;
/*!40000 ALTER TABLE `tin_dang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_dang_da_luu`
--

DROP TABLE IF EXISTS `tin_dang_da_luu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tin_dang_da_luu` (
  `ma_nguoi_dung` int NOT NULL,
  `ma_tin_dang` int NOT NULL,
  `ngay_luu` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_nguoi_dung`,`ma_tin_dang`),
  KEY `ma_tin_dang` (`ma_tin_dang`),
  CONSTRAINT `tin_dang_da_luu_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tin_dang_da_luu_ibfk_2` FOREIGN KEY (`ma_tin_dang`) REFERENCES `tin_dang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_dang_da_luu`
--

LOCK TABLES `tin_dang_da_luu` WRITE;
/*!40000 ALTER TABLE `tin_dang_da_luu` DISABLE KEYS */;
/*!40000 ALTER TABLE `tin_dang_da_luu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_nhan`
--

DROP TABLE IF EXISTS `tin_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tin_nhan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_cuoc_tro_chuyen` int NOT NULL,
  `ma_nguoi_gui` int NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `da_doc` tinyint(1) DEFAULT '0',
  `ngay_gui` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ma_cuoc_tro_chuyen` (`ma_cuoc_tro_chuyen`),
  KEY `ma_nguoi_gui` (`ma_nguoi_gui`),
  CONSTRAINT `tin_nhan_ibfk_1` FOREIGN KEY (`ma_cuoc_tro_chuyen`) REFERENCES `cuoc_tro_chuyen` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tin_nhan_ibfk_2` FOREIGN KEY (`ma_nguoi_gui`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_nhan`
--

LOCK TABLES `tin_nhan` WRITE;
/*!40000 ALTER TABLE `tin_nhan` DISABLE KEYS */;
/*!40000 ALTER TABLE `tin_nhan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vi_tri`
--

DROP TABLE IF EXISTS `vi_tri`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vi_tri` (
  `ma_tin_dang` int NOT NULL,
  `tinh_thanh_pho` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quan_huyen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phuong_xa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_duong` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi_chi_tiet` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vi_do` decimal(10,8) DEFAULT NULL,
  `kinh_do` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`ma_tin_dang`),
  CONSTRAINT `vi_tri_ibfk_1` FOREIGN KEY (`ma_tin_dang`) REFERENCES `tin_dang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vi_tri`
--

LOCK TABLES `vi_tri` WRITE;
/*!40000 ALTER TABLE `vi_tri` DISABLE KEYS */;
/*!40000 ALTER TABLE `vi_tri` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-26 14:45:13
