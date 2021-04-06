<template>
  <div class="row">
    <div class="col-10">
      <p>Broadcast</p>
      <button v-on:click="toggleTTS()" id="toggleTTSButton" class="btn btn-primary">Resume/Pause TTS</button>
      <button id="nextTTSButton" class="btn btn-primary">Next TTS</button>
      <button id="cameraButton" class="btn btn-primary">Camera</button>
      <button id="micButton" class="btn btn-primary">Microphone</button>
      <button id="audioButton" class="btn btn-primary">Audio</button>
      <button id="recordButton" class="btn btn-danger">Record</button>
      <button id="screenButton" class="btn btn-primary">Share screen</button>
      <pdf-view></pdf-view>

      <div id="reminder" class="position-fixed bottom-0 start-0 p-3" style="z-index: 5">
        <div id="remindToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-body">
            This is a friendly reminder to record your lecture :)
            <div class="mt-2 pt-2 border-top">
              <button id="toastRecordButton" type="button" class="btn btn-danger btn-sm">Record</button>
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-2">
      <p class="mb-1">Chat</p>
      <chat-box></chat-box>
    </div>
  </div>

</template>

<script>
import {toggleTTS} from "@/liveTTSChat";
import {Toast} from "bootstrap";
import PdfView from "@/components/pdf/pdfView";
import ChatBox from "@/components/liveSession/chatBox";

const room = location.pathname;
let bootstrapAlert = null;
let initialReminderTimer = null;
let reminderTimer = null;
let recordState = false;

export default {
  name: "live",
  components: {ChatBox, PdfView},
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    room: function (room) {
      console.log("room emitted",room);
    },
    record_started: function () {
      this.startRecording();
    },
    record_stopped: function () {
      this.stopRecording();
    }
  },
  created() {
    this.$socket.emit("room",room);
    console.log(this.$socket, room);
  },
  mounted() {
    const vue = this;
    // Recording reminder functions
    const recordRemindToast = document.getElementById("remindToast");
    bootstrapAlert = new Toast(recordRemindToast, {animation: true, autohide: false});
    const recordButton = document.getElementById("recordButton");
    const toastRecordButton = document.getElementById("toastRecordButton");

    window.addEventListener('DOMContentLoaded', () => {

      initialReminderTimer = window.setTimeout(vue.initialReminder, 5000); // change time later

      //Recording starts, disable all reminders
      recordButton.onclick = () => {
        vue.recordButtonControl();
      }
      toastRecordButton.onclick = () => {
        vue.recordButtonControl();
      }

    });
  },
  methods: {
    toggleTTS,
    initialReminder: function () {
      console.log("first reminder");
      bootstrapAlert.show();
      reminderTimer = window.setInterval(this.reminder, 10000); // change time later
    },
    reminder: function() {
      bootstrapAlert.show();
      console.log("reminder");
    },
    recordButtonControl: function () {
      if(recordState) {
        this.$socket.emit("record_stop",room);
        this.stopRecording();
      }
      else {
        this.$socket.emit("record_start",room);
        this.startRecording();
      }
    },
    startRecording: function () {
      console.log("recording starts");
      recordState = true;
      window.clearTimeout(initialReminderTimer);
      window.clearInterval(reminderTimer);
      bootstrapAlert.dispose();
      const reminder = document.getElementById("reminder");
      reminder.remove();
    },
    stopRecording: function () {
      console.log("recording stopped");
      recordState = false;
    }
  }
}
</script>

<style scoped>

</style>