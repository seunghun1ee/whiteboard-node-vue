<template>
  <div>
    <p>jitsi space</p>
    <button v-on:click="joinRoom('equalhintstinsalong')">Join room</button>
    <button v-on:click="unload">Leave room</button>
    <div id="videos" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"></div>
  </div>
</template>

<script>
import {jitsiInit, connect, joinRoom, unload} from "../../jitsi";

export default {
  name: "jitsi",
  mounted() {
    jitsiInit();
    connect();
  },
  methods: {
    joinRoom,
    unload
  }

}
</script>

<style scoped>

</style>