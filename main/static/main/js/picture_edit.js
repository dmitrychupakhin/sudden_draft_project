

function hoverBlock(id) {
    var element = document.getElementById(`buttons-${id}`);
    var buttons = document.getElementById(`buttons-${id}`);
    element.style.boxShadow = "0px 0px 0px 5px rgb(134, 188, 250)";
    buttons.style.opacity = "1";
}

function unhoverBlock(id) {
    var element = document.getElementById(`buttons-${id}`);
    var buttons = document.getElementById(`buttons-${id}`);
    element.style.boxShadow = "0px 0px 0px 0px rgb(0, 0, 0)";
    buttons.style.opacity = "0";
}

var isButtonDown2 = false;
var startX1, startY1, scrollLeft1, scrollTop1;
var currentId;
function buttonResizeDown(id, e) {
    currentId = id;
    isButtonDown2 = true;
    container.style.cursor = "none";
    container.removeEventListener("mousedown", startMove);
    container.removeEventListener("mousemove", move);
    container.removeEventListener("mouseup", stopMove);

    container.addEventListener("mousemove", buttonResizeMove);
    container.addEventListener("mouseup", buttonResizeUp);
}
function buttonResizeMove(e) {
    if (isButtonDown2) {
        var rect = editor_canvas.getBoundingClientRect();

        var element = document.getElementById(`picture_block-${currentId}`);

        console.log(element.offsetWidth);
        console.log(element.offsetHeight);

        var originalWidth = element.offsetWidth;
        var originalHeight = element.offsetHeight;

        var newWidth = e.clientX - x[currentId - 1] - rect.left;

        // Рассчитываем коэффициент пропорций
        var aspectRatio = originalWidth / originalHeight;

        // Рассчитываем новую высоту на основе изменения ширины с учетом пропорций
        var newHeight = newWidth / aspectRatio;

        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';

        var canvasElement = document.getElementById(`canvas-${currentId}`);
        canvasElement.style.width = newWidth + 'px';
        canvasElement.style.height = newHeight + 'px';

        var buttonsElement = document.getElementById(`buttons-${currentId}`);
        buttonsElement.style.width = newWidth + 'px';
        buttonsElement.style.height = newHeight + 'px';
    }
}
function buttonResizeUp() {
    isMouseDown2 = false;
    container.removeEventListener("mousemove", buttonResizeMove);
    container.removeEventListener("mouseup", buttonResizeUp);

    container.style.cursor = "grab";
    isMouseDown = false;
    container.addEventListener("mousedown", startMove);
    container.addEventListener("mousemove", move);
    container.addEventListener("mouseup", stopMove);
}