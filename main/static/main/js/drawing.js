
var lineWidth = 2;
var color = "black";
var style = 1;

var editor_canvas = document.getElementById("editor-canvas");
var editor_context = editor_canvas.getContext("2d");

function set_draw_style1(event) {
    var button = event.target;
    var draw_button = document.getElementById("toolbar-draw-button");
    draw_button.innerHTML = button.innerHTML;

    var isDrawing = false;
    var drawButtonActivate = true;
    lineWidth = 2;
    editor_context.lineWidth = 2;
    style = 1;
}

function set_draw_style2(event) {
    var button = event.target;
    var draw_button = document.getElementById("toolbar-draw-button");
    draw_button.innerHTML = button.innerHTML;

    var isDrawing = false;
    var drawButtonActivate = true;
    lineWidth = 2;
    editor_context.lineWidth = 2;
    style = 1;
}

function set_draw_style3(event) {
    var button = event.target;
    var draw_button = document.getElementById("toolbar-draw-button");
    draw_button.innerHTML = button.innerHTML;

    var isDrawing = false;
    var drawButtonActivate = true;
    lineWidth = 2;
    editor_context.lineWidth = 2;
    style = 1;
}

function set_draw_style4(event) {
    var button = event.target;
    var draw_button = document.getElementById("toolbar-draw-button");
    draw_button.innerHTML = button.innerHTML;

    var isDrawing = false;
    var drawButtonActivate = true;
    lineWidth = 2;
    editor_context.lineWidth = 2;
    style = 1;
}


function set_draw_color(event) {
    var button = event.target;
    var computedStyle = window.getComputedStyle(button);
    var backgroundColor = computedStyle.backgroundColor;
    color = backgroundColor;
    editor_context.strokeStyle = backgroundColor;
    if (style === 1) {
        set_draw_style1();
    }
    else if (style === 2) {
        set_draw_style2();
    }
    else if (style === 3) {
        set_draw_style3();
    }
}

//Рисование

var isDrawing = false;
var drawButtonActivate = false;

function draw_button_click() {
    editor_context.lineWidth = lineWidth;
    editor_context.strokeStyle = color;
    if (drawButtonActivate) {
        editor_canvas.addEventListener("mousedown", startDrawing);
        editor_canvas.addEventListener("touchstart", startDrawingTouch, { passive: false });
        editor_canvas.addEventListener("mousemove", draw);
        editor_canvas.addEventListener("touchmove", drawTouch, { passive: false });
        editor_canvas.addEventListener("mouseup", stopDrawing);
        editor_canvas.addEventListener("touchend", stopDrawingTouch);
        editor_canvas.addEventListener("mouseout", stopDrawing);
    } else {
        editor_canvas.removeEventListener("mousedown", startDrawing);
        editor_canvas.removeEventListener("touchstart", startDrawingTouch);
        editor_canvas.removeEventListener("mousemove", draw);
        editor_canvas.removeEventListener("touchmove", drawTouch);
        editor_canvas.removeEventListener("mouseup", stopDrawing);
        editor_canvas.removeEventListener("touchend", stopDrawingTouch);
        editor_canvas.removeEventListener("mouseout", stopDrawing);
    }
}

function startDrawing(e) {
    isDrawing = true;
    editor_context.beginPath();
    var rect = editor_canvas.getBoundingClientRect();
    editor_context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (isDrawing) {
        var rect = editor_canvas.getBoundingClientRect();
        editor_context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        editor_context.stroke();
    }
    console.log(editor_context.strokeStyle);
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveDrawing();
    }
}

function startDrawingTouch(e) {
    e.preventDefault();
    isDrawing = true;
    var touch = e.touches[0];
    editor_context.beginPath();
    var rect = editor_canvas.getBoundingClientRect();
    editor_context.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
}

function drawTouch(e) {
    e.preventDefault();
    if (isDrawing) {
        var touch = e.touches[0];
        var rect = editor_canvas.getBoundingClientRect();
        editor_context.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        editor_context.stroke();
    }
}

function stopDrawingTouch() {

    if (isDrawing) {
        isDrawing = false;
        saveDrawing();
    }
}

function saveDrawing() {
    var imageData = editor_context.getImageData(0, 0, editor_canvas.width, editor_canvas.height).data;

    var minX = editor_canvas.width;
    var minY = editor_canvas.height;
    var maxX = 0;
    var maxY = 0;

    for (var y = 0; y < editor_canvas.height; y++) {
        for (var x = 0; x < editor_canvas.width; x++) {
            var index = (y * editor_canvas.width + x) * 4;
            var alpha = imageData[index + 3];

            if (alpha > 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    var regionX = minX;
    var regionY = minY;
    var regionWidth = maxX - minX + 1;
    var regionHeight = maxY - minY + 1;

    var tempCanvas = document.createElement('canvas');
    var tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = regionWidth;
    tempCanvas.height = regionHeight;

    tempContext.drawImage(editor_canvas, regionX, regionY, regionWidth, regionHeight, 0, 0, regionWidth, regionHeight);

    var imageURL = tempCanvas.toDataURL('image/png');

    var xPosition = regionX; // Ваш x_position
    var yPosition = regionY; // Ваш y_position

    var data = {
        image: imageURL,
        x_position: xPosition,
        y_position: yPosition
    };

    editor_context.clearRect(0, 0, editor_canvas.width, editor_canvas.height);
    socket.send(JSON.stringify(data));
}