<template>
  <div>
    <a>{{commentData.author}}</a>
    <small class="text-muted"> | 31/12/2021 - 09:20</small>
    <p>{{commentData.message}}</p>
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