<template>
  <div class="row">
    <div class="col-10">
      <p>Broadcast</p>
      <button v-on:click="toggleTTS()" id="toggleTTSButton" class="btn btn-primary">Resume/Pause TTS</button>
      <button v-on:click="nextTTS()" id="nextTTSButton" class="btn btn-primary">Next TTS</button>
      <button id="cameraButton" class="btn btn-primary">Camera</button>
      <button id="micButton" class="btn btn-primary">Microphone</button>
      <button id="audioButton" class="btn btn-primary">Audio</button>
      <button id="recordButton" class="btn btn-danger">Record</button>
      <button id="screenButton" class="btn btn-primary">Share screen</button>

      <div class="position-fixed bottom-0 start-0 p-3" style="z-index: 5">
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
      <p>Chat</p>
      <div>
        <ul id="chatSpace">
        </ul>
      </div>
      <div id="chatBox" class="ms-auto col-2 fixed-bottom">
        <form id="chatForm" autocomplete="off">
          <label for="textInput" class="form-label">Chat</label>
          <input id="textInput" type="text" class="form-control">
          <button type="submit" id="speechButton" class="btn btn-primary">Send</button>
        </form>
      </div>

    </div>
  </div>

</template>

<script>

const room = location.pathname;
const receivedChats = [];
let speechSynth = window.speechSynthesis;

function speech(textToSpeech) {
  let utterance = new SpeechSynthesisUtterance(textToSpeech);
  console.log("Chat is being speeched");
  speechSynth.speak(utterance);
}

export default {
  name: "live",
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    room: function (room) {
      console.log("room emitted",room);
    },
    chat_message: function (data) {
      const chatSpace = document.getElementById("chatSpace");
      console.log("chat_message",data);
      const id = data[0];
      const msg = data[1];
      let userId = id.substr(0,4);
      this.appendChat(chatSpace,userId,msg);
      if(!speechSynth.paused) {
        speech(msg);
      }
      receivedChats.push(msg);
      window.scrollTo(0, document.body.scrollHeight);

    }
  },
  created() {
    this.$socket.emit("room",room);
    console.log(this.$socket, room);
  },
  mounted() {
    const vue = this;
    const form = document.getElementById("chatForm");
    const input = document.getElementById("textInput");
    const chatSpace = document.getElementById("chatSpace");

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (input.value) {
        // let myId = this.$socket.id.substr(0,4);
        vue.appendChat(chatSpace,"myId",input.value)
        vue.$socket.emit('chat_message', {msg: input.value, room:room});
        input.value = '';
      }
    });
  },
  methods: {
    appendChat: function (chatSpace,id,msg) {
      let item = document.createElement('li');
      item.textContent = id + ": " + msg;
      chatSpace.appendChild(item);
    },
    nextTTS: function () {
      if(receivedChats.length > 0) {
        let msg = receivedChats.shift();
        speechSynth.resume();
        speech(msg);
      }
    },
    toggleTTS: function() {
      if(speechSynth.paused) {
        console.log("resume speaking");
        speechSynth.resume();
      }
      else {
        console.log("pause speaking");
        speechSynth.pause();
      }
      console.log(speechSynth);
    }
  }
}
</script>

<style scoped>

</style>