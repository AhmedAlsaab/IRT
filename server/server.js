var express = require('express');
var expressValidator = require('express-validator')
var bodyParser = require('body-parser')
var mysql = require('mysql');
var app = express();

var bcrypt = require('bcryptjs');
var saltRounds = 10;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(expressValidator());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'transport'
})

connection.connect((error) => {
    if(error) throw error
    else console.log('Connected to MySQL Database')
})

app.post('/register', (req, res) => {
    //Check for errors in user input
    req.checkBody('firstName', "First name cannot be empty").notEmpty().trim()
    req.checkBody('lastName', "Last name cannot be empty").notEmpty().trim()
    req.checkBody('phoneNumber', "Phone number must be valid").len(5, 15).isNumeric();
    req.checkBody('email', "Email address must be valid").isEmail().trim()
    req.checkBody('password', "Password must include 8 characters, 1 upper case and 1 lower case").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).trim()
    req.checkBody('passwordConfirm', "Passwords must match").equals(req.body.password)

    //Send errors back to client
    const errors = req.validationErrors();
    if (errors) {
        return res.send({status: 0, errors: errors})
    }

    //Get form fields
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const type = req.body.type;

    //Check if user exists
    connection.query("SELECT * FROM user WHERE email = ?",
        [email],
        (error, rows, fields) => {
            //if user exists, return and throw error
            if (error) throw error
            if (rows.length >= 1) return res.send({ status: 1 }) 
            else {
                //If user doesnt exist insert new user
                bcrypt.hash(password, saltRounds, (error, hash) => {
                    connection.query("INSERT INTO user (email, password, forename, surname, phone_number, date_created, fk_user_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [email, hash, firstName, lastName, phoneNumber, new Date(), type],
                        (error, rows, fields) => {
                            if (error) throw error;
                            return res.send({ status: 10 })
                        })
                })
            }
        })
})

app.post('/login', (req, res) => {
    req.checkBody('email', null).notEmpty().trim()
    req.checkBody('password', null).notEmpty().trim()

    const errors = req.validationErrors();
    if (errors) {
        return res.send({status: 0})
    }

    connection.query("SELECT * FROM user WHERE email = ? LIMIT 1",
        [req.body.email],
        (error, rows, fields) => {
            if (error) throw error
            if (rows.length < 1) return res.send({ status: 0 })
  
            bcrypt.compare(req.body.password, rows[0].password, (error, success) => {
                if (error) throw error
                if (!success) return res.send({ status: 0 })
                else return res.send({ content: rows[0], status: 10 })
            })
        })
})

app.listen(3000);
