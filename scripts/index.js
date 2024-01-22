/**
 * if state true disable interaction on element
 * @param {*} ele HTMLElement
 * @param {*} state boolean
 */
const disableInteraction = (ele, state) => {
  if (state) {
    ele.style.userSelect = "none";
    ele.style.pointerEvents = "none";
  } else {
    ele.style.removeProperty("user-select");
    ele.style.removeProperty("pointer-events");
  }
};

/**
 * Handles resize of main layout
 */
function handleWindowResize() {
  const resizer = $("#resizer");
  const leftWinRef = $("aside");
  const rightWinRef = $("iframe");

  let x = 0;
  let leftWinWidth = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;

    const rect = leftWinRef.getBoundingClientRect();
    leftWinWidth = rect.width;

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    disableInteraction(leftWinRef, true);
    disableInteraction(rightWinRef, true);
  };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const w =
      ((leftWinWidth + dx) * 100) /
      resizer.parentNode.getBoundingClientRect().width;
    leftWinRef.style.width = w + "%";
    resizer.style.cursor = "col-resize";
  };

  const mouseUpHandler = function (e) {
    disableInteraction(leftWinRef, false);
    disableInteraction(rightWinRef, false);

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  resizer.addEventListener("mousedown", mouseDownHandler);
}

/**
 * Handles code editor windows resize
 */
function handleEditorWindowResize() {
  const parent = $("aside");
  const editorWindows = $$("aside > div");
  const labelHeight = $(".lang-label").getBoundingClientRect().height - 4;

  editorWindows.forEach((window) => {
    window.style.minHeight = `${labelHeight-2}px`;
  });

  const handleResize = (ele) => {
    let startY = 0,
      height = 0;

    const handleMouseDown = (e) => {
      e.preventDefault()

      startY = e.clientY - 2; // 2 coming from css. 
        // cuz we have 2px border of hr in css
      height = ele.previousElementSibling.getBoundingClientRect().height;
    
      editorWindows.forEach((ele) => {
        disableInteraction(ele, true);
      });

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      ele.style.borderWidth = `5px`;
    };

    const handleMouseMove = (e) => {
      const dy = e.clientY - startY;
      const h = ((height + dy) * 100) / parent.getBoundingClientRect().height;
      ele.previousElementSibling.style.height = `calc(max(${h}%, ${labelHeight}px)`;

      editorWindows.forEach((win) => {
        if (win === ele.nextElementSibling) {
          win.style.flex = "1";
          win.style.height = `${win.clientHeight}px`;
        } else {
          win.style.removeProperty("flex");
          win.style.height = `${win.clientHeight}px`;
        }
      });
    };

    const handleMouseUp = (e) => {
      editorWindows.forEach((ele) => disableInteraction(ele, false));
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      ele.style.borderWidth = `2px`;
    };

    ele.addEventListener("mousedown", handleMouseDown);
  };
  
  $$("aside > .h-divider")
    .forEach((ele) => handleResize(ele));
}

handleWindowResize();
handleEditorWindowResize();
