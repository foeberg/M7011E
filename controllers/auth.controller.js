const { Household } = require('../models');
const bcrypt = require('bcrypt');

const signup = (req, res) => {
    const salt = bcrypt.genSaltSync();
        
    let newHousehold = new Household({
        lastname: req.body.lastname,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt)
    });

    newHousehold.save(function (err, c) {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating user');
            return;
        } else {
            console.log("New household " + c.lastname + " saved.");
            req.session.user = c;

            res.status(200).send('User created');
            return;
        }
    });
};

const login = (req, res) => {
    Household.findOne({ username: req.body.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error logging in');
            return;
        } else {
            if(!user) {
                res.status(400).send();
                return;
            }
            if(bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;

                res.status(200).send('Logged in');
                return;
            } else {
                res.status(400).send();
                return;
            }
        }
    });
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error logging out');
            return;
        } else {
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