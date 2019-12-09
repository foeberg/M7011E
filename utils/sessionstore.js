class SessionStore {
    constructor() {
        this.activeSessions = [];
        this.expires = 86400000;
    }

    addUser(user) {
        this.activeSessions.push({
            username: user.username,
            role: user.role
        });

        // Remove session when expired
        setTimeout(function(user) {
            this.removeUser(user);
        }.bind(this, user), this.expires);
    }

    removeUser(user) {
        let filtered = this.activeSessions.filter((session) => {
            return session.username !== user.username;
        });
        this.activeSessions = filtered;
    }

    getActiveSessions() {
        return this.activeSessions;
    }
}

let store = new SessionStore();

module.exports = store;