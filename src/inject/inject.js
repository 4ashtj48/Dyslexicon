//global vars
var popupOptions = null;
var exactText = "";
var cursorX = 0;
var cursorY = 0;

let userOptions = {
  voiceOption: "",
  rate: 1,
  pitch: 1,
  textColor: "default",
  textSize: "default",
  backgroundColor: "default",
  font: "verdana",
  extRunning: true,
};

let voices = [];
var msg = null;
let fonts = [
  "arial",
  "verdana",
  "helvetica",
  "tahoma",
  "trebuchet-ms",
  "times-new-roman",
  "georgia",
  "garamond",
  "courier-new",
];

//--Init SpeechSynth API--//
const synth = window.speechSynthesis;
//global speech

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";
// Chrome 1+
var isChrome = !!window.chrome;
let client = chrome;
if (isFirefox) {
  client = browser;
}

const getVoices = () => {
  voices = synth.getVoices();
};

//----functions----//

function createPopupOptions() {
  console.log("Creating Popup Options ");
  popupOptions = document.createElement("div");
  popupOptions.classList.add("dyslexicon__popup");
  popupOptions.id = "dyslexiconPopUp";

  document.body.append(popupOptions);
}

function testOptionsExists() {
  console.log("Testing Popup Options Exists ");
  let test = document.getElementById("dyslexiconPopUp");
  if (test) return true;

  return false;
}

function testOptionsShowing() {
  return popupOptions.classList.contains("show"); // false
}
function unWrapElement(span) {
  console.log(span);
  console.log(span.length);
  while (span.innerHTML.length) {
    var parent = span[0].parentNode;
    while (span[0].firstChild) {
      parent.insertBefore(span[0].firstChild, span[0]);
    }
    parent.removeChild(span[0]);
  }
  return;
}

//removes the attribute and style.

async function removeSelectedElement() {
  var elements = document.getElementsByClassName("dyslexicon--selected");
  if (elements.length > 0) {
    for (let c = 0; c < elements.length; c++) {
      let element = elements[c];
      element.removeAttribute("style");
      element.classList.add("disabled");
      element.classList.remove("active");
      element.removeAttribute("data-dyslexicon");
    }

    //  await unWrapElement(span);
    //  span.remove();
  }
}

//change--removed
//breaks on non-text node.
//  function surroundSelection() {
//    try {
//     var span = document.createElement("span");
//     //span.style.fontWeight = "bold";
//     span.classList.add("dyslexicon--selected");
//     span.classList.add("active");
//     span.id = "dyslexiconSelected";
//     if (window.getSelection) {
//       var sel = window.getSelection();
//       if (sel.rangeCount) {
//         var range = sel.getRangeAt(0).cloneRange();
//         range.surroundContents(span);
//         sel.removeAllRanges();
//         sel.addRange(range);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

function getSelectionParentElement() {
  var parentEl = null,
    sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType != 1) {
        parentEl = parentEl.parentNode;
      }
    }
  } else if ((sel = document.selection) && sel.type != "Control") {
    parentEl = sel.createRange().parentElement();
  }
  return parentEl;
}

function createButtons() {
  if (testOptionsExists() == false) createPopupOptions();

  let playButton = document.createElement("button");
  playButton.innerText = "Play";
  playButton.classList.add("dyslexicon");
  playButton.addEventListener("click", playButtonOperation);
  popupOptions.append(playButton);

  let pauseButton = document.createElement("button");
  pauseButton.innerText = "Pause";
  pauseButton.classList.add("dyslexicon");
  pauseButton.addEventListener("click", pauseButtonOperation);
  popupOptions.append(pauseButton);

  //changes font size -increase button
  let increaseButton = document.createElement("button");
  increaseButton.innerText = "A +";
  increaseButton.classList.add("dyslexicon");
  increaseButton.addEventListener("click", increaseFontOperation);
  popupOptions.append(increaseButton);

  //changes font size -decrease button
  let decreaseButton = document.createElement("button");
  decreaseButton.innerText = "A -";
  decreaseButton.classList.add("dyslexicon");
  decreaseButton.addEventListener("click", decreaseFontOperation);
  popupOptions.append(decreaseButton);

  //new buttons here
}

function playButtonOperation(e) {
  e.preventDefault();
  //console.log("Playing the text");

  client.storage.sync.get(["userOption"], function (result) {
    let msgNullTest = msg;
    //console.log(result);
    //console.log(msgNullTest);
    if (msgNullTest == null) {
      msg = new SpeechSynthesisUtterance();
    }
    if (result.userOption) {
      userOptions = result.userOption;
      let pickedVoice = null;
      for (let c = 0; c < voices.length; c++) {
        let voice = voices[c];
        if (voice.name == userOptions.voiceOption) {
          pickedVoice = voice;
        }
      }
      // get  user voice from array so it matches picked option
      if (pickedVoice !== null) {
        msg.voice = pickedVoice;
      }

      //rate.oninput = rateValueChanged;
      if (userOptions.rate) {
        msg.rate = userOptions.rate;
      }

      if (userOptions.pitch) {
        msg.pitch = userOptions.pitch;
      }
    }
    if (msgNullTest !== null) {
      synth.resume();
      //console.log("resume");
    } else {
      msg.text = exactText;
      msg.addEventListener("end", (event) => {
        msg = null;
      });
      synth.speak(msg);
    }
  });
}
function pauseButtonOperation(e) {
  e.preventDefault();
  console.log("Pausing");
  synth.pause();
}

