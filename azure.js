// jshint esversion: 6
let searchVisible = false;
let newbie = false;
let undoHistory = [];
let tiercost = 30;
let tierDTU = 20;
let tierStorage = 250;

$(document).ready(function() {
    $(".addsql").on("click", gotoSQL);
    $(".link").on("click", goToHref);
    $(".subWindow").mouseenter(hoverOverSubWindow);
    $("#searchIcon").on("click", openCloseSearch);
    $("#searchBar").hide();
    $(window).on("click", openCloseSearch); // THIS IS DANGEROUS! Make sure you read the exception below in !!!!s
    $("#switch-small").on("click", switched);
    $("#switch-small").trigger("click");
    $(".nav-link-brand").on("click", goToHref);
    $("#undo").on("click", undoChange);
    $('[data-toggle="tooltip"]').mouseenter(showTooltip);
    $(window).resize(resizeWindow);
    $("#selectpricingtier").on("click", pricingWindow);
    $("#pricingwindow").hide();
    $("#basics1").on("click", chooseTier);
    $("#standards2").on("click", chooseTier);
    $("#premium").on("click", chooseTier);
    $("#premiumrs").on("click", chooseTier);
    $("[name=choosetier]").on("click", chooseTier);
    $("#standards2").trigger("click");
});

function chooseTier(evt) {
    console.log(evt);
    if (evt.target.id == "basics1") {
        $("#tiername").html("Basic S1");
        $("#tiercontent").html("This tier costs:" + tiercost + " per month");
        $("#basics1").removeClass("btn-info");
        $("#basics1").addClass("btn-primary");
        $("#standards2").removeClass("btn-primary");
        $("#standards2").addClass("btn-info");
        $("#premium").removeClass("btn-primary");
        $("#premium").addClass("btn-info");
        $("#premiumrs").removeClass("btn-primary");
        $("#premiumrs").addClass("btn-info");
        tierDTU = 5;
        tierStorage = 2;
        $("#sliderDTU").slider({
            min: 5,
            max: 5,
            range: "min",
            value: tierDTU
        });
        $("#sliderStorage").slider({
            min: 0.1,
            max: 2,
            range: "min",
            value: tierStorage
        });
    } else if (evt.target.id == "standards2") {
        $("#tiername").html("Standard S0-1");
        $("#basics1").removeClass("btn-primary");
        $("#basics1").addClass("btn-info");
        $("#standards2").removeClass("btn-info");
        $("#standards2").addClass("btn-primary");
        $("#standards3").removeClass("btn-primary");
        $("#standards3").addClass("btn-info");
        $("#premium").removeClass("btn-primary");
        $("#premium").addClass("btn-info");
        $("#premiumrs").removeClass("btn-primary");
        $("#premiumrs").addClass("btn-info");
        $("#selectDTU").html(
            "<option value=10>10</option><option value=20 selected>20</option>"
        );
        $("#selectStorage").html(
            "<option value='0.1'>100MB</option><option value='0.5'>500MB</option><option value='1'>1GB</option><option value='2'>2GB</option><option value='5'>5GB</option><option value='10'>10GB</option><option value='20'>20</option><option value='30'>30</option><option value='40'>40</option><option value='50'>50</option><option value='100'>100</option><option value='150'>150</option><option value='200'>200</option><option value='250' selected>250</option>"
        );
        $("#tiercontent").html(
            "This tier costs: <em style='color: red; font-weight: bold;'>" +
            tiercost * 1.0 +
            "</em> per month<br> and has " +
            $("#selectDTU")[0].value +
            "DTUs and<br> " +
            $("#selectStorage")[0].value +
            "GB storage!"
        );
        baseRate = 15.0;
        let select = $("#selectDTU");
        $("#sliderDTU").unbind();
        let slider = $("#sliderDTU").slider({
            min: 1,
            max: 2,
            range: "min",
            value: select[0].selectedIndex + 1,
            slide: function(event, ui) {
                select[0].selectedIndex = ui.value - 1;
                tiercost = baseRate * (parseFloat(select[0].selectedIndex) + 1);
                $("#tiercontent").html(
                    "This tier costs: <em style='color: red; font-weight: bold;'>" +
                    tiercost * 1.0 +
                    "</em> per month<br> and has " +
                    $("#selectDTU")[0].value +
                    "DTUs and<br> " +
                    $("#selectStorage")[0].value +
                    "GB storage!"
                );
            }
        });
        $("#selectDTU").unbind();
        $("#selectDTU").bind("change", function() {
            slider.slider("value", this.selectedIndex + 1);
            $("#tiercontent").html(
                "This tier costs: <em style='color: red; font-weight: bold;'>" +
                tiercost * 1.0 +
                "</em> per month<br> and has " +
                $("#selectDTU")[0].value +
                "DTUs and<br> " +
                $("#selectStorage")[0].value +
                "GB storage!"
            );
            tiercost = baseRate * (parseFloat(select[0].selectedIndex) + 1);
        });
        select = $("#selectStorage");
        slider = $("#sliderStorage").slider({
            min: 1,
            max: 14,
            range: "min",
            value: select[0].selectedIndex + 1,
            slide: function(event, ui) {
                select[0].selectedIndex = ui.value - 1;
                $("#tiercontent").html(
                    "This tier costs: <em style='color: red; font-weight: bold;'>" +
                    tiercost * 1.0 +
                    "</em> per month<br> and has " +
                    $("#selectDTU")[0].value +
                    "DTUs and<br> " +
                    $("#selectStorage")[0].value +
                    "GB storage!"
                );
            }
        });
        $("#selectStorage").unbind();
        $("#selectStorage").bind("change", function() {
            $("#selectSlider").slider("value", this.selectedIndex + 1);
            $("#tiercontent").html(
                "This tier costs: <em style='color: red; font-weight: bold;'>" +
                tiercost * 1.0 +
                "</em> per month<br> and has " +
                $("#selectDTU")[0].value +
                "DTUs and<br> " +
                $("#selectStorage")[0].value +
                "GB storage!"
            );
        });
    }
}

