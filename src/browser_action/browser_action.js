let client = chrome;


var isFirefox = typeof InstallTrigger !== "undefined";
//var isChrome = !!window.chrome;

if (isFirefox) {
  client = browser;
}

let userOptions = {
  voiceOption: "",
  rate: 1,
  pitch: 1,
  textColor: "default",
  backgroundColor: "default",
  font: "verdana",
  extRunning: true,
};

const extOn = document.getElementById("extOn");
const extOff = document.getElementById("extOff");
const fontPicker = document.getElementById("fontPicker");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");
const rateValue = document.getElementById("rate-value");
const pitchValue = document.getElementById("pitch-value");

fontPicker.onchange = fontValueChanged;

function fontValueChanged(e) {
  e.preventDefault();
  userOptions.font = fontPicker.value;
  setUserOptions();
}

function updateUI() {
  rate.value = userOptions.rate;
  rateValue.innerText = userOptions.rate;
  pitch.value = userOptions.pitch;
  pitchValue.innerText = userOptions.pitch;
  fontPicker.value = userOptions.font;
  document.body.className = "";
  document.body.classList.add(`dyslexicon-font-${userOptions.font}`);

  extOn.classList.remove("btn-secondary");
  extOff.classList.remove("btn-secondary");
  extOn.classList.remove("btn-primary");
  extOff.classList.remove("btn-primary");

  if (userOptions.extRunning) {
    extOn.classList.add("btn-primary");
    extOff.classList.add("btn-secondary");
  } else {
    extOff.classList.add("btn-primary");
    extOn.classList.add("btn-secondary");
  }

  //Button Setting class
  let buttons = document.getElementsByClassName("button");
  if (buttons.length > 0) {
    for (let c = 0; c < buttons.length; c++) {
      buttons[c].classList.remove("active");
    }
  }
  //textcolour buttons update
  if (userOptions.textColor == "default") {
    btnDefaultTxt.classList.add("active");
  } else if (userOptions.textColor == "red") {
    btnRedTxt.classList.add("active");
  } else if (userOptions.textColor == "blue") {
    btnBlueTxt.classList.add("active");
  } else if (userOptions.textColor == "green") {
    btnGreenTxt.classList.add("active");
  } else if (userOptions.textColor == "black") {
    btnBlackTxt.classList.add("active");
  }

  // background buttons update
  if (userOptions.backgroundColor == "default") {
    btnDefaultBg.classList.add("active");
  } else if (userOptions.backgroundColor == "cream") {
    btnCream.classList.add("active");
  } else if (userOptions.backgroundColor == "grey") {
    btnGrey.classList.add("active");
  }

  //iterate through dropdown options and remove selected
  voiceSelect.value = userOptions.voiceOption;
}

function getUserOptions() {
  client.storage.sync.get(["userOption"], function (result) {
    if (result.userOption) {
      userOptions = result.userOption;
    }
    // set the default values
    updateUI();
  });
}

function setUserOptions() {
  client.storage.sync.set({ userOption: userOptions }, function () {
    console.log(userOptions);
    updateUI();
  });
}
getUserOptions();

// Init SpeechSynth API
const synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voice-select");
voiceSelect.onchange = voiceValueChanged;

function voiceValueChanged(e) {
  e.preventDefault();
  userOptions.voiceOption = voiceSelect.value;
  setUserOptions();
}

var textSizeSelect = document.getElementById("text-size");

// DOM Elements
rate.oninput = rateValueChanged;
rate.onchange = rateValueChanged;
pitch.oninput = pitchValueChanged;
pitch.onchange = pitchValueChanged;

function rateValueChanged(e) {
  e.preventDefault();
  userOptions.rate = parseFloat(rate.value);
  setUserOptions();
}

function pitchValueChanged(e) {
  e.preventDefault();
  userOptions.pitch = parseFloat(pitch.value);
  setUserOptions();
}

//init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  
  // Loop through voices and create an option for each one
  voices.forEach((voice) => {
    // Create option element
    const option = document.createElement("option");
    // Fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    option.value = voice.name;
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}


// EVENT LISTENERS

//buttons for text colour
let btnDefaultTxt = document.getElementById("btnDefaultTxt");
let btnRedTxt = document.getElementById("btnRedTxt");
let btnBlueTxt = document.getElementById("btnBlueTxt");
let btnGreenTxt = document.getElementById("btnGreenTxt");
let btnBlackTxt = document.getElementById("btnBlackTxt");

let btnDefaultBg = document.getElementById("btnDefaultBg");
let btnCream = document.getElementById("btnCream");
let btnGrey = document.getElementById("btnGrey");

btnRedTxt.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.textColor = "red";
  setUserOptions();
});
btnBlueTxt.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.textColor = "blue";
  setUserOptions();
});
btnGreenTxt.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.textColor = "green";
  setUserOptions();
});
btnBlackTxt.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.textColor = "black";
  setUserOptions();
});

btnDefaultTxt.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.textColor = "default";
  setUserOptions();
});

btnCream.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.backgroundColor = "cream";
  setUserOptions();
});

btnGrey.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.backgroundColor = "grey";
  setUserOptions();
});

btnDefaultBg.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.backgroundColor = "default";
  setUserOptions();
});

extOn.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.extRunning = true;
  setUserOptions();
});
extOff.addEventListener("click", (e) => {
  e.preventDefault();
  userOptions.extRunning = false;
  setUserOptions();
});
