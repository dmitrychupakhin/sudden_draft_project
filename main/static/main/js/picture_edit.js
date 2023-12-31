

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

function picture_edit(div) {

}