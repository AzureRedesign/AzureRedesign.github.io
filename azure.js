// jshint esversion: 6
let searchVisible = false;

$(document).ready(function() {
    $(".subWindow").mouseenter(hoverOverSubWindow);
    $("#searchIcon").on('click', openCloseSearch);
    $("#searchBar").hide();
    $(window).on('click', openCloseSearch)
});

function openCloseSearch(evt) {
    // !!!!!!!!!!!!!!!!!
    // If you need events to bubble, make sure their ids get added to this array
    // !!!!!!!!!!!!!!!!!
    if (!(evt.target.id in ["switchx", "switch-small"])) {
        evt.preventDefault();
        evt.bubbles = false;
        evt.stopPropagation();
    }
    if (searchVisible && !evt.target.className.includes('search-bar')) {
        // hide search
        $("#searchIcon").show()
        $("#searchBar").hide()
        searchVisible = false;
    } else if (evt.currentTarget.id === 'searchIcon') {
        $("#searchIcon").hide()
        $("#searchBar").show()
        searchVisible = true
    }
}

function hoverOverSubWindow(evt) {
    let h = evt.target.clientHeight;
    let w = evt.target.clientWidth;
    let t = evt.target.offsetTop;
    let l = evt.target.offsetLeft;
    let id = evt.target.id;
    if (!(id.substr(id.length - 2) in ["-t", "-w", "-c", "-x"])) {
        $(".subWindow").each(index => {
            // get out of each other subwindow that's not a match, sometimes this gets missed
            if (this.id !== id && $(this.id + "-w").length !== 0) {
                $(this.id + "-w").trigger("mouseout");
            }
        });
        let clone = $(`#${id}`).clone();
        clone.attr("id", `${id}-c`);
        clone.css("z-index", 100);
        $(`#${id}`).after(clone);
        $(`#${id}-c`).removeClass("subWindow");
        $(`#${id}-c`).addClass("subWindowInWrapper");
        $(`#${id}-c`).wrap(`<div id="${id}-w" class="subWindowWraper"></div>`);
        $(`#${id}-w`).unbind();
        $(`#${id}-w`).mouseleave(hoverOutSubWindow);
        // empty div to take spot so other things don't shift around
        $(`#${id}-c`).before(`<div id="${id}-t" class="titleBar"></div>`);
        $(`#${id}-t`).append(
            `<div id="${id}-x" class="xRemove"><img src="close.png" /></div>`
        );
        $(`#${id}-x`).unbind();
        // $(`#${id}-x`).mouseleave(hoverOutSubWindow);
        $(`#${id}-w`).height(parseFloat(h) + 30);
        $(`#${id}-w`).offset({
            top: parseFloat(t) - 30,
            left: l
        });
        $(`#${id}-x`).on("click", removeSubWindow);
        $(`#${id}`).unbind();
        $(`#${id}-c`).unbind();
        $(`#${id}-t`).unbind();
    }
}

function removeSubWindow(evt) {
    let id = evt.currentTarget.id;
    if (
        id.substr(id.length - 2) === "-t" ||
        id.substr(id.length - 2) === "-w" ||
        id.substr(id.length - 2) === "-c" ||
        id.substr(id.length - 2) === "-x"
    ) {
        id = id.substr(0, id.length - 2); // root object
    }
    $(`#${id}-w`).trigger("mouseout");
    $(`#${id}-x`).remove();
    $(`#${id}`).remove();
}

function hoverOutSubWindow(evt) {
    let id = evt.target.id;
    // remove element before and unwrap and reallow mouseenter!
    if (
        id.substr(id.length - 2) === "-t" ||
        id.substr(id.length - 2) === "-w" ||
        id.substr(id.length - 2) === "-c" ||
        id.substr(id.length - 2) === "-x"
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