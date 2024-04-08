import http from "./axios";

const Transaction = {
    deposit : (body) => {
        return http.post('/transaction/deposit', body);
    },

    wallet : () => {
        return http.get('/transaction/wallet');
    },

    getAll: () => {
        return http.get('/transaction/get/all');
    },

    getAllAdmin: (query = {}) => {
        return http.get('/transaction/get/admin', {params: query});
    },

    changeStatus: (id, status) => {
        return http.put('/transaction/status/' + id + '/' + status);
    },

    withdraw : (body) => {
        return http.post('/transaction/withdraw', body);
    },

    convert: (body) => {
        return http.post('/transaction/convert', body);
    },

    hold: (body) => {
        return http.post('/transaction/hold', body);
    },

    redeem: (body) => {
        return http.post('/transaction/redeem', body);
    },

    borrow: (body) => {
        return http.post('/transaction/borrow', body);
    },

    getBorrow: () => {
        return http.get('/transaction/borrow/assets');
    },

    repay: (body) => {
        return http.post('/transaction/borrow/repay', body);
    },

    getUser: (email) => {
        return http.get('/transaction/get/user/' + email);
    },

    update: (body) => {
        return http.put('/transaction/update', body);
    }
}

export default Transaction;