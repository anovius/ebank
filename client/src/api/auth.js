import http from "./axios";

const Auth = {
    login : (body) => {
        return http.post('/user/login', body);
    },

    signup : (body) => {
        return http.post('/user/signup', body);
    },

    twoFactor: (body) => {
        return http.post('/user/twoFactor', body);
    },

    context: () => {
        return http.get('/user/context');
    }
}

export default Auth;