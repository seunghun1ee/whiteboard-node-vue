<template>
  <div>
    <chat-channel v-for="channel in channels" :key="channel"></chat-channel>
  </div>
</template>

<script>
import ChatChannel from "@/components/liveSession/chatChannel";
export default {
  name: "chatBox",
  components: {ChatChannel},
  data() {
    return {
      channels: ["default"]
    }
  }
}
</script>

<style scoped>

</style>