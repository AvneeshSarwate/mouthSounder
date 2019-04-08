
var audioPlayers = {};

var createAudioElement = function(audioBlobURL){
    const audio = document.createElement('audio');

    audioPlayers[audioBlobURL] = {player:audio, ready: false};

    var playing = false;
    var timeupdate = false;

    audio.autoplay = false;
    audio.loop = false;


    audio.addEventListener('playing', function() {
        playing = true;
        checkReady();
    }, true);

    audio.addEventListener('timeupdate', function() {
        timeupdate = true;
        checkReady();
    }, true);

    function checkReady() {
        if (playing && timeupdate) {
            audioPlayers[audioBlobURL].ready = true;
        }
    }

    audio.src = audioBlobURL;
}

function blobAudioLoad(audioFileUrl, otherArgs){
    var req = new XMLHttpRequest();
    req.open('GET', audioFileUrl, true);
    req.responseType = 'blob';

    req.onload = function() {
        // Onload is triggered even on 404
        // so we need to check the status code
        if (this.status === 200) {
            var audioBlob = this.response;
            var audioBlobURL = URL.createObjectURL(audioBlob); // IE10+
          
            createAudioElement(audioBlobURL);
            if(otherArgs && otherArgs.postLoadFunc) otherArgs.postLoadFunc();
        }
    }
    req.onerror = function() {
        // Error
    }

    req.send(); 
}