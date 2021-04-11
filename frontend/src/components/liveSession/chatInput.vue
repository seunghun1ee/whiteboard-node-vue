<template>
  <div style="display: block;" ref="chatInputForm">
    <form autocomplete="off" @submit="submitForm">
      <input type="text" placeholder="Message" class="form-control" v-model="chatMessage" name="chatMessage" v-on:input="validateChat">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" v-model="anonymous" name="anonymous">
        <label class="form-check-label">Anonymous chat</label>
      </div>
      <button type="submit" class="btn btn-primary" v-bind:disabled="isChatEmpty">Send</button>
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