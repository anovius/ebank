import http from "./axios";

const KYC = {
    get: () => {
        return http.get("/kyc");
    },

    post: (body) => {
        return http.post('/kyc', body)
    }, 

    getLevel : () => {
        return http.get("/kyc/karma");
    }
}


export default KYC;