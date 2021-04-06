<template>
  <div v-if="postData.parent == null">
    <div>
      <h6 v-if="postData.title"><a v-bind:href="'posts/' + postData._id">{{postData.title}}</a></h6>
      <h6 v-else><a v-bind:href="'posts/' + postData._id">No title</a></h6>
      <small>No tags</small>
      <p>
        <a v-if="postData.anonymous">Anonymous</a>
        <a v-else>{{postData.author}}</a>
        <small class="text-muted"> | 31/12/2021 - 09:20</small>
        <small> | 0 Comments</small>
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
  }
}
</script>

<style scoped>

</style>