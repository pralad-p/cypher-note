// scripts.js

/* Global variables */
let usedColors = ["#333"]; // Array to track used colors
// Global object to store selection-to-noun mappings
let selectionToNounMap = {};
let lastRightClickTimestamp = 0; // To track double right-clicks
let leftAndRightClicked = false;

class StateManager {
  constructor() {
    this.flags = {
      sessionRunning: false,
      // Other flags can be added here
    };
  }

  setFlag(flagKey, value) {
    if (Object.prototype.hasOwnProperty.call(this.flags, flagKey)) {
      this.flags[flagKey] = value;
    }
  }

  getFlag(flagKey) {
    return Object.prototype.hasOwnProperty.call(this.flags, flagKey)
      ? this.flags[flagKey]
      : undefined;
  }
}
// Usage
const stateManager = new StateManager();

document.addEventListener("DOMContentLoaded", () => {
  /* Global document variables */
  const textArea = document.getElementById("editable-area");
  const selectedTextDisplay = document.getElementById("selected-text");
  const encryptButton = document.getElementById("encrypt-button");
  const decryptButton = document.getElementById("decrypt-button");
  const caseSensitiveCheckbox = document.getElementById("case-sensitive");
  const wholeWordCheckbox = document.getElementById("whole-word");
  const sessionStatusText = document.getElementById("session-status");

  /* Functions */
  function updateSelectedText() {
    const selection = window.getSelection().toString();
    selectedTextDisplay.value = selection;
    selectedTextDisplay.value = selectedTextDisplay.value.replace(/ /g, "*");
  }

  textArea.addEventListener("mouseup", updateSelectedText);
  textArea.addEventListener("keyup", updateSelectedText);

  async function fetchRandomNoun() {
    let uniqueWord = "";
    do {
      const response = await fetch(
        `https://random-word-form.herokuapp.com/random/noun`
      );
      const words = await response.json();
      uniqueWord = words[0]; // API returns a single noun
    } while (Object.values(selectionToNounMap).includes(uniqueWord));
    return uniqueWord;
  }

  function getRandomColor() {
    // Function to generate random color, making sure it's not too close to the text area bg
    let color = "#";
    do {
      color += Math.floor(Math.random() * 16777215).toString(16);
    } while (usedColors.includes(color)); // Replace with the background color of your text area if different
    usedColors.push(color);
    return color;
  }

  function escapeRegExp(text) {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  async function markText(selectedText) {
    let content = textArea.innerHTML;
    const randomColor = getRandomColor();
    let flags = caseSensitiveCheckbox.checked ? "g" : "gi";
    let escapedSelectedText = escapeRegExp(selectedText);
    let regexString = escapedSelectedText;

    if (wholeWordCheckbox.checked) {
      // If whole word checkbox is checked, use word boundaries in the regex
      regexString = `\\b${escapedSelectedText}\\b`;
    }
    // Use a regex to replace text
    const regex = new RegExp(regexString, flags);
    const singular_matches = content.match(regex);
    if (singular_matches) {
      const noun = await fetchRandomNoun();
      for (const match of singular_matches) {
        selectionToNounMap[match] = noun;
      }
    }
    content = content.replace(regex, (match) => {
      // Use the actual matched text, which preserves the case
      return `<span style="background-color: ${randomColor};">${match}</span>`;
    });
    textArea.innerHTML = content;
  }

  textArea.addEventListener("mousedown", (event) => {
    // Check if both left (1) and right (2) buttons are pressed
    if (event.buttons === 3) {
      leftAndRightClicked = true;
      // Prevent text selection or context menu
      event.preventDefault();
    }
  });

  textArea.addEventListener("mouseup", () => {
    if (leftAndRightClicked) {
      leftAndRightClicked = false; // Reset the state
      // Your logic for marking text
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        markText(selectedText);
      }
    }
  });

  // Reset the state if the mouse leaves the element
  textArea.addEventListener("mouseleave", () => {
    leftAndRightClicked = false;
  });

  textArea.addEventListener("contextmenu", (event) => {
    // Prevent default context menu
    event.preventDefault();
    const currentTime = new Date().getTime();

    // Check if the last right-click was less than 500ms ago to consider it a double right-click
    if (currentTime - lastRightClickTimestamp < 500) {
      clearMarkings(textArea);
      usedColors = ["#333"];
      selectionToNounMap = {};
    }

    lastRightClickTimestamp = currentTime;
  });

  // Clear placeholder on focus
  textArea.addEventListener("focus", function () {
    if (this.value === this.getAttribute("placeholder")) {
      this.value = "";
    }
  });

  // Optionally, you can reinsert the placeholder if the textarea is still empty when it loses focus
  textArea.addEventListener("blur", function () {
    if (this.value === "") {
      this.value = this.getAttribute("placeholder");
    }
  });

  encryptButton.addEventListener("click", () => {
    if (stateManager.getFlag("sessionRunning")) {
      // session shouldn't be running
      return;
    }
    let content = textArea.innerHTML;
    // Iterate through each selection-to-noun mapping
    Object.entries(selectionToNounMap).forEach(([key, noun]) => {
      // Create a RegExp object for the key, ensuring case sensitivity
      const regex = new RegExp(escapeRegExp(key), "g");

      // Replace occurrences of the key with the noun
      content = content.replace(regex, noun);
    });

    // Update the text area with the modified content
    textArea.innerHTML = content;
    sessionStatusText.textContent = "🔴 Session running...";
    stateManager.setFlag("sessionRunning", true);
    clearMarkings(textArea);
  });

  decryptButton.addEventListener("click", () => {
    if (!stateManager.getFlag("sessionRunning")) {
      // session should be running
      return;
    }
    let content = textArea.innerHTML;
    // content = stripHTML(content);

    let traversedWords = [];
    // Iterate through each selection-to-noun mapping
    Object.entries(selectionToNounMap).forEach(([key, noun]) => {
      // Create a RegExp object for the noun (inverse), ensuring case sensitivity
      if (traversedWords.includes(noun)) {
        return;
      }
      const regex = new RegExp(escapeRegExp(noun), "gi");
      // Replace occurrences of the noun with the key
      content = content.replace(regex, key);
      traversedWords.push(noun);
    });

    // Update the text area with the modified content
    textArea.innerHTML = content;
    sessionStatusText.textContent = "🟢 Session Ready!";
    stateManager.setFlag("sessionRunning", false);
    resetMarkingProps();
  });
});

function resetMarkingProps() {
  usedColors = ["#333"];
  selectionToNounMap = {};
}

function clearMarkings(textArea) {
  textArea.innerHTML = textArea.innerHTML.replace(
    /<span style="background-color: [^>]+>([^<]+)<\/span>/g,
    "$1"
  );

}

// Function to remove HTML tags from content
// function stripHTML(html) {
//   const tempDiv = document.createElement("div");
//   tempDiv.innerHTML = html;
//   return tempDiv.textContent || tempDiv.innerText || "";
// }
