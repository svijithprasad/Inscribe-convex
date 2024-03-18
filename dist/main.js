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
      <div class="skeleton h-4 w-full bg-[#666666] opacity-10"></div>
      <div class="skeleton h-4 w-full bg-[#666666] opacity-10"></div>
      <div class="skeleton h-4 w-full bg-[#666666] opacity-10"></div>
    </div>`;
      client.onUpdate(
        "documents:getSidebar",
        { userId: userId },
        (documents) => {
          // Clear existing content
          if (!documents.length == 0) {
            sidebarContainer.innerHTML = "";
            for (let i = 0; i < documents.length; i++) {
              const document = documents[i];
              const isActive = i === 0 ? "active" : "";

              sidebarContainer.innerHTML += `
                <div class='document-title' data-document-id="${document._id}">
                <div class='titleContainer'>
                    <div class="expand"><i class='fa-solid fa-chevron-right fa-xs'></i></div>
                    <div class='title text-sm truncate'>${document.title}</div>
                </div>
                    <div class='actionItems'>
                        <div class='delete-document moreoptions' data-document-id='${document._id}'><i class='fa-solid fa-trash fa-xs'></i></div>
                        <div class='add-child' data-document-id='${document._id}'><i class='fa-solid fa-plus fa-sm'></i></div>
                    </div>
                </div>
            `;
            }
          } else {
            sidebarContainer.innerHTML = `<div class="flex items-center min-h-7 pl-4 font-normal text-sm text-black "><p>No document created!</p></div>`;
          }

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

          // Select all document titles
          const documentTitles = document.querySelectorAll(".document-title");

          // Add click event listener to each document title
          documentTitles.forEach((title) => {
            title.addEventListener("click", function (event) {
              event.stopPropagation();
              // Remove "active" class from all document titles
              documentTitles.forEach((t) => {
                t.classList.remove("active");
              });

              // Add "active" class to the clicked document title
              title.classList.add("active");
            });
          });

          documentTitles.forEach((title) => {
            const navTitle = document.getElementById("navTitle");
            title.addEventListener("click", function (event) {
              event.stopPropagation();
              const documentId = title.dataset.documentId;
              const notespace = document.getElementById("note-space");
              const userspace = document.getElementById("user-space");
              const publishMenu = document.querySelector(".publish-Menu");
              publishMenu.style.display = "flex";
              // Display skeleton loading animation
              // notespace.innerHTML = `
              //       <div class="flex flex-col p-3 gap-2">
              //           <div class="skeleton h-52 w-full bg-[#666666] opacity-10"></div>
              //           <div class="flex flex-col w-[800px] ml-[250px] gap-2">
              //               <div class="skeleton h-4  bg-[#666666] opacity-10"></div>
              //               <div class="skeleton h-4  bg-[#666666] opacity-10"></div>
              //               <div class="skeleton h-4  bg-[#666666] opacity-10"></div>
              //           </div>
              //       </div>`;

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
                      const wallpaper =
                        document.getElementById("note-wallpaper");
                      if (documents[0].coverImage !== undefined) {
                        wallpaper.innerHTML = `<img class="h-52 w-full" src="${documents[0].coverImage}"/>`;
                      } else {
                        wallpaper.innerHTML = "";
                      }
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
                  <div class="note-wallpaper" id="note-wallpaper">
                  <span class="fileText"></span>
              </div>

              <div class="note-title group">
                  <input class="title-input" type="text" id="note-title" data-id="${documents[0]._id}" value="${documents[0].title}">
              </div>
              <iframe src="editor.html" width="100%" height="100%" data-document-id="${documents[0]._id}"></iframe>
              `;

                  const iconAndCover = document.querySelector(".iconAndCover");
                  const notetitle = document.querySelector(".note-title");

                  document.addEventListener("mouseover", function (event) {
                    const isMouseOverNotetitle = notetitle.contains(
                      event.target
                    );
                    const isMouseOverIconAndCover = iconAndCover.contains(
                      event.target
                    );

                    if (!isMouseOverNotetitle && !isMouseOverIconAndCover) {
                      iconAndCover.style.display = "none";
                    } else {
                      iconAndCover.style.display = "flex";
                    }
                  });

                  const iframe = document.querySelector("iframe");
                  iframe.addEventListener("load", function () {
                    const documentId = iframe.dataset.documentId;
                    console.log("iframe loaded");
                    iframe.contentWindow.postMessage({ documentId }, "*");
                  });

                  // Initialize EditorJS inside the promise callback
                  initializeEditor(documentId);

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
                })

                .catch((error) => {
                  console.error("Error retrieving document:", error);
                  notespace.innerHTML = `<div>Error retrieving document</div>`;
                });
            });
          });

          function initializeEditor(documentId) {
            const titleTextBox = document.getElementById("note-title");
            titleTextBox.addEventListener("input", function () {
              const titleValue = titleTextBox.value.trim(); // Trim whitespace

              // If titleValue is empty, set it to "Untitled", otherwise use the current value
              const titleToSend = titleValue ? titleValue : "Untitled";

              client.mutation(
                "documents:renameTitle",
                { id: documentId, title: titleToSend },
                (documents) => {
                  console.log("task:", documents);
                }
              );
            });
          }

          const deleteDocumentButtons =
            document.querySelectorAll(".delete-document");
          deleteDocumentButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
              event.stopPropagation();
              const documentId = button.dataset.documentId;
              const notespace = document.getElementById("note-space");
              const userspace = document.getElementById("user-space");
              const navTitle = document.querySelector(".navTitle");
              const publishMenu = document.querySelector(".publish-Menu");
              publishMenu.style.display = "none";
              navTitle.style.display = "none";
              notespace.style.display = "none";
              userspace.style.display = "flex";
              deleteNote(documentId);
            });
          });
        }
      );

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

    addBtn.addEventListener("click", async function (event) {
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
            notespace.innerHTML += `          <div class="note-wallpaper" id="note-wallpaper">
            <span class="fileText"></span>
        </div>

        <div class="note-title group">
            <input class="title-input" type="text" id="note-title" data-id="${documents[0]._id}" value="${documents[0].title}">
        </div>
        <iframe src="editor.html" width="100%" height="100%" data-document-id="${documents[0]._id}"></iframe>`;
            const titleTextBox = document.getElementById("note-title");
            titleTextBox.value = documents[0].title;
            const documentId = titleTextBox.dataset.id;
            titleTextBox.addEventListener("input", function () {
              const documentId = titleTextBox.dataset.id;
              client.mutation("documents:renameTitle", {
                id: documentId,
                title: titleTextBox.value,
              });
            });
            client.onUpdate(
              "documents:get",
              { id: documentId },
              (documents) => {
                const navTitle = document.getElementById("navTitle");
                navTitle.innerHTML = `<p>${documents[0].title}</p>`;
              }
            );

            const editor = new EditorJS({
              holder: "editorjs",
              onChange: () => {
                saveEditorData(documentId);
              },

              tools: {
                header: {
                  class: Header,
                  inlineToolbar: true,
                  config: {
                    placeholder: "Enter a header",
                    levels: [2, 3, 4],
                    defaultLevel: 2,
                  },
                },
                paragraph: {
                  class: Paragraph,
                  inlineToolbar: true,
                },
                list: {
                  class: List,
                  inlineToolbar: true,
                  config: {
                    ordered: true,
                    unordered: true,
                  },
                },
                table: {
                  class: Table,
                  inlineToolbar: true,
                  config: {
                    rows: 2,
                    cols: 3,
                  },
                },
                embed: {
                  class: Embed,
                  inlineToolbar: true,
                },
                inlineCode: {
                  class: InlineCode,
                  inlineToolbar: true,
                },
                checklist: {
                  class: Checklist,
                  inlineToolbar: true,
                },
                marker: {
                  class: Marker,
                  inlineToolbar: true,
                },
                image: {
                  class: Image,
                  inlineToolbar: true,
                },
              },
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
            function saveEditorData(documentId) {
              editor
                .save()
                .then((data) => {
                  const content = JSON.stringify(data);
                  console.log("Saved data:", content);
                  client.mutation(
                    "documents:saveEditor",
                    { id: documentId, content: content },
                    (documents) => {
                      console.log("task:", documents);
                    }
                  );
                })
                .catch((error) => {
                  console.error("Saving failed:", error);
                });
            }
          });
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
