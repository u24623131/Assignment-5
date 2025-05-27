-- phpMyAdmin SQL Dump
-- version 5.0.4deb2~bpo10+1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 27, 2025 at 10:13 PM
-- Server version: 10.3.39-MariaDB-0+deb10u2
-- PHP Version: 7.3.31-1~deb10u7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u24623131_satoshi_nakamoto_db`
--
CREATE DATABASE IF NOT EXISTS `u24623131_satoshi_nakamoto_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `u24623131_satoshi_nakamoto_db`;

-- --------------------------------------------------------

--
-- Table structure for table `Compare`
--

CREATE TABLE `Compare` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favourites`
--

CREATE TABLE `favourites` (
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Prices`
--

CREATE TABLE `Prices` (
  `Retailer_ID` int(11) NOT NULL,
  `Product_No` int(11) NOT NULL,
  `Price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `Product_No` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Category` varchar(50) NOT NULL,
  `Description` text DEFAULT NULL,
  `Brand` varchar(50) NOT NULL,
  `Image_URL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Retailers`
--

CREATE TABLE `Retailers` (
  `Retailer_ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Phy_Address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reviews`
--

CREATE TABLE `Reviews` (
  `Review_ID` int(11) NOT NULL,
  `Date` datetime NOT NULL DEFAULT current_timestamp(),
  `Rating` tinyint(1) NOT NULL CHECK (`Rating` between 1 and 5),
  `review_text` varchar(500) NOT NULL,
  `Prod_ID` int(11) NOT NULL,
  `U_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `User_ID` int(11) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Surname` varchar(20) NOT NULL,
  `Email` varchar(40) NOT NULL,
  `Cell_No` varchar(10) DEFAULT NULL,
  `User_Type` enum('normal','admin') NOT NULL DEFAULT 'normal',
  `Password` varchar(325) NOT NULL,
  `Salt` varchar(325) NOT NULL,
  `API_Key` varchar(100) NOT NULL,
  `XP` int(11) NOT NULL DEFAULT 0 COMMENT 'EXPERIENCE POINTS AUTOMATICALLY 0\r\n'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Compare`
--
ALTER TABLE `Compare`
  ADD PRIMARY KEY (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `favourites`
--
ALTER TABLE `favourites`
  ADD PRIMARY KEY (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `Prices`
--
ALTER TABLE `Prices`
  ADD PRIMARY KEY (`Retailer_ID`,`Product_No`),
  ADD KEY `Product_No` (`Product_No`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`Product_No`);

--
-- Indexes for table `Retailers`
--
ALTER TABLE `Retailers`
  ADD PRIMARY KEY (`Retailer_ID`);

--
-- Indexes for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD PRIMARY KEY (`Review_ID`),
  ADD KEY `Prod_ID` (`Prod_ID`),
  ADD KEY `U_ID` (`U_ID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Password` (`Password`),
  ADD UNIQUE KEY `API_Key` (`API_Key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `Product_No` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Retailers`
--
ALTER TABLE `Retailers`
  MODIFY `Retailer_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Reviews`
--
ALTER TABLE `Reviews`
  MODIFY `Review_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Compare`
--
ALTER TABLE `Compare`
  ADD CONSTRAINT `Compare_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`User_ID`),
  ADD CONSTRAINT `Compare_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`Product_No`);

--
-- Constraints for table `favourites`
--
ALTER TABLE `favourites`
  ADD CONSTRAINT `favourites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`User_ID`),
  ADD CONSTRAINT `favourites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`Product_No`);

--
-- Constraints for table `Prices`
--
ALTER TABLE `Prices`
  ADD CONSTRAINT `Prices_ibfk_1` FOREIGN KEY (`Retailer_ID`) REFERENCES `Retailers` (`Retailer_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Prices_ibfk_2` FOREIGN KEY (`Product_No`) REFERENCES `Products` (`Product_No`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`Prod_ID`) REFERENCES `Products` (`Product_No`),
  ADD CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`U_ID`) REFERENCES `Users` (`User_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
