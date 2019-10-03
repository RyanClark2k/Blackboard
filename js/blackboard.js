// Author Ryan CLark
var board = document.getElementById("blackboard");
var board2 = document.getElementById("blackboard2");

var colorChooser = document.getElementById('colorChooser');

var mouseDown = false;
var paintColor = "#FFFFFF";
var brushSize = 4;
var maxBrushSize = 20;
var minBrushSize = 1;

var undoStack = [];
var redoStack = [];

function addListeners(canvas){
    var ctx = canvas.getContext('2d');
    // mouse listeners
    canvas.addEventListener('mousemove', function(e){
        if(mouseDown)
            handleMove(e, canvas, ctx);
    });
    canvas.addEventListener('mousedown', function(e){
        handleDown(e, canvas, ctx);
    });
    canvas.addEventListener('mouseup', function(e){
        handleUp(e, canvas, ctx);
    });
    // touch listeners
    canvas.addEventListener('touchmove',function(e){
        handleMove(e.changedTouches[0], canvas, ctx);
    });
    canvas.addEventListener('touchend',function(e){
        handleUp(e.changedTouches[0], canvas, ctx);
    });
    canvas.addEventListener('touchstart',function(e){
        handleDown(e.changedTouches[0], canvas, ctx);
    });

    canvas.addEventListener("touchstart",  function(event) {event.preventDefault()})
    canvas.addEventListener("touchmove",   function(event) {event.preventDefault()})
    canvas.addEventListener("touchend",    function(event) {event.preventDefault()})
    canvas.addEventListener("touchcancel", function(event) {event.preventDefault()})

    window.addEventListener('keydown', function(e){
        if ((e.metaKey || e.ctrlKey) && e.key=='z'){
            undo(ctx);
        }
        if ((e.metaKey || e.ctrlKey) && e.key=='y'){
            redo(ctx);
        }
    });

    var undoBtn = document.getElementById("undo");
    undoBtn.addEventListener("mousedown", function(e){
        undo(ctx);
    });

    var redoBtn = document.getElementById("redo");
    redoBtn.addEventListener("mouseup", function(e){
        redo(ctx);
    });

    var sizeUp = document.getElementById("sizeUp");
    sizeUp.addEventListener("click", function(e){
        brushSize = Math.min(brushSize + 1, maxBrushSize);
    });
    sizeUp.addEventListener("mousedown", function(e){
        sizeUp.style.color = "#CCC";
    });

    sizeUp.addEventListener("mouseup", function(e){
        sizeUp.style.color = "#FFF";
    });

    var sizeDown = document.getElementById("sizeDown");
    sizeDown.addEventListener("click", function(e){
        brushSize = Math.max(brushSize - 1, minBrushSize);
    });

    sizeDown.addEventListener("mousedown", function(e){
        sizeDown.style.color = "#CCC";
    });

    sizeDown.addEventListener("mouseup", function(e){
        sizeDown.style.color = "#FFF";
    });

    var clearBtn = document.getElementById("clear");
    clearBtn.addEventListener("click", function(e){
        clear(canvas, ctx);
    });

    clearBtn.addEventListener("mousedown", function(e){
        clearBtn.style.color = "#CCC";
    });

    clearBtn.addEventListener("mouseup", function(e){
        clearBtn.style.color = "#FFF";
    });

    clear(canvas,ctx);
}
  
function clear(canvas, ctx){
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// code for listeners inspired by  Michael Schwartz
function handleDown(e, canvas, ctx){
    mouseDown = true;
    ctx.beginPath();
    pos = getMousePos(canvas, e);
    ctx.moveTo(pos.x, pos.y);
}

function handleUp(e, canvas, ctx){
    mouseDown = false;
    ctx.closePath();
}

function handleMove(e, canvas, ctx){
    pos = getMousePos(canvas, e);
    undoStack.push(
        copyCanvasRegionToBuffer(canvas)
    );
    redoStack.length = 0;
    ctx.lineTo(pos.x, pos.y);
    if (colorChooser != null){}
        paintColor = colorChooser.style.backgroundColor;
    ctx.strokeStyle = paintColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
}

function undo(ctx){
    
    if(undoStack.length < 1)
        return;

    buffer = undoStack.pop();
    ctx.drawImage(buffer, 0, 0);
    redoStack.push(buffer);
}

function redo(ctx){

    console.log(redoStack.length);

    if(redoStack.length < 1 || undoStack.length < 1)
        return;
        
    buffer = redoStack.pop();
    ctx.drawImage(buffer, 0, 0);
    undoStack.push(buffer);
}

// credit user1693593 @ Stack Overflow
function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

// credit Phrogz @ Stack Overflow
function copyCanvasRegionToBuffer( canvas, bufferCanvas ){
    if (!bufferCanvas) bufferCanvas = document.createElement('canvas');
    bufferCanvas.width  = canvas.width;
    bufferCanvas.height = canvas.height;
    bufferCanvas.getContext('2d').drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height );
    return bufferCanvas;
  }

addListeners(board);
addListeners(board2);