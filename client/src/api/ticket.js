import http from "./axios";

const Ticket = {
    add: (body) => {
        return http.post("/ticket", body);
    },

    getAll: () => {
        return http.get("/ticket/get/all");
    },

    getAllByAdmin: (data = {}) => {
        return http.get("/ticket/admin/get/all", { params: data});
    },

    changeStatus: (body) => {
        return http.put("/ticket/status", body);
    }
}

export default Ticket;