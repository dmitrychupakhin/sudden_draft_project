var moveButtonActivate = true;
var isMouseDown = false;
var startX, startY, scrollLeft, scrollTop;
var container = document.querySelector('.canvas-block');
var content = document.getElementById("editor-canvas");

function move_button_click() {
    if (moveButtonActivate) {
        container.style.cursor = "grab";
        container.addEventListener("mousedown", startMove);
        container.addEventListener("mousemove", move);
        container.addEventListener("mouseup", stopMove);
    } else {
        container.style.cursor = "auto";
        container.removeEventListener("mousedown", startMove);
        container.removeEventListener("mousemove", move);
        container.removeEventListener("mouseup", stopMove);
    }
}

function startMove(e) {
    container.style.cursor = "grabbing";
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
}

function move(e) {
    if (isMouseDown) {
        // Вычисляем новые значения положения блока контента
        var newScrollLeft = scrollLeft - (e.clientX - startX);
        var newScrollTop = scrollTop - (e.clientY - startY);

        // Присваиваем новые значения
        container.scrollLeft = newScrollLeft;
        container.scrollTop = newScrollTop;
    }
}

function stopMove() {
    container.style.cursor = "grab";
    isMouseDown = false;
}