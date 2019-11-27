var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var fileUpload = require('express-fileupload');
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

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'ji754gkl0+a',
    cookie: {
        maxAge: 3600000
    }
}));

app.use(fileUpload());

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("Example app listening at http://%s:%s", host, port);
});

var ensureNotLoggedIn = (req, res, next) => {
    if(req.session.user) {
        res.redirect('/');
        return;
    } else {
        next();
    }
};

var ensureLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        res.redirect('/login');
        return;
    } else {
        next();
    }
};

app.get('/', ensureLoggedIn,  function (req, res) {
    // TODO: Redirect to logged in page
});
 
app.get('/simulator/wind', function (req, res) {
     res.send(sim.getWind().toString());
     return;
});
 
app.get('/simulator/householdConsumption/:householdId', function (req, res) {
    let household = sim.getHouseholds().find(h => h.id == req.params.householdId);
    res.send(household.getConsumption().toString());
    return;
});
 
app.get('/simulator/electricityPrice/', function (req, res) {
    res.send(sim.getElectricityPrice().toString());
    return;
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
    return;
});

app.route('/signup')
    .get((req, res) => {
        // TODO: send signup page
        // res.redirect('path')
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
                res.redirect('/signup');
                return;
            } else {
                console.log("New household " + c.lastname + " saved.");
                req.session.user = c;

                res.status(200);
                res.send('User created');
                return;

                // TODO: Redirect to logged in pages
                // res.redirect('path')
            }
        });
    });

app.route('/login')
    .get(ensureNotLoggedIn, (req, res) => {
        // TODO: send login page to user
    })
    .post((req, res) => {
        console.log(req.session.user);
        Household.findOne({ username: req.body.username }, (err, user) => {
            if(err) {
                res.status(400);
                res.redirect('/login');
                return;
            } else {
                if(bcrypt.compareSync(req.body.password, user.password)) {
                    req.session.user = user;

                    res.status(200);
                    res.send('Logged in');
                    return;
                } else {
                    res.status(400);
                    res.redirect('/login');
                    return;
                }
            }
        });
    });

app.get('/logout', function(req, res) {
    if(req.session.user) {
        req.session.destroy((err) => {
            if(err) {
                console.error(err);
                res.send('Error logging out');
                return;
            } else {
                res.send('Logged out');
                return;
            }
        });
    } else {
        res.send('Not logged in');
        res.redirect('/');
        return;
    }
});

app.post('/householdImage', ensureLoggedIn, function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400);
        res.send('No files were uploaded');
        return;
    } else {
        // TODO: Update form name to the actual name in frontend
        let file = req.files.file;

        if(!file.mimetype.includes('image')) {
            res.status(400);
            res.send('Invalid image format');
            return;
        }

        // Splits for example 'image/png' into 'image', 'png'. Takes the second element to get the filetype
        let filetype = file.mimetype.split('/')[1];
        let filename = req.session.user._id + '.' + filetype;
        file.mv('./householdImages/' + filename, (err) => {
            if (err) {
                console.error(err);
                res.status(500);
                res.send('Error uploading image');
                return;
            } else {
                res.status(200);
                res.send('File uploaded!');

                Household.findOne({ _id: req.session.user._id }, (err, household) => {
                    household.imageURL = filename;
                    household.save((err) => {
                        if(err) {
                            console.error(err);
                            return;
                        }
                        console.log('Image URL for user' + req.session.user.username + ' updated');
                    });
                });

                return;
            }
        });
    }
});

app.route('/sellRatio/')
    .get(ensureLoggedIn, (req, res) => {
        Household.findOne({ username: req.session.user.username }, (err, user) => {
            if(err) {
                console.error(err);
                res.status(500);
                res.send('error getting sell ratio');
                return;
            } else {
                    res.status(200);
                res.send(user.sellRatio.toString());
                    return;
            }
        });
    })
    .post(ensureLoggedIn, (req, res) => {
        if(!req.body.sellRatio) {
            res.status(400);
            res.send('sellRatio field not provided');
            return;
        }
        Household.findOne({ username: req.session.user.username }, (err, user) => {
            if(err) {
                console.error(err);
                res.status(500);
                res.send('error setting sell ratio');
                return;
                } else {
                user.sellRatio = req.body.sellRatio;
                user.save((err) => {
                    if(err) {
                        console.error(err);
                        res.status(500);
                        res.send('error saving sell ratio');
                    return;
                }
                    console.log('SellRatio for user "' + req.session.user.username + '" updated');
                });

                res.status(200);
                res.send('Sellratio updated');
                return;
            }
        });
    });


app.route('/buyRatio/')
.get(ensureLoggedIn, (req, res) => {
    Household.findOne({ username: req.session.user.username }, (err, user) => {
            if(err) {
            console.error(err);
            res.status(500);
            res.send('error getting buy ratio');
                return;
            } else {
                    res.status(200);
            res.send(user.buyRatio.toString());
            return;
        }
    });
})
.post(ensureLoggedIn, (req, res) => {
    if(!req.body.buyRatio) {
        res.status(400);
        res.send('buyRatio field not provided');
        return;
    }
    Household.findOne({ username: req.session.user.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500);
            res.send('error setting buy ratio');
                    return;
                } else {
            user.buyRatio = req.body.buyRatio;
            user.save((err) => {
                if(err) {
                    console.error(err);
                    res.status(500);
                    res.send('error saving buy ratio');
                    return;
                }
                console.log('BuyRatio for user "' + req.session.user.username + '" updated');
            });
            

            res.status(200);
            res.send('Buyratio updated');
            return;
            }
        });
    });