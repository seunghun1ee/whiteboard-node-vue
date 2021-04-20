import axios from "axios";
const BASE_URL = process.env.VUE_APP_BACKEND;

export function uploadPdf(formData) {
    return axios.post(`${BASE_URL}/api/uploadPdf`,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then(res => res.data);
}