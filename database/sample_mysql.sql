/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `sample` (
  `fieldchar` char(20) NOT NULL,
  `fielddecimal` decimal(22,6) DEFAULT NULL,
  `fielddate` date DEFAULT NULL,
  `fieldtime` time DEFAULT NULL,
  `fieldinteger` bigint unsigned DEFAULT NULL,
  `fieldvarchar` varchar(15) DEFAULT NULL,
  `fieldflag` char(1) DEFAULT NULL,
  `fieldbox` varchar(50) DEFAULT NULL,
  `fieldtext` mediumtext,
  `fielddatetime` datetime DEFAULT NULL,
  `fieldtimestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`fieldchar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `sample` (`fieldchar`, `fielddecimal`, `fielddate`, `fieldtime`, `fieldinteger`, `fieldvarchar`, `fieldflag`, `fieldbox`, `fieldtext`, `fielddatetime`, `fieldtimestamp`) VALUES
	('666', 666.000000, '2018-11-15', '10:00:00', 66, NULL, '1', NULL, 'อิทธิพล คชินทร', NULL, NULL),
	('A001', 1200.000000, '2016-11-01', '10:00:00', 1200, 'Q', '1', NULL, 'ประจักษ์ เสียงทอง', NULL, NULL),
	('A002', 1300.000000, '2016-11-01', '10:00:00', 1300, 'Q', '1', NULL, 'ไพเราะ  เทียนทอง', NULL, NULL),
	('A003', 2100.000000, '2018-08-27', '11:11:11', 10000, NULL, '1', NULL, 'สมภพ  ปรางศร', NULL, NULL),
	('AAA', 26900.000000, '2014-04-30', '12:00:00', 8900, 'E', '0', NULL, 'อัสนัย โพธิ์ทอง', NULL, NULL),
	('ABS', 1000.000000, '2016-02-12', '10:00:00', 450, 'E', '1', NULL, 'S&P', NULL, NULL),
	('AIA', 90000.000000, '2013-08-15', '10:00:00', 100, 'P', '1', NULL, 'อุทัย เอื้อเก่ง', NULL, NULL),
	('ATS', 77777.000000, '2018-08-27', '12:40:39', 90, NULL, NULL, NULL, 'วีระพงค์  แก้วเทศ', NULL, NULL),
	('AXA', 45000.000000, '2018-08-27', '10:00:00', 1200, NULL, NULL, NULL, 'สุริยพงศ์  ศรีมาตร', NULL, NULL),
	('AZA', 55555.000000, '2018-08-20', '10:30:00', 300, NULL, NULL, NULL, 'เอมอร ดำรงกุล', NULL, NULL),
	('B2S', 5670.000000, '2013-08-07', '15:00:00', 65800, 'R', '1', NULL, 'อุทุมพร กุลาดี', NULL, NULL),
	('BAY', 43250.255900, '2015-12-20', '10:30:00', 6500, 'E', '1', NULL, 'ไตรจักร จารุวิจิตร', NULL, NULL),
	('BBL', 250350.000000, '2015-12-21', '10:35:50', 6560, 'E', '1', NULL, 'อัจฉรา ดำงาม', NULL, NULL),
	('CIMB', 1250000.000000, '2015-12-28', '14:03:00', 5500, 'E', '1', NULL, 'เอกดนัย คงทน', NULL, NULL),
	('J01', 12200.000000, '2016-11-01', '10:00:00', 100, 'Q', '1', NULL, 'ทิพยเนตร  ฟ้าหวั่น', NULL, NULL),
	('J02', 2300.000000, '2016-11-01', '10:00:00', 200, 'Q', '1', NULL, 'พิศมัย  บัวอุไร', NULL, NULL),
	('KBANK', 45560.000000, '2016-01-08', '10:00:00', 6000, 'R', '1', NULL, 'เพลิน นวกิจวัฒนา', NULL, NULL),
	('KTB', 78900.000000, '2016-01-06', '12:00:00', 7000, 'E', '1', NULL, 'อริษา ศรีทองรุ่ง', NULL, NULL),
	('MK', 98500.958500, '2016-01-05', '15:09:09', 8000, 'E', '1', NULL, 'เศรษฐา ทวีศรี', NULL, NULL),
	('S&P', 5555.255000, '2015-09-19', '12:22:22', 45555, 'E', '0', NULL, 'เมธาวี วิไลกุล', NULL, NULL),
	('SCB', 75460.857500, '2016-01-09', '12:00:00', 5460, 'E', '1', NULL, 'โชคชัย เฉลิมวัฒนไตร', NULL, NULL),
	('T001', 7510.000000, '2016-11-01', '10:00:00', 1250, 'Q', '1', NULL, 'จิระเดช  ฟ้าหวั่น', NULL, NULL),
	('TAS', 14500.000000, '2017-08-30', '10:00:00', 1200, 'E', '1', NULL, 'ทิพยเนตร ใจภักดี', NULL, NULL),
	('TCNB', 453500.556000, '2016-01-08', '15:50:00', 7500, 'E', '1', NULL, 'อำไพ บุญเรือง', NULL, NULL),
	('TEST1', 1100.500000, '2024-08-15', '10:10:10', 110, 'Testing', 'X', NULL, NULL, '2024-08-15 10:10:10', NULL),
	('TEST2', 1100.500000, '2024-08-15', '10:10:10', 110, 'Testing', 'X', NULL, NULL, '2024-08-15 10:10:10', NULL),
	('TMB', 23500.570000, '2015-09-16', '12:00:00', 6500, 'E', '1', NULL, 'อุลาวรรณ ไชยเพชร\r\n', NULL, NULL),
	('TME', 45600.250000, '2015-10-16', '14:00:00', 8900, 'E', '0', NULL, 'อุไรวรรณ รัตนพันธุ์', NULL, NULL),
	('TSO', 600.000000, '2016-11-01', '13:00:00', 6000, 'E', 'F', NULL, 'ไชยโย กุยยากานนท์', NULL, NULL),
	('TSO4', 400.000000, '2016-11-01', '11:00:00', 4700, 'E', '0', NULL, 'พิกุล เนตรทอง', NULL, NULL),
	('TSO5', 500.000000, '2016-11-01', '12:00:00', 5000, 'E', 'F', NULL, 'วิจิตร  ศิลปชัย', NULL, NULL),
	('TSO7', 700.000000, '2016-11-01', '13:00:00', 7000, 'E', 'F', NULL, 'อุไร  ทองอุไร', NULL, NULL),
	('TSO8', 800.000000, '2016-11-01', '14:00:00', 8000, 'E', 'F', NULL, 'ขจีวรรณ  เทียนทอง', NULL, NULL),
	('TSO9', 45211.000000, '2017-08-30', '10:00:00', 700, 'E', '1', NULL, 'ไชโย  ฟ้าหวั่น', NULL, NULL);

CREATE TABLE IF NOT EXISTS `sampling` (
  `account` varchar(50) NOT NULL,
  `amount` decimal(16,2) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `domestic` varchar(1) DEFAULT NULL,
  `effectdate` date DEFAULT NULL,
  `effecttime` time DEFAULT NULL,
  `pincode` varchar(50) DEFAULT NULL,
  `marrystatus` varchar(1) DEFAULT NULL,
  `licenses` varchar(200) DEFAULT NULL,
  `languages` varchar(200) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `caption` varchar(100) DEFAULT NULL,
  `assets` int DEFAULT NULL,
  `credit` decimal(16,2) DEFAULT NULL,
  `passcode` varchar(50) DEFAULT NULL,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  `curtime` datetime DEFAULT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `sampling` (`account`, `amount`, `age`, `gender`, `domestic`, `effectdate`, `effecttime`, `pincode`, `marrystatus`, `licenses`, `languages`, `remark`, `title`, `caption`, `assets`, `credit`, `passcode`, `createdate`, `createtime`, `createuser`, `editdate`, `edittime`, `edituser`, `curtime`) VALUES
	('1-0-12345-0', 200000.00, 28, 'M', '1', '2024-07-29', '14:15:00', '101010', 'S', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-0-12345-1', 110000.00, 31, 'F', '1', '2024-07-01', '15:26:19', '', 'S', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-0-12345-2', 120000.00, 30, 'F', '1', '2024-07-01', '15:26:19', '', 'S', 'CAR', 'CN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-0-12345-3', 120000.00, 32, 'F', '1', '2024-07-31', '14:15:01', '454545', 'S', 'CAR', 'CN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-0-12345-4', 130000.00, 33, 'F', '1', '2024-07-31', '14:15:00', '555555', 'S', 'CAR', 'CN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-0-12345-5', 150000.00, 29, 'M', '1', '2024-07-30', '14:15:00', '151515', 'S', 'CAR,TRUCK', 'TH,CN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-0-12345-6', 15000.00, 25, 'M', '1', '2024-06-27', '16:24:02', '123456', 'S', 'CAR,BOAT', 'TH,EN', NULL, NULL, NULL, 1, 650000.00, 'A1200', '2024-06-27', '16:24:51', NULL, '2024-06-27', '16:24:54', NULL, NULL),
	('1-0-12345-7', 200000.00, 27, 'M', '1', '2024-06-01', '13:05:00', 'AAAAAAAA', 'S', 'CAR,TRUCK', 'TH,EN,CN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-0-12345-8', 180000.00, 26, 'M', '1', '2024-07-29', '14:15:00', '181818', 'S', 'CAR,TRUCK', 'TH,EN,CN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-0-12345-9', 190000.00, 34, 'M', '1', '2024-07-29', '14:15:01', '191919', 'S', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-1-12345-0', 1500000.00, 47, 'M', '1', '2024-07-29', '14:15:00', '301230', 'M', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-1-12345-1', 1200000.00, 30, 'M', '1', '2024-07-29', '14:15:00', '2120000', 'S', 'CAR,TRUCK', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-1-12345-2', 1500000.00, 30, 'M', '1', '2024-07-29', '14:15:01', '252525', 'S', 'CAR,TRUCK', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-1-12345-3', 1500000.00, 30, 'M', '1', '2024-07-29', '14:15:00', '353535', 'S', 'CAR,TRUCK', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-1-12345-4', 1500000.00, 30, 'F', '1', '2024-07-29', '14:15:00', '454545', 'S', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-1-12345-5', 1500000.00, 36, 'F', '1', '2024-07-29', '14:15:00', '787878', 'S', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-1-12345-6', 1500000.00, 40, 'F', '1', '2024-07-29', '14:15:01', '898998', 'M', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-1-12345-7', 1500000.00, 40, 'F', '1', '2024-07-29', '14:15:01', '771122', 'M', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-1-12345-8', 1500000.00, 42, 'F', '1', '2024-07-29', '14:15:00', '848563', 'M', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-1-12345-9', 1500000.00, 45, 'F', '1', '2024-07-29', '14:15:01', '921931', 'M', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:01', NULL, '2024-06-25', '12:00:01', NULL, NULL),
	('1-2-12345-0', 1500000.00, 50, 'M', '1', '2024-07-29', '14:15:00', '230000', 'M', 'CAR,TRUCK', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-2-12345-1', 1500000.00, 50, 'M', '1', '2024-07-29', '14:15:00', '510000', 'M', 'CAR', 'TH,EN', '', '', '', 1, 2500.55, '', '2024-06-25', '12:00:00', NULL, '2024-06-25', '12:00:00', NULL, NULL),
	('1-3-10101-0', 521000.00, 25, 'M', '1', '2024-07-19', '15:15:01', '12452552', 'S', 'CAR,TRUCK', 'TH,EN', 'ทดสอบ', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('1-4-12345-6', 512000.00, 40, 'M', '1', '2024-07-19', '12:00:02', '45210000', 'M', 'BOAT,CAR,TRUCK', 'TH,EN', 'ทดสอบ', 'เทสเทส', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('1-4-20202-2', 800000.00, 33, 'M', '1', '2024-07-19', '12:00:00', '8521000', 'S', 'CAR', 'TH,EN,CN', 'ทดสอบ', 'สวัสดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('1-4-32030-0', 580000.00, 30, 'M', '1', '2024-07-19', '12:00:01', '52512000', 'S', 'CAR', 'TH', 'ทดสอบทดสอบ', 'สวัสดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('1-4-40120-0', 550000.00, 25, 'M', '1', '2024-07-19', '12:00:01', '12410100', 'S', 'CAR', 'TH,EN', 'ทดสอบ', 'สวัสดีปีใหม่', NULL, NULL, NULL, NULL, '2024-07-19', '14:40:10', NULL, '2024-07-19', '14:40:10', NULL, NULL),
	('5-5-55555-5', 555000.00, 55, 'M', '1', '2024-08-20', '15:15:00', '55555', 'S', 'CAR,TRUCK', 'TH,EN', 'ทดสอบ 55', '55 เทส', NULL, 0, NULL, NULL, '2024-08-20', '17:04:57', NULL, '2024-08-20', '17:04:57', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
