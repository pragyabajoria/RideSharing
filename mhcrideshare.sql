CREATE DATABASE  IF NOT EXISTS `mhcrideshare` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `mhcrideshare`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: mhcrideshare
-- ------------------------------------------------------
-- Server version	5.6.23-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zipcode` varchar(45) DEFAULT NULL,
  `lastridedate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Smith College','Northampton','MA','01063','0000-00-00 00:00:00'),(3,'Amherst College','Amherst','MA','01002','0000-00-00 00:00:00'),(4,'Bradley Airport','Windsor Locks','CT','06096','0000-00-00 00:00:00'),(5,'New York City','New York','NY','10001','0000-00-00 00:00:00'),(6,'Boston','Boston','MA','02110','0000-00-00 00:00:00'),(7,'Springfield Bus Terminal','Springfield','MA','01103','0000-00-00 00:00:00'),(8,'Holyoke Mall','Holyoke','MA','01040','0000-00-00 00:00:00'),(9,'Mount Holyoke College','South Hadley','MA','01075','0000-00-00 00:00:00'),(10,'UMASS','Amherst','MA','01003','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `facebookid` varchar(45) DEFAULT NULL,
  `gmailid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gmailid_UNIQUE` (`gmailid`),
  UNIQUE KEY `facebookid_UNIQUE` (`facebookid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'Jane','Smith','lisa@example.com','4130000004','active',NULL,NULL),(2,'Alice','Roberts','alice@example.com','4131110001','active',NULL,NULL),(3,'Fatima','Reza','fatima@example.com','413888999','active',NULL,NULL),(4,'Anna','Jones','anna@example.com','67288878787','inactive',NULL,NULL),(5,'Ellen','Johnson','ellen@example.com','87827481278','active',NULL,NULL);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `riderequests`
--

DROP TABLE IF EXISTS `riderequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `riderequests` (
  `rideid` int(11) NOT NULL,
  `memberid` int(11) NOT NULL,
  PRIMARY KEY (`rideid`,`memberid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riderequests`
--

LOCK TABLES `riderequests` WRITE;
/*!40000 ALTER TABLE `riderequests` DISABLE KEYS */;
INSERT INTO `riderequests` VALUES (1,1),(1,3),(1,20),(1,21),(2,1),(4,1),(5,20);
/*!40000 ALTER TABLE `riderequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rides`
--

DROP TABLE IF EXISTS `rides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driverid` int(11) DEFAULT NULL,
  `origin` int(11) DEFAULT NULL,
  `destination` int(11) DEFAULT NULL,
  `seats` int(11) DEFAULT NULL,
  `flexibility` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `offered` varchar(45) DEFAULT NULL,
  `requested` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rides`
--

LOCK TABLES `rides` WRITE;
/*!40000 ALTER TABLE `rides` DISABLE KEYS */;
INSERT INTO `rides` VALUES (1,2,1,3,6,6,'2015-05-19 07:14:00',NULL,NULL),(4,1,1,1,1,3,'2015-05-31 12:14:00',NULL,NULL),(5,1,1,1,6,5,'2015-05-25 09:14:00',NULL,NULL),(6,2,9,4,2,-2,'2015-05-25 09:14:00',NULL,NULL),(7,1,3,4,1,2,'2015-05-25 09:14:00',NULL,NULL),(8,3,9,8,3,-1,'2015-05-25 09:14:00',NULL,NULL),(9,5,10,8,2,3,'2015-05-25 09:14:00',NULL,NULL),(10,4,9,6,4,1,'2015-05-25 09:14:00',NULL,NULL),(11,1,9,5,5,2,'2015-05-25 09:14:00',NULL,NULL),(12,3,9,7,4,1,'2015-05-25 09:14:00',NULL,NULL);
/*!40000 ALTER TABLE `rides` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-04-21 11:19:11
