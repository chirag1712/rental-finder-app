-- MySQL dump 10.13  Distrib 8.0.25, for macos11 (x86_64)
--
-- Host: localhost    Database: honkForSublet
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `address_id` int NOT NULL,
  `city` varchar(20) NOT NULL,
  `street_name` varchar(20) NOT NULL,
  `street_num` smallint NOT NULL,
  `postal_code` char(6) NOT NULL,
  `building_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `postal_code` (`postal_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES (1,'waterloo','main',12,'A1A1A1',NULL);
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AddressOf`
--

DROP TABLE IF EXISTS `AddressOf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AddressOf` (
  `posting_id` int NOT NULL,
  `address_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AddressOf`
--

LOCK TABLES `AddressOf` WRITE;
/*!40000 ALTER TABLE `AddressOf` DISABLE KEYS */;
INSERT INTO `AddressOf` VALUES (1,1);
/*!40000 ALTER TABLE `AddressOf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posting`
--

DROP TABLE IF EXISTS `Posting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posting` (
  `posting_id` int NOT NULL,
  `user_id` int NOT NULL,
  `term` set('fall','winter','spring') DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `pop` decimal(6,2) DEFAULT NULL,
  `price_per_month` decimal(6,2) NOT NULL,
  `gender_details` enum('male','female','co-ed') DEFAULT NULL,
  `rooms_available` tinyint DEFAULT NULL,
  `total_rooms` tinyint DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`posting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posting`
--

LOCK TABLES `Posting` WRITE;
/*!40000 ALTER TABLE `Posting` DISABLE KEYS */;
INSERT INTO `Posting` VALUES (1,1,NULL,'2021-07-01','2021-09-03',NULL,1200.00,NULL,NULL,NULL,NULL,'2021-06-10 00:00:00','2021-06-10 00:00:00');
/*!40000 ALTER TABLE `Posting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PostingPhoto`
--

DROP TABLE IF EXISTS `PostingPhoto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostingPhoto` (
  `posting_photo_id` int NOT NULL,
  `posting_id` int NOT NULL,
  `url` text NOT NULL,
  PRIMARY KEY (`posting_photo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostingPhoto`
--

LOCK TABLES `PostingPhoto` WRITE;
/*!40000 ALTER TABLE `PostingPhoto` DISABLE KEYS */;
INSERT INTO `PostingPhoto` VALUES (1,1,'https://i.pinimg.com/originals/48/8b/43/488b43148ad17d95811d0165251acfe3.png');
/*!40000 ALTER TABLE `PostingPhoto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` char(64) DEFAULT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `phone_num` varchar(20) DEFAULT NULL,
  `avatar` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'rain@uwaterloo.ca',NULL,'rain',NULL,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-10 13:47:51
