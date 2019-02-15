var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var bcrypt = require('bcryptjs');
var saltRounds = 10;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(expressValidator());

// Change to your credentials
// Use Database provided in folders or ask in Teams
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'transport'
});

connection.connect((error) => {
	if (error) throw error;
	else console.log('Connected to MySQL Database');
});

app.post('/register', (req, res) => {
	//Check for errors in user input
	req.checkBody('firstName', 'First name cannot be empty').notEmpty().trim();
	req.checkBody('lastName', 'Last name cannot be empty').notEmpty().trim();
	req.checkBody('phoneNumber', 'Phone number must be valid').len(5, 15).isNumeric();
	req.checkBody('email', 'Email address must be valid').isEmail().trim();
	req
		.checkBody('password', 'Password must include 8 characters, 1 upper case and 1 lower case')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
		.trim();
	req.checkBody('passwordConfirm', 'Passwords must match').equals(req.body.password);

	//Send errors back to client
	const errors = req.validationErrors();
	if (errors) {
		console.log(errors);
		return res.send({ status: 0, errors: errors });
	}

	//Get form fields
	const email = req.body.email;
	const password = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const phoneNumber = req.body.phoneNumber;
	const type = req.body.type;

	//Check if user exists
	connection.query('SELECT * FROM user WHERE email = ?', [ email ], (error, rows, fields) => {
		//if user exists, return and throw error
		if (error) throw error;
		if (rows.length >= 1) return res.send({ status: 1 });
		else {
			//If user doesnt exist insert new user
			bcrypt.hash(password, saltRounds, (error, hash) => {
				connection.query(
					'INSERT INTO user (email, password, forename, surname, phone_number, date_created, fk_user_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
					[ email, hash, firstName, lastName, phoneNumber, new Date(), type ],
					(error, rows, fields) => {
						if (error) throw error;
						return res.send({ status: 10 });
					}
				);
			});
		}
	});
});

app.post('/login', (req, res) => {
	req.checkBody('email', null).notEmpty().trim();
	req.checkBody('password', null).notEmpty().trim();

	const errors = req.validationErrors();
	if (errors) {
		return res.send({ status: 0 });
	}

	connection.query('SELECT * FROM user WHERE email = ? LIMIT 1', [ req.body.email ], (error, rows, fields) => {
		if (error) throw error;
		if (rows.length < 1) return res.send({ status: 0 });

		bcrypt.compare(req.body.password, rows[0].password, (error, success) => {
			if (error) throw error;
			if (!success) return res.send({ status: 0 });
			else return res.send({ content: rows[0], status: 10 });
		});
	});
});

app.get('/users', function(req, res) {
	connection.query('select * from students', function(error, rows, fields) {
		if (error) console.log(error);
		else {
			console.log(rows);
			res.send(rows);
		}
	});
});

app.get('/journey', function(req, res) {
	connection.query(
		`select coordinate_type.type, coordinate.street, coordinate.city
        from coordinate
        inner join coordinate_type on coordinate.fk_coordinate_type_id=coordinate_type.coordinate_type_id
        where coordinate.fk_journey_id=1`,
		function(error, rows, fields) {
			if (error) console.log(error);
			else {
				console.log(rows);
				res.send(rows);
			}
		}
	);
});

app.post('/booking/temp', (req, res) => {
	// "place_id": this.state.placeID,
	//   "street": this.state.street,
	//   "city": this.state.city,
	//   "country": this.state.country,
	//   "startType": this.state.startType,
	//   "endPlaceID": this.state.endPlaceID,
	//   "endStreet": this.state.endStreet,
	//   "endCity": this.state.endCity,
	//   "endCountry": this.state.endCountry,
	//   "endType": this.state.endType

	const startPlaceId = req.body.place_id;
	const startStreet = req.body.street;
	const startCity = req.body.city;
	const startCountry = req.body.country;
	const startLat = req.body.lat;
	const startLng = req.body.lng;
	const startType = req.body.startType;

	const endPlaceId = req.body.endPlaceID;
	const endStreet = req.body.endStreet;
	const endCity = req.body.endCity;
	const endCountry = req.body.endCountry;
	const endLat = req.body.endLat;
	const endLng = req.body.endLng;
	const endType = req.body.endType;

	connection.query(
		'INSERT INTO journey (start_time, end_time) VALUES (?, ?)',
		[ new Date(), new Date() ],
		(error, row, fields) => {
			console.log(row.insertId);
			if (error) throw error;

			connection.query(
				'INSERT INTO coordinate (place_id, street, city, country, latitude, longitude, fk_coordinate_type_id, fk_journey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[ startPlaceId, startStreet, startCity, startCountry, startLat, startLng, startType, row.insertId ],
				(error, row, fields) => {
					if (error) throw error;
				}
			);

			connection.query(
				'INSERT INTO coordinate (place_id, street, city, country, latitude, longitude, fk_coordinate_type_id, fk_journey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[ endPlaceId, endStreet, endCity, endCountry, endLat, endLng, endType, row.insertId ],
				(error, row, fields) => {
					if (error) throw error;
				}
			);
		}
	);
});

app.listen(3000);
