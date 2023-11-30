var active_now_button;

function moveButtonActive(event) {
    drawButtonActivate = false;
    draw_button_click();
    eraseButtonActivate = false;
    erase_button_click();

    if (active_now_button) {
        active_now_button.classList.remove('active_button');
    }
    var button = event.target;
    button.classList.add('active_button');
    active_now_button = button;
    moveButtonActivate = true;
    move_button_click();
}

function eraserButtonActive(event) {
    drawButtonActivate = false;
    draw_button_click();
    moveButtonActivate = false;
    move_button_click();

    if (active_now_button) {
        active_now_button.classList.remove('active_button');
    }
    var button = event.target;
    button.classList.add('active_button');
    active_now_button = button;
    eraseButtonActivate = true;
    erase_button_click();
}

function drawButtonActive(event) {
    eraseButtonActivate = false;
    erase_button_click();
    moveButtonActivate = false;
    move_button_click();

    var dropdown = document.getElementById("draw-settings");

    if (!dropdown.style.display || dropdown.style.display === 'none') {
        dropdown.style.left = 20 + event.pageX + 'px';
        dropdown.style.top = event.pageY + 'px';
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }

    var button = event.target;

    if (active_now_button) {
        active_now_button.classList.remove('active_button');
    }

    button.classList.add('active_button');
    active_now_button = button;
    drawButtonActivate = true;
    draw_button_click();
}

window.onclick = function (event) {
    var dropdown = document.getElementById("draw-settings");
    if (!event.target.matches('.draw-button') && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
}

//Фон

function setBackground(style) {
    if (style == "0") {
        drawGridstyle0("base-canvas", 20);
    }
    else if (style == "1") {
        drawGridstyle1("base-canvas", 20);
    }
    else if (style == "2") {
        drawGridstyle2("base-canvas", 20);
    }
    else if (style == "3") {
        drawGridstyle3("base-canvas", 20);
    }
}

function toggleDropdown(event) {
    var dropdown = document.getElementById("backgrounds");

    if (!dropdown.style.display || dropdown.style.display === 'none') {
        dropdown.style.left = event.pageX + 'px';
        dropdown.style.top = 20 + event.pageY + 'px';
        dropdown.style.display = 'block';
        drawGridstyle0("style0");
        drawGridstyle1("style1", 10);
        drawGridstyle2("style2", 10);
        drawGridstyle3("style3", 10);
    } else {
        dropdown.style.display = 'none';
    }
}

window.onclick = function (event) {
    var dropdown = document.getElementById("backgrounds");
    if (!event.target.matches('.background_button') && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
    var dropdown = document.getElementById("draw-settings");
    if (!event.target.matches('.draw-button') && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
}



//Разлинеивание 
function drawGridstyle0(canvasId) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function drawGridstyle1(canvasId, cellSize) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgb(218,233,249)";

    // Ширина и высота холста
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    // Отрисовка клетчатой тетради
    for (var x = 0; x < canvasWidth; x += cellSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvasHeight);
        context.stroke();
    }

    for (var y = 0; y < canvasHeight; y += cellSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvasWidth, y);
        context.stroke();
    }
}

function drawGridstyle2(canvasId, cellSize) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Ширина и высота холста
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    context.strokeStyle = "rgb(218,233,249)";
    for (var y = 0; y < canvasHeight; y += cellSize) {
        context.beginPath();  // Начать новый путь
        context.moveTo(0, y);
        context.lineTo(canvasWidth, y);
        context.stroke();
    }
}

function drawGridstyle3(canvasId, cellSize) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(82, 93, 100, 0.251)";

    // Ширина и высота холста
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    // Отрисовка клетчатой тетради
    for (var x = 0; x < canvasWidth; x += cellSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvasHeight);
        context.stroke();
    }

    for (var y = 0; y < canvasHeight; y += cellSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvasWidth, y);
        context.stroke();
    }
}