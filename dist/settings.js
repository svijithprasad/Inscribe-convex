document.addEventListener("DOMContentLoaded", function () {
    const selectTheme = document.getElementById("selectTheme");
    const themes = document.getElementById("themes");
    const selected = document.getElementById("selected");

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
        localStorage.setItem("theme", "light");
        themes.classList.add("hidden");
        themes.classList.remove("flex");
        selected.innerHTML = `<i class="bx bx-sun"></i>`;
    });

    dark.addEventListener("click", function () {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
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
        } else {
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
            selected.innerHTML = `<i class="bx bx-sun"></i>`;
        }
        themes.classList.add("hidden");
        themes.classList.remove("flex");
    });

    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        selected.innerHTML = `<i class="bx bx-moon"></i>`;
    } else if (theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        selected.innerHTML = `<i class="bx bx-sun"></i>`;
    }
});


const userSettings = document.getElementById("userSettings");

userSettings.addEventListener("click", function () {
    my_modal_4.close();

})

document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key === 'j') {
        event.preventDefault(); // Prevent default behavior
        my_modal_4.showModal();
    }
});