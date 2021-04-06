<template>
  <div>
    <span v-for="error in errors" :key="error">{{error}} </span>
    <form id="newCommentForm" @submit="submitForm">
      <label v-if="anonymous" for="commentInput" class="form-label">Comment as Anonymous</label>
      <label v-else for="commentInput" class="form-label">Comment as {{sessionUser}}</label>
      <textarea id="commentInput" class="form-control" placeholder="Leave comment" v-model="body" name="body" required></textarea>
      <div class="form-check form-switch">
        <input id="newPostAnonymousInput" class="form-check-input" type="checkbox" v-model="anonymous" v-on:click="anonymous = !anonymous" name="anonymous">
        <label class="form-check-label" for="newPostAnonymousInput">Comment anonymously</label>
      </div>
      <button type="submit" class="btn-sm btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import {saveComment} from "@/postRepository";

export default {
  name: "newCommentForm",
  data() {
    return {
      sessionUser: "Edgar Wright", //static placeholder value
      author: null,
      body: null,
      anonymous: false,
      errors: []
    }
  },
  created() {
    console.log(this.$route.params);
  },
  methods: {
    checkForm() {
      if(this.body) {
        this.errors = [];
        return true;
      }
      if(!this.body) {
        this.errors.push("Body required");
      }
      return false;
    },
    submitForm(e) {
      this.author = this.sessionUser;
      if(this.checkForm()) {
        let comment = {
          author: this.author,
          body: this.body,
          anonymous: this.anonymous
        }
        console.log(comment);
        saveComment(this.$route.params.postId, comment).then(newComment => {
          console.log("new comment",newComment);
          this.$emit("newCommentSaved",newComment);
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