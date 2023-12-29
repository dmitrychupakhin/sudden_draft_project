var moveButtonActivate = true;
var isMouseDown = false;
var startX, startY, scrollLeft, scrollTop;
var container = document.querySelector('.canvas-block');
var content = document.getElementById("editor-canvas");

var isPictureMove = null;

//Алгоритм перемещения поля
function move_button_click() {
    if (moveButtonActivate) {
        editor_canvas.style = "pointer-events: none;";
        container.style.cursor = "grab";
        container.addEventListener("mousedown", startMove);
        container.addEventListener("mousemove", move);
        container.addEventListener("mouseup", stopMove);
    } else {
        editor_canvas.style = "pointer-events: auto;";
        container.style.cursor = "auto";
        container.removeEventListener("mousedown", startMove);
        container.removeEventListener("mousemove", move);
        container.removeEventListener("mouseup", stopMove);
    }
}

function startMove(e) {
    var rect = editor_canvas.getBoundingClientRect();
    isPictureMove = isClickInPicture(e.clientX - rect.left, e.clientY - rect.top);
    if (isPictureMove != null) {
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        scrollLeft = startX - x[isPictureMove];
        scrollTop = startY - y[isPictureMove];
    }
    else {
        container.style.cursor = "grabbing";
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
    }
    isMouseDown = true;
}

function move(e) {
    if (isMouseDown) {
        if (isPictureMove != null) {

            var rect = editor_canvas.getBoundingClientRect();
            x[isPictureMove] = e.clientX - rect.left - scrollLeft;
            y[isPictureMove] = e.clientY - rect.top - scrollTop;

            draw_picture(isPictureMove);
        }
        else {
            // Вычисляем новы е значения положения блока контента
            var newScrollLeft = scrollLeft - (e.clientX - startX);
            var newScrollTop = scrollTop - (e.clientY - startY);

            // Присваиваем новые значения
            container.scrollLeft = newScrollLeft;
            container.scrollTop = newScrollTop;
        }
    }
}

function stopMove() {
    if (isPictureMove != null) {
        var data = {
            type: 'picture_pisition_change',
            id: id[isPictureMove],
            x_position: x[isPictureMove],
            y_position: y[isPictureMove]
        };
        socket.send(JSON.stringify(data));
    }
    container.style.cursor = "grab";
    isMouseDown = false;
}