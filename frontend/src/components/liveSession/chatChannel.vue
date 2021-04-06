<template>
  <div>
    <p>Channel name</p>
    <ul id="chatSpace">
      <li v-for="chat in chats" :key="chat + Math.floor(Math.random()*1000)">
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
  sockets: {
    receive_chat: function (data) {
      const shortId = data.id.substr(0,4);
      this.chats.push(`${shortId}: ${data.chat}`);
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