const publishableKey =
  "pk_test_Zmlyc3QtcmFwdG9yLTY1LmNsZXJrLmFjY291bnRzLmRldiQ";
const startClerk = async () => {
  const Clerk = window.Clerk;
  const CONVEX_URL = "https://fantastic-alligator-877.convex.cloud";
  const client = new convex.ConvexClient(CONVEX_URL);
  const firebaseConfig = {
    apiKey: "AIzaSyCXEueXJRuj-v2i2btuca8CWViM2AvsWX8",

    authDomain: "inscribe-c57f9.firebaseapp.com",

    projectId: "inscribe-c57f9",

    storageBucket: "inscribe-c57f9.appspot.com",

    messagingSenderId: "119733210559",

    appId: "1:119733210559:web:d97a36be0c004d0cb1a50a",

    measurementId: "G-M7ZPF4W19S",
  };
  const app = firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  try {
    const mainLoader = document.querySelector(".mainLoader");
    const mainId = document.getElementById("mainId");
    const userSettings = document.getElementById("userSettings");
    mainId.style.display = "none";
    mainLoader.style.display = "flex";
    await Clerk.load();
    const userButton = document.getElementById("user-button");
    const userNameMain = document.querySelector(".userNameMain");
    function checkUser() {
      if (Clerk.user) {
        return;
      } else {
        window.location.href = "/dist/";
      }
    }

    setInterval(checkUser, 100);
    if (Clerk.user) {
      userSettings.innerHTML = `<div><img src=${Clerk.user.imageUrl}  style='border-radius: 50%; width: 30px; height: 30px;'></div>`;
      localStorage.setItem("userId", Clerk.user.id);
      const userEmail = document.getElementById("user-email");
      const DropDownImg = document.getElementById("user-dropdown-image");
      const DropDownName = document.getElementById("user-dropdown-name");
      const userName = document.getElementById("userName");
      const profile = Clerk.user.imageUrl;
      const email = Clerk.user?.emailAddresses[0].emailAddress;
      userEmail.innerHTML = `<p>${email}</p>`;
      userButton.innerHTML = `<img style='border-radius: 50%; width: 25px;
      height: 25px;' src=${profile} alt="Profile">`;
      DropDownImg.innerHTML = `<img src=${profile} alt="Profile" width="35px" height="35px">`;
      DropDownName.innerHTML = `<p>${Clerk.user.firstName}'s Inscribe</p>`;
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
          if (documents.length == 0) {
            document.querySelector(
              ".trashboxContent"
            ).innerHTML = `<div class="no-document "><p>No document deleted!</p></div>`;
          } else {
            const trashboxContent = document.querySelector(".trashboxContent");
            trashboxContent.innerHTML = "";
            for (const document of documents) {
              trashboxContent.innerHTML += `<div class="trashDocuments text-black text-sm" data-document-id="${document._id}">${document.title}<div class="deleteActions" data-document-id="${document._id}"><div class="revert" data-document-id="${document._id}"><i class="fa fa-reply "></i></div><div data-document-id="${document._id}" class="perma-delete"><i class="fa-solid fa-trash"></i></div></div></div>
            `;
            }
          }
        }
      );

      const sidebarContainer = document.getElementById("titles-list");
      sidebarContainer.innerHTML = `<div class="flex flex-col p-3 gap-2">
      <div class="flex items-center gap-1"><div class="skeleton w-3 h-3 rounded-medium shrink-0 bg-[#666666] opacity-10"></div><div class="skeleton w-[70%] h-3 rounded-full shrink-0 bg-[#666666] opacity-10"></div></div>
      <div class="flex items-center gap-1"><div class="skeleton w-3 h-3 rounded-medium shrink-0 bg-[#666666] opacity-10"></div><div class="skeleton w-[70%] h-3 rounded-full shrink-0 bg-[#666666] opacity-10"></div></div>
      <div class="flex items-center gap-1"><div class="skeleton w-3 h-3 rounded-medium shrink-0 bg-[#666666] opacity-10"></div><div class="skeleton w-[70%] h-3 rounded-full shrink-0 bg-[#666666] opacity-10"></div></div>
    </div>`;

      // Define renderDocuments function outside of the client.onUpdate callback
      function renderDocuments(documents, parentElement, level = 0) {
        // Clear existing content
        parentElement.innerHTML = "";

        documents.forEach((documentDetails) => {
          let indent = 0;
          if (level == 0) {
            indent = 14;
          } else if (level == 1) {
            indent = level * 30;
          } else {
            indent = level * 24;
          }
          const { _id, title } = documentDetails;

          const documentHTML = `
      <div class='document-title' data-document-id="${_id}" style="padding-left: ${indent}px;">
        <div class='titleContainer'>
          <div class="expand" data-document-id="${_id}">
            <i class='fa-solid fa-chevron-right fa-xs'></i>
          </div>
          <div class='title text-sm truncate'>${title}</div>
        </div>
        <div class='actionItems'>
          <div class='moreoptions' data-document-id='${_id}'>
            <i class="fa-solid fa-ellipsis"></i>
          </div>
          <div class='add-child' data-document-id='${_id}'>
            <i class='fa-solid fa-plus fa-sm'></i>
          </div>
        </div>
      </div>
      <div class="childrenDocuments" style="display: none;"></div>
    `;

          // Append HTML to parentElement
          parentElement.innerHTML += documentHTML;

          // Add event listener for adding child
          const addChildButton = parentElement.querySelectorAll(`.add-child`);
          addChildButton.forEach((button) => {
            button.addEventListener("click", function (event) {
              event.stopPropagation();
              const documentId = button.dataset.documentId;
              client.mutation(
                "documents:create",
                {
                  title: "Untitled",
                  userId: userId,
                  isArchived: false,
                  isPublished: false,
                  parentDocument: documentId,
                },
                (documents) => {
                  // Find the closest expand button and trigger a click event on it
                  const expandButton = button
                    .closest(".document-title")
                    .querySelector(".expand");
                  if (expandButton) {
                    expandButton.click(); // Simulate click on the expand button
                  }
                }
              );
            });
          });

          // Add event listener for expanding
          const expandButton = parentElement.querySelectorAll(`.expand`);
          expandButton.forEach((expButton) => {
            expButton.addEventListener("click", function (event) {
              event.stopPropagation();
              const chevronIcon = expButton.querySelector("i");
              const childrenDocuments =
                expButton.closest(".document-title").nextElementSibling;
              const documentId = expButton.dataset.documentId;

              chevronIcon.classList.toggle("fa-chevron-right");
              chevronIcon.classList.toggle("fa-chevron-down");

              if (chevronIcon.classList.contains("fa-chevron-right")) {
                const isExpanded = false;
                childrenDocuments.style.display = "none";
              } else if (chevronIcon.classList.contains("fa-chevron-down")) {
                const isExpanded = true;
                childrenDocuments.innerHTML = `
                <div class="flex items-center gap-1"><div style="padding-left="${indent}px" class="skeleton w-3 h-3 rounded-medium shrink-0 bg-[#666666] opacity-10"></div><div class="skeleton w-[70%] h-3 rounded-full shrink-0 bg-[#666666] opacity-10"></div></div> 
                `;
                childrenDocuments.style.display = "flex";

                client.onUpdate(
                  "documents:getChildrens",
                  { parentDocument: documentId, userId: userId },
                  (children) => {
                    childrenDocuments.innerHTML = "";
                    if (children.length == 0) {
                      childrenDocuments.innerHTML = `<div class="flex items-center min-h-7 pl-4 font-normal text-sm text-muted-foreground" style="padding-left: ${indent}px;"><p>no documents found!</p></div>`;
                    } else {
                      renderDocuments(children, childrenDocuments, level + 1);
                    }
                  }
                );
              }
            });
          });

          // Add event listener for more options
          const moreOptionsButtons =
            parentElement.querySelectorAll(".moreoptions");
          const modal6 = document.getElementById("moreoptionsBox");
          moreOptionsButtons.forEach((moreButton) => {
            moreButton.addEventListener("click", function (event) {
              // Your more options logic here
              event.stopPropagation();
              const documentId = moreButton.dataset.documentId;
              console.log("More options clicked for document:", documentId);
              const rect = moreButton.getBoundingClientRect(); // Get the position of the button
              const scrollTop = window.pageYOffset || document.body.scrollTop; // Get the scroll top
              const left = rect.left + window.pageXOffset; // Calculate the left position
              const top = rect.bottom + scrollTop; // Calculate the top position
              modal6.style.left = `${left}px`; // Set the left position of the modal
              modal6.style.top = `${top - 20}px`; // Set the top position of the modal
              moreButton.classList.add("active");
              modal6.style.display = "flex";
              function isClickInsideModal(event) {
                return event.target === modal6 || modal6.contains(event.target);
              }

              // Event listener for clicks on the document
              document.addEventListener("click", function (event) {
                // Check if the click is outside the modal
                const isOutsideModal = !isClickInsideModal(event);

                // If it's outside the modal, hide the modal
                if (isOutsideModal) {
                  modal6.style.display = "none";
                  moreButton.classList.remove("active");
                }
              });
              modal6.innerHTML = `<div class="flex w-full h-full px-10 py-10 flex-col items-center justify-center">
      <span class="loading loading-spinner loading-xs text-[#737373]"></span>
      </div>`;
              client.onUpdate(
                "documents:get",
                { id: documentId },
                (documents) => {
                  console.log("documents:", documents[0]._id);
                  modal6.innerHTML = ` <div class="flex w-full h-full flex-col">
      <div id="moreoptionsContent" class="w-full flex flex-col items-center justify-center p-1 select-none text-primary">

        <div class="item p-2" id="">
        <i class="fa-regular fa-copy"></i>
          <p
            style="
              font-size: 14px;
              font-weight: 500;
              margin-left: 8px;
            "
          >
            Duplicate
          </p>
        </div>

        <div class="item p-2" id="delete-document" data-document-id="${documents[0]._id}">
        <i class="fa-regular fa-trash-can"></i>
          <p
            style="
              font-size: 14px;
              font-weight: 500;
              margin-left: 8px;
            "
          >
            Delete
          </p>
        </div>
      </div>
      <div class="w-full flex flex-col items-center justify-center p-1 select-none text-primary">
        <div class="border-t border-gray-300 w-full mt-1 mb-1"></div>
          <div class="w-full h-8 p-2 flex items-center" id="lastEdited">

            <p
              style="
                font-size: 14px;
                font-weight: 500;
                margin-left: 8px;
              "
            >

            </p>
          </div>
      </div>
    </div>`;
                  const username = Clerk.user.firstName;
                  const lastEdited = document.getElementById("lastEdited");
                  const creationTime = documents[0]._creationTime;
                  const date = new Date(creationTime);
                  const formattedDate = date.toLocaleString();
                  lastEdited.innerHTML = `<p
        style="
          font-size: 10px;
          font-weight: 400;
          margin-left: 8px;
          color: #737373;
        "
      >
        Last Edited by: ${username} <br>
        Created on: ${formattedDate}
      </p>`;
                  const deleteDocumentButton =
                    document.getElementById("delete-document");
                  deleteDocumentButton.addEventListener(
                    "click",
                    function (event) {
                      event.stopPropagation();
                      const documentId =
                        deleteDocumentButton.dataset.documentId;
                      const notespace = document.getElementById("note-space");
                      const userspace = document.getElementById("user-space");
                      const navTitle = document.querySelector(".navTitle");
                      const publishMenu =
                        document.querySelector(".publish-Menu");
                      publishMenu.style.display = "none";
                      navTitle.style.display = "none";
                      notespace.style.display = "none";
                      userspace.style.display = "flex";
                      deleteNote(documentId);
                      modal6.style.display = "none";
                      moreButton.classList.remove("active");
                    }
                  );
                }
              );
            });
          });

          const documentTitleButtons =
            document.querySelectorAll(".document-title");

          documentTitleButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
              const documentId = button.dataset.documentId;
              localStorage.setItem("activeTitle", documentId);
              event.stopPropagation();
              const notespace = document.getElementById("note-space");
              const userspace = document.getElementById("user-space");
              const publishMenu = document.querySelector(".publish-Menu");
              publishMenu.style.display = "flex";

              client
                .query("documents:get", { id: documentId })
                .then((documents) => {
                  userspace.style.display = "none";
                  notespace.style.display = "block";
                  navTitle.style.display = "block";
                  navTitle.innerHTML = `<p>${documents[0].title}</p>`;
                  client.onUpdate(
                    "documents:get",
                    { id: documentId },
                    (documents) => {
                      const dynamicTitle = documents[0].title;
                      navTitle.innerHTML = `<p>${dynamicTitle}</p>`;
                    }
                  );
                  publishMenu.innerHTML = "";
                  publishMenu.innerHTML += `
                  <div class="flex items-center fixed right-3 top-2">
                    <div class="publish">
                      <div id="publishBtn" class="btn btn-sm btn-ghost rounded-sm cursor-pointer" >Export <i class="fa-solid fa-globe"></i></div>
                    </div>
                    <div class="ml-2 btn btn-ghost btn-sm "><i class="fa-solid fa-ellipsis"></i></div>
                  </div>`;

                  notespace.innerHTML = `
                <iframe id="iframe" src="editor.html" width="100%" height="100%" data-document-id="${documents[0]._id}"></iframe>
                `;

                  const publishBtn = document.getElementById("publishBtn");
                  const publishTab = document.querySelector(".publish-tab");
                  publishBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    console.log("publish-up");
                    publishTab.classList.remove("hidden");
                    publishTab.classList.add("flex");
                    document.addEventListener("click", function (event) {
                      // Check if the click target is not within publishMenu or publishBtn
                      if (
                        !publishTab.contains(event.target) &&
                        event.target !== publishBtn
                      ) {
                        // Hide publishMenu
                        publishTab.classList.remove("flex");
                        publishTab.classList.add("hidden");
                      }
                    });
                  });

                  // const iframe = document.querySelector("iframe");
                  iframe.addEventListener("load", function () {
                    const documentId = iframe.dataset.documentId;
                    console.log("iframe loaded");
                    iframe.contentWindow.postMessage({ documentId }, "*");
                  });
                });
            });
          });
        });
      }
      // Usage:
      client.onUpdate(
        "documents:getSidebar",
        { userId: userId },
        (rootDocuments) => {
          const sidebarContainer = document.getElementById("titles-list");
          if (rootDocuments.length === 0) {
            sidebarContainer.innerHTML = `<div class="flex items-center min-h-7 pl-4 font-normal text-sm text-black "><p>No document created!</p></div>`;
          } else {
            renderDocuments(rootDocuments, sidebarContainer);
          }
        }
      );

      //expand code

      document.addEventListener("DOMContentLoaded", function () {
        var titlesListDiv = document.getElementById("titles-list");
        var noDocumentDiv = titlesListDiv.querySelector(".no-document");
        if (
          titlesListDiv.children.length === 1 &&
          titlesListDiv.firstElementChild === noDocumentDiv
        ) {
          noDocumentDiv.style.display = "block";
        } else {
          noDocumentDiv.style.display = "none";
        }
      });

      document.addEventListener("click", function (event) {
        const restoreButton = event.target.closest(".revert");
        if (restoreButton) {
          const documentId = restoreButton.dataset.documentId;
          restoreNote(documentId);
        }
      });

      function restoreNote(documentId) {
        client.mutation("documents:restore", { id: documentId }, (document) => {
          console.log("task:", document);
        });
      }
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
      const deleteConfirm = document.getElementById("deleteConfirm");
      const closeModalBtn = document.querySelector(".closeModalBtn");
      event.stopPropagation();

      trashBox.style.display = "flex";

      document.addEventListener("click", function (event) {
        // Check if the click target is not within publishMenu or publishBtn
        if (
          !trashBox.contains(event.target) &&
          event.target !== openTrash &&
          event.target !== deleteConfirm &&
          event.target !== closeModalBtn
        ) {
          // Hide publishMenu
          trashBox.style.display = "none";
        }
      });
    });

    const addBtn = document.getElementById("addDocument");
    const createNoteButton = document.getElementById("createNoteButton");
    async function createDocumentHandler(event) {
      event.stopPropagation();
      const userspace = document.getElementById("user-space");
      const notespace = document.getElementById("note-space");
      const publishMenu = document.querySelector(".publish-Menu");
      const navTitle = document.getElementById("navTitle");
      publishMenu.style.display = "flex";
      navTitle.style.display = "block";
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
          client.query("documents:get", { id: documents }).then((documents) => {
            console.log("task:", documents[0]._id);
            navTitle.innerHTML = `<p>${documents[0].title}</p>`;
            publishMenu.innerHTML = "";
            publishMenu.innerHTML += `
                <div class="flex items-center fixed right-3 top-2">
                  <div class="publish">
                    <div id="publishBtn" class="btn btn-sm btn-ghost rounded-sm cursor-pointer">Export <i class="fa-solid fa-globe"></i></div>
                  </div>
                  <div class="ml-2 btn btn-ghost btn-sm "><i class="fa-solid fa-ellipsis"></i></div>
                </div>`;
            notespace.innerHTML = "";
            notespace.innerHTML += `
        <iframe id="iframe" src="editor.html" width="100%" height="100%" data-document-id="${documents[0]._id}"></iframe>`;
            const iframe = document.querySelector("iframe");
            iframe.addEventListener("load", function () {
              const documentId = iframe.dataset.documentId;
              console.log("iframe loaded");
              iframe.contentWindow.postMessage({ documentId }, "*");
            });
            const docId = iframe.dataset.documentId;
            client.onUpdate("documents:get", { id: docId }, (documents) => {
              const navTitle = document.getElementById("navTitle");
              navTitle.innerHTML = `<p>${documents[0].title}</p>`;
            });

            const publishBtn = document.getElementById("publishBtn");
            const publishTab = document.querySelector(".publish-tab");
            publishBtn.addEventListener("click", function (event) {
              event.stopPropagation();
              console.log("publish-down");
              publishTab.classList.remove("hidden");
              publishTab.classList.add("flex");
              document.addEventListener("click", function (event) {
                // Check if the click target is not within publishMenu or publishBtn
                if (
                  !publishTab.contains(event.target) &&
                  event.target !== publishBtn
                ) {
                  // Hide publishMenu
                  publishTab.classList.remove("flex");
                  publishTab.classList.add("hidden");
                }
              });
            });
          });
        });
    }

    addBtn.addEventListener("click", createDocumentHandler);
    createNoteButton.addEventListener("click", createDocumentHandler);


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

document.addEventListener("DOMContentLoaded", function () {
  const userItem = document.getElementById("user-item");
  const dropDown = document.getElementById("user-dropdown");

  userItem.addEventListener("click", function () {
    dropDown.classList.toggle("hidden");
  });

  document.addEventListener("click", function (event) {
    if (!userItem.contains(event.target) && !dropDown.contains(event.target)) {
      dropDown.classList.add("hidden");
    }
  });
});

function handleActiveTitle() {
  const activeTitle = localStorage.getItem("activeTitle");
  if (activeTitle) {
    const documentTitles = document.querySelectorAll(".document-title");
    // Iterate through each document title to find the one with the activeDocumentId
    documentTitles.forEach((title) => {
      if (title.dataset.documentId === activeTitle) {
        // Remove "active" class from all document titles
        documentTitles.forEach((t) => {
          t.classList.remove("active");
        });
        // Add "active" class to the title with activeDocumentId
        title.classList.add("active");
      }
    });
  }
}

setInterval(handleActiveTitle, 1);

window.addEventListener("load", function () {
  localStorage.setItem("activeTitle", null);
});
