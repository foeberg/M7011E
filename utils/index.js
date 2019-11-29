const ensureNotLoggedIn = (req, res, next) => {
    if(req.session.user) {
        res.status(400);
        res.send('Already logged in');
        return;
    } else {
        next();
    }
};

const ensureLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        res.status(400);
        res.send('Not logged in');
        return;
    } else {
        next();
    }
};

module.export = {
    ensureNotLoggedIn,
    ensureLoggedIn
}