import axios from 'axios';
import config from "./config";
import Token from "./token";

function tokenInterceptor(requestConfig) {

    requestConfig.headers['X-Parse-Application-Id'] = config.appId;
    requestConfig.headers['X-Parse-REST-API-Key'] = config.appKey;

    if (Token.isAuthenticated()) {
        requestConfig.headers['X-Parse-Session-Token'] = Token.getToken();
    }

    return requestConfig;
}

function tokenInterceptorError(err) {
    if (err.status === 401 || (err.status === 404 && err.error.code === 101)) {
        Token.deleteToken();
        throw new Error(err.error.error);
    }

    return Promise.reject(err);
}

/** @type {AxiosInstance} */
const request = axios.create();

request.interceptors.request.use(
    (config) => tokenInterceptor(config),
    (err) => tokenInterceptorError(err)
);

export default request;
