var express = require('express');
// var fs = require('fs')
// var https = require('https')
var bodyParser = require('body-parser')
var mysql = require('mysql');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'transport'
})

connection.connect((error) => {
    if(!!error) console.log(error.message)
    else console.log('Connected to MySQL Database')
})

app.get('/', (req, res) => {
    connection.query("SELECT * FROM user", (error, rows, fields) => {
        if(error) throw error;
        res.send(rows);
    })
})

app.post('/register', (req, res) => {
    connection.query("INSERT INTO user (email, password, forename, surname, phone_number, date_created) VALUES (?, ?, ?, ?, ?, ?)", 
    [req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.phoneNumber, new Date()],
    (error, rows, fields) => {
        if(error) throw error;
    })
})

app.post('/login', (req, res) => {
    connection.query("SELECT * FROM user WHERE email = ? and password = ?",
    [req.body.email, req.body.password],
    (error, rows, fields) => {
        if(error) throw error;
        res.send(rows[0])
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