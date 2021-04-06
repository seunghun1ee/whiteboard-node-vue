<template>
  <div v-if="postData.parent == null">
    <div>
      <h6 v-if="postData.title"><a v-bind:href="'posts/' + postData._id">{{postData.title}}</a></h6>
      <h6 v-else><a v-bind:href="'posts/' + postData._id">No title</a></h6>
      <div v-if="postData.tags.length > 0">
        <small v-for="tag in postData.tags" :key="tag">{{tag}} | </small>
      </div>
      <small v-else class="mb-0">No tags</small>
      <p>
        <a v-if="postData.anonymous">Anonymous</a>
        <a v-else>{{postData.author}}</a>
        <small class="text-muted"> | {{new Intl.DateTimeFormat("en-GB",this.dateFormatOption).format(new Date(postData.createdAt))}}</small>
        <small v-if="postData.comments.length === 1" :key="postData.comments.length">| 1 Comment</small>
        <small v-else :key="postData.comments.length">| {{postData.comments.length}} Comments</small>
      </p>
    </div>
    <hr>
  </div>
</template>

<script>
export default {
  name: "post",
  props: {
    postData: Object,
  },
  data() {
    return {
      dateFormatOption: {
        dateStyle: "medium",
        timeStyle: "medium"
      }
    }
  }
}
</script>

<style scoped>

</style>