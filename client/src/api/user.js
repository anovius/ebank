import http from "./axios";

const User = {
    getAll: () => {
        return http.get("/user/get/all");
    },

    email: (email) => {
        return http.post("/user/email", email);
    },

    emailAll: (email) => {
        return http.post("/user/email/all", email);
    },

    addTeam: (body) => {
        return http.post("/team", body);
    },

    getAllTeam: () => {
        return http.get("/team");
    },

    blog: (body) => {
        return http.post("/blog", body);
    },

    getAllBlog: () => {
        return http.get("/blog");
    },

    getBlog: (slug) => {
        return http.get("/blog/details/"+slug);
    },

    updateBlog: (slug, body) => {
        return http.put("/blog/update/"+slug, body);
    },

    search: (data) => {
        return http.get("/user/get/all", { params: data});
    },

    changeStatus: (body) => {
        return http.post("/user/change/status", body);
    },

    forgotPassword: (body) => {
        return http.post("/user/forgot", body);
    },

    resetPassword: (body) => {
        return http.post("/user/reset/password", body);
    },

    getReferrals: () => {
        return http.get("/user/get/referrals");
    }
}

export default User;