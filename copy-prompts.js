document.addEventListener("copy", (event) => {
  highlightPromptAndSelectNextPrompt(document.getSelection().focusNode);
});

function formatClipboardButtons() {
  document.querySelectorAll("button").forEach(button => {
    const previousElementSibling = button.previousElementSibling;
    if (!previousElementSibling.innerText.includes('Prompt')) return;

    const leftPostion = previousElementSibling.innerText.includes('Optional') ? '170px' : '75px';
    Object.assign(button.style, {
      position: "absolute",
      fontSize: "16px",
      top: "-4px",
      left: leftPostion,
      background: "#41a3ff",
      color: "white",
      border: "none",
      padding: "5px 10px",
      cursor: "pointer",
      borderRadius: "3px"
    });

    button.prepend(createCopySvg());

    if (button.parentElement) {
      button.parentElement.style.position = "relative";
    }
  });
}

function showPopup(text) {
  const popup = document.createElement("div");
  popup.innerText = text;
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.background = "#41a3ff";
  popup.style.color = "white";
  popup.style.padding = "10px 15px";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.opacity = "1";
  popup.style.transition = "opacity 0.5s ease-out";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => document.body.removeChild(popup), 500);
  }, 2000);
}

function copyToClipboard(copyButton) {
  const parentParagraphElement = copyButton.closest("p");
  const currentPromptElement = parentParagraphElement.nextElementSibling?.querySelector("em");
  console.log('copying to clipboard', currentPromptElement);
  navigator.clipboard.writeText(currentPromptElement.innerText)
    .then(() => { showPopup('Copied to clipboard!'); highlightPromptAndSelectNextPrompt(currentPromptElement); })
    .catch(() => showPopup('Oops, failed to copy to clipboard. :('))
}

function highlightPromptAndSelectNextPrompt(currentPromptElement) {
  console.log('here', currentPromptElement);
  window.getSelection().removeAllRanges();
  highlightText(currentPromptElement);

  const nextPromptElement = findNextPromptElement(currentPromptElement);
  setTimeout(() => selectText(nextPromptElement), 2000);
}

function highlightText(currentPromptElement) {
  if (!currentPromptElement) return;

  console.log('highlighting', currentPromptElement);
  currentPromptElement.style.backgroundColor = "#ffeb3b"; // Yellow highlight
  currentPromptElement.style.transition = "background-color 0.5s ease-in-out";

  // Remove highlight after 1 second
  setTimeout(() => {
    currentPromptElement.style.backgroundColor = "transparent";
  }, 1000);
}

function selectText(element) {
  if (!element) return;

  const range = document.createRange();
  range.selectNodeContents(element); // Select the full content of <em>

  const selection = window.getSelection();
  selection.removeAllRanges(); // Clear any existing selection
  selection.addRange(range); // Select the new range
}

function findNextPromptElement(currentPromptElement) {
  const parentPElement = currentPromptElement.closest('p');
  let nextElement = parentPElement;

  console.log('finding next', nextElement);
  while (nextElement) {
    nextElement = nextElement.nextElementSibling;
    console.log('nextElement', nextElement);

    // Check if the element contains a <strong>Prompt</strong>
    if (nextElement?.querySelector("strong")?.innerText.includes("Prompt")) {
      // The next <p> should contain the corresponding <em> element
      let nextEm = nextElement.nextElementSibling?.querySelector("em");
      if (nextEm) return nextEm;
    }
  }
  console.log('exit while')
}

function createCopySvg() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20px");
  svg.setAttribute("height", "20px");
  svg.setAttribute("viewBox", "250 150 650 700");
  svg.setAttribute("fill", "#000000");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const paths = [
    { d: "M589.3 260.9v30H371.4v-30H268.9v513h117.2v-304l109.7-99.1h202.1V260.9z", fill: "#E1F0FF" },
    { d: "M516.1 371.1l-122.9 99.8v346.8h370.4V371.1z", fill: "#E1F0FF" },
    { d: "M752.7 370.8h21.8v435.8h-21.8z", fill: "#446EB1" },
    { d: "M495.8 370.8h277.3v21.8H495.8z", fill: "#446EB1" },
    { d: "M495.8 370.8h21.8v124.3h-21.8z", fill: "#446EB1" },
    { d: "M397.7 488.7l-15.4-15.4 113.5-102.5 15.4 15.4z", fill: "#446EB1" },
    { d: "M382.3 473.3h135.3v21.8H382.3z", fill: "#446EB1" },
    { d: "M382.3 479.7h21.8v348.6h-21.8zM404.1 806.6h370.4v21.8H404.1z", fill: "#446EB1" },
    { d: "M447.7 545.1h261.5v21.8H447.7zM447.7 610.5h261.5v21.8H447.7zM447.7 675.8h261.5v21.8H447.7z", fill: "#6D9EE8" },
    { d: "M251.6 763h130.7v21.8H251.6z", fill: "#446EB1" },
    { d: "M251.6 240.1h21.8v544.7h-21.8zM687.3 240.1h21.8v130.7h-21.8zM273.4 240.1h108.9v21.8H273.4z", fill: "#446EB1" },
    { d: "M578.4 240.1h130.7v21.8H578.4zM360.5 196.5h21.8v108.9h-21.8zM382.3 283.7h196.1v21.8H382.3zM534.8 196.5h65.4v21.8h-65.4z", fill: "#446EB1" },
    { d: "M360.5 196.5h65.4v21.8h-65.4zM404.1 174.7h152.5v21.8H404.1zM578.4 196.5h21.8v108.9h-21.8z", fill: "#446EB1" }
  ];

  paths.forEach(({ d, fill }) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", fill);
    svg.appendChild(path);
  });

  return svg;
}