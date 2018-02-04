// jshint esversion: 6
let hoverOver = [];
$(document).ready(function() {
    $(".subWindow").mouseenter(hoverOverSubWindow);
});

function hoverOverSubWindow(evt) {
    let h = evt.target.clientHeight;
    let w = evt.target.clientWidth;
    let t = evt.target.offsetTop;
    let l = evt.target.offsetLeft;
    let id = evt.target.id;
    if (
        $(`#${id}-c`).length === 0 &&
        !(id.substr(id.length - 2) in ["-t", "-w", "-c"])
    ) {
        let clone = $(`#${id}`).clone();
        clone.attr("id", `${id}-c`);
        clone.css("z-index", 100);
        $(`#${id}`).after(clone);
        $(`#${id}-c`).wrap(`<div id="${id}-w" class="subWindowWraper"></div>`);
        $(`#${id}-w`).unbind();
        $(`#${id}-w`).mouseleave(hoverOutSubWindow);
        // empty div to take spot so other things don't shift around
        $(`#${id}-c`).before(
            `<div id="${id}-t" class="titleBar"><div class="xRemove">X</div></div>`
        );
        $().width(parseFloat(w));
        $(`#${id}-w`).height(parseFloat(h) + 40);
        $(`#${id}-w`).offset({ top: parseFloat(t) - 40, left: l });
        $(`#${id}-c`).removeClass("subWindow");
        $(`#${id}-c`).addClass("subWindowInWrapper");
        $(`#${id}`).unbind();
        $(`#${id}-t`).unbind();
    }
}

function hoverOutSubWindow(evt) {
    let id = evt.target.id;
    // remove element before and unwrap and reallow mouseenter!
    if (
        id.substr(id.length - 2) === "-t" ||
        id.substr(id.length - 2) === "-w" ||
        id.substr(id.length - 2) === "-c"
    ) {
        id = id.substr(0, id.length - 2);
    }
    if (id === "") {
        return;
    }
    $(`#${id}-t`).remove();
    $(`#${id}-c`).remove();
    $(`#${id}-w`).remove();
    $("#" + id).unbind();
    $("#" + id).mouseenter(hoverOverSubWindow);
}