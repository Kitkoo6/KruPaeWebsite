(function () {
  var LOAD_TIMEOUT_MS = 5000;

  function buildIframe(href) {
    var enc = encodeURIComponent(href);
    var iframe = document.createElement("iframe");
    iframe.className = "fb-lite__frame";
    iframe.src =
      "https://www.facebook.com/plugins/video.php?href=" +
      enc +
      "&show_text=false&width=267&height=476&t=0";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute(
      "allow",
      "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    );
    return iframe;
  }

  function activateAutoplay(el) {
    var iframe = el.querySelector("iframe.fb-lite__frame");
    if (!iframe) return;
    var src = iframe.src;
    if (src.indexOf("autoplay=true") === -1) {
      iframe.src = src + "&autoplay=true";
    }
  }

  function init(el) {
    if (el.dataset.ready === "1") return;
    el.dataset.ready = "1";

    var href = el.getAttribute("data-href");
    if (!href) return;

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

    var iframe = buildIframe(href);
    var loaded = false;
    var timer = setTimeout(function () {
      if (!loaded) el.classList.add("fb-lite--stalled");
    }, LOAD_TIMEOUT_MS);

    iframe.addEventListener("load", function () {
      loaded = true;
      clearTimeout(timer);
      el.classList.add("fb-lite--loaded");
    });

    el.appendChild(iframe);

    // Click on the fallback (visible only when stalled or before iframe load) triggers autoplay
    el.addEventListener("click", function () {
      if (el.classList.contains("fb-lite--loaded")) return;
      activateAutoplay(el);
      el.classList.add("fb-lite--loaded");
    });
    el.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && !el.classList.contains("fb-lite--loaded")) {
        e.preventDefault();
        activateAutoplay(el);
        el.classList.add("fb-lite--loaded");
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
