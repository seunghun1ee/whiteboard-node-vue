<template>
  <div>
    <p>jitsi space</p>
    <button v-on:click="joinRoom('equalhintstinsalong')">Join room</button>
    <button v-on:click="unload">Leave room</button>
    <div id="videos" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"></div>
  </div>
</template>

<script>
import JitsiMeetJs from "@lyno/lib-jitsi-meet";
import $ from "jquery";
import JitsiMeetJS from "@lyno/lib-jitsi-meet";
import {options} from "@/jitsiConfig";
import {disconnect, onConnectionFailed, onConnectionSuccess, onDeviceListChanged} from "@/jitsi";

export default {
  name: "jitsi",
  data() {
    return {
      jitsi: null,
      connection: null,
      isJoined: false,
      room: null,
      localTracks: [],
      remoteTracks: {}
    }
  },
  mounted() {
    window.$ = $;
    this.jitsiInit();
    this.createLocalTracks();
    this.connect();
  },
  methods: {
    jitsiInit() {
      const initOptions = {
        disableAudioLevels: true
      };
      this.jitsi = JitsiMeetJs.init(initOptions);
    },
    onLocalTracks(tracks) {
      this.localTracks = tracks;
      for (let i = 0; i < this.localTracks.length; i++) {
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('local track muted'));
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log('local track stopped'));
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            deviceId =>
                console.log(
                    `track audio output device was changed to ${deviceId}`));
        if (this.localTracks[i].getType() === 'video') {
          $("#videos").append(`<video autoplay='1' id='localVideo${i}' class="col" style="object-fit: cover" />`);
          this.localTracks[i].attach($(`#localVideo${i}`)[0]);
        } else {
          $("#videos").append(
              `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
          this.localTracks[i].attach($(`#localAudio${i}`)[0]);
        }
        if (this.isJoined) {
          this.room.addTrack(this.localTracks[i]);
        }
      }
      console.log(this.localTracks);
    },
    createLocalTracks() {
      JitsiMeetJs.createLocalTracks({ devices: [ 'audio', 'video' ] })
          .then(this.onLocalTracks)
          .catch(error => {
            throw error;
          });
    },
    connect() {
      this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);

      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
          onConnectionSuccess);
      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_FAILED,
          onConnectionFailed);
      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
          disconnect);

      JitsiMeetJS.mediaDevices.addEventListener(
          JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
          onDeviceListChanged);

      this.connection.connect();
    },
    joinRoom() {

    },
    unload() {

    }
  }

}
</script>

<style scoped>

</style>