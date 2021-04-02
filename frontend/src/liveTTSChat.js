export function appendChat (chatSpace,id,msg) {
    let item = document.createElement('li');
    item.textContent = id + ": " + msg;
    chatSpace.appendChild(item);
}

export function speech(textToSpeech) {
    let utterance = new SpeechSynthesisUtterance(textToSpeech);
    console.log("Chat is being speeched");
    window.speechSynthesis.speak(utterance);
}

export function nextTTS(receivedChats) {
    if(receivedChats.length > 0) {
        let msg = receivedChats.shift();
        window.speechSynthesis.resume();
        speech(msg);
    }
}

export function toggleTTS() {
    if(window.speechSynthesis.paused) {
        console.log("resume speaking");
        window.speechSynthesis.resume();
    }
    else {
        console.log("pause speaking");
        window.speechSynthesis.pause();
    }
    console.log(window.speechSynthesis);
}