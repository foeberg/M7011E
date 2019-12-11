const { User, Household } = require('../models');
const { sim } = require('./simulator.controller');
const sessionStore = require('../utils/sessionstore');
const bcrypt = require('bcrypt');

const signup = (req, res) => {
    const salt = bcrypt.genSaltSync();
        
    let newUser = new User({
        lastname: req.body.lastname,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt)
    });

    newUser.save(function (err, user) {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating user');
            return;
        } else {
            // Since this api call is used only for creating prosumers, we always create a household when creating user
            let newHousehold = new Household({
                username: user.username,
            });

            newHousehold.save(function (err, household) {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error creating household');
                    return;
                } else {
                    console.log("New household " + household.username + " saved.");

                    // Create session, i.e log in after registering
                    req.session.user = user;

                    sessionStore.addUser(user);

                    // Add the new household to the simulator
                    sim.addHousehold(household);
                    res.status(200).send('User created');
                    return;
                }
            });
        }
    });
};

const login = (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error logging in');
            return;
        } else {
            if(!user) {
                res.status(400).send('Incorrect username or password');
                return;
            }
            if(bcrypt.compareSync(req.body.password, user.password)) {
                // If password is correct, we create the session
                req.session.user = user;
                sessionStore.addUser(user);

                res.status(200).send('Logged in');
                return;
            } else {
                res.status(400).send('Incorrect username or password');
                return;
            }
        }
    });
};

const logout = (req, res) => {
    let user = req.session.user;
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error logging out');
            return;
        } else {
            sessionStore.removeUser(user);
            res.status(200).send('Logged out');
            return;
        }
    });
};

module.exports = {
    signup,
    login,
    logout
};