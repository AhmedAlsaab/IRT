var express = require('express');
var app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

var con = mysql.createConnection({

    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'sampledb'
});

var server = app.listen(3000, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("start")
});

con.connect(function(error){
    if(error) console.log(error);
    else console.log("connected")
});

app.get('/users', function(req, res){
    con.query('select * from students', function(error, rows, fields){
        if(error) console.log(error)

        else{
            console.log(rows);
            res.send(rows);
        }
    })
});
// connection.query("INSERT INTO user (email, password, forename, surname, phone_number, date_created) VALUES ('"+ req.body.email +"', '"+ req.body.password +"', '"+ req.body.firstName +"', '"+ req.body.lastName +"', '"+ req.body.phoneNumber +"', '"+ req.body.date +"')", (error, rows, fields) => {
//     if(error) console.log(error);

app.post('/booking/startlocation', (req, res) => {
    con.query("INSERT INTO startlocation (place_id, street, city, country) VALUES ('"+ req.body.place_id +"', '"+ req.body.street + "', '"+ req.body.city +"', '"+ req.body.country +"')", (error, rows, fields) => {
        if(error) console.log(error);
        
    })
});
