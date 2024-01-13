const textAreas = $$("textarea")
const iframeRef = $("iframe")

class KeyboardEventHandler {
  
  constructor() {
    this.actions = new Map()
    this.actions.set("Tab", this.onTab);
  }

  handle(key, self) {
    this.actions.forEach((action, potentialKey)=> {
      if(key === potentialKey)
        action(self);
    });
  }
  
  has(key) { return this.actions.has(key); }

  onTab(self) {
    console.log(self);
    const start = self.selectionStart;
    const end = self.selectionEnd;
    const tab = (new Array(2).fill(' ')).join('')
    self.value = self.value.substring(0, start) + tab + self.value.substring(end);
    self.selectionStart = self.selectionEnd = start + tab.length;
  }
}


var code = {
  html: `<main>
  <img src="../images/logo.svg" />
  <div class="grad-text">WELCOME TO </div>
  <div class="grad-text">RANDOMS CODE EDITOR</div>
  <div class="credit">Created by: Zain Ul Din (Fa-2020/BSCS/147)</div>
</main>`,
css: `* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: white;
  font-family: sans-serif;
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
}

main > img {
  margin-bottom: 2rem;
  animation: ping-pong 2s linear infinite forwards;
}

.grad-text {
  font-size: 3rem;
  font-weight: 800;
  background-image: linear-gradient(to left, #ecc94b, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.credit {
  color: #666;
  margin-top: 3rem;
}

@keyframes ping-pong {
  0% {
    transform: translateY(0px);
  }
  
  50% {
    transform: translateY(5px);
  }
  
  100% {
    transform: translateY(0px);
  }
}
`,
  js: `// add your javascript here`,
  construct: function () {
    return `${this.html}\n<style>${this.css}</style>\n<script>${this.js}</script>`
  }
}

const keyboardEventHandler = new KeyboardEventHandler();
const setIframeSrc = ()=> iframeRef.srcdoc = code.construct();

setIframeSrc()

textAreas.forEach(textArea=> {
  
  textArea.value = code[textArea.getAttribute("data-lang")]

  // handles keyboard events
  textArea.addEventListener("keydown", function (e) {
    if(keyboardEventHandler.has(e.key)) {
      e.preventDefault()
      keyboardEventHandler.handle(e.key, this);
    }
  });
  
  textArea.oninput = (e)=> {
    const { target } = e;
    const { value } = target;

    switch(target.getAttribute("data-lang")) {
      case 'html':
        code = {...code, 'html': value }
      break;
      case 'css':
        code = {...code, 'css': value }
      break;
      case 'js':
        code = {...code, 'js': value }
      break;
    }

    setIframeSrc();
  }
});