function gotoSQL(evt) {
    console.log(window);
    evt.preventDefault();
    window.location = "./sql.html";
}

function pricingWindow(evt) {
    console.log("pricing");
    $("#pricingwindow").show();
    $("#selectpricingtier").tooltip("hide");
    $("#serviceWindows").scrollTop(0);
}

function resizeWindow(evt) {
    if ($(window).width() < 1000) {
        $("#userinfo").hide();
    } else {
        $("#userinfo").show();
    }
}

function undoChange(evt) {
    let lastid = undoHistory.pop();
    $(`#${lastid}`).show();
}

function showTooltip(evt) {
    if (newbie) {
        if (evt.target.id !== "") {
            $(`#${evt.target.id}`).tooltip("show");
        } else if (evt.currentTarget.id !== "") {
            $(`#${evt.currentTarget.id}`).tooltip("show");
        }
    } else {}
}

function hideToolTip(id) {
    console.log("hide");
}

function switched(evt) {
    newbie = !newbie;

    if (newbie) {
        console.log("newbie on");
        $('[data-toggle="tooltip"]').bind("mouseenter", showTooltip);
    } else {
        console.log("newbie off");
        $('[data-toggle="tooltip"]').unbind("mouseenter");
        $(".subWindow").mouseenter(hoverOverSubWindow);
    }
}

function goToHref(evt) {
    console.log(evt);
    let target = evt.currentTarget;
    window.location = target.getAttribute("href");
}

function openCloseSearch(evt) {
    // !!!!!!!!!!!!!!!!!
    // If you need events to bubble, make sure their ids get added to this array
    // That means you need to get a click or something past this function without it being stopped
    // !!!!!!!!!!!!!!!!!
    if (!["switchx", "switch-small", "searchBarInput", "dashboard"].includes(
            evt.target.id
        ) &&
        evt.target.id !== "addsql"
    ) {
        evt.preventDefault();
        evt.bubbles = false;
        evt.stopPropagation();
    }
    if (searchVisible && !evt.target.className.includes("search-bar")) {
        // hide search
        $("#searchIcon").show();
        $("#searchBar").hide();
        searchVisible = false;
    } else if (evt.currentTarget.id === "searchIcon") {
        $("#searchIcon").hide();
        $("#searchBar").show();
        searchVisible = true;
    }
}

function hoverOverSubWindow(evt) {
    let h = evt.target.clientHeight;
    let w = evt.target.clientWidth;
    let t = evt.target.offsetTop;
    let l = evt.target.offsetLeft;
    let td = $(".dashboard").offset().top;
    t += td;
    let ld = $(".dashboard").offset().left;
    l += ld;
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
        if (id == "z2") {
            $(".addsql").on("click", gotoSQL);
        }
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
    $(`#${id}`).hide();
    undoHistory.push(id);
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
    $(`#${id}`).unbind();
    setTimeout(function() {
        $(`#${id}`).mouseenter(showTooltip);
        $(`#${id}`).tooltip("hide");
        $(`#${id}`).mouseenter(hoverOverSubWindow);
    }, 400);
}