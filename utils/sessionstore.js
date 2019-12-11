const config = require('../config.json');

class SessionStore {
    constructor() {
        this.activeSessions = [];
        this.expires = config.session_max_age;
    }

    addUser(user) {
        this.activeSessions.push(user.username);

        // Remove session when expired
        setTimeout(function(user) {
            this.removeUser(user);
        }.bind(this, user), this.expires);
    }

    removeUser(user) {
        let filtered = this.activeSessions.filter((session) => {
            return session !== user.username;
        });
        this.activeSessions = filtered;
    }

    getActiveSessions() {
        return this.activeSessions;
    }
}

let store = new SessionStore();

module.exports = store;