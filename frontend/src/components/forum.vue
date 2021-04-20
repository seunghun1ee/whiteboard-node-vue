<template>
  <div>
    <h1><a v-bind:href="'/units/' + unit._id">{{unit.code}} {{unit.title}}</a> Forum</h1>
    <hr>
    <new-post-form @newPostSaved="onNewPostSaved"></new-post-form>
    <div>
      <small>Filter by tag  </small>
      <small v-if="currentTag" v-bind:style="'color:' + currentTag.colour">{{currentTag.name}}  </small>
      <button v-if="currentTag" v-on:click="tagFilterClear" class="btn btn-sm btn-outline-secondary">Clear</button>
      <ul class="list-inline">
        <li class="list-inline-item" v-for="tag in tags" :key="tag.id" v-on:click="tagFilter(tag)">
          <small><a href="#" v-bind:style="'color:' + tag.colour">{{tag.name}}</a></small>
        </li>
      </ul>
    </div>
    <post-list v-bind:posts="posts"></post-list>
  </div>
</template>

<script>
import {getPostsByUnitId, getTags, getPostByUnitAndTagId} from "@/postRepository";
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
      users:[],
      tags: [],
      currentTag: null
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
      if(this.currentTag == null) {
        this.posts.unshift(post);
      }
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
    getTags()
        .then(data => {this.tags = data;})
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
    },
    tagFilter(tag) {
      this.currentTag = tag
      getPostByUnitAndTagId(this.unit._id,tag.id)
          .then(res => this.posts = res)
          .catch(err => alert(err));
    },
    tagFilterClear() {
      this.currentTag = null;
      getPostsByUnitId(this.unit._id)
          .then(data => {this.posts = data;})
          .catch(err => alert(err));
    }
  }
}
</script>

<style scoped>

</style>