var express = require('express');
// var fs = require('fs')
// var https = require('https')
var bodyParser = require('body-parser')
var mysql = require('mysql');
var app = express();

var bcrypt = require('bcryptjs');
var saltRounds = 10;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

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

app.get('/', (req, res) => {
    connection.query("SELECT * FROM user", (error, rows, fields) => {
        if(error) throw error;
        res.send(rows);
    })
})

app.post('/register', (req, res) => {
    //Check if user exists
    connection.query("SELECT * FROM user WHERE email = ?",
        [req.body.email],
        (error, rows, fields) => {
            if (rows.length >= 1 || error) {  console.log("user exists"); return res.send({ status: 0 })}
            else {
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(req.body.password, salt, (error, hash) => {
                        connection.query("INSERT INTO user (email, password, salt, forename, surname, phone_number, date_created, fk_user_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        [req.body.email, hash, salt, req.body.firstName, req.body.lastName, req.body.phoneNumber, new Date(), req.body.type],
                        (error, rows, fields) => {
                            console.log(error)
                            if (error) throw error;    
                            return res.send({ status: 1 })
                        })
                    })
                })
            }
        })
})

app.post('/login', (req, res) => {
    connection.query("SELECT * FROM user WHERE email = ? LIMIT 1",
        [req.body.email],
        (error, rows, fields) => {
            if (error) throw error
            if (rows < 1) return res.send({ status: 0 })

            bcrypt.compare(req.body.password + rows[0].salt, rows[0].password, (error, success) => {
                if (error) return res.send({ status: 0 })
                else return res.send(rows[0])
            })
        })
})

app.listen(3000);

// https.createServer({
//     key: fs.readFileSync("C:\\Users\\Oliver\\Desktop\\Transport Wales\\server\\server.key"),
//     cert: fs.readFileSync("C:\\Users\\Oliver\\Desktop\\Transport Wales\\server\\server.cert")
//   }, app)
//   .listen(8080, function () {
//     console.log('Example app listening on port 8080! Go to https://localhost:8080/')
//   })