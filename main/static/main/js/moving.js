var moveButtonActivate = true;
var isMouseDown = false;
var startX, startY, scrollLeft, scrollTop;
var container = document.getElementById('canvas-block');

var containerRect = container.getBoundingClientRect();

//Алгоритм перемещения поля
function loadMove() {
    if (moveButtonActivate) {
        editor_canvas.style = "pointer-events: none;";
        container.style.cursor = "grab";
        container.addEventListener("mousedown", startMove);
        container.addEventListener("mousemove", move);
        container.addEventListener("mouseup", stopMove);
    } else {
        editor_canvas.style = "pointer-events: auto;";
        container.style.cursor = "none";
        container.removeEventListener("mousedown", startMove);
        container.removeEventListener("mousemove", move);
        container.removeEventListener("mouseup", stopMove);

    }
}

function startMove(e) {
    container.style.cursor = "grabbing";
    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
    isMouseDown = true;
}

function move(e) {
    if (isMouseDown) {

        // Вычисляем новы е значения положения блока контента
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