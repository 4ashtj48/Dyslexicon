//global vars
var popupOptions = null;
var exactText = "";
var cursorX = 0;
var cursorY = 0;

//--Init SpeechSynth API--//
const synth = window.speechSynthesis;
//global speech




//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach((voice) => {
    // Create option element
    const option = document.createElement("option");
    // Fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    // Set needed option attributes
    option.setAttribute("voice--lang", voice.lang);
    option.setAttribute("voice--name", voice.name);
    voiceSelect.appendChild(option);
  });
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

async function removeSelectedElement() {
  var spans = document.getElementsByClassName("dyslexicon--selected");
  if (spans.length > 0) {
    for (let c = 0; c < spans.length; c++) {
      let span = spans[c];
      span.removeAttribute("style");
      span.classList.add("disabled");
      span.classList.remove("active");
      span.id = "";
    }

    //  await unWrapElement(span);
    //  span.remove();
  }
}

//change
//breaks on non-text node.

function surroundSelection() {
  try {
    var span = document.createElement("span");
    //span.style.fontWeight = "bold";
    span.classList.add("dyslexicon--selected");
    span.classList.add("active");
    span.id = "dyslexiconSelected";
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(span);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function createButtons() {
  console.log("Creating Buttons ");
  if (testOptionsExists() == false) createPopupOptions();
  // change font to options

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

  let customButton = document.createElement("button");
  customButton.innerText = "Custom";
  customButton.classList.add("dyslexicon");
  customButton.addEventListener("click", customOperation);
  popupOptions.append(customButton);

  //new buttons here
}

function playButtonOperation(e) {
  e.preventDefault();
  synth.cancel();
  console.log("Playing the text");
  console.log(exactText);
  var msg = new SpeechSynthesisUtterance();
  msg.text = exactText;
  synth.speak(msg);
}

function pauseButtonOperation(e) {
  e.preventDefault();
  console.log("Pausing");
  console.log(exactText);
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
  console.log("Increase font size");
  var span = document.getElementById("dyslexiconSelected");
  if (span) {
    span.classList.add("font--increase");
    let currentsize = window.getComputedStyle(span).fontSize.match(/\d+/)[0]; // "3"
    span.style.fontSize = currentsize * 2 + "px";
  }
}
function decreaseFontOperation(e) {
  e.preventDefault();
  console.log("Decrease font size");
  var span = document.getElementById("dyslexiconSelected");
  if (span) {
    span.classList.add("font--decrease");
    let currentsize = window.getComputedStyle(span).fontSize.match(/\d+/)[0]; // "3"
    span.style.fontSize = currentsize / 2 + "px";
  }
}

function customOperation(e) {
  e.preventDefault();
  console.log("apply custom");
  //grab custom settings from browser_action.
}

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

chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------
      createButtons();
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
      window.addEventListener("scroll", (event) => {
        if (testOptionsShowing) {
          hideOptionsPopup();
          removeSelectedElement();
          console.log("scroll event remove");
        }
      });
      document.addEventListener("mouseup", (event) => {
        //highlighting text functionality
        //cursor location
        cursorX = event.clientX;
        cursorY = event.clientY;
        if (window.getSelection().toString().length) {
          //obtaining exact (highlighted text)
          exactText = window.getSelection().toString();
          if (exactText.length > 0) {
            setTimeout(() => {
              surroundSelection();
              showOptionsPopup();
            }, 100);
          } else {
            hideOptionsPopup();
            removeSelectedElement();
            console.log("event remove 1");
          }
          //window.getSelection().toString()--- section highlighted
        } else {
          hideOptionsPopup();
          removeSelectedElement();
          console.log("event remove 2");
        }
      });
    }
  }, 10);
});
