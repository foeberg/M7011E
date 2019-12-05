const ensureNotLoggedIn = (req, res, next) => {
    if(req.session.user) {
        res.status(400).send('Already logged in');
        return;
    } else {
        next();
    }
};

const ensureLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        res.status(400).send('Not logged in');
        return;
    } else {
        next();
    }
};

const ensureLoggedInProsumer = (req, res, next) => {
    if(!req.session.user) {
        res.status(400).send('Not logged in');
        return;
    } else if(req.session.user.role !== 'prosumer') {
        res.status(400).send('Not logged in as prosumer');
    } else {
        next();
    }
};

module.exports = {
    ensureNotLoggedIn,
    ensureLoggedIn,
    ensureLoggedInProsumer
}