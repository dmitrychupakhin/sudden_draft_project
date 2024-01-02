
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

function buttonRotateMove(e) {
    e.stopPropagation();
    container.style.cursor = "nesw-resize";
    if (isButtonResizeDown) {
        var element = document.getElementById(currentDivId);

        // Получаем текущие трансформации
        var styles = window.getComputedStyle(element);
        var matrix = new DOMMatrix(styles.getPropertyValue('transform'));

        // Получаем координаты центра элемента
        var centerX = matrix.m41 + element.offsetWidth / 2 + 100;
        var centerY = matrix.m42 + element.offsetHeight / 2 + 100;

        // Получаем угол между текущим положением курсора и центром элемента
        var angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        if (startAngle == null) {
            startAngle = angle;
        }

        angle = angle - startAngle;

        console.log(angle);
        console.log(startAngle);
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
}

function buttonResizeDown(e, divId) {
    e.stopPropagation();
    currentDivId = divId;
    isButtonResizeDown = true;
    container.style.cursor = "none";
    container.removeEventListener("mousedown", startMove);
    container.removeEventListener("mousemove", move);
    container.removeEventListener("mouseup", stopMove);

    container.addEventListener("mousemove", buttonResizeMove);
    container.addEventListener("mouseup", buttonResizeUp);
}

function buttonResizeMove(e) {
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
    container.removeEventListener("mousemove", buttonResizeMove);
    container.removeEventListener("mouseup", buttonResizeUp);

    container.style.cursor = "grab";
    isMouseDown = false;
    container.addEventListener("mousedown", startMove);
    container.addEventListener("mousemove", move);
    container.addEventListener("mouseup", stopMove);
}

var isButtonElementMoveDown = false;

function buttonElementMoveDown(e, divId) {
    e.stopPropagation();
    var element = document.getElementById(divId);
    container.style.cursor = "grabbing";
    var rectElement = document.getElementById("canvas-block-wrapper");
    startX = e.clientX + rectElement.getBoundingClientRect().left;
    startY = e.clientY + rectElement.getBoundingClientRect().top;
    console.log(element.getBoundingClientRect());
    console.log(rectElement.getBoundingClientRect());
    scrollLeft = startX - element.getBoundingClientRect().left - rectElement.getBoundingClientRect().left;
    scrollTop = startY - element.getBoundingClientRect().top - rectElement.getBoundingClientRect().top;
    isButtonElementMoveDown = true;
    container.addEventListener("mousemove", buttonElementMoveMove);
    currentDivId = divId;
}

function buttonElementMoveMove(e) {
    e.stopPropagation();
    var element = document.getElementById(currentDivId);
    var rectElement = document.getElementById("canvas-block-wrapper");
    element.style.transform = `translate(${e.clientX - rectElement.getBoundingClientRect().left - scrollLeft}px, ${e.clientY - rectElement.getBoundingClientRect().top - scrollTop}px)`;
}

function buttonElementMoveUp(e, divId) {
    var element = document.getElementById(divId);
    container.removeEventListener("mousemove", buttonElementMoveMove);
    /*
    if (isButtonElementMoveDown) {
        var data = {
            type: 'picture_pisition_change',
            id: id[isPictureMove],
            x_position: x[isPictureMove],
            y_position: y[isPictureMove]
        };
        socket.send(JSON.stringify(data));
    }
    */
}