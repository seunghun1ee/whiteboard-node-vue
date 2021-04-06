<template>
  <div class="ms-auto col-2 fixed-bottom">
    <form autocomplete="off" @submit="submitForm">
      <label for="textInput" class="form-label">Chat</label>
      <input id="textInput" type="text" class="form-control" v-model="chatMessage" name="chatMessage" v-on:input="validateChat">
      <button type="submit" id="speechButton" class="btn btn-primary" v-bind:disabled="isChatEmpty">Send</button>
    </form>
  </div>
</template>

<script>
const room = location.pathname;
export default {
  name: "chatInput",
  data() {
    return {
      chatMessage: null,
      isChatEmpty: true
    }
  },
  methods: {
    validateChat(event) {
      this.isChatEmpty = event.target.value === "" || event.target.value === null;
    },
    submitForm(e) {
      const vue = this;
      console.log(this.chatMessage,room);
      this.$emit("chatSent",this.chatMessage);
      vue.$socket.emit("chat_message",{room:room,msg:this.chatMessage});
      this.chatMessage = "";
      this.isChatEmpty = true;
      e.preventDefault();
    }
  }
}
</script>

<style scoped>

</style>