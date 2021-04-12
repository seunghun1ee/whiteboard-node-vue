import axios from "axios";
const BASE_URL = "http://localhost:3000";

export function uploadPdf(formData) {
    return axios.post(`${BASE_URL}/api/uploadPdf`,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then(res => res.data);
}