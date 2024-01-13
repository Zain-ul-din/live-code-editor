function handleWindowResize () {
    const resizer = $("#resizer")
    const leftWinRef = $("aside")
    const rightWinRef = $("iframe")

    let x = 0;
    let leftWinWidth = 0;
    
    const mouseDownHandler = function (e) {
        x = e.clientX;

        const rect = leftWinRef.getBoundingClientRect();
        leftWinWidth = rect.width;
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        
        leftWinRef.style.userSelect = 'none';
        leftWinRef.style.pointerEvents = 'none';

        rightWinRef.style.userSelect = 'none';
        rightWinRef.style.pointerEvents = 'none';
    }

    const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const w = ((leftWinWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        leftWinRef.style.width = w + '%';
        resizer.style.cursor = 'col-resize'
    }

    const mouseUpHandler = function(e) {
        leftWinRef.style.removeProperty('user-select');
        leftWinRef.style.removeProperty('pointer-events');

        rightWinRef.style.removeProperty('user-select');
        rightWinRef.style.removeProperty('pointer-events');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }

    resizer.addEventListener('mousedown', mouseDownHandler)
}

handleWindowResize()
