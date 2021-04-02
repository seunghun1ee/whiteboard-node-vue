<template>
  <div>
    <h1>{{unit.code}} {{unit.name}} Forum</h1>
    <hr>
    <p>
      <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNewPost" aria-expanded="false" aria-controls="collapseNewPost">
        New post
      </button>
    </p>
    <div class="collapse" id="collapseNewPost">
      <div class="mb-3">
        <form>
          <label class="form-label" for="newPostTitleInput">Title (optional)</label>
          <input class="form-control" type="text" id="newPostTitleInput" name="title">
          <label class="form-label" for="newPostTextarea">Post message</label>
          <textarea class="form-control" id="newPostTextarea" rows="3" name="message" required></textarea>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="newPostAnonymousInput" name="isAnonymous">
            <label class="form-check-label" for="newPostAnonymousInput">Post anonymously</label>
          </div>
          <button class="btn btn-primary" type="button" v-on:click="false;submitPost()">Post</button>
        </form>

      </div>
    </div>
    <article id="posts">
      <article v-for="post in posts" v-bind:key="post.id" class="mb-3">
        <div class="card" v-if="post.parent == null" v-bind:id="'post#'+ post.id">
          <div class="card-header">
            <span v-if="post.title">{{post.title}}</span>
            <span v-else>No Title</span>
<!--            <span v-for="tag in post.tags" v-bind:key="tag" class="badge bg-primary">{{tag.name}}</span>-->
            <small v-if="post.isAnonymous"> - Anonymous</small>
            <small v-else-if="users[post.uploader]"> - {{users[post.uploader].name}}</small>
            <small v-else> - No user</small>
          </div>
          <div class="card-body">
            <p class="card-text">{{post.message}}</p>

            <!--Children posts-->
            <div v-for="child in post.children" v-bind:key="child" v-bind:id="'post#' + child" class="card">
              <div class="card-header" v-bind="childPost = posts[child]">
                <small v-if="childPost.isAnonymous">Anonymous</small>
                <small v-else-if="users[childPost.uploader]">{{users[childPost.uploader].name}}</small>
                <small v-else> - No user</small>
              </div>
              <div class="card-body">
                <h5 v-if="childPost.title" class="card-title">{{childPost.title}}</h5>
                <p class="card-text">{{childPost.message}}</p>
              </div>
            </div>

            <div>
              <form>
                <input id="replyInput" class="form-control" placeholder="Reply">
                <button class="btn btn-primary">Post</button>
              </form>
            </div>
          </div>
        </div>
      </article>
    </article>
  </div>
</template>

<script>
import {getPostsByUnitId, savePost} from "@/postRepository";
import {getUsers} from "@/userRepository";
import {getUnitById} from "@/unitRepository";
import Vue from 'vue'
import io from "socket.io-client"
import VueSocketIO from "vue-socket.io";

Vue.use(new VueSocketIO({
  debug: true,
  connection: io("http://localhost:3000")
}));
const room = location.pathname;

export default {
  name: "forum",
  data() {
    return {
      unit: {},
      posts:[],
      users:[]
    }
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    room: function (room) {
      console.log("room emitted",room);
    },
    new_post: function (post) {
      console.log("new post incoming",post);
      this.posts.unshift(post);
    }
  },
  created() {
    // console.log(this.$route.params);
    getUnitById(this.$route.params.id)
        .then(data => this.unit = data)
        .catch(err => alert(err));
    getPostsByUnitId(this.$route.params.id)
        .then(data => {this.posts = data;})
        .catch(err => alert(err));
    getUsers()
        .then(data => {this.users = data;})
        .catch(err => alert(err));
  },
  mounted() {
    this.$socket.emit("room",room);
    console.log(this.$socket);
    console.log(room);
  },
  methods: {
    submitPost: function () {
      const vue = this;
      const titleInput = document.getElementById("newPostTitleInput");
      const message = document.getElementById("newPostTextarea");
      // const anonymous = document.getElementById("newPostAnonymousInput");
      let post = {unit: Number(this.$route.params.id), title: titleInput.value, message: message.value, parent: null, children: [], tags: []}
      savePost(post)
          .then(newPost => {
            this.posts.unshift(newPost);
            vue.$socket.emit("save_new_post",{post: newPost,room:room});
          })
          .catch(err => alert(err));
    }
  }
}
</script>

<style scoped>

</style>