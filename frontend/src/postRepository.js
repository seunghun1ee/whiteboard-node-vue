import axios from "axios";
const BASE_URL = "http://localhost:3000";

export function getPosts() {
    return axios.get(BASE_URL+"/api/posts").then(res => res.data);
}

export function getPostById(id) {
    return axios.get(BASE_URL+"/api/posts/" + id).then(res => res.data);
}

export function getPostsByUnitId(unitId) {
    return axios.get(BASE_URL+"/api/posts/unitId/" + unitId).then(res => res.data);
}

export function savePost(post) {
    return axios.post(BASE_URL + "/api/posts/newPost",post).then(res => res.data);
}