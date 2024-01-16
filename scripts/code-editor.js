const textAreas = $$("textarea");
const iframeRef = $("iframe");

/**
 * listen to keyboard events and perform actions
*/
class KeyboardEventHandler {
  constructor() {
    this.actions = new Map();
    this.actions.set("Tab", this.onTab);
  }

  handle(key, self) {
    this.actions.forEach((action, potentialKey) => {
      if (key === potentialKey) action(self);
    });
  }

  has(key) {
    return this.actions.has(key);
  }

  onTab(self) {
    const start = self.selectionStart;
    const end = self.selectionEnd;
    const tab = new Array(2).fill(" ").join("");
    self.value =
      self.value.substring(0, start) + tab + self.value.substring(end);
    self.selectionStart = self.selectionEnd = start + tab.length;
  }
}

/**
 * Default boiler-plate code 
*/
var code = {
  html: `<main>
  <img src="../images/logo.svg" />
  <div class="grad-text">WELCOME TO </div>
  <div class="grad-text">LIVE CODE EDITOR</div>
  <button class="counter-btn">Click to Increment</button>
  <div class="credit">Created by: Zain Ul Din (Fa-2020/BSCS/147)</div>
</main>`,
  css: `* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: white;
  font-family: sans-serif;
}

:root {
  --gradient: linear-gradient(to left, #ecc94b, #48bb78);
}

body, html {
  width: 100%;
  height: 100%;
  background: #111;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

main::before {
  content: '';
  position: absolute;
  top: 35%; left: 33%;
  width: 30%;
  height: 30%;
  background: var(--gradient);
  filter: blur(200px);
  opacity: 0.3;
}

main > img {
  margin-bottom: 2rem;
  animation: ping-pong 5s linear infinite forwards;
}

.grad-text {
  font-size: 3rem;
  font-weight: 800;
  background-image: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.counter-btn {
  color: black;
  margin-top: 1.5rem;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  background: var(--gradient);
  border: 0;
  font-size: 1em;
  font-weight: 700;
  position: relative;
  isolation: isolate;
  cursor: pointer;
}

.counter-btn:hover {
  opacity: 0.7;
}

.counter-btn::before {
  content: '';
  position: absolute;
  width: calc(100%);
  height: calc(100%);
  background: red;
  top: 0; left: 0;
  border-radius: inherit;
  background: inherit;
  z-index: -1;
  filter: blur(10px);
  opacity: 0.5;
}

.credit {
  color: #999;
  margin-top: 2rem;
}

@keyframes ping-pong {
  0% {
    transform: translateY(0px);
  }
  
  50% {
    transform: translateY(20px);
  }
  
  100% {
    transform: translateY(0px);
  }
}
`,
  js: `const $ = document.querySelector.bind(document)
const counterBtn = $(".counter-btn")
let counter = 0

function incrementCount () {
  counter += 1
  counterBtn.textContent = \`\${counter} times clicked!\` 
}

counterBtn.onclick = incrementCount;
`,
  construct: function () {
    return `${this.html}\n<style>${this.css}</style>\n<script>${this.js}</script>`;
  },
};

/**
 * runs callback after given delay
 * @param {*} callback 
 * @param {*} delay 
 * @returns 
*/
function useDebounce(callback, delay) {
  let timeoutId = null;
  return function () {
    const context = this;
    const args = arguments;

    if(timeoutId != null) return;

    const runLater = function () {
      callback.apply(context, args);
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    timeoutId = setTimeout(runLater, delay);
  }
}

const keyboardEventHandler = new KeyboardEventHandler();
const setIframeSrc = () => (iframeRef.srcdoc = code.construct());
const debounce = useDebounce(setIframeSrc, 1000);

setIframeSrc();

textAreas.forEach((textArea) => {
  textArea.value = code[textArea.getAttribute("data-lang")];

  // handles keyboard events
  textArea.addEventListener("keydown", function (e) {
    if (keyboardEventHandler.has(e.key)) {
      e.preventDefault();
      keyboardEventHandler.handle(e.key, this);
    }
  });

  textArea.oninput = (e) => {
    const { target } = e;
    const { value } = target;

    switch (target.getAttribute("data-lang")) {
      case "html":
        code = { ...code, html: value };
        break;
      case "css":
        code = { ...code, css: value };
        break;
      case "js":
        code = { ...code, js: value };
        break;
    }

    debounce();
    // setIframeSrc();
  };
});
