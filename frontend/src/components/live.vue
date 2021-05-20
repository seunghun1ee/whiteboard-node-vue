<template>
  <div class="row">
    <div id="liveArea" class="col-10">
      <p v-if="isRecoding">This session is being recorded</p>
      <pdf-uploader></pdf-uploader>
      <not-jitsi></not-jitsi>
      <button class="btn btn-secondary" v-if="isPdfReady" v-on:click="onStopPresentation">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        Stop presentation
      </button>
      <pdf-document v-if="b64PdfData" :key="b64PdfData" v-bind="{data: b64PdfData, scale: 1}"></pdf-document>
      <record-reminder v-if="!isRecoding && recordCount === 0" v-bind="{firstTime:10000,time:600000}" v-on:toastRecordClicked="onRecordClicked"></record-reminder>
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
//import Jitsi from "./liveSession/jitsi";
import NotJitsi from "@/components/liveSession/notJitsi";

const room = location.pathname;

export default {
  name: "live",
  // eslint-disable-next-line vue/no-unused-components
  components: {NotJitsi, PdfDocument, PdfUploader, RecordReminder, ChatBox},
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