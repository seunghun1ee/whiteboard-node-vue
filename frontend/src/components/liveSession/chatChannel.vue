<template>
  <div>
    <div v-bind:id="channelData.name" class="chat-channel">
      <p>{{channelData.name}}</p>
      <ul id="chatSpace">
        <li v-for="chat in chats" :key="chat + Math.floor(Math.random()*1000)">
          <chat v-bind:message="chat"></chat>
        </li>
      </ul>
    </div>
    <chat-input ref="chatInput" @chatSent="onChatSent"></chat-input>
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
    username: String,
    channelData : Object
  },
  data() {
    return {
      chatHeight: 100,
      chats: []
    }
  },
  sockets: {
    receive_chat: function (data) {
      if(data.channel === this.channelData.id) {
        if(data.anonymous) {
          this.chats.push(`Anonymous: ${data.chat}`);
        }
        else {
          //const shortId = data.id.substr(0,4);
          this.chats.push(`${data.id}: ${data.chat}`);
        }
      }
    }
  },
  mounted() {
    this.chatHeight = 0.7 * window.innerHeight;
    document.getElementById(this.channelData.name).setAttribute("style", `height: ${this.chatHeight}px`);
  },
  methods: {
    onChatSent(chatMessage,anonymous) {
      const vue = this
      vue.$socket.emit("send_chat",this.username,chatMessage,anonymous,room,this.channelData.id);
      this.chats.push(`Me: ${chatMessage}`);
    }
  }
}
</script>

<style scoped>
  .chat-channel {
    display: block;
    overflow-wrap: break-word;
    word-wrap: break-word;
    overflow-y: auto;
  }
</style>