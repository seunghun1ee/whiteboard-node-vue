<template>
  <div>
    <div v-bind:style="{display: 'block', height: chatHeight+'px', overflow: 'auto'}">
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
          const shortId = data.id.substr(0,4);
          this.chats.push(`${shortId}: ${data.chat}`);
        }
      }
    }
  },
  mounted() {
    const menuHeight = this.$parent.$refs.chatMenu.clientHeight;
    const inputHeight = this.$refs.chatInput.$refs.chatInputForm.clientHeight;
    console.log(`${this.channelData.name} heights:`,menuHeight,inputHeight);
    this.chatHeight = 0.9 * window.innerHeight - menuHeight - inputHeight;
  },
  methods: {
    onChatSent(chatMessage,anonymous) {
      const vue = this
      vue.$socket.emit("send_chat",chatMessage,anonymous,room,this.channelData.id);
      this.chats.push(`myId: ${chatMessage}`);
    }
  }
}
</script>

<style scoped>
  .chat-channel {
    display: block;
    height: 400px;
    overflow: auto;
  }
</style>