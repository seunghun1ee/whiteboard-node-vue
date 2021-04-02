<template>
  <div id="app">
    <navbar></navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import navbar from "@/components/navbar";

export default {
  name: 'App',
  components: {
    navbar
  }
}
</script>

