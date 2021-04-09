<template>
  <div>
    <p>{{channelData.name}}</p>
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
const room = location.pathname;
export default {
  name: "chatChannel",
  components: {ChatInput, Chat},
  props: {
    channelData : Object
  },
  data() {
    return {
      chats: []
    }
  },
  sockets: {
    receive_chat: function (data) {
      if(data.channel === this.channelData.id) {
        const shortId = data.id.substr(0,4);
        this.chats.push(`${shortId}: ${data.chat}`);
      }
    }
  },
  methods: {
    onChatSent(chatMessage) {
      const vue = this
      vue.$socket.emit("send_chat",chatMessage,room,this.channelData.id);
      this.chats.push(`myId: ${chatMessage}`);
    }
  }
}
</script>

<style scoped>

</style>