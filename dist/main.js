const publishableKey =
  "pk_test_Zmlyc3QtcmFwdG9yLTY1LmNsZXJrLmFjY291bnRzLmRldiQ";
const startClerk = async () => {
  const Clerk = window.Clerk;
  const CONVEX_URL = "https://fantastic-alligator-877.convex.cloud";
  const client = new convex.ConvexClient(CONVEX_URL);
  try {
    const mainLoader = document.querySelector(".mainLoader");
    const mainId = document.getElementById("mainId");
    mainId.style.display = "none";
    mainLoader.style.display = "flex";
    await Clerk.load();
    const userButton = document.getElementById("user-button");
    const userNameMain = document.querySelector(".userNameMain");
    if (Clerk.user) {
      const userName = document.getElementById("userName");
      const profile = Clerk.user.imageUrl;
      userButton.innerHTML = `<img style='border-radius: 50%; width: 25px;
      height: 25px;' src=${profile} alt="Profile">`;
      const username = Clerk.user.firstName;
      userName.innerHTML = `<p>${username}'s Inscribe</p>`;
      userNameMain.innerHTML = `<h3>Welcome to ${username}'s Inscribe</h3>`;
      mainId.style.display = "flex";
      mainLoader.style.display = "none";
      var userId = Clerk.user.id;
      console.log(userId);
      client.onUpdate(
        "documents:getArchived",
        { userId: userId },
        (documents) => {
          const trashboxContent = document.querySelector(".trashboxContent");
          trashboxContent.innerHTML = "";
          for (const document of documents) {
            trashboxContent.innerHTML += `<div class="trashDocuments" data-document-id="${document._id}">${document.title}<div class="deleteActions" data-document-id="${document._id}"><div class="revert"><i class="fa-solid fa-reply "></i></div><div data-document-id="${document._id}" class="perma-delete"><i class="fa-solid fa-trash"></i></div></div></div>
            `;
          }
        }
      );

      client.onUpdate(
        "documents:getSidebar",
        { userId: userId },
        (documents) => {
          const sidebarContainer = document.getElementById("titles-list");

          // Clear existing content
          sidebarContainer.innerHTML = "";
          for (let i = 0; i < documents.length; i++) {
            const document = documents[i];
            const isActive = i === 0 ? "active" : "";

            sidebarContainer.innerHTML += `
                <div class='document-title ${isActive}' id="${document._id}">
                    <div class="expand"><i class='fa-solid fa-chevron-right fa-xs'></i></div>
                    <div class='title'>${document.title}</div> 
                    <div class='actionItems'>
                        <div class='delete-document moreoptions' data-document-id='${document._id}'><i class='fa-solid fa-trash fa-xs'></i></div>
                        <div class='add-child' data-document-id='${document._id}'><i class='fa-solid fa-plus fa-sm'></i></div>
                    </div>
                </div>
            `;
          }

          // Select all document titles
          const documentTitles = document.querySelectorAll(".document-title");

          // Add click event listener to each document title
          documentTitles.forEach((title) => {
            title.addEventListener("click", function () {
              // Remove "active" class from all document titles
              documentTitles.forEach((t) => {
                t.classList.remove("active");
              });

              // Add "active" class to the clicked document title
              title.classList.add("active");
            });
          });

          const deleteDocumentButtons =
            document.querySelectorAll(".delete-document");
          deleteDocumentButtons.forEach((button) => {
            button.addEventListener("click", function () {
              const documentId = button.dataset.documentId;
              deleteNote(documentId);
            });
          });
        }
      );

      function deleteNote(documentId) {
        client.mutation(
          "documents:archive",
          { id: documentId },
          (documents) => {
            console.log("task:", documents);
          }
        );
      }

      document.addEventListener("click", function (event) {
        const permaDeleteButton = event.target.closest(".perma-delete");
        if (permaDeleteButton) {
          const documentId = permaDeleteButton.dataset.documentId;
          my_modal_3.showModal();
          const deleteConfirm = document.getElementById("deleteConfirm");
          deleteConfirm.addEventListener("click", function () {
            my_modal_3.close();
            permaDelete(documentId);
          });
        }
      });

      function permaDelete(documentId) {
        client.mutation("documents:remove", { id: documentId }, (documents) => {
          console.log("deleted", documents);
        });
      }
    }


    const openTrash = document.getElementById("openTrash");
    openTrash.addEventListener("click", function (event) {
      const trashBox = document.querySelector(".trashbox");
      event.stopPropagation();

      trashBox.style.display = "flex";
    });

    const closeTrash = document.querySelector(".closeTrash");
    closeTrash.addEventListener("click", function (event) {
      const trashBox = document.querySelector(".trashbox");
      trashBox.style.display = "none";
    });

    const addBtn = document.getElementById("addDocument");

    addBtn.addEventListener("click", async function (event) {
      event.stopPropagation();
      const userspace = document.getElementById("user-space");
      const notespace = document.getElementById("note-space");
      notespace.innerHTML = "";
      userspace.style.display = "none";
      notespace.style.display = "block";

      client
        .mutation("documents:create", {
          title: "Untitled",
          isArchived: false,
          isPublished: false,
          userId: userId,
        })
        .then((documents) => {
          console.log("Inserted task:", documents);
        });

    });
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

function collapseAside() {
  var aside = document.querySelector(".aside");
  var mainBar = document.querySelector(".mainBar");
  mainBar.style.marginLeft = "0px";
  aside.style.width = "0px";
  menuVisible();
}

function menuVisible() {
  var menu = document.querySelector(".menu-icon");
  menu.style.display = "block";
}

function resetAside() {
  var menu = document.querySelector(".menu-icon");
  var aside = document.querySelector(".aside");
  var mainBar = document.querySelector(".mainBar");
  mainBar.style.marginLeft = "250px";
  aside.style.width = "250px";
  menu.style.display = "none";
}

function handleMouseUp() {
  isResizing = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}
// this logic for saving the asie's state is not working

// isNotResetting
function isNotResetting() {
  var aside = document.getElementById("resizableAside");
  var mainBar = document.querySelector(".mainBar");
  mainBar.style.marginLeft = "250px";
  aside.style.width = "250px";
}