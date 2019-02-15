var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

var bcrypt = require('bcryptjs');
var saltRounds = 10;

var engines = require('consolidate');
var paypal = require('paypal-rest-sdk');
var paypalApiKey = require('./paypal_api_key');

app.engine('ejs', engines.ejs);
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
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

paypal.configure({
	mode: 'sandbox', //sandbox or live
	client_id: paypalApiKey.client_id,
	client_secret: paypalApiKey.client_secret
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

app.get('/driver/schedule', function(req, res) {
	connection.query('SELECT * FROM coordinate WHERE fk_coordinate_type_id = 1', function(error, rows, fields) {
		if (error) console.log(error);
		else {
			// console.log(rows);
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
	console.log(req.body);

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

	const date = req.body.date;
	const time = req.body.time;
	const numPassenger = req.body.numPassenger;
	const numWheelchair = req.body.numWheelchair;

	connection.query(
		'INSERT INTO ticket (no_of_passengers, no_of_wheelchairs, used, expired, date_of_journey, time_of_journey, date_created) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[ numPassenger, numWheelchair, 0, 0, date, time, new Date() ],
		(error, row, fields) => {
			if (error) throw error;
		}
	);

	connection.query(
		'INSERT INTO journey (start_time, end_time) VALUES (?, ?)',
		[ new Date(), new Date() ],
		(error, row, fields) => {
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

app.get('/paypal-button', (req, res) => {
	res.render('index');
});

app.get('/paypal', (req, res) => {
	req.session.amount = parseFloat(req.query.amount).toFixed(2);
	var create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal'
		},
		redirect_urls: {
			return_url: 'http://192.168.0.33:3000/success',
			cancel_url: 'http://192.168.0.33:3000/cancel'
		},
		transactions: [
			{
				item_list: {
					items: [
						{
							name: 'item',
							sku: 'item',
							price: req.query.amount,
							currency: 'GBP',
							quantity: 1
						}
					]
				},
				amount: {
					currency: 'GBP',
					total: req.query.amount
				},
				description: 'Add funds to Transport for Wales wallet'
			}
		]
	};

	paypal.payment.create(create_payment_json, function(error, payment) {
		if (error) throw error;
		else {
			res.redirect(payment.links[1].href);
		}
	});
});

app.get('/driver/place', function(req, res) {
	connection.query('SELECT latitude, longitude FROM coordinate WHERE fk_coordinate_type_id = 1', function(
		error,
		rows,
		fields
	) {
		if (error) throw error;
		else {
			// console.log(rows);
			res.send(rows);
		}
	});
});

app.get('/success', (req, res) => {
	var PayerID = req.query.PayerID;
	var paymentId = req.query.paymentId;
	var execute_payment_json = {
		payer_id: PayerID,
		transactions: [
			{
				amount: {
					currency: 'GBP',
					total: parseFloat(req.session.amount).toFixed(2)
				}
			}
		]
	};

	paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
		if (error) {
			throw error;
		} else {
			//Add money to users account

			res.render('success');
		}
	});
});

app.get('/cancel', (req, res) => {
	res.render('cancel');
});

app.listen(3000);
