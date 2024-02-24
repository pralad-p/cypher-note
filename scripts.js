// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("editable-area");

  let lastRightClickTimestamp = 0; // To track double right-clicks
  let leftAndRightClicked = false;

  const caseSensitiveCheckbox = document.getElementById("case-sensitive");
  const wholeWordCheckbox = document.getElementById("whole-word");
  let usedColors = ["#333"]; // Array to track used colors

  // Global object to store selection-to-noun mappings
  let selectionToNounMap = {};

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
    // Directly query the checkbox states here
    const isCaseSensitive = document.getElementById("case-sensitive").checked;
    const isWholeWord = document.getElementById("whole-word").checked;

    console.log("Case sensitive checked:", isCaseSensitive);
    console.log("Whole word checked:", isWholeWord);

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
    const singular_match = content.match(regex);
    if (singular_match) {
      const noun = await fetchRandomNoun();
      selectionToNounMap[singular_match] = noun;
    }
    content = content.replace(regex, (match) => {
      // Use the actual matched text, which preserves the case
      return `<span style="background-color: ${randomColor};">${match}</span>`;
    });
    textArea.innerHTML = content;
    console.log("SelectionToNounMap: ", selectionToNounMap);
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
      textArea.innerHTML = textArea.innerHTML.replace(
        /<span style="background-color: [^>]+>([^<]+)<\/span>/g,
        "$1"
      );
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

  [caseSensitiveCheckbox, wholeWordCheckbox].forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      // Logic that should run when checkbox state changes, if any
      console.log(`${checkbox.id} changed: `, checkbox.checked);
    });
  });
});
