
var isButtonResizeDown = false;
var startResizeX, startResizeY, scrollLeftResize, scrollTopResize;
var currentDivId = null;

var currentButtonRotateDivId = null;

function hoverBlock(divId) {
    var element = document.getElementById(divId);
    element.style.boxShadow = "0px 0px 0px 5px rgb(134, 188, 250)";
    element.style.opacity = "1";
}

function unhoverBlock(divId) {
    var element = document.getElementById(divId);
    element.style.boxShadow = "0px 0px 0px 0px rgb(0, 0, 0)";
    element.style.opacity = "0";
}

var Xstart;
var Ystart;

function buttonRotateDown(e, divId, buttonDivId) {
    e.stopPropagation();
    startAngle = null;
    Xstart = e.clientX;
    Ystart = e.clientY;

    currentDivId = divId;
    currentButtonRotateDivId = buttonDivId;
    isButtonResizeDown = true;
    container.style.cursor = "none";
    container.removeEventListener("mousedown", startMove);
    container.removeEventListener("mousemove", move);
    container.removeEventListener("mouseup", stopMove);

    container.addEventListener("mousemove", buttonRotateMove);
    container.addEventListener("mouseup", buttonRotateUp);
}

var startAngle = null;
var rotateAngle = 0;

function buttonRotateMove(e) {
    e.stopPropagation();
    container.style.cursor = "nesw-resize";
    if (isButtonResizeDown) {
        var element = document.getElementById(currentDivId);

        // Получаем текущие трансформации
        var styles = window.getComputedStyle(element);
        var matrix = new DOMMatrix(styles.getPropertyValue('transform'));

        var rect_element = document.getElementById("canvas-block-wrapper");
        // Получаем координаты центра элемента
        var rect = element.getBoundingClientRect();
        var centerX = rect.x + element.offsetWidth / 2;
        var centerY = rect.y + element.offsetHeight / 2;
        //var centerX = matrix.m41 + element.offsetWidth / 2;
        //var centerY = matrix.m42 + element.offsetHeight / 2;

        // Получаем угол между текущим положением курсора и центром элемента
        var angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        if (startAngle == null) {
            startAngle = angle;
            rotateAngle = Math.atan2(matrix.b, matrix.a);
        }

        angle = rotateAngle + (angle - startAngle);

        // Применяем вращение
        element.style.transform = 'translate(' + matrix.m41 + 'px, ' + matrix.m42 + 'px) rotate(' + angle + 'rad)';
    }
}
function buttonRotateUp(e) {
    e.stopPropagation();
    startAngle = null;
    isMouseDown2 = false;
    container.removeEventListener("mousemove", buttonRotateMove);
    container.removeEventListener("mouseup", buttonRotateUp);

    container.style.cursor = "grab";
    isMouseDown = false;
    container.addEventListener("mousedown", startMove);
    container.addEventListener("mousemove", move);
    container.addEventListener("mouseup", stopMove);

    var element = document.getElementById(currentDivId);
    var styles = window.getComputedStyle(element);
    var matrix = new DOMMatrix(styles.getPropertyValue('transform'));

    // Получаем угол поворота в радианах
    var rotateAngle = Math.atan2(matrix.b, matrix.a);

    // Преобразуем угол в градусы
    var rotateAngleDegrees = (rotateAngle * 180) / Math.PI;

    if (parseBeforeId(currentDivId) === "picture_block") {
        var element = document.getElementById(currentDivId);

        var data = {
            type: 'picture_rotate_change',
            id: parseAndConvertId(currentDivId),
            rotate: rotateAngleDegrees
        };
        socket.send(JSON.stringify(data));
    }
}

function buttonResizeDown(e, divId, isProportions) {
    e.stopPropagation();
    currentDivId = divId;
    isButtonResizeDown = true;
    container.style.cursor = "none";
    container.removeEventListener("mousedown", startMove);
    container.removeEventListener("mousemove", move);
    container.removeEventListener("mouseup", stopMove);

    if (isProportions) {
        container.addEventListener("mousemove", buttonResizeProportionsMove);
    }
    else {
        container.addEventListener("mousemove", buttonResizeNoProportionsMove);
    }

    container.addEventListener("mouseup", buttonResizeUp);
}

function buttonResizeNoProportionsMove(e) {
    e.stopPropagation();
    if (isButtonResizeDown) {
        var element = document.getElementById(currentDivId);

        var newWidth = e.clientX - element.getBoundingClientRect().x;
        var newHeight = e.clientY - element.getBoundingClientRect().y;

        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';

    }
}

