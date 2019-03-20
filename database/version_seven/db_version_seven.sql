-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema transport
-- -----------------------------------------------------
DROP SCHEMA `transport`;
-- -----------------------------------------------------
-- Schema transport
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `transport` DEFAULT CHARACTER SET utf8 ;
USE `transport` ;

-- -----------------------------------------------------
-- Table `transport`.`accessibility`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`accessibility` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `theme` TINYINT(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`address` (
  `address_id` INT(11) NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(45) NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `house_number` INT(11) NOT NULL,
  `postcode` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`address_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`coordinate_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`coordinate_type` (
  `coordinate_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`coordinate_type_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`journey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`journey` (
  `journey_id` INT(11) NOT NULL AUTO_INCREMENT,
  `start_time` DATETIME NULL DEFAULT NULL,
  `end_time` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`journey_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`coordinate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`coordinate` (
  `coordinate_id` INT(11) NOT NULL AUTO_INCREMENT,
  `place_id` VARCHAR(200) NULL DEFAULT NULL,
  `street` VARCHAR(200) NULL DEFAULT NULL,
  `city` VARCHAR(200) NULL DEFAULT NULL,
  `country` VARCHAR(100) NULL DEFAULT NULL,
  `latitude` FLOAT NULL DEFAULT NULL,
  `longitude` FLOAT NULL DEFAULT NULL,
  `fk_coordinate_type_id` INT(11) NOT NULL,
  `fk_journey_id` INT(11) NOT NULL,
  PRIMARY KEY (`coordinate_id`),
  INDEX `fk_coordinate_coordinate_type1_idx` (`fk_coordinate_type_id` ASC) ,
  INDEX `fk_coordinate_journey1_idx` (`fk_journey_id` ASC) ,
  CONSTRAINT `fk_coordinate_coordinate_type1`
    FOREIGN KEY (`fk_coordinate_type_id`)
    REFERENCES `transport`.`coordinate_type` (`coordinate_type_id`),
  CONSTRAINT `fk_coordinate_journey1`
    FOREIGN KEY (`fk_journey_id`)
    REFERENCES `transport`.`journey` (`journey_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`ticket` (
  `ticket_id` INT(11) NOT NULL AUTO_INCREMENT,
  `accessibility_required` TINYINT(4) NOT NULL DEFAULT '0',
  `used` TINYINT(4) NOT NULL DEFAULT '0',
  `expired` TINYINT(4) NOT NULL DEFAULT '0',
  `cancelled` TINYINT(4) NOT NULL DEFAULT '0',
  `date_created` DATETIME NOT NULL,
  `no_of_passengers` INT(11) NOT NULL,
  `no_of_wheelchairs` INT(11) NOT NULL,
  `date_of_journey` DATETIME NOT NULL,
  `time_of_journey` DATETIME NOT NULL,
  PRIMARY KEY (`ticket_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`transaction_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`transaction_type` (
  `transaction_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`transaction_type_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`user_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_type` (
  `user_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_type_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `funds` DECIMAL(15,2) NULL DEFAULT '0.00',
  `concessionary` TINYINT(4) NULL DEFAULT '1',
  `forename` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NULL DEFAULT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `fk_accessibility_id` INT(11) NULL DEFAULT NULL,
  `fk_address_id` INT(11) NULL DEFAULT NULL,
  `fk_user_type_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_user_accessibility1_idx` (`fk_accessibility_id` ASC) ,
  INDEX `fk_user_address1_idx` (`fk_address_id` ASC) ,
  INDEX `fk_user_user_type1_idx` (`fk_user_type_id` ASC) ,
  CONSTRAINT `fk_user_accessibility1`
    FOREIGN KEY (`fk_accessibility_id`)
    REFERENCES `transport`.`accessibility` (`id`),
  CONSTRAINT `fk_user_address1`
    FOREIGN KEY (`fk_address_id`)
    REFERENCES `transport`.`address` (`address_id`),
  CONSTRAINT `fk_user_user_type1`
    FOREIGN KEY (`fk_user_type_id`)
    REFERENCES `transport`.`user_type` (`user_type_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`transaction` (
  `transaction_id` INT(11) NOT NULL AUTO_INCREMENT,
  `current_funds` DECIMAL(15,2) NOT NULL,
  `spent_funds` DECIMAL(15,2) NOT NULL,
  `cancellation_fee` TINYINT(4) NOT NULL DEFAULT '0',
  `date` DATETIME NOT NULL,
  `fk_transaction_type_id` INT(11) NOT NULL,
  `fk_user_id` INT(11) NOT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `fk_transaction_transaction_type1_idx` (`fk_transaction_type_id` ASC) ,
  INDEX `fk_transaction_user1_idx` (`fk_user_id` ASC) ,
  CONSTRAINT `fk_transaction_transaction_type1`
    FOREIGN KEY (`fk_transaction_type_id`)
    REFERENCES `transport`.`transaction_type` (`transaction_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transaction_user1`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `transport`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`user_journey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_journey` (
  `fk_journey_id` INT(11) NOT NULL,
  `fk_ticket_id` INT(11) NOT NULL,
  `fk_user_id` INT(11) NOT NULL,
  `paid` TINYINT(4) NOT NULL DEFAULT '0',
  `completed` TINYINT(4) NOT NULL DEFAULT 0,
  INDEX `fk_journey_has_user_journey1_idx` (`fk_journey_id` ASC) ,
  INDEX `fk_user_journey_ticket1_idx` (`fk_ticket_id` ASC) ,
  INDEX `fk_user_journey_user1_idx` (`fk_user_id` ASC) ,
  CONSTRAINT `fk_journey_has_user_journey1`
    FOREIGN KEY (`fk_journey_id`)
    REFERENCES `transport`.`journey` (`journey_id`),
  CONSTRAINT `fk_user_journey_ticket1`
    FOREIGN KEY (`fk_ticket_id`)
    REFERENCES `transport`.`ticket` (`ticket_id`),
  CONSTRAINT `fk_user_journey_user1`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `transport`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`vehicle_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`vehicle_type` (
  `vehicle_type_id` INT(11) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`vehicle_type_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`vehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`vehicle` (
  `vehicle_id` INT(11) NOT NULL,
  `registration` VARCHAR(45) NOT NULL,
  `make` VARCHAR(45) NOT NULL,
  `model` VARCHAR(45) NOT NULL,
  `year` INT(11) NOT NULL,
  `passanger_seats` INT(11) NOT NULL,
  `wheelchair_access` TINYINT(4) NOT NULL DEFAULT '0',
  `currently_driven` TINYINT(4) NOT NULL DEFAULT '0',
  `fk_vehicle_type_id` INT(11) NOT NULL,
  PRIMARY KEY (`vehicle_id`, `fk_vehicle_type_id`),
  INDEX `fk_vehicle_vehicle_type1_idx` (`fk_vehicle_type_id` ASC) ,
  CONSTRAINT `fk_vehicle_vehicle_type1`
    FOREIGN KEY (`fk_vehicle_type_id`)
    REFERENCES `transport`.`vehicle_type` (`vehicle_type_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`user_vehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_vehicle` (
  `fk_user_id` INT(11) NOT NULL,
  `fk_vehicle_id` INT(11) NOT NULL,
  PRIMARY KEY (`fk_user_id`, `fk_vehicle_id`),
  INDEX `fk_user_has_vehicle_vehicle1_idx` (`fk_vehicle_id` ASC) ,
  INDEX `fk_user_has_vehicle_user1_idx` (`fk_user_id` ASC) ,
  CONSTRAINT `fk_user_has_vehicle_user1`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `transport`.`user` (`user_id`),
  CONSTRAINT `fk_user_has_vehicle_vehicle1`
    FOREIGN KEY (`fk_vehicle_id`)
    REFERENCES `transport`.`vehicle` (`vehicle_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
