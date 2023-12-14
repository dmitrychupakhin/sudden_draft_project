//Значения для ручки по умолчанию
var lineWidth = 2;
var color = "rgba(60, 64, 67, 1)";
var style = 1;

var editor_canvas = document.getElementById("editor-canvas");
var editor_context = editor_canvas.getContext("2d");

//Изменяем тип ручки
function set_draw_style1(event) {
    if (event) {
        //Изменяем иконку ручки
        var button = event.target;
        var draw_button = document.getElementById("toolbar-draw-button");
        draw_button.innerHTML = button.innerHTML;
        var custom_cursor = document.getElementById("custom-cursor");
        custom_cursor.innerHTML = button.innerHTML;
    }
    // Устанавливаем цвет и стиль
    editor_context.lineJoin = 'miter';
    editor_context.lineCap = 'butt';
    var alpha = 1;
    var rgbaColor = tinycolor(editor_context.strokeStyle).setAlpha(alpha).toRgbString();
    color = rgbaColor;
    editor_context.strokeStyle = rgbaColor;
    lineWidth = 2;
    editor_context.lineWidth = 2;
    style = 1;
    cursor_func();
}

function set_draw_style2(event) {
    if (event) {
        var button = event.target;
        var draw_button = document.getElementById("toolbar-draw-button");
        draw_button.innerHTML = button.innerHTML;
        var custom_cursor = document.getElementById("custom-cursor");
        custom_cursor.innerHTML = button.innerHTML;
    }


    editor_context.lineJoin = 'round';
    editor_context.lineCap = 'round';

    var alpha = 0.9;
    var rgbaColor = tinycolor(editor_context.strokeStyle).setAlpha(alpha).toRgbString();

    // Устанавливаем цвет и стиль
    color = rgbaColor;
    editor_context.strokeStyle = rgbaColor;
    lineWidth = 4;
    editor_context.lineWidth = 4;
    style = 2;
    cursor_func();
}

function set_draw_style3(event) {
    if (event) {
        var button = event.target;
        var draw_button = document.getElementById("toolbar-draw-button");
        draw_button.innerHTML = button.innerHTML;
        var custom_cursor = document.getElementById("custom-cursor");
        custom_cursor.innerHTML = button.innerHTML;
    }


    editor_context.lineJoin = 'miter';
    editor_context.lineCap = 'butt';

    var alpha = 0.2;
    var rgbaColor = tinycolor(editor_context.strokeStyle).setAlpha(alpha).toRgbString();

    // Устанавливаем цвет и стиль
    color = rgbaColor;
    editor_context.strokeStyle = rgbaColor;
    lineWidth = 15;
    editor_context.lineWidth = 15;
    style = 3;
    cursor_func();
}

function set_draw_style4(event) {
    if (event) {
        var button = event.target;
        var draw_button = document.getElementById("toolbar-draw-button");
        draw_button.innerHTML = button.innerHTML;
        var custom_cursor = document.getElementById("custom-cursor");
        custom_cursor.innerHTML = button.innerHTML;
    }


    editor_context.lineJoin = 'miter';
    editor_context.lineCap = 'butt';

    var alpha = 0.05;
    var rgbaColor = tinycolor(editor_context.strokeStyle).setAlpha(alpha).toRgbString();

    // Устанавливаем цвет и стиль
    color = rgbaColor;
    editor_context.strokeStyle = rgbaColor;
    lineWidth = 30;
    editor_context.lineWidth = 30;
    style = 4;
    cursor_func();
}

//Изменяем цвет ручки
function set_draw_color(event) {
    var button = event.target;
    var computedStyle = window.getComputedStyle(button);
    var backgroundColor = computedStyle.backgroundColor;
    var alpha = 1;
    var rgbaColor = tinycolor(backgroundColor).setAlpha(alpha).toRgbString();

    // Устанавливаем цвет и стиль
    color = rgbaColor;
    editor_context.strokeStyle = rgbaColor;

    // Далее ваш код для установки стиля рисования в зависимости от переменной style
    if (style === 1) {
        set_draw_style1();
    }
    else if (style === 2) {
        set_draw_style2();
    }
    else if (style === 3) {
        set_draw_style3();
    }
    else if (style === 4) {
        set_draw_style4();
    }
}

// Рисование
var isDrawing = false;
var drawButtonActivate = false;

function draw_button_click() {
    editor_context.lineWidth = lineWidth;
    editor_context.strokeStyle = color;
    var alpha = 1;
    editor_context.strokeStyle = tinycolor(editor_context.strokeStyle).setAlpha(alpha).toRgbString();
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
    var rect = editor_canvas.getBoundingClientRect();
    editor_context.beginPath();
    editor_context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (isDrawing) {
        var rect = editor_canvas.getBoundingClientRect();
        var x1 = e.clientX - rect.left;
        var y1 = e.clientY - rect.top;
        var x0 = editor_context.currentX || x1;
        var y0 = editor_context.currentY || y1;

        var xc = (x0 + x1) / 2;
        var yc = (y0 + y1) / 2;
        editor_context.quadraticCurveTo(x0, y0, xc, yc);

        editor_context.stroke();

        editor_context.beginPath(); // Начать новый путь
        editor_context.moveTo(xc, yc);

        editor_context.currentX = x1;
        editor_context.currentY = y1;
    }
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        delete editor_context.currentX;
        delete editor_context.currentY;
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
        type: 'draw_picture_change',
        image: imageURL,
        x_position: xPosition,
        y_position: yPosition
    };

    editor_context.clearRect(0, 0, editor_canvas.width, editor_canvas.height);
    socket.send(JSON.stringify(data));
}