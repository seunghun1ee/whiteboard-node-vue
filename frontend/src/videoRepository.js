import axios from "axios";
const BASE_URL = "http://localhost:3000";

export function getVideos() {
    return axios.get(BASE_URL + "/api/videos").then(res => res.data);
}