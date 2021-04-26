<template>
  <div>
    <a v-if="commentData.anonymous">Anonymous</a>
    <a v-else>{{commentData.author}}</a>
    <small class="text-muted"> | 31/12/2021 - 09:20</small>
    <p>{{commentData.body}}</p>
    <button class="btn btn-sm btn-outline-success" v-on:click="markCommentAnswer">Mark as answer</button>
    <button class="btn btn-sm btn-outline-danger" v-on:click="unmarkCommentAnswer">Unmark as answer</button>
    <hr>
  </div>
</template>

<script>
export default {
  name: "comment",
  props: {
    commentData: Object,
    index: Number
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