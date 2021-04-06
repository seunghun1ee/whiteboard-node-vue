<template>
  <div>
    <p>Channel name</p>
    <ul id="chatSpace">
      <li v-for="chat in chats" :key="chat">
        <chat v-bind:message="chat"></chat>
      </li>
    </ul>

    <chat-input @chatSent="onChatSent"></chat-input>
  </div>
</template>

<script>
import Chat from "@/components/liveSession/chat";
import ChatInput from "@/components/liveSession/chatInput";
export default {
  name: "chatChannel",
  components: {ChatInput, Chat},
  data() {
    return {
      chats: []
    }
  },
  methods: {
    onChatSent(chatMessage) {
      this.chats.push(`myId: ${chatMessage}`);
    }
  }
}
</script>

<style scoped>

</style>