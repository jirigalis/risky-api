-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: localhost    Database: risky
-- ------------------------------------------------------
-- Server version	5.7.20-log

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
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `event_id` int(10) NOT NULL,
  `question_id` int(10) NOT NULL,
  `competitor_id` int(10) NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0',
  `created` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `answer_event_fk` (`event_id`),
  KEY `answer_question_fk` (`question_id`),
  KEY `answer_competitor_fk` (`competitor_id`),
  CONSTRAINT `answer_competitor_fk` FOREIGN KEY (`competitor_id`) REFERENCES `competitor` (`id`),
  CONSTRAINT `answer_event_fk` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `answer_question_fk` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competitor`
--

DROP TABLE IF EXISTS `competitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `competitor` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competitor`
--

LOCK TABLES `competitor` WRITE;
/*!40000 ALTER TABLE `competitor` DISABLE KEYS */;
/*!40000 ALTER TABLE `competitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `author` int(10) NOT NULL,
  `created` int(11) NOT NULL,
  `updated` int(11) NOT NULL,
  `state` varchar(20) NOT NULL DEFAULT 'CREATED',
  PRIMARY KEY (`id`),
  CONSTRAINT `event_user_fk` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_competitor`
--

DROP TABLE IF EXISTS `event_competitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_competitor` (
  `event_id` int(10) NOT NULL,
  `competitor_id` int(10) NOT NULL,
  KEY `event_competitor_competitor_fk` (`event_id`),
  CONSTRAINT `event_competitor_competitor_fk` FOREIGN KEY (`event_id`) REFERENCES `competitor` (`id`),
  CONSTRAINT `event_competitor_event_fk` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_competitor`
--

LOCK TABLES `event_competitor` WRITE;
/*!40000 ALTER TABLE `event_competitor` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_competitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_question`
--

DROP TABLE IF EXISTS `event_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_question` (
  `event_id` int(10) NOT NULL,
  `question_id` int(10) NOT NULL,
  KEY `event_question_question_fk` (`question_id`),
  KEY `event_question_event_fk` (`event_id`),
  CONSTRAINT `event_question_event_fk` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `event_question_question_fk` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_question`
--

LOCK TABLES `event_question` WRITE;
/*!40000 ALTER TABLE `event_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `level` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` VALUES (1,'1000'),(2,'2000'),(3,'3000'),(4,'4000'),(5,'5000');
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `text` varchar(2000) NOT NULL,
  `level` int(10) DEFAULT '1',
  `attachment` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_level_fk` (`level`),
  CONSTRAINT `question_level_fk` FOREIGN KEY (`level`) REFERENCES `level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'Popište základní rozdíly mezi zajícem polním a králíkem divokým.',2,NULL),(2,'Jmenujte alespoň dvě dravé ryby, které žijí v našich vodách.',2,NULL),(3,'Na území národního parku Podyjí žije jediný druh želvy u nás. O jaký druh se jedná?',5,NULL),(4,'Patří želva mezi obojživelníky a nebo plazy?',2,NULL),(5,'Jaké je jméno hvězdy, která je nejblíže Zemi?',1,''),(9,'Jmenujte alespoň tři druhy ptáků, kteří na léto odlétají do teplých krajin.',2,''),(10,'V jakém slohu je postaven Bučovický zámek?',5,''),(11,'Jak se jmenuje hmyz, který je největší u nás?',2,'');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_topic`
--

DROP TABLE IF EXISTS `question_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_topic` (
  `question_id` int(10) NOT NULL,
  `topic_id` int(10) NOT NULL,
  KEY `question_topic_question_fk` (`question_id`),
  KEY `question_topic_topic_fk` (`topic_id`),
  CONSTRAINT `question_topic_question_fk` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `question_topic_topic_fk` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_topic`
--

LOCK TABLES `question_topic` WRITE;
/*!40000 ALTER TABLE `question_topic` DISABLE KEYS */;
INSERT INTO `question_topic` VALUES (2,3),(3,3),(4,3),(2,44),(3,44),(4,44),(1,1),(1,44),(5,2),(5,7),(9,2),(9,44),(10,43),(11,4);
/*!40000 ALTER TABLE `question_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topic` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `topic_un` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,'Savci','Otázky na téma Savci'),(2,'Ptáci','Otázky na téma Ptáci'),(3,'Ryby, obojživelníci a plazi',NULL),(4,'Bezobratlí','test'),(5,'Rostliny','Otázky na téma Rostliny'),(6,'Stromy, keře',NULL),(7,'Hvězdná obloha','Otázky na téma Hvězdná obloha'),(43,'KPČ','Kulturní a památková činnost'),(44,'Zvířata','Otázky na téma zvířata'),(45,'Stopy','Stopy zvířat');
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `login` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `admin` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin','admin',1),(2,'john','john doe','123456',0),(3,'joe','lazy','123456',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'risky'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-02-16 14:03:20
