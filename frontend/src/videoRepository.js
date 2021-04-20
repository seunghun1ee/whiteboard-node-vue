import axios from "axios";
const BASE_URL = process.env.VUE_APP_BACKEND;

export function getVideos() {
    return axios.get(BASE_URL + "/api/videos").then(res => res.data);
}