<template>
  <div>
    <p>
      <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNewPost" aria-expanded="false" aria-controls="collapseNewPost">
        New post
      </button>
    </p>
    <div id="collapseNewPost" class="collapse">
      <span v-for="error in errors" :key="error">{{error}} </span>
      <div class="mb-3">
        <form id="newPost" @submit="submitForm">
          <label class="form-label" for="newPostTitleInput">Title</label>
          <input id="newPostTitleInput" class="form-control" type="text" v-model="title" name="title" required>
          <label class="form-label" for="newPostTagSelect">Tags</label>
          <select id="newPostTagSelect" class="form-select form-select-sm" multiple v-model="tags" name="tags">
            <option v-for="selectTag in selectTags" :key="selectTag.id" v-bind:value="selectTag.id">{{selectTag.name}}</option>
          </select>
          <label class="form-label" for="newPostTextarea">Post message</label>
          <textarea class="form-control" id="newPostTextarea" rows="3" v-model="body" name="body" required></textarea>
          <div class="form-check form-switch">
            <input id="newPostAnonymousInput" class="form-check-input" type="checkbox" v-model="anonymous" name="anonymous">
            <label class="form-check-label" for="newPostAnonymousInput">Post anonymously</label>
          </div>
          <button class="btn btn-primary" type="submit">Post</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {savePost, getTags} from "@/postRepository";

export default {
  name: "newPostForm",
  data() {
    return {
      title: null,
      tags: [],
      body: null,
      anonymous: false,
      errors: [],
      selectTags: []
    }
  },
  created() {
    getTags()
        .then(data => this.selectTags = data)
        .catch(err => alert(err));
  },
  methods: {
    checkForm() {
      if(this.title && this.body) {
        this.errors = [];
        return true;
      }
      if(!this.title) {
        this.errors.push("Title required");
      }
      if(!this.body) {
        this.errors.push("Body required");
      }
      return false;
    },
    submitForm(e) {
      if(this.checkForm()) {
        let unitId = this.$route.params.id;
        let post = {
          unitId: unitId,
          title: this.title,
          author: "Edgar Wright", // static placeholder value
          tags: this.tags,
          body: this.body,
          anonymous: this.anonymous
        }
        console.log(post);
        savePost(post).then(newPost => {
          this.$emit("newPostSaved",newPost);
        }).catch(err => alert(err));
      }
      else {
        console.log(this.errors);
      }
      e.preventDefault();
    }
  }
}
</script>

<style scoped>

</style>