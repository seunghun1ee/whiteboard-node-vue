<template>
  <div>
    <h1><a v-bind:href="'/units/' + unit._id">{{unit.code}} {{unit.title}}</a> Forum</h1>
    <hr>
    <new-post-form @newPostSaved="onNewPostSaved"></new-post-form>
    <post-list v-bind:posts="posts"></post-list>
  </div>
</template>

<script>
import {getPostsByUnitId} from "@/postRepository";
import {getUsers} from "@/userRepository";
import {getUnitById} from "@/unitRepository";
import PostList from "@/components/post/postList";
import NewPostForm from "@/components/post/newPostForm";
const room = location.pathname;

export default {
  name: "forum",
  components: {NewPostForm, PostList},
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
    onNewPostSaved(newPost) {
      const vue = this;
      this.posts.unshift(newPost);
      vue.$socket.emit("save_new_post",{post: newPost,room:room});
    }
  }
}
</script>

<style scoped>

</style>