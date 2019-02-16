-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema transport
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `transport` ;

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
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`journey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`journey` (
  `journey_id` INT(11) NOT NULL AUTO_INCREMENT,
 `no_of_passengers` INT NOT NULL,
  `no_of_wheelchairs` INT NOT NULL,
  `used` TINYINT(4) NOT NULL DEFAULT '0',
  `expired` TINYINT(4) NOT NULL DEFAULT '0',
  `date_of_journey` DATETIME NOT NULL,
  `time_of_journey` DATETIME NOT NULL,
  `date_created` DATETIME NOT NULL,
  PRIMARY KEY (`journey_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`coordinate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`coordinate` (
  `coordinate_id` INT(11) NOT NULL AUTO_INCREMENT,
  `place_id` VARCHAR(200) NULL,
  `street` VARCHAR(200) NULL,
  `city` VARCHAR(200) NULL,
  `country` VARCHAR(100) NULL,
  `latitude` FLOAT NULL,
  `longitude` FLOAT NULL,
  `fk_coordinate_type_id` INT(11) NOT NULL,
  `fk_journey_id` INT(11) NOT NULL,
  PRIMARY KEY (`coordinate_id`),
  INDEX `fk_coordinate_coordinate_type1_idx` (`fk_coordinate_type_id` ASC) ,
  INDEX `fk_coordinate_journey1_idx` (`fk_journey_id` ASC) ,
  CONSTRAINT `fk_coordinate_coordinate_type1`
    FOREIGN KEY (`fk_coordinate_type_id`)
    REFERENCES `transport`.`coordinate_type` (`coordinate_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_coordinate_journey1`
    FOREIGN KEY (`fk_journey_id`)
    REFERENCES `transport`.`journey` (`journey_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `transport`.`ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`ticket` (
  `ticket_id` INT(11) NOT NULL AUTO_INCREMENT,
  `no_of_passengers` INT NOT NULL,
  `no_of_wheelchairs` INT NOT NULL,
  `used` TINYINT(4) NOT NULL DEFAULT '0',
  `expired` TINYINT(4) NOT NULL DEFAULT '0',
  `date_of_journey` DATETIME NOT NULL,
  `time_of_journey` DATETIME NOT NULL,
  `date_created` DATETIME NOT NULL,
  PRIMARY KEY (`ticket_id`))
ENGINE = InnoDB
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
-- Table `transport`.`user_journey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_journey` (
  `fk_journey_id` INT(11) NOT NULL,
  `fk_user_id` INT(11) NOT NULL,
  `fk_ticket_id` INT(11) NOT NULL,
  `paid` TINYINT(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`fk_journey_id`, `fk_user_id`),
  INDEX `fk_journey_has_user_user1_idx` (`fk_user_id` ASC) ,
  INDEX `fk_journey_has_user_journey1_idx` (`fk_journey_id` ASC) ,
  INDEX `fk_user_journey_ticket1_idx` (`fk_ticket_id` ASC) ,
  CONSTRAINT `fk_journey_has_user_journey1`
    FOREIGN KEY (`fk_journey_id`)
    REFERENCES `transport`.`journey` (`journey_id`),
  CONSTRAINT `fk_journey_has_user_user1`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `transport`.`user` (`user_id`),
  CONSTRAINT `fk_user_journey_ticket1`
    FOREIGN KEY (`fk_ticket_id`)
    REFERENCES `transport`.`ticket` (`ticket_id`))
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
