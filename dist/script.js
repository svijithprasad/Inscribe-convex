document.addEventListener("DOMContentLoaded", function () {
  var selectTheme = document.getElementById("selectTheme");
  var themeList = document.getElementById("themeList");

  // Toggle visibility of theme list on selectTheme click
  selectTheme.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click event from propagating to the document body
    themeList.classList.toggle("themes-open");
  });

  // Handle theme selection
  themeList.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click event from propagating to the document body

    if (event.target.tagName === "LI") {
      // Remove "active" class from all themes
      var themes = themeList.getElementsByTagName("li");
      for (var i = 0; i < themes.length; i++) {
        themes[i].classList.remove("active");
      }

      // Set "active" class to the clicked theme
      event.target.classList.add("active");
      var selectedTheme = event.target.innerText.toLowerCase();
      var selected = document.getElementById("selected");
      selected.innerHTML =
        '<i class="bx bx-' + getIconName(selectedTheme) + '"></i>';
      // Hide the theme list
      themeList.classList.remove("themes-open");
    }
  });

  // Close theme list when clicking outside
  document.addEventListener("click", function (event) {
    if (!themeList.contains(event.target) && event.target !== selectTheme) {
      // Clicked outside the theme list or selectTheme, close it
      themeList.classList.remove("themes-open");
    }
  });
  // Function to map theme names to icon names

  function getIconName(theme) {
    header = document.getElementById("mainHeader");
    logoImg = document.getElementById("logo-image");
    containerImg = document.getElementById("container-img");
    footerlogoImg = document.getElementById("footerlogo-image");
    highlighters = document.getElementById("highlighters");
    button = document.getElementsByClassName(".button");
    classylightBtn = document.getElementsByClassName(".classy-lightBtn");
    if (theme === "system") {
      // Detect user's preferred color scheme
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.body.style.color = "white";
        document.body.style.background = "#1F1F1F";
        header.style.background = "#1f1f1f";
        header.style.color = "white";
        containerImg.innerHTML =
          '<img src="./images/parade-dark.png" width="600px" alt="documents">';
        logoImg.innerHTML =
          '<img src="images/info-darkmain.png" class="logo-image"  alt="logo"> Inscribe';
        footerlogoImg.innerHTML =
          '<img src="images/info-darkmain.png" class="logo-image"  alt="logo"><span class="footer-dark-logo">Inscribe</span>';
        highlighters.innerHTML =
          '<img src="images/top-dark.png" width="150px" alt="Looking Down">';
        botton.classList.remove = "button";
        button.classList.add = "button-dark";
        classylightBtn.classList.add = 'dark';
        return "moon";
      } else {
        // Reset styles for light theme
        document.body.style.color = ""; // Reset to default color
        document.body.style.background = ""; // Reset to default background
        header.style.background = "white";
        header.style.color = "Black";
        containerImg.innerHTML =
          '<img src="./images/parade.png" width="600px" alt="documents">';
        logoImg.innerHTML =
          '<img src="images/info.png" class="logo-image"  alt="logo"> Inscribe';
        footerlogoImg.innerHTML =
          '<img src="images/info.png" class="logo-image"  alt="logo"><span class="footer-logo">Inscribe</span>';
        highlighters.innerHTML =
          '<img src="images/topPeekI.avif" width="150px" alt="Looking Down">';
        return "sun"; // Light theme
      }
    } else if (theme === "dark") {
      // Apply styles for dark theme
      document.body.style.color = "white";
      document.body.style.background = "#1F1F1F";
      header.style.background = "#1f1f1f";
      header.style.color = "white";
      containerImg.innerHTML =
        '<img src="./images/parade-dark.png" width="600px" alt="documents">';
      logoImg.innerHTML =
        '<img src="images/info-darkmain.png" class="logo-image"  alt="logo"> Inscribe';
      footerlogoImg.innerHTML =
        '<img src="images/info-darkmain.png" class="logo-image"  alt="logo"><span class="footer-dark-logo">Inscribe</span>';
      highlighters.innerHTML =
        '<img src="images/top-dark.png" width="150px" alt="Looking Down">';
        classylightBtn.classList.add = "dark";
      return "moon";
    } else {
      // For other themes, use predefined mappings
      switch (theme) {
        case "light":
          // Reset styles for light theme
          document.body.style.color = ""; // Reset to default color
          document.body.style.background = ""; // Reset to default background
          header.style.background = "white";
          header.style.color = "Black";
          containerImg.innerHTML =
            '<img src="./images/parade.png" width="600px" alt="documents">';
          logoImg.innerHTML =
            '<img src="images/info.png" class="logo-image" alt="logo"> Inscribe';
          footerlogoImg.innerHTML =
            '<img src="images/info.png" class="logo-image"  alt="logo"><span class="footer-logo">Inscribe</span>';
          highlighters.innerHTML =
            '<img src="images/topPeekI.avif" width="150px" alt="Looking Down">';
          return "sun";
        default:
          return "";
      }
    }
  }
});

// ........................

document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("mainHeader");
  var lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY;

    // Check if the user is scrolling down
    if (scrollTop > lastScrollTop) {
      header.classList.add("with-border");
    } else {
      // Check if the user has scrolled back to the top
      if (scrollTop === 0) {
        header.classList.remove("with-border");
      }
    }

    lastScrollTop = scrollTop;
  });
});
