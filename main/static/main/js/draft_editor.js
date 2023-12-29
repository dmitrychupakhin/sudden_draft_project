//Активная кнопка сейчас
var active_now_button;

//Функция для кастомного курсора
function cursor_func() {
    const container = document.querySelector('.canvas-block');
    const cursor = document.querySelector('.custom-cursor');
    var top_len;
    if (document.getElementById("custom-cursor").innerHTML.trim() === "ink_eraser") {
        top_len = 10;
    }
    else {
        top_len = 20;
    }


    container.addEventListener('mouseenter', function () {
        cursor.style.display = 'block';
    });

    container.addEventListener('mouseleave', function () {
        cursor.style.display = 'none';
    });

    container.addEventListener('mousemove', function (e) {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = (e.pageY - top_len) + 'px';
    });
}

//Кнопка Move активная
function moveButtonActive(event) {
    drawButtonActivate = false;
    draw_button_click();
    eraseButtonActivate = false;
    erase_button_click();

    var custom_cursor = document.getElementById("custom-cursor");
    custom_cursor.innerHTML = event.target.innerHTML;

    if (active_now_button) {
        active_now_button.classList.remove('active_button');
    }
    var button = event.target;
    button.classList.add('active_button');
    active_now_button = button;
    moveButtonActivate = true;

    cursor_func();
    move_button_click();
}

//Кнопка Eraser активная
function eraserButtonActive(event) {

    drawButtonActivate = false;
    draw_button_click();
    moveButtonActivate = false;
    move_button_click();

    var custom_cursor = document.getElementById("custom-cursor");
    custom_cursor.innerHTML = event.target.innerHTML;

    if (active_now_button) {
        active_now_button.classList.remove('active_button');
    }
    var button = event.target;
    button.classList.add('active_button');
    active_now_button = button;
    eraseButtonActivate = true;
    cursor_func();
    erase_button_click();
}

//Кнопка Draw активная
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

//Добавление картинки
function newPictureObject(event) {
    eraseButtonActivate = false;
    erase_button_click();
    moveButtonActivate = false;
    move_button_click();
    drawButtonActivate = false;
    draw_button_click();

    var fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.addEventListener('change', handleFileSelect);
}

function handleFileSelect() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (event) {
            // Отправка данных на сервер через веб-сокеты с использованием socket.send
            socket.send(JSON.stringify({ type: 'image-upload', imageData: event.target.result }));
        };

        reader.readAsDataURL(file);
    } else {
        console.log('Выберите изображение для загрузки.');
    }
    // Удаляем обработчик события change после выбора файла
    fileInput.removeEventListener('change', handleFileSelect);
}

//Изменить фон только у себя
function setBackground_non_websocket(style) {
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

//Изменить фон у всех пользователей в комнате
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
    var data = {
        type: 'background_set',
        background_style: style,
    };
    socket.send(JSON.stringify(data));
}

//Открыли окно фонов
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

//При нажатии вне активного окна, оно сварачивается
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

//Разлинеивание фона
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