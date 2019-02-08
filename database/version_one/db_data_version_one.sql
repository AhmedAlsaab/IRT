USE transport;

SET foreign_key_checks = 0;
truncate user;
truncate user_type;
truncate vehicle_type;
truncate address;
truncate accessibility;
SET foreign_key_checks = 1;

INSERT INTO user_type VALUES (1, "Passenger");
INSERT INTO user_type VALUES (2, "Driver");

INSERT INTO vehicle_type VALUES (1, "Bus");
INSERT INTO vehicle_type VALUES (2, "Mini Bus");
INSERT INTO vehicle_type VALUES (3, "Taxi");

INSERT INTO address VALUES (1, "Rimouski","2845 Vitae, Rd.",98,"O6P 4VZ");
INSERT INTO address VALUES (2, "Conselice","570-3273 Leo. Road",113,"154565");
INSERT INTO address VALUES (3, "Gandhinagar","660-6268 Amet Avenue",147,"61099");
INSERT INTO address VALUES (4, "Yumbel","Ap #434-5257 Sagittis. Rd.",63,"1986 XZ");
INSERT INTO address VALUES (5, "Roselies","P.O. Box 456, 3804 Odio. St.",106,"09248-453");
INSERT INTO address VALUES (6, "Villa Santo Stefano","6635 Nunc Rd.",141,"56782-522");
INSERT INTO address VALUES (7, "Fort Simpson","P.O. Box 128, 340 Aenean Av.",76,"49415");
INSERT INTO address VALUES (8, "Berg","631-6773 Aliquet Road",47,"5109");
INSERT INTO address VALUES (9, "Couthuin","P.O. Box 443, 2114 Iaculis Road",37,"40517");
INSERT INTO address VALUES (10, "Kelkheim","Ap #355-312 Mi. Avenue",82,"55366");
INSERT INTO address VALUES (11, "Enterprise","Ap #513-3153 Sapien St.",167,"41966");

INSERT INTO accessibility VALUES (1, 1);
INSERT INTO accessibility VALUES (2, 0);
INSERT INTO accessibility VALUES (3, 1);
INSERT INTO accessibility VALUES (4, 0);
INSERT INTO accessibility VALUES (5, 1);
INSERT INTO accessibility VALUES (6, 0);
INSERT INTO accessibility VALUES (7, 1);
INSERT INTO accessibility VALUES (8, 1);
INSERT INTO accessibility VALUES (9, 0);
INSERT INTO accessibility VALUES (10, 0);
INSERT INTO accessibility VALUES (11, 1);

INSERT INTO user VALUES (1, "driver@driver.com", "123", "Driver", "Test", "07842 135442", NOW() ,1, 1, 2);
INSERT INTO user VALUES (2, "passenger@passenger.com", "123", "Passenger", "Test", "12534 899655", NOW(), 1, 1, 1);