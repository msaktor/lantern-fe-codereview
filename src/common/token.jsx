export default class Token {

    /**
     * Return if user is authenticated
     *
     * @return {boolean}
     */
    static isAuthenticated() {
        return Token.getToken() !== null;
    }

    /**
     * Get token from local storage
     *
     * @returns {string|Null}
     */
    static getToken() {
        return localStorage.getItem('LanternSessionToken');
    }

    /**
     * Set token to local storage
     *
     * @param {string} token
     * @returns void
     */
    static setToken(token) {
        localStorage.setItem('LanternSessionToken', token);
    }

    /**
     * Remove token from local storage
     *
     * @returns void
     */
    static deleteToken() {
        localStorage.removeItem('LanternSessionToken');
    }
}
