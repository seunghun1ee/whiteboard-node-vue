<template>
  <div class="row">
    <div id="liveArea" class="col-10">
      <p v-if="isRecoding">This session is being recorded</p>
      <button id="cameraButton" class="btn btn-primary">Camera</button>
      <button id="micButton" class="btn btn-primary">Microphone</button>
      <button id="audioButton" class="btn btn-primary">Audio</button>
      <button v-on:click="onRecordClicked" id="recordButton" class="btn btn-danger">Record</button>
      <button id="screenButton" class="btn btn-primary">Share screen</button>
      <pdf-uploader></pdf-uploader>
      <button class="btn btn-secondary" v-if="isPdfReady" v-on:click="onStopPresentation">Stop presentation</button>
      <pdf-document v-if="b64PdfData" :key="b64PdfData" v-bind="{data: b64PdfData, scale: 1, width: 1000, height: 563}"></pdf-document>
      <record-reminder v-if="!isRecoding && recordCount === 0" v-bind="{firstTime:5000,time:10000}" v-on:toastRecordClicked="onRecordClicked"></record-reminder>
      <jitsi v-bind:hidden="jitsiHidden"></jitsi>
    </div>
    <div class="col-2">
      <chat-box></chat-box>
    </div>
  </div>

</template>

<script>
import {toggleTTS} from "@/liveTTSChat";
import ChatBox from "@/components/liveSession/chatBox";
import RecordReminder from "@/components/liveSession/recordReminder";
import PdfUploader from "@/components/pdf/pdfUploader";
import PdfDocument from "@/components/pdf/pdfDocument";
import Jitsi from "./liveSession/jitsi";

const room = location.pathname;

export default {
  name: "live",
  // eslint-disable-next-line vue/no-unused-components
  components: {Jitsi, PdfDocument, PdfUploader, RecordReminder, ChatBox},
  data() {
    return {
      isRecoding: false,
      recordCount: 0,
      isPdfReady: false,
      b64PdfData: null,
      jitsiHidden: false,
      pdfWidth: 0,
      pdfHeight: 0
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
    },
    presenting_pdf: function (data) {
      this.isPdfReady = true;
      this.b64PdfData = atob(data);
      this.jitsiHidden = true;
    },
    presentation_stopped: function () {
      this.isPdfReady = false;
      this.b64PdfData = null;
      this.jitsiHidden = false;
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
    },
    onStopPresentation() {
      this.isPdfReady = false;
      console.log("presentation stops");
      this.$socket.emit("stop_presenting_pdf");
      this.jitsiHidden = false;
    },
    onPdfUploaded() {
      this.jitsiHidden = true;
    }
  }
}
</script>

<style scoped>

</style>