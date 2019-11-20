var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var Simulator = require('./simulator/');
var { Household } = require('./models/');

mongoose.connect('mongodb://localhost/M7011E', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to database!');
});

const sim = new Simulator();
sim.start();

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("Example app listening at http://%s:%s", host, port);
});

app.get('/', function (req, res) {
    res.send('Hello World');
});
 
app.get('/simulator/wind', function (req, res) {
     res.send(sim.getWind().toString());
});
 
app.get('/simulator/householdConsumption/:houseId', function (req, res) {
    var households = sim.getHouseholds();
    res.send(households[req.params.houseId].getConsumption().toString());
});
 
app.get('/simulator/electricityPrice/', function (req, res) {
    res.send(sim.getElectricityPrice().toString());
});

app.get('/simulator/', function (req, res) {
    var wind = sim.getWind();
    var households = sim.getHouseholds();
    var totalConsumption = 0;
    for(var i = 0; i < households.length; i++) {
        totalConsumption += households[i].getConsumption();
    }
    var electricityPrice = sim.getElectricityPrice();

    string = "Wind: " + wind + "\n Total consumption: " + totalConsumption + "\n Price: " + electricityPrice;
    res.send(string);
});

app.route('/signup')
    .get((req, res) => {
        // TODO: Redirect to signup page
    })
    .post((req, res) => {
        const salt = bcrypt.genSaltSync();
        
        let newHousehold = new Household({
            lastname: req.body.lastname,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, salt)
        });

        newHousehold.save(function (err, c) {
            if (err) {
                console.error(err);
                res.status(400);
                res.send('Error creating user');
            } else {
                console.log("New household " + c.lastname + " saved.");
                res.status(200);
                res.send('User created');
            }
        });

        // TODO: Redirect to logged in pages
    });