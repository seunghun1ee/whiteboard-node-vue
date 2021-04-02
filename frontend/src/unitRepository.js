import axios from "axios";
const BASE_URL = "http://localhost:3000";

export function getUnits() {
    return axios.get(BASE_URL+"/api/units").then(res => res.data);
}

export function getUnitById(id) {
    return axios.get(BASE_URL+"/api/units/" + id).then(res => res.data);
}