const { Household } = require('../models');
const fs = require('fs');

const getHouseholdImage = (req, res) => {
    Household.findOne({ _id: req.session.user._id }, (err, household) => {
        if(err) {
            console.error(err);
            res.status(500);
            res.send('Error getting image URL');
            return;
        } else {
            if(household.imageURL === ""){
                res.send('placeholder.jpg');
            } else {
                res.send(household.imageURL);
            }
        }
    });
};

const postHouseholdImage = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400);
        res.send('No files were uploaded');
        return;
    } else {
        let file = req.files.file;

        if(!file.mimetype.includes('image')) {
            res.status(400);
            res.send('Invalid image format');
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
                        res.status(500);
                        res.send('Error uploading image');
                        return;
                    }
                    console.log('Image for user ' + req.session.user.username + ' was deleted');
                });
            }
        });
        
        // Save the new image
        file.mv(dirpath + filename, (err) => {
            if (err) {
                console.error(err);
                res.status(500);
                res.send('Error uploading image');
                return;
            } else {
                Household.findOne({ _id: req.session.user._id }, (err, household) => {
                    if(err) {
                        console.error(err);
                        res.status(500);
                        res.send('Error getting image');
                        return;
                    }
                    household.imageURL = filename;
                    household.save((err) => {
                        if(err) {
                            console.error(err);
                            res.status(500);
                            res.send('Error saving URL');
                            return;
                        }
                        console.log('Image URL for user ' + req.session.user.username + ' updated');
                    });
                });

                res.status(200);
                res.send('File uploaded!');
                return;
            }
        });
    }
};

const getSellRatio = (req, res) => {
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
};

const postSellRatio = (req, res) => {
    if(req.body.sellRatio == null || req.body.sellRatio === '') {
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
};

const getBuyRatio = (req, res) => {
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
};

const postBuyRatio = (req, res) => {
    if(req.body.buyRatio == null || req.body.buyRatio === '') {
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
};

const getHouseholdBuffer = (req, res) => {
    Household.findOne({ username: req.session.user.username }, (err, user) => {
        if(err) {
            console.error(err);
            res.status(500);
            res.send('error getting buffer');
            return;
        } else {
            res.status(200);
            res.send(user.buffer.toString());
            return;
        }
    });
};

module.exports = {
    getHouseholdImage,
    postHouseholdImage,
    getSellRatio,
    postSellRatio,
    getBuyRatio,
    postBuyRatio,
    getHouseholdBuffer
};