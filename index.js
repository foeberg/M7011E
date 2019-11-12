var express = require('express');
var mongoose = require('mongoose');
var app = express();
var Simulator = require('./simulator/');

mongoose.connect('mongodb://localhost/M7011E', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to database!');
});

const sim = new Simulator(4);
sim.start();

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

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});