<template>
  <div v-if="postData.parent == null">
    <div>
      <h6 v-if="postData.title"><a v-bind:href="'posts/' + postData.id">{{postData.title}}</a></h6>
      <h6 v-else><a v-bind:href="'posts/' + postData.id">No title</a></h6>
      <a v-if="postData.isAnonymous">Anonymous</a>
      <a v-else>{{postData.uploader}}</a>
      <small class="text-muted"> | 31/12/2021 - 09:20</small>
      <small> | No tags</small>
      <small> | 0 Comments</small>
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