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

module.exports = {
    ensureNotLoggedIn,
    ensureLoggedIn
}