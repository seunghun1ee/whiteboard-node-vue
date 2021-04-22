<template>
  <div>
    <button id="cameraButton" class="btn btn-primary" v-on:click="localTrackToggle('video')">Camera</button>
    <button id="micButton" class="btn btn-primary" v-on:click="localTrackToggle('audio')">Microphone</button>
    <button v-on:click="recordButton" id="recordButton" class="btn btn-danger">Record</button>
    <button id="screenButton" class="btn btn-primary" v-on:click="switchVideo">Share screen</button>
    <button class="btn btn-danger" v-on:click="unload()">Leave room</button>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4" v-for="video in videos" :key="video.id" v-html="video"></div>
    <div v-for="audio in audios" :key="audio.id" v-html="audio"></div>
  </div>
</template>

<script>
import JitsiMeetJs from "@lyno/lib-jitsi-meet";
import $ from "jquery";
import JitsiMeetJS from "@lyno/lib-jitsi-meet";
import {options} from "@/jitsiConfig";
import {
  onConnectionFailed,
  onDeviceListChanged,
} from "@/jitsi";

export default {
  name: "jitsi",
  data() {
    return {
      jitsi: null,
      connection: null,
      isJoined: false,
      isVideo: true,
      roomName: process.env.VUE_APP_JITSI_ROOM,
      room: null,
      localTracks: [],
      remoteTracks: {},
      videos: [],
      audios: []
    }
  },
  mounted() {
    window.$ = $;
    this.jitsiInit();
    this.connect();
    this.createLocalTracks();
  },
  beforeDestroy() {
    if(this.isJoined) {
      this.unload();
    }
  },
  methods: {
    jitsiInit() {
      const initOptions = {
        disableAudioLevels: true
      };
      this.jitsi = JitsiMeetJs.init(initOptions);
      JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
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
          this.videos.push(`<video autoplay='1' id='localVideo${i}' class='col' style='object-fit: cover' />`);
          this.$nextTick(() => {
            this.localTracks[i].attach($(`#localVideo${i}`)[0]);
          });
        } else {
          this.audios.push(`<audio autoplay='1' muted='true' id='localAudio${i}' />`);
          this.$nextTick(() => {
            this.localTracks[i].attach($(`#localAudio${i}`)[0]);
          });
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
    onRemoteTrack(track) {
      if (track.isLocal()) {
        return;
      }
      const participant = track.getParticipantId();

      if (!this.remoteTracks[participant]) {
        this.remoteTracks[participant] = [];
      }
      const idx = this.remoteTracks[participant].push(track);

      track.addEventListener(
          JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
          audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
      track.addEventListener(
          JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
          () => console.log('remote track muted'));
      track.addEventListener(
          JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
          () => console.log('remote track stopped'));
      track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
          deviceId =>
              console.log(
                  `track audio output device was changed to ${deviceId}`));
      const id = participant + track.getType() + idx;

      if (track.getType() === 'video') {
        this.videos.push(`<video autoplay='1' id='${participant}video${idx}' class='col' style='object-fit: cover' />`);
      } else {
        this.audios.push(`<audio autoplay='1' id='${participant}audio${idx}' />`);
      }
      this.$nextTick(() => {
        track.attach($(`#${id}`)[0]);
      });

    },
    onConnectionSuccess() {
      console.log("Server connected");
      this.joinRoom(`${process.env.VUE_APP_JITSI_ROOM}`);
    },
    onConferenceJoined() {
      console.log(`conference joined! room name: ${this.roomName}`);
      this.isJoined = true;
      for (let i = 0; i < this.localTracks.length; i++) {
        this.room.addTrack(this.localTracks[i]);
      }
    },
    onUserLeft(id) {
      console.log('user left');
      if (!this.remoteTracks[id]) {
        return;
      }
      const tracks = this.remoteTracks[id];

      for (let i = 0; i < tracks.length; i++) {
        console.log($(`#${id}${tracks[i].getType()}2`));
        // tracks[i].detach($(`#${id}${tracks[i].getType()}`));
      }
    },
    connect() {
      this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);

      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
          this.onConnectionSuccess);
      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_FAILED,
          onConnectionFailed);
      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
          this.onDisconnect);

      JitsiMeetJS.mediaDevices.addEventListener(
          JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
          onDeviceListChanged);

      this.connection.connect();
    },
    onDisconnect() {
      console.log('disconnect!');
      this.connection.removeEventListener(
          JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
          this.onConnectionSuccess);
      this.connection.removeEventListener(
          JitsiMeetJS.events.connection.CONNECTION_FAILED,
          onConnectionFailed);
      this.connection.removeEventListener(
          JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
          this.onDisconnect);
    },
    joinRoom(roomName) {
      const confOptions = {
        openBridgeChannel: true
      }
      this.room = this.connection.initJitsiConference(roomName, confOptions);
      this.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, this.onRemoteTrack);
      this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
        console.log(`track removed!!!${track}`);
      });
      this.room.on(
          JitsiMeetJS.events.conference.CONFERENCE_JOINED,
          this.onConferenceJoined);
      this.room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
        console.log('user join');
        this.remoteTracks[id] = [];
      });
      this.room.on(JitsiMeetJS.events.conference.USER_LEFT, this.onUserLeft);
      this.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
        console.log(`${track.getType()} - isMuted: ${track.isMuted()}`);
      });
      this.room.on(
          JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
          (userID, displayName) => console.log(`${userID} - ${displayName}`));
      this.room.on(
          JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
          (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
      this.room.on(
          JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
          () => console.log(`${this.room.getPhoneNumber()} - ${this.room.getPhonePin()}`));
      this.room.join();
    },
    localTrackToggle(type) {
      for(let i = 0; i < this.localTracks.length; i++) {
        if(this.localTracks[i].getType() === type) {
          if(this.localTracks[i].isMuted()) {
            this.localTracks[i].unmute();
          }
          else {
            this.localTracks[i].mute();
          }
        }
      }
    },
    switchVideo() {
      this.isVideo = !this.isVideo;
      if (this.localTracks[1]) {
        this.localTracks[1].dispose();
        this.localTracks.pop();
      }
      JitsiMeetJS.createLocalTracks({
        devices: [ this.isVideo ? 'video' : 'desktop' ]
      })
          .then(tracks => {
            this.localTracks.push(tracks[0]);
            this.localTracks[1].addEventListener(
                JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                () => console.log('local track muted'));
            this.localTracks[1].addEventListener(
                JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                () => console.log('local track stoped'));
            this.localTracks[1].attach($('#localVideo1')[0]);
            this.room.addTrack(this.localTracks[1]);
          })
          .catch(error => console.log(error));
    },
    recordButton() {
      this.$emit("mainRecordClicked");
    },
    unload() {
      for (let i = 0; i < this.localTracks.length; i++) {
        this.localTracks[i].dispose();
      }
      this.room.leave()
      this.connection.disconnect();
      this.isJoined = false;
      this.leavePage();
    },
    leavePage() {
      this.$router.push("/");
    }
  }

}
</script>

<style scoped>

</style>