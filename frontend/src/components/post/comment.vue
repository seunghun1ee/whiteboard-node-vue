<template>
  <div>
    <div v-if="commentData.answer" class="mb-1" style="display: block">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-check2-circle" viewBox="0 0 16 16" style="fill: #198754;">
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"></path>
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"></path>
      </svg>
    </div>
    <a v-if="commentData.anonymous">Anonymous</a>
    <a v-else>{{commentData.author}}</a>
    <small class="text-muted"> | 31/12/2021 - 09:20</small>
    <p>{{commentData.body}}</p>
    <button v-if="commentData.answer" class="btn btn-sm btn-outline-danger" v-on:click="unmarkCommentAnswer">Unmark as answer</button>
    <button v-else-if="!this.postAnswered" class="btn btn-sm btn-outline-success" v-on:click="markCommentAnswer">Mark as answer</button>
    <hr>
  </div>
</template>

<script>
export default {
  name: "comment",
  props: {
    commentData: Object,
    postAnswered: Boolean
  },
  methods: {
    markCommentAnswer() {
      this.$emit("markCommentAnswer",this.commentData._id);
    },
    unmarkCommentAnswer() {
      this.$emit("unmarkCommentAnswer",this.commentData._id);
    }
  }
}
</script>

<style scoped>

</style>