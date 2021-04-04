<template>
  <div>
    <post class="mb-3" v-for="post in posts" v-bind:post-data="post" :key="post.id"></post>
  </div>
</template>

<script>
import Post from "@/components/post";
export default {
  name: "postList",
  components: {Post},
  props: {
    posts: Array
  }
}
</script>

<style scoped>

</style>