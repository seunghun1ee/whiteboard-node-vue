<template>
  <div class="row">
    <div class="col-10">
      <p>Broadcast</p>
      <p v-if="isRecoding">This session is being recorded</p>
      <button v-on:click="toggleTTS()" id="toggleTTSButton" class="btn btn-primary">Resume/Pause TTS</button>
      <button id="nextTTSButton" class="btn btn-primary">Next TTS</button>
      <button id="cameraButton" class="btn btn-primary">Camera</button>
      <button id="micButton" class="btn btn-primary">Microphone</button>
      <button id="audioButton" class="btn btn-primary">Audio</button>
      <button v-on:click="onRecordClicked" id="recordButton" class="btn btn-danger">Record</button>
      <button id="screenButton" class="btn btn-primary">Share screen</button>
      <pdf-view></pdf-view>

      <record-reminder v-if="!isRecoding && recordCount === 0" v-bind="{firstTime:5000,time:10000}" v-on:toastRecordClicked="onRecordClicked"></record-reminder>

    </div>
    <div class="col-2">
      <p class="mb-1">Chat</p>
      <chat-box></chat-box>
    </div>
  </div>

</template>

<script>
import {toggleTTS} from "@/liveTTSChat";
import PdfView from "@/components/pdf/pdfView";
import ChatBox from "@/components/liveSession/chatBox";
import RecordReminder from "@/components/liveSession/recordReminder";

const room = location.pathname;

export default {
  name: "live",
  components: {RecordReminder, ChatBox, PdfView},
  data() {
    return {
      isRecoding: false,
      recordCount: 0
    }
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    room: function (room) {
      console.log("room emitted",room);
    },
    record_state_true: function () {
      this.isRecoding = true;
    },
    record_started: function () {
      this.startRecording();
      this.recordCount++;
    },
    record_stopped: function () {
      this.stopRecording();
      this.recordCount++;
    }
  },
  created() {
    this.$socket.emit("room",room);
    console.log(this.$socket, room);
  },
  mounted() {

  },
  methods: {
    toggleTTS,
    onRecordClicked() {
      console.log("record button clicked");
      if(!this.isRecoding) {
        this.startRecording();
        this.$socket.emit("record_start",room);
      }
      else {
        this.stopRecording();
        this.$socket.emit("record_stop",room);
      }
      this.recordCount++;
    },
    startRecording() {
      this.isRecoding = true;
      console.log("recording starts");
    },
    stopRecording() {
      this.isRecoding = false;
      console.log("recording stops");
    }
  }
}
</script>

<style scoped>

</style>