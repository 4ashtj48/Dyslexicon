//global vars
var popupOptions = null;
var exactText = "";
var cursorX = 0;
var cursorY = 0;

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

function createButtons() {
  console.log("Creating Buttons ");
  if (testOptionsExists() == false) createPopupOptions();
  // change font to options

  let playButton = document.createElement("button");
  playButton.innerText = "Play";
  playButton.addEventListener("click", playButtonOperation);
  popupOptions.append(playButton);

  //changes font size -increase button
  let increaseButton = document.createElement("button");
  increaseButton.innerText = "Increase Size";
  increaseButton.addEventListener("click", increaseFontOperation);
  popupOptions.append(increaseButton);

  //new buttons here
}

function playButtonOperation(e) {
  e.preventDefault();
  console.log("Playing the text");
  console.log(exactText);
  var msg = new SpeechSynthesisUtterance();
  msg.text = exactText;
  window.speechSynthesis.speak(msg);
}

function increaseFontOperation(e) {
  e.preventDefault();
  console.log("Increase font size");
}

function showOptionsPopup() {
  popupOptions.classList.add("show");
  popupOptions.style.top = `${cursorY}px`;
  popupOptions.style.left = `${cursorX}px`;
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
        if (testOptionsShowing) hideOptionsPopup();
      });
      window.addEventListener("scroll", (event) => {
        if (testOptionsShowing) hideOptionsPopup();
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
              showOptionsPopup();
            }, 100);
          } else {
            hideOptionsPopup();
          }
          //window.getSelection().toString()--- section highlighted
        } else {
          hideOptionsPopup();
        }
      });
    }
  }, 10);
});
