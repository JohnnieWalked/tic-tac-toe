/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, sessionParams) {}
  findAllSessions() {}
}

/**
 * @typedef {Object} Session
 * @property {string} username - The username of the participator.
 * @property {string} userID - The user ID of the participator.
 * @property {boolean} connected - Indicates whether the user is connected.
 */

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  /** Receives sessionID and returns the session with same id.
   * @param {string} id indicates unique sessionID string;
   * @returns {Session}
   */
  findSession(id) {
    return this.sessions.get(id);
  }

  /** Creates new session.
   * @param {string} id indicates unique sessionID string;
   * @param {Session} sessionParams indicates params of each session.;
   */
  saveSession(id, sessionParams) {
    this.sessions.set(id, sessionParams);
  }

  /** Returns an array of sessions.
   * @returns {Session[]}
   */
  findAllSessions() {
    return [...this.sessions.values()];
  }
}

module.exports = {
  InMemorySessionStore,
};
