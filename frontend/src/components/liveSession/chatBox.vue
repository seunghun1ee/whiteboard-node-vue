<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-for="channel in channels" :key="channel.id" class="nav-item">
        <a href="#" v-if="channelIndex === channel.id" v-on:click="channelIndex = channel.id" class="nav-link active" aria-current="page">{{channel.name}}</a>
        <a href="#" v-else v-on:click="channelIndex = channel.id" class="nav-link">{{channel.name}}</a>
      </li>
    </ul>
    <chat-channel v-bind:hidden="channelIndex !== channel.id" v-for="channel in channels" :key="channel.id" v-bind:channel-data="channel"></chat-channel>
  </div>
</template>

<script>
import ChatChannel from "@/components/liveSession/chatChannel";
export default {
  name: "chatBox",
  components: {ChatChannel},
  data() {
    return {
      channelIndex: 0,
      channels: [{id: 0, name: "default"}, {id: 1, name: "secondary"}]
    }
  }
}
</script>

<style scoped>

</style>