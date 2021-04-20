import axios from "axios";
const BASE_URL = process.env.VUE_APP_BACKEND;

export function getUnits() {
    return axios.get(BASE_URL+"/api/units").then(res => res.data);
}

export function getUnitById(id) {
    return axios.get(BASE_URL+"/api/units/" + id).then(res => res.data);
}