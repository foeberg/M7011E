const { User, Household } = require('../models');
const sessionStore = require('../utils/sessionstore');
const bcrypt = require('bcrypt');
const fs = require('fs');

const getProfileImage = (req, res) => {
    User.findOne({ username: req.session.user.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting image URL');
            return;
        } else {
            if(user.imageURL === ''){
                if(user.role === 'manager') {
                    res.send('placeholderManager.jpg');
                } else {
                    res.send('placeholder.jpg');
                }
                return;
            } else {
                res.send(user.imageURL);
                return;
            }
        }
    });
};

const postProfileImage = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded');
        return;
    } else {
        let file = req.files.file;

        if(!file.mimetype.includes('image')) {
            res.status(400).send('Invalid image format');
            return;
        }

        // Splits for example 'image/png' into 'image', 'png'. Takes the second element to get the filetype
        let filetype = file.mimetype.split('/')[1];
        let filename = req.session.user._id + '.' + filetype;
        let dirpath = './householdImages/';

        // If a picture associated with the user already exists, remove it
        fs.readdirSync(dirpath).forEach((f) => {
            if(f.includes(req.session.user._id)) {
                fs.unlink(dirpath + f, (err) => {
                    if(err) {
                        console.error(err);
                        res.status(500).send('Error uploading image');
                        return;
                    } else {
                        console.log('Image for user ' + req.session.user.username + ' was deleted');
                    }
                });
            }
        });
        
        // Save the new image
        file.mv(dirpath + filename, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error uploading image');
                return;
            } else {
                User.findOne({ username: req.session.user.username }, (err, user) => {
                    if(err) {
                        console.error(err);
                        res.status(500).send('Error getting image');
                        return;
                    } else {
                        user.imageURL = filename;
                        user.save((err, user) => {
                            if(err) {
                                console.error(err);
                                res.status(500).send('Error saving URL');
                                return;
                            } else {
                                console.log('Image URL for user ' + req.session.user.username + ' updated');
                                res.status(200).send(user.imageURL);
                                return;
                            }
                        });
                    }
                });
            }
        });
    }
};

const getProsumers = (req, res) => {
    let online = sessionStore.getActiveSessions();
    let list = [];
    User.find({ role: 'prosumer' }, (err, users) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting prosumers');
            return;
        } else {
            users.forEach(user => {
                let found = false;
                for(let i = 0; i < online.length; i++) {
                    if(user.username === online[i].username) {
                        list.push({
                            status: 'online',
                            username: user.username,
                            lastname: user.lastname
                        });
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    list.push({
                        status: 'offline',
                        username: user.username,
                        lastname: user.lastname
                    });
                }
            });
            res.status(200).send(list);
        }
    });
};

const getUser = (req, res) => {
    User.findOne({ username: req.session.user.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting user.');
            return;
        } else {
            let data = {
                username: user.username,
                lastname: user.lastname,
                role: user.role
            };
            res.status(200).send(data);
            return;
        }
    });
};

const updateUser = (req, res) => {
    // If user is prosumer, update his own credentials
    let username = req.session.user.username;

    // If user is manager, change the credentials of the username passed
    if(req.session.user.role === 'manager') {
        if(req.body.username == null || req.body.username === '') {
            res.status(400).send('username field not provided');
            return;
        }
        username = req.body.username;
    }
    User.findOne({ username: username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error updating user.');
            return;
        } else {
            // If lastname is set, update in database
            if(req.body.lastname != null && req.body.lastname !== '') {
                user.lastname = req.body.lastname;
            }

            // If password is set, update in database
            if(req.body.password != null && req.body.password !== '') {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(req.body.password, salt);
            }

            user.save(err => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error updating user.');
                    return;
                } else {
                    res.status(200).send('User updated.');
                }
            });
        }
    });
};

// Only supports deleting managers as of now, since the requirements only stated this
const deleteUser = (req, res) => {
    console.log(req.body);
    if(req.body.username == null || req.body.username === '') {
        res.status(400).send('username field not provided');
        return;
    }
    User.deleteOne({ username: req.body.username }, (err) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error deleting user.');
            return;
        } else {
            console.log('User ' + req.body.username + ' deleted');

            Household.deleteOne({ username: req.body.username }, (err) => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error deleting household.');
                    return;
                }
                console.log('Household ' + req.body.username + ' deleted.');
                // Destroy the session belonging to the user
                sessionStore.removeUser(req.body.username);
                res.status(200).send('User deleted.');
                return;
            })
        }
    });
};

module.exports = {
    getProfileImage,
    postProfileImage,
    getProsumers,
    getUser,
    updateUser,
    deleteUser
};