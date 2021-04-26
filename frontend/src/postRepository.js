import axios from "axios";
const BASE_URL = process.env.VUE_APP_BACKEND;

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

// This is part of post repository for now
export function saveComment(postId, comment) {
    return axios.patch(BASE_URL + `/api/posts/${postId}/newComment`,comment).then(res => res.data);
}
// This is part of post repository for now
export function getTags() {
    return axios.get(`${BASE_URL}/api/tags`).then(res => res.data);
}

export function saveTags(postId, tagIds) {
    return axios.patch(`${BASE_URL}/api/posts/${postId}/newTags`,tagIds).then(res => res.data);
}

export function markAnswered(postId) {
    return axios.patch(`${BASE_URL}/api/posts/${postId}/markAnswered`).then(res => res.data);
}

export function markCommentAnswer(postId, commentId, answered) {
    return axios.patch(`${BASE_URL}/api/posts/${postId}/markCommentAnswer?commentId=${commentId}&answered=${answered}`).then(res => res.data);
}

export function getPostByUnitAndTagId(unitId, tagId) {
    return axios.get(`${BASE_URL}/api/posts/unitId/${unitId}/tagId/${tagId}`).then(res => res.data);
}