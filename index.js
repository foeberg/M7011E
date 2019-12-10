const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routes = require('./routes');
const db = mongoose.connection;

const config = require('./config.json');

mongoose.connect(config.db_path, {useNewUrlParser: true});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to database!');
});

var app = express();

app.use(cors({
    origin: config.cors_origin,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ji754gkl0+a',
    cookie: {
        // 24 hours
        maxAge: config.session_max_age
    }
}));

app.use(fileUpload());

app.use('/simulator', routes.simulatorRoutes);

app.use('/', routes.apiRoutes);

var server = app.listen(config.server_port, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("Example app listening at http://%s:%s", host, port);
});