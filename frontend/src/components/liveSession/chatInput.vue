<template>
  <div class="ms-auto col-2 fixed-bottom">
    <form autocomplete="off" @submit="submitForm">
      <label for="textInput" class="form-label">Chat</label>
      <input id="textInput" type="text" class="form-control" v-model="chatMessage" name="chatMessage" v-on:input="validateChat">
      <div class="form-check form-switch">
        <input id="newPostAnonymousInput" class="form-check-input" type="checkbox" v-model="anonymous" name="anonymous">
        <label class="form-check-label" for="newPostAnonymousInput">Anonymous chat</label>
      </div>
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
      anonymous: false,
      isChatEmpty: true
    }
  },
  methods: {
    validateChat(event) {
      this.isChatEmpty = event.target.value === "" || event.target.value === null;
    },
    submitForm(e) {
      console.log(this.chatMessage,this.anonymous,room);
      this.$emit("chatSent",this.chatMessage,this.anonymous);
      this.chatMessage = "";
      this.isChatEmpty = true;
      e.preventDefault();
    }
  }
}
</script>

<style scoped>

</style>