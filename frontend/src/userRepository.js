import axios from "axios";
const BASE_URL = process.env.VUE_APP_BACKEND;

export function getUsers() {
    return axios.get(BASE_URL+"/api/users").then(res => res.data);
}

export function getUserById(id) {
    return axios.get(BASE_URL+"/api/users/" + id).then(res => res.data);
}