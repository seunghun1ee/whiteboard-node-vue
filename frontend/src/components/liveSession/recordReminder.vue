<template>
  <div id="wrapper" class="position-fixed bottom-0 start-0 p-3" style="z-index: 5">
    <div id="reminder" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        This is a friendly reminder to record your lecture :)
        <div class="mt-2 pt-2 border-top">
          <button v-on:click="recordButton" id="toastRecordButton" type="button" class="btn btn-danger btn-sm">Record</button>
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from "bootstrap";
export default {
  name: "recordReminder",
  props: {
    firstTime: Number,
    time: Number
  },
  data() {
    return {
      initialTimer: null,
      timer: null,
      bootstrapAlert: null
    }
  },
  mounted() {
    const reminder = document.getElementById("reminder");
    this.bootstrapAlert = new Toast(reminder, {animation: true, autohide: false});
    this.initialTimer = window.setTimeout(this.initialReminder, this.firstTime);
  },
  beforeDestroy() {
    clearTimeout(this.initialTimer);
    clearInterval(this.timer);
  },
  methods: {
    initialReminder() {
      console.log("first reminder");
      this.bootstrapAlert.show();
      this.timer = window.setInterval(this.reminder, this.time);
    },
    reminder() {
      console.log("reminder");
      this.bootstrapAlert.show();
    },
    recordButton() {
      clearTimeout(this.initialTimer);
      clearInterval(this.timer);
      this.bootstrapAlert.dispose();
      this.$emit("toastRecordClicked");
    }
  }
}
</script>

<style scoped>

</style>