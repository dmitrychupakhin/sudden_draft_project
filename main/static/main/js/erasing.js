let isEraseing = false;
var eraseButtonActivate = true;
let pathCoordinates = [];

function erase_button_click() {
    if (eraseButtonActivate) {
        editor_canvas.addEventListener("mousedown", startErasing);
        editor_canvas.addEventListener("touchstart", startErasingTouch, { passive: false });
        editor_canvas.addEventListener("mousemove", erase);
        editor_canvas.addEventListener("touchmove", eraseTouch, { passive: false });
        editor_canvas.addEventListener("mouseup", stopEraseing);
        editor_canvas.addEventListener("touchend", stopEraseingTouch);
        editor_canvas.addEventListener("mouseout", stopEraseing);
    } else {
        editor_canvas.removeEventListener("mousedown", startErasing);
        editor_canvas.removeEventListener("touchstart", startErasingTouch);
        editor_canvas.removeEventListener("mousemove", erase);
        editor_canvas.removeEventListener("touchmove", eraseTouch);
        editor_canvas.removeEventListener("mouseup", stopEraseing);
        editor_canvas.removeEventListener("touchend", stopEraseingTouch);
        editor_canvas.removeEventListener("mouseout", stopEraseing);
    }
}

function startErasing(e) {
    isEraseing = true;
    var rect = editor_canvas.getBoundingClientRect();
    pathCoordinates.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    editor_context.clearRect(e.clientX - rect.left, e.clientY - rect.top, 15, 15);
}

function erase(e) {
    if (isEraseing) {
        var rect = editor_canvas.getBoundingClientRect();
        pathCoordinates.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        editor_context.clearRect(e.clientX - rect.left, e.clientY - rect.top, 15, 15);
    }
}

function stopEraseing() {
    if (isEraseing) {
        isEraseing = false;
        saveEraseing();
    }
}

function startErasingTouch(e) {
    e.preventDefault();
    isEraseing = true;
    var rect = editor_canvas.getBoundingClientRect();
    pathCoordinates.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
}

function eraseTouch(e) {
    e.preventDefault();
    if (isEraseing) {
        var rect = editor_canvas.getBoundingClientRect();
        pathCoordinates.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
}

function stopEraseingTouch() {

    if (isEraseing) {
        isEraseing = false;
        saveEraseing();
    }
}

function saveEraseing() {
    socket.send(JSON.stringify({
        coordinates: pathCoordinates,
    }));
    pathCoordinates = [];
}