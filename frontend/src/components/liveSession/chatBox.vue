<template>
  <div>
    <div id="chatMenu" ref="chatMenu">
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="channelMenu" data-bs-toggle="dropdown" aria-expanded="false">
          Channels
        </button>
        <ul class="dropdown-menu" aria-labelledby="channelMenu">
          <li v-for="channel in channels" :key="channel.id">
            <button v-if="channelIndex === channel.id" v-on:click="channelIndex = channel.id" class="dropdown-item active" type="button">{{channel.name}}</button>
            <button v-else v-on:click="channelIndex = channel.id" class="dropdown-item" type="button">{{channel.name}}</button>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button class="dropdown-item">Add new channel</button>
          </li>
        </ul>
      </div>
    </div>
    <chat-channel v-bind:hidden="channelIndex !== channel.id" v-for="channel in channels" :key="channel.id" v-bind:username="username" v-bind:channel-data="channel"></chat-channel>
  </div>
</template>

<script>
import ChatChannel from "@/components/liveSession/chatChannel";
export default {
  name: "chatBox",
  components: {ChatChannel},
  data() {
    return {
      username: "User",
      channelIndex: 0,
      channels: [{id: 0, name: "default"}, {id: 1, name: "secondary"}, {id: 2, name: "private"}]
    }
  },
  mounted() {
    this.username = prompt("Please enter the name to use", "User");
  }
}
</script>

<style scoped>

</style>