<template>
    <div v-if="postData.parent == null" class="card">
      <div class="card-body">
        <h6 v-if="postData.isAnonymous" class="card-title mb-0 fw-bold">Anonymous</h6>
        <h6 v-else class="card-title mb-0 fw-bold">{{postData.uploader}}</h6>
        <small class="text-muted">31/12/2021 - 09:20</small>
        <p v-if="postData.title" class="card-text mb-1"><a v-bind:href="'posts/' + postData.id">{{postData.title}}</a></p>
        <p v-else class="card-text mb-1"><a v-bind:href="'posts/' + postData.id">No title</a></p>
        <p class="card-text">{{postData.message}}</p>
        <p class="card-text text-end">0 Comments</p>
        <p class="text-muted text-sm-end mb-0"><a href="#">Edit</a></p>
      </div>
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