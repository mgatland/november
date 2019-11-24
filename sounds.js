// Modified from https://github.com/flukeout/simple-sounds/blob/gh-pages/sounds.js

var sounds = {
  "silence" : {
    url : "sounds/silence_.wav"
  },
  "hit2" : {
    url : "sounds/hit2_.wav",
    volume: 0.5
  },
  "enemyshoot" : {
    url : "sounds/enemyshoot_.wav",
    volume: 2
  },
  "playerexp" : {
    url : "sounds/playerexp_.wav"
  },
  "playerhit" : {
    url : "sounds/playerhit_.wav",
    volume: 2
  },
  "exp2" : {
    url : "sounds/exp2_.wav",
    volume: 0.5
  },
  "heal" : {
    url : "sounds/heal_.wav"
  },
  "exp" : {
    url : "sounds/exp_.wav"
  },
  "shoot" : {
    url : "sounds/shoot_.wav",
    volume: 0.5
  },
  "hitwall" : {
    url : "sounds/hitwall_.wav"
  },
  "spawn" : {
    url : "sounds/spawn_.wav"
  },
};


var soundContext = new AudioContext();

for(var key in sounds) {
  loadSound(key);
}

function loadSound(name){
  var sound = sounds[name];

  var url = sound.url;
  var buffer = sound.buffer;

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    soundContext.decodeAudioData(request.response, function(newBuffer) {
      sound.buffer = newBuffer;
    });
  }

  request.send();
}

function playSound(name, options){
  var sound = sounds[name];
  var soundVolume = sounds[name].volume || 1;
  soundVolume *= 0.05 // Hack for ultra-loud BFXR sounds!

  var buffer = sound.buffer;
  if(buffer){
    var source = soundContext.createBufferSource();
    source.buffer = buffer;

    var volume = soundContext.createGain();

    if(options) {
      if(options.volume) {
        volume.gain.value = soundVolume * options.volume;
      }
    } else {
      volume.gain.value = soundVolume;
    }

    volume.connect(soundContext.destination);
    source.connect(volume);
    source.start(0);
  }
}

export { playSound, loadSound }
