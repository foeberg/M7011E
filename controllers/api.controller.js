const { Household } = require('../models');
const sessionStore = require('../utils/sessionstore');
const fs = require('fs');

const getHouseholdImage = (req, res) => {
    Household.findOne({ username: req.session.user.username }, (err, household) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error getting image URL');
            return;
        } else {
            if(household.imageURL === ""){
                res.send('placeholder.jpg');
                return;
            } else {
                res.send(household.imageURL);
                return;
            }
        }
    });
};

const postHouseholdImage = (req, res) => {
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
        let dirpath = './frontend/src/householdImages/';

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
                Household.findOne({ username: req.session.user.username }, (err, household) => {
                    if(err) {
                        console.error(err);
                        res.status(500).send('Error getting image');
                        return;
                    } else {
                        household.imageURL = filename;
                        household.save((err) => {
                            if(err) {
                                console.error(err);
                                res.status(500).send('Error saving URL');
                                return;
                            } else {
                                console.log('Image URL for user ' + req.session.user.username + ' updated');
                                res.status(200).send('File uploaded!');
                                return;
                            }
                        });
                    }
                });
            }
        });
    }
};

const getActiveSessions = (req, res) => {
    res.send(sessionStore.getActiveSessions());
};

module.exports = {
    getHouseholdImage,
    postHouseholdImage,
    getActiveSessions
};