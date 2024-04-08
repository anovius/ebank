import http from "./axios";

const Asset = {
    getAll: () => {
        return http.get('/asset/get/all');
    },

    getSpecial: () => {
        return http.get('/asset/get/special');
    },

    add: (body) => {
        return http.post('/asset/add', body);
    },

    status: (id, body) => {
        return http.post(`/asset/status/${id}`, body);
    },

    update: (id, body) => {
        return http.put(`/asset/update/${id}`, body);
    },

    getPrices: () => {
        return http.get('/asset/prices');
    },

    getStats: () => {
        return http.get('/asset/my/stats');
    },

    getMyAssets: () => {
        return http.get('/asset/my/assets');
    },

    getEarnings: (name) => {
        return http.get('/asset/earn/' + name);
    },

    getBorrow: (name) => {
        return http.get('/asset/borrow/' + name);
    },
}

export default Asset;