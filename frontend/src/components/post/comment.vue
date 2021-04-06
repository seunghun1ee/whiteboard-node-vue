<template>
  <div>
    <a v-if="commentData.anonymous">Anonymous</a>
    <a v-else>{{commentData.author}}</a>
    <small class="text-muted"> | 31/12/2021 - 09:20</small>
    <p>{{commentData.body}}</p>
    <hr>
  </div>
</template>

<script>
export default {
  name: "comment",
  props: {
    commentData: Object
  }
}
</script>

<style scoped>

</style>