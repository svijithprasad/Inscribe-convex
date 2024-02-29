const publishableKey =
  "pk_test_Zmlyc3QtcmFwdG9yLTY1LmNsZXJrLmFjY291bnRzLmRldiQ"; // <- Add Publishable Key here
const loader = document.getElementById("loader");
const enter1 = document.getElementById("enter1");
const loginBtn = document.getElementById("loginButton");
const mainBtn = document.getElementById("mainBtn");
const mainBtnDiv = document.getElementById("mainBtnDiv");
const loaderMain = document.getElementById("loaderMain");

let isLoading = true;

const startClerk = async () => {
  const authLinks = document.getElementById("auth-links");
  const Clerk = window.Clerk;

  try {
    mainBtnDiv.style.display = "none";
    loader.style.display = "block";
    loaderMain.style.display = "block";
    authLinks.style.display = "none";
    await Clerk.load({
      afterSignInUrl: "/dist/",
      afterSignUpUrl: "/dist/",
      SameSite: "None",
    });
    loader.style.display = "none";
    authLinks.style.display = "block";
    mainBtnDiv.style.display = "block";
    loaderMain.style.display = "none";
    const userButton = document.getElementById("user-button");

    Clerk.addListener(({ user }) => {
      authLinks.style.display = user ? "none" : "block";
      enter1.style.display = user ? "block" : "none";
      mainBtn.innerHTML = user
        ? '<a href="main.html" style="color: white;">Enter Inscribe <i class="bx bx-right-arrow-alt"></i></a>'
        : 'Get Inscribe Free<i class="bx bx-right-arrow-alt"></i>';
    });

    if (Clerk.user) {
      // Mount user button component
      Clerk.mountUserButton(userButton);
      userButton.style.margin = "10px";
      const userName = Clerk.user.fullName;
      const userId = Clerk.user.id;
      console.log("User ID:", userId);
      console.log("Name:", userName);
    }
  } catch (err) {
    console.error("Error starting Clerk: ", err);
  }
};

(() => {
  const script = document.createElement("script");
  script.setAttribute("data-clerk-publishable-key", publishableKey);
  script.async = true;
  script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
  script.crossOrigin = "anonymous";
  script.addEventListener("load", startClerk);
  script.addEventListener("error", () => {
    document.getElementById("no-frontend-api-warning").hidden = false;
  });
  document.body.appendChild(script);
})();
