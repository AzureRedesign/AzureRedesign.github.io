// 'esversion: 6'
$(document).ready(function() {
  console.log("ready");
  $(".subWindow").mouseenter(hoverOverSubWindow);
});

function hoverOverSubWindow(evt) {
  let h = evt.target.clientHeight;
  let w = evt.target.clientWidth;
  let id = evt.target.id;
  $("#" + id).wrap(
    '<div id="' +
      id +
      "w" +
      '" class="wrapperSubWindow" style="width:' +
      parseFloat(w) +
      "; height:" +
      (parseFloat(h) + 75) +
      ';"></div>'
  );
  $("#" + id + "w").width(parseFloat(w));
  $("#" + id + "w").height(parseFloat(h));
  $("#" + id).unbind();
  $("#" + id + "w").mouseleave(hoverOutSubWindow);
  $("#" + id + "t").mouseleave(hoverOutSubWindow);
  $("#" + id).before(
    '<div id="' +
      id +
      "t" +
      '" class="titleBar"><div class="xRemove">X</div></div>'
  );
}

function hoverOutSubWindow(evt) {
  let id = evt.target.id;
  // remove element before and unwrap and reallow mouseenter!
  if (id.substr(id.length - 1) === "t" || id.substr(id.length - 1) === "w") {
    id = id.substr(0, id.length - 1);
  }
  if (id === "") {
    return;
  }
  $("#" + id).unwrap();
  $("#" + id + "t").remove();
  $("#" + id).unbind();
  $("#" + id).mouseenter(hoverOverSubWindow);
}
