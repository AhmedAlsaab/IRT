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
  `id` INT NOT NULL AUTO_INCREMENT,
  `theme` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`address` (
  `address_id` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(45) NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `house_number` INT NOT NULL,
  `postcode` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`address_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`user_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_type` (
  `user_type_id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_type_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `salt` VARCHAR(45) NOT NULL,
  `forename` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `fk_accessibility_id` INT NULL,
  `fk_address_id` INT NULL,
  `fk_user_type_id` INT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_user_accessibility1_idx` (`fk_accessibility_id` ASC),
  INDEX `fk_user_address1_idx` (`fk_address_id` ASC) ,
  INDEX `fk_user_user_type1_idx` (`fk_user_type_id` ASC) ,
  CONSTRAINT `fk_user_accessibility1`
    FOREIGN KEY (`fk_accessibility_id`)
    REFERENCES `transport`.`accessibility` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_address1`
    FOREIGN KEY (`fk_address_id`)
    REFERENCES `transport`.`address` (`address_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_user_type1`
    FOREIGN KEY (`fk_user_type_id`)
    REFERENCES `transport`.`user_type` (`user_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`coordinate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`coordinate` (
  `coordinate_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  PRIMARY KEY (`coordinate_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`journey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`journey` (
  `journey_id` INT NOT NULL AUTO_INCREMENT,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  PRIMARY KEY (`journey_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`ticket` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `accessibility_required` TINYINT NOT NULL DEFAULT 0,
  `used` TINYINT NOT NULL DEFAULT 0,
  `expired` TINYINT NOT NULL DEFAULT 0,
  `date_created` DATETIME NOT NULL,
  PRIMARY KEY (`ticket_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`user_journey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_journey` (
  `fk_journey_id` INT NOT NULL,
  `fk_user_id` INT NOT NULL,
  `fk_ticket_id` INT NOT NULL,
  `paid` TINYINT NOT NULL DEFAULT 0,
  INDEX `fk_journey_has_user_user1_idx` (`fk_user_id` ASC) ,
  INDEX `fk_journey_has_user_journey1_idx` (`fk_journey_id` ASC) ,
  INDEX `fk_user_journey_ticket1_idx` (`fk_ticket_id` ASC) ,
  PRIMARY KEY (`fk_journey_id`, `fk_user_id`),
  CONSTRAINT `fk_journey_has_user_journey1`
    FOREIGN KEY (`fk_journey_id`)
    REFERENCES `transport`.`journey` (`journey_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_journey_has_user_user1`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `transport`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_journey_ticket1`
    FOREIGN KEY (`fk_ticket_id`)
    REFERENCES `transport`.`ticket` (`ticket_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`coordinate_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`coordinate_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`journey_coordinate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`journey_coordinate` (
  `fk_journey_id` INT NOT NULL,
  `fk_coordinate_id` INT NOT NULL,
  `fk_coordinate_type_id` INT NOT NULL,
  INDEX `fk_journey_has_coordinate_coordinate1_idx` (`fk_coordinate_id` ASC) ,
  INDEX `fk_journey_has_coordinate_journey1_idx` (`fk_journey_id` ASC) ,
  INDEX `fk_journey_coordinate_coordinate_type1_idx` (`fk_coordinate_type_id` ASC) ,
  CONSTRAINT `fk_journey_has_coordinate_journey1`
    FOREIGN KEY (`fk_journey_id`)
    REFERENCES `transport`.`journey` (`journey_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_journey_has_coordinate_coordinate1`
    FOREIGN KEY (`fk_coordinate_id`)
    REFERENCES `transport`.`coordinate` (`coordinate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_journey_coordinate_coordinate_type1`
    FOREIGN KEY (`fk_coordinate_type_id`)
    REFERENCES `transport`.`coordinate_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`vehicle_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`vehicle_type` (
  `vehicle_type_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`vehicle_type_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`vehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`vehicle` (
  `vehicle_id` INT NOT NULL,
  `registration` VARCHAR(45) NOT NULL,
  `make` VARCHAR(45) NOT NULL,
  `model` VARCHAR(45) NOT NULL,
  `year` INT NOT NULL,
  `passanger_seats` INT NOT NULL,
  `wheelchair_access` TINYINT NOT NULL DEFAULT 0,
  `currently_driven` TINYINT NOT NULL DEFAULT 0,
  `fk_vehicle_type_id` INT NOT NULL,
  PRIMARY KEY (`vehicle_id`, `fk_vehicle_type_id`),
  INDEX `fk_vehicle_vehicle_type1_idx` (`fk_vehicle_type_id` ASC) ,
  CONSTRAINT `fk_vehicle_vehicle_type1`
    FOREIGN KEY (`fk_vehicle_type_id`)
    REFERENCES `transport`.`vehicle_type` (`vehicle_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transport`.`user_vehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transport`.`user_vehicle` (
  `fk_user_id` INT NOT NULL,
  `fk_vehicle_id` INT NOT NULL,
  INDEX `fk_user_has_vehicle_vehicle1_idx` (`fk_vehicle_id` ASC) ,
  INDEX `fk_user_has_vehicle_user1_idx` (`fk_user_id` ASC) ,
  PRIMARY KEY (`fk_user_id`, `fk_vehicle_id`),
  CONSTRAINT `fk_user_has_vehicle_user1`
    FOREIGN KEY (`fk_user_id`)
    REFERENCES `transport`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_vehicle_vehicle1`
    FOREIGN KEY (`fk_vehicle_id`)
    REFERENCES `transport`.`vehicle` (`vehicle_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
