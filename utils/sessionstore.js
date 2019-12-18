const config = require('../config.json');

class SessionStore {
    constructor() {
        this.activeSessions = [];
        this.expires = config.session_max_age;
    }

    addUser(session, user) {
        this.activeSessions.push({session: session, username: user.username});

        // Remove session when expired
        setTimeout(function(username) {
            this.removeUser(username);
        }.bind(this, user.username), this.expires);
    }

    removeUser(username) {
        let filtered = this.activeSessions.filter((session) => {
            if(session.username === username) {
                session.session.destroy((err) => {
                    if(err) {
                        console.error(err);
                        return true;
                    } else {
                        console.log('User ' + username + ' logged out');
                        return false;
                    }
                });
            } else {
                return true;
            }
        });

        if(this.activeSessions.length === filtered.length) {
            return false;
        } else {
            this.activeSessions = filtered;
            return true;
        }

    }

    getActiveSessions() {
        return this.activeSessions;
    }
}

let store = new SessionStore();

module.exports = store;