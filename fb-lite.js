(function () {
  function activate(el) {
    if (el.dataset.activated === "1") return;
    el.dataset.activated = "1";
    var href = el.getAttribute("data-href");
    if (!href) return;
    var enc = encodeURIComponent(href);
    var iframe = document.createElement("iframe");
    iframe.src =
      "https://www.facebook.com/plugins/video.php?href=" +
      enc +
      "&show_text=false&width=267&height=476&autoplay=true&mute=0&t=0";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute(
      "allow",
      "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    );
    el.innerHTML = "";
    el.appendChild(iframe);
  }

  function init(el) {
    if (el.dataset.ready === "1") return;
    el.dataset.ready = "1";

    var poster = el.getAttribute("data-poster");
    var label = el.getAttribute("data-label") || "▶ Play video";

    var html = "";
    if (poster) {
      html +=
        '<img class="fb-lite__poster" loading="lazy" decoding="async" alt="" src="' +
        poster +
        '">';
      el.setAttribute("data-has-poster", "1");
    }
    html +=
      '<span class="fb-lite__gradient"></span>' +
      '<span class="fb-lite__play" aria-hidden="true"></span>' +
      '<span class="fb-lite__label">' +
      label +
      "</span>";
    el.innerHTML = html;

    if (!el.getAttribute("role")) el.setAttribute("role", "button");
    if (!el.getAttribute("tabindex")) el.setAttribute("tabindex", "0");
    if (!el.getAttribute("aria-label"))
      el.setAttribute("aria-label", "Play Facebook video");

    el.addEventListener("click", function () {
      activate(el);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(el);
      }
    });
  }

  function boot() {
    var nodes = document.querySelectorAll(".fb-lite");
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
