/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, sessionParams) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  /** Receives sessionID and returns the session with same id.
   * @param {string} id indicates unique sessionID string;
   * @returns {{userID: string, username: string, connected: boolean}}
   */
  findSession(id) {
    return this.sessions.get(id);
  }

  /** Creates new session.
   * @param {string} id indicates unique sessionID string;
   * @param {{userID: string, username: string, connected: boolean}} sessionParams indicates params of each session.;
   */
  saveSession(id, sessionParams) {
    this.sessions.set(id, sessionParams);
  }

  /** Returns an array of sessions.
   * @returns {{userID: string, username: string, connected: boolean}[]}
   */
  findAllSessions() {
    return [...this.sessions.values()];
  }
}

module.exports = {
  InMemorySessionStore,
};
