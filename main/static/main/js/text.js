var textButtonActivate = true;
var isMouseDown = false;
var container = document.getElementById('canvas-block');
var editor_canvas = document.getElementById('editor_canvas');
var containerRect = container.getBoundingClientRect();

function focusOn(focusDiv) {
    document.getElementById(focusDiv).focus();
}

function loadText() {
    if (textButtonActivate) {
        editor_canvas.style = "pointer-events: none;";
        container.style.cursor = "crosshair";
        container.addEventListener("dblclick", newTextArea);
    } else {
        editor_canvas.style = "pointer-events: auto;";
        container.style.cursor = "none";
        container.removeEventListener("dblclick", newTextArea);
    }
}

function newTextArea(e) {
    var rect = editor_canvas.getBoundingClientRect();
    var data = {
        type: 'new_text_array',
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    socket.send(JSON.stringify(data));
}