function buttonResizeProportionsMove(e) {
    e.stopPropagation();
    if (isButtonResizeDown) {
        var rect = editor_canvas.getBoundingClientRect();

        var element = document.getElementById(currentDivId);

        var originalWidth = element.offsetWidth;
        var originalHeight = element.offsetHeight;

        var rectElement = document.getElementById("canvas-block-wrapper");
        var newWidth = e.clientX - element.getBoundingClientRect().x;

        // Рассчитываем коэффициент пропорций
        var aspectRatio = originalWidth / originalHeight;

        // Рассчитываем новую высоту на основе изменения ширины с учетом пропорций
        var newHeight = newWidth / aspectRatio;

        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';

    }
}
function buttonResizeUp(e) {
    e.stopPropagation();
    isMouseDown2 = false;
    container.removeEventListener("mousemove", buttonResizeNoProportionsMove);
    container.removeEventListener("mousemove", buttonResizeProportionsMove);
    container.removeEventListener("mouseup", buttonResizeUp);

    container.style.cursor = "grab";
    isMouseDown = false;
    container.addEventListener("mousedown", startMove);
    container.addEventListener("mousemove", move);
    container.addEventListener("mouseup", stopMove);

    var element = document.getElementById(currentDivId);
    if (parseBeforeId(currentDivId) === "picture_block") {
        var element = document.getElementById(currentDivId);

        var data = {
            type: 'picture_size_change',
            id: parseAndConvertId(currentDivId),
            width: parseInt(element.style.width),
            height: parseInt(element.style.height)
        };
        socket.send(JSON.stringify(data));
    }
}

var isButtonElementMoveDown = false;

function buttonElementMoveDown(e, divId) {
    e.stopPropagation();
    var element = document.getElementById(divId);
    container.style.cursor = "grabbing";
    var rectElement = document.getElementById("canvas-block-wrapper");
    startX = e.clientX + rectElement.getBoundingClientRect().left;
    startY = e.clientY + rectElement.getBoundingClientRect().top;
    scrollLeft = startX - element.getBoundingClientRect().left - rectElement.getBoundingClientRect().left;
    scrollTop = startY - element.getBoundingClientRect().top - rectElement.getBoundingClientRect().top;
    isButtonElementMoveDown = true;
    container.addEventListener("mousemove", buttonElementMoveMove);
    container.addEventListener("mouseup", buttonElementMoveUp);
    currentDivId = divId;
}

function buttonElementMoveMove(e) {
    e.stopPropagation();
    var element = document.getElementById(currentDivId);
    var styles = window.getComputedStyle(element);
    var matrix = new DOMMatrix(styles.getPropertyValue('transform'));

    // Получаем угол поворота в радианах
    var rotateAngle = Math.atan2(matrix.b, matrix.a);

    // Преобразуем угол в градусы
    var rotateAngleDegrees = (rotateAngle * 180) / Math.PI;

    var rectElement = document.getElementById("canvas-block-wrapper");

    // Рассчитываем новое положение элемента
    var offsetX = e.clientX - rectElement.getBoundingClientRect().left - scrollLeft;
    var offsetY = e.clientY - rectElement.getBoundingClientRect().top - scrollTop;

    // Устанавливаем новое положение и поворот элемента
    element.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotateAngleDegrees}deg)`;
}

function parseAndConvertId(id) {
    // Используем регулярное выражение для извлечения числа y
    const match = id.match(/\d+$/);

    if (match) {
        // Извлекаем число и преобразуем его в целое число
        const yValue = parseInt(match[0], 10);

        // Возвращаем целое число
        return yValue;
    } else {
        // Возвращаем null или другое значение по умолчанию, если не удалось извлечь число
        return null;
    }
}

function parseBeforeId(id) {
    const match = id.match(/^([^-]+)-\d+/);

    if (match) {
        // Извлекаем все символы до числа y
        const result = match[1];

        // Возвращаем результат
        return result;
    } else {
        // Возвращаем null или другое значение по умолчанию, если не удалось извлечь
        return null;
    }
}

function buttonElementMoveUp(e) {
    var element = document.getElementById(currentDivId);
    container.removeEventListener("mousemove", buttonElementMoveMove);
    container.removeEventListener("mouseup", buttonElementMoveUp);
    if (parseBeforeId(currentDivId) === "picture_block") {
        var element = document.getElementById(currentDivId);

        // Получаем текущие трансформации
        var styles = window.getComputedStyle(element);
        var matrix = new DOMMatrix(styles.getPropertyValue('transform'));

        var data = {
            type: 'picture_position_change',
            id: parseAndConvertId(currentDivId),
            x_position: matrix.m41,
            y_position: matrix.m42
        };
        socket.send(JSON.stringify(data));
    }
}