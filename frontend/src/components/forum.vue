<template>
  <div>
    <h1>{{unit.code}} {{unit.title}} Forum</h1>
    <hr>
    <p>
      <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNewPost" aria-expanded="false" aria-controls="collapseNewPost">
        New post
      </button>
    </p>
    <div class="collapse" id="collapseNewPost">
      <div class="mb-3">
        <form>
          <label class="form-label" for="newPostTitleInput">Title</label>
          <input class="form-control" type="text" id="newPostTitleInput" name="title" required>
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
    <post-list v-bind:posts="posts"></post-list>
  </div>
</template>

<script>
import {getPostsByUnitId, savePost} from "@/postRepository";
import {getUsers} from "@/userRepository";
import {getUnitById} from "@/unitRepository";
import PostList from "@/components/postList";
const room = location.pathname;

export default {
  name: "forum",
  components: {PostList},
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
      this.posts.push(post);
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
            this.posts.push(newPost);
            vue.$socket.emit("save_new_post",{post: newPost,room:room});
          })
          .catch(err => alert(err));
    }
  }
}
</script>

<style scoped>

</style>