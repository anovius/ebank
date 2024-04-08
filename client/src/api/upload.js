import axios from "axios";
import { environment } from "../constants";

const Upload  = {
    upload: (body) => {
        return axios.post(environment.api_url+'/upload', body);
    }
}

export default Upload;