function getStyle(el, styleProp) {
  var camelize = function (str) {
    return str.replace(/\-(\w)/g, function (str, letter) {
      return letter.toUpperCase();
    });
  };

  if (el.currentStyle) {
    return el.currentStyle[camelize(styleProp)];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView
      .getComputedStyle(el, null)
      .getPropertyValue(styleProp);
  } else {
    return el.style[camelize(styleProp)];
  }
}

//add the functions here
function increaseFontOperation(e) {
  e.preventDefault();
  let selectedElement = document.querySelectorAll(
    "[data-dyslexicon='dyslexicon']"
  );

  if (selectedElement.length > 0) {
    selectedElement = selectedElement[0];
    selectedElement.classList.add("font--increase");
    let currentsize = window
      .getComputedStyle(selectedElement)
      .fontSize.match(/\d+/)[0]; 
    selectedElement.style.fontSize = currentsize * 1.4 + "px";
  }
}
function decreaseFontOperation(e) {
  e.preventDefault();

  let selectedElement = document.querySelectorAll(
    "[data-dyslexicon='dyslexicon']"
  );
  if (selectedElement.length > 0) {
    selectedElement = selectedElement[0];
    selectedElement.classList.add("font--decrease");
    let currentsize = window
      .getComputedStyle(selectedElement)
      .fontSize.match(/\d+/)[0];
    let sizeToBe = currentsize / 1.4;
    if (sizeToBe > 1) {
      selectedElement.style.fontSize = `${sizeToBe}px`;
    }
  }
}

// function customOperation(e) {
//   e.preventDefault();
//   console.log("apply custom");
// }

function showOptionsPopup() {
  if (!popupOptions.classList.contains("show")) {
    popupOptions.classList.add("show");
    popupOptions.style.top = `${cursorY}px`;
    popupOptions.style.left = `${cursorX}px`;
  }
}
function hideOptionsPopup() {
  popupOptions.classList.remove("show");
}

///allow change from background options user option

function setParentFont() {
  client.storage.sync.get(["userOption"], function (result) {
    userOptions = result.userOption;
    for (let c = 0; c < fonts.length; c++) {
      document.body.classList.remove(`dyslexicon-font-${fonts[c]}`);
    }
    document.body.classList.add(`dyslexicon-font-${userOptions.font}`);
  });
}
function setHighlightColors() {
  client.storage.sync.get(["userOption"], function (result) {
    userOptions = result.userOption;
    document.body.classList.add(`dyslexicon-text-${userOptions.textColor}`);
    document.body.classList.add(
      `dyslexicon-background-${userOptions.backgroundColor}`
    );
  });
}

function setOnOffClass() {
  document.body.classList.remove("dyslexicon--off");
  if (userOptions.extRunning == false) {
    document.body.classList.add("dyslexicon--off");
  }
}

async function getUserOptions() {
  return new Promise((resolve, reject) => {
    client.storage.sync.get(["userOption"], function (result) {
      if (result["userOption"] === undefined) {
        reject();
      }
      userOptions = result.userOption;
      console.log("getuseroptions");
      resolve();
    });
  });
}

//onpageload
(async function () {
  var readyStateCheckInterval = setInterval(async function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      await getUserOptions();
      createButtons();
      getVoices();
      setHighlightColors();
      setParentFont();
      setOnOffClass();

      window.addEventListener("click", (event) => {
        if (
          testOptionsShowing &&
          !event.target.classList.contains("dyslexicon")
        ) {
          removeSelectedElement();
          hideOptionsPopup();
          console.log("click event remove");
        }
      });

      document.addEventListener("mouseup", async (event) => {
        //highlighting text functionality
        //cursor location
        await getUserOptions();
        setOnOffClass();
        cursorX = event.clientX;
        cursorY = event.clientY;
        if (window.getSelection().toString().length) {
          //obtaining exact (highlighted text)
          exactText = window.getSelection().toString();
          if (exactText.length > 0 && userOptions.extRunning) {
            setTimeout(() => {
              let parentEl = getSelectionParentElement();
              if (parentEl) {
                parentEl.classList.add("dyslexicon--selected");
                parentEl.classList.add("active");
                //setting attribute
                parentEl.setAttribute("data-dyslexicon", "dyslexicon");
              }
              setParentFont();
              // surroundSelection();
              showOptionsPopup();
            }, 100);
          } else {
            hideOptionsPopup();
            removeSelectedElement();
            console.log("event remove 1");
          }
        } else {
          hideOptionsPopup();
          removeSelectedElement();
          console.log("event remove 2");
        }
      });
    }
  }, 10);
})();
