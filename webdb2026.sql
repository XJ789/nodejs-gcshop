-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: webdb2026
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `author` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `profile` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='저자 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `author`
--

LOCK TABLES `author` WRITE;
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
INSERT INTO `author` VALUES (6,'xiao jian','THE GREAT ONE'),(7,'Acacia Baldie','NOT GOOD');
/*!40000 ALTER TABLE `author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `type_id` int DEFAULT NULL,
  `board_id` int NOT NULL AUTO_INCREMENT,
  `p_id` int DEFAULT NULL,
  `loginid` varchar(10) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `date` varchar(50) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`board_id`)
) ENGINE=InnoDB AUTO_INCREMENT=497 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='게이판 테이블, 모든 유형의 게이뭏을 저장';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (93,481,0,'M','M','날씨','2026.05.20: 19시 45분 12초','날씨가 추워져요'),(94,482,0,'c','C','싸이트가 자구 다운되요','2026.05.20: 22시 09분 21초','너무 자주 다운되요'),(94,483,0,'C2','C','싸이트가 너무느려요. 오류도 많아요','2026.05.20: 22시 16분 52초','너무 느려요!'),(94,484,0,'M','1','인터넷 접속','2026.05.20: 22시 38분 33초','Free talk'),(92,485,0,'C2','C2','교환이 가능한가요','2026.05.31: 10시 14분 02초','어제 구매한 옷인데 교환이 가능한가요'),(92,486,485,'M','admin','[답변]: 교환이 가능한가요','2026.05.31: 11시 57분 17초','가능합니다. 택배 기사님이 연락하실 것입니다.');
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boardtype`
--

DROP TABLE IF EXISTS `boardtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boardtype` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `write_YN` varchar(1) NOT NULL,
  `re_YN` varchar(1) NOT NULL,
  `numPerPage` int DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='모든 게시판 유형을 저장하는 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boardtype`
--

LOCK TABLES `boardtype` WRITE;
/*!40000 ALTER TABLE `boardtype` DISABLE KEYS */;
/*!40000 ALTER TABLE `boardtype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT COMMENT 'PRIMARY KEY',
  `loginid` varchar(10) NOT NULL COMMENT '로그인아이디',
  `prod_id` int DEFAULT NULL COMMENT '상품아이디',
  `date` varchar(30) NOT NULL COMMENT '장바구니담긴날짜',
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='장바구니 테이블, 고객들의 장바구니를 관리';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (128,'c',105,'2026.05.29: 09시 45분 33초'),(129,'c',104,'2026.05.29: 09시 45분 42초');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code`
--

DROP TABLE IF EXISTS `code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code` (
  `main_id` varchar(4) NOT NULL,
  `sub_id` varchar(4) NOT NULL,
  `main_name` varchar(20) NOT NULL,
  `sub_name` varchar(100) DEFAULT NULL,
  `start` varchar(8) NOT NULL,
  `end` varchar(8) NOT NULL,
  PRIMARY KEY (`main_id`,`sub_id`,`start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='GCShop의 모든 코드를 저장';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code`
--

LOCK TABLES `code` WRITE;
/*!40000 ALTER TABLE `code` DISABLE KEYS */;
INSERT INTO `code` VALUES ('0000','0000','여성 의류','상의','20240101','20261231'),('0000','0001','여성 의류','아우터','20240101','20261231'),('0001','0000','식품','신선 식품','20240401','20261028'),('0002','0000','가전','주방 가전','20240601','20271231'),('0003','0000','화장품','여성','20240501','20271030');
/*!40000 ALTER TABLE `code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `loginid` varchar(10) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `mf` varchar(1) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `tel` varchar(13) DEFAULT NULL,
  `birth` varchar(8) NOT NULL,
  `class` varchar(3) NOT NULL,
  PRIMARY KEY (`loginid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='GCShop에 회원 가입한 모든 고객과, 관리자, 경영자를 저장하는 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('c','c','고객1','f','서울','000-111-2222','20000505','CST'),('C2','C2','고객2','m','부산','010-2587-7896','20000101','CST'),('C3','C3','고객3','f','대구','010-2587-7344','20000605','CST'),('CEO','CEO','CEO','m','서울','010-2587-7445','19980611','CEO'),('M','M','관리자','f','서울','010-1234-5678','18900506','MNG');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `main_id` varchar(4) NOT NULL,
  `sub_id` varchar(4) NOT NULL,
  `prod_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `price` int NOT NULL,
  `stock` int NOT NULL,
  `brand` varchar(50) NOT NULL,
  `supplier` varchar(50) NOT NULL,
  `image` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`prod_id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='모든 상품을 저장';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('0000','0000',102,'단추 긴팔 소프트 니트',27900,10,'제니트','제니트','/images/1.webp'),('0000','0001',103,'남녀공용 양털 후드 집업 자켓 플리스 후리스',40000,8,'모니즈','모니즈','/images/2.jpg'),('0001','0000',104,'샤민머스켓',10300,15,'경북 김선시','경북 김선시','/images/grape.webp'),('0002','0000',105,'LG 디오스 오브제 컬렉션',1969000,3,'LG','LG','/images/LG 디오스 오브제 컬렉션.avif'),('0003','0000',106,'이케이뷰디 프리미엄 천연 고보습 4종세트',103000,7,'이케이뷰디','이케이뷰디','/images/이케이뷰디 프리미엄.jpg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `loginid` varchar(10) NOT NULL,
  `prod_id` int DEFAULT NULL,
  `date` varchar(30) NOT NULL,
  `price` int DEFAULT NULL,
  `point` int DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `total` int DEFAULT NULL,
  `payYN` varchar(1) NOT NULL DEFAULT 'N',
  `cancel` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='구매 트랜잭션을 저장하는 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES (83,'c',102,'2026.05.25: 23시 26분 53초',27900,279,1,27900,'Y','Y'),(84,'c',103,'2026.05.26: 00시 14분 02초',40000,1200,3,120000,'Y','N'),(85,'C2',102,'2026.05.26: 00시 31분 28초',27900,279,1,27900,'Y','Y'),(87,'C3',103,'2026.05.31: 14시 19분 02초',40000,800,2,80000,'Y','Y'),(88,'C3',106,'2026.06.01: 14시 58분 20초',103000,2060,2,206000,'Y','N');
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('StWzseQPCHiRmQJLGyIpH09IZwmTJNfc',1780379977,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"is_logined\":true,\"loginid\":\"M\",\"name\":\"관리자\",\"cls\":\"MNG\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `descript` text,
  `created` datetime NOT NULL,
  `author_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,'MySQL','MySQL is Database Name.','2023-09-20 00:00:00',6),(2,'Node.js','Node.js is runtime of javascript','2023-09-20 00:00:00',7),(3,'HTML','HTML is Hyper Text Markup Language','2023-09-20 00:00:00',3),(4,'CSS','CSS is used to decorate HTML Page.','2023-09-20 00:00:00',4),(7,'ersdfsd','sdfsa','2026-04-09 14:31:46',4);
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-04 10:00:38
