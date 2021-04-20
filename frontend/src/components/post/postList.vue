<template>
  <div>
    <post class="mb-0" v-for="post in posts" v-bind:post-data="post" :key="post._id"></post>
  </div>
</template>

<script>
import Post from "@/components/post/post";
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