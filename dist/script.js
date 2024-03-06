document.addEventListener("DOMContentLoaded", function () {
  const selectTheme = document.getElementById("selectTheme");
  const themes = document.getElementById("themes");
  const selected = document.getElementById("selected");

  const logoImg = document.querySelector(".logo-image");
  const footerLogoImg = document.querySelector("#footer-logo-image");
  const highlight = document.querySelector(".highlight");
  const parade = document.querySelector(".parade");


  selectTheme.addEventListener("click", function (event) {
    event.stopPropagation();
    themes.classList.toggle("hidden");
  });

  if (selectTheme) {
    document.addEventListener("click", function (event) {
      if (
        !selectTheme.contains(event.target) &&
        !themes.contains(event.target)
      ) {
        themes.classList.add("hidden");
      }
    });
  }

  const light = document.getElementById("light");
  const dark = document.getElementById("dark");
  const system = document.getElementById("system");

  light.addEventListener("click", function () {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    logoImg.src = "../public/info.png";
    footerLogoImg.src = "../public/info.png";
    highlight.src = "../public/topPeekI.avif";
    parade.src = "../public/parade.png";
    localStorage.setItem("theme", "light");
    themes.classList.add("hidden");
    themes.classList.remove("flex");
    selected.innerHTML = `<i class="bx bx-sun"></i>`;
  });

  dark.addEventListener("click", function () {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    logoImg.src = "../public/info-darkmain.png";
    footerLogoImg.src = "../public/info-darkmain.png";
    highlight.src = "../public/top-dark.png";
    parade.src = "../public/parade-dark.png";
    localStorage.setItem("theme", "dark");
    themes.classList.add("hidden");
    themes.classList.remove("flex");
    selected.innerHTML = `<i class="bx bx-moon"></i>`;
  });

  system.addEventListener("click", function () {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.remove("dark");
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      selected.innerHTML = `<i class="bx bx-moon"></i>`;
      logoImg.src = "../public/info-darkmain.png";
      footerLogoImg.src = "../public/info-darkmain.png";
      highlight.src = "../public/top-dark.png";
      parade.src = "../public/parade-dark.png";
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      selected.innerHTML = `<i class="bx bx-sun"></i>`;
      logoImg.src = "../public/info.png";
      footerLogoImg.src = "../public/info.png";
      highlight.src = "../public/topPeekI.avif";
      parade.src = "../public/parade.png";
    }
    themes.classList.add("hidden");
    themes.classList.remove("flex");
  });

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    selected.innerHTML = `<i class="bx bx-moon"></i>`;
    logoImg.src = "../public/info-darkmain.png";
    footerLogoImg.src = "../public/info-darkmain.png";
    highlight.src = "../public/top-dark.png";
    parade.src = "../public/parade-dark.png";
  } else if (theme === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    selected.innerHTML = `<i class="bx bx-sun"></i>`;
    logoImg.src = "../public/info.png";
    footerLogoImg.src = "../public/info.png";
    highlight.src = "../public/topPeekI.avif";
    parade.src = "../public/parade.png";
  }
});

// ........................

document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".navbar");
  var lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY;

    // Check if the user is scrolling down
    if (scrollTop > lastScrollTop) {
      header.classList.add("shadow");
      header.classList.add("shadow-b");
      // header.classList.add("border-grey-200");
    } else {
      // Check if the user has scrolled back to the top
      if (scrollTop === 0) {
        header.classList.remove("shadow");
        header.classList.remove("shadow-b");
        // header.classList.remove("border-bottom");
      }
    }

    lastScrollTop = scrollTop;
  });
});


document.getElementById("featuresBtn").addEventListener("click", function() {
  // Get the target div
  var targetDiv = document.querySelector(".features-container-viewer");

  // Scroll to the target div
targetDiv.scrollIntoView({
    behavior: 'smooth' // Smooth scrolling behavior
  });
});
