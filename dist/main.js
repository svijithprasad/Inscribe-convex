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
          sidebarContainer.innerHTML = "";
          for (let i = 0; i < documents.length; i++) {
            const document = documents[i];
            const isActive = i === 0 ? "active" : "";

            sidebarContainer.innerHTML += `
                <div class='document-title' data-document-id="${document._id}">
                    <div class="expand"><i class='fa-solid fa-chevron-right fa-xs'></i></div>
                    <div class='title'>${document.title}</div> 
                    <div class='actionItems'>
                        <div class='delete-document moreoptions' data-document-id='${document._id}'><i class='fa-solid fa-trash fa-xs'></i></div>
                        <div class='add-child' data-document-id='${document._id}'><i class='fa-solid fa-plus fa-sm'></i></div>
                    </div>
                </div>
            `;
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
            title.addEventListener("click", function () {
              // Remove "active" class from all document titles
              documentTitles.forEach((t) => {
                t.classList.remove("active");
              });

              // Add "active" class to the clicked document title
              title.classList.add("active");
            });
          });

          documentTitles.forEach((title) => {
            title.addEventListener("click", function () {
              const documentId = title.dataset.documentId;
              const notespace = document.getElementById("note-space");
              const userspace = document.getElementById("user-space");
              notespace.innerHTML = `<div class="flex flex-col p-3 gap-2">
              <div class="skeleton h-52 w-full bg-[#666666] opacity-10"></div>
              <div class="flex flex-col w-[800px] ml-[250px] gap-2">
              <div class="skeleton h-4  bg-[#666666] opacity-10"></div>
              <div class="skeleton h-4  bg-[#666666] opacity-10"></div>
              <div class="skeleton h-4  bg-[#666666] opacity-10"></div>
              </div>
            </div>`;
              client
                .query("documents:get", { id: documentId })
                .then((documents) => {
                  console.log("task:", documents[0]._id);
                  userspace.style.display = "none";
                  notespace.style.display = "block";
                  notespace.innerHTML = "";
                  notespace.innerHTML += `          <div class="note-wallpaper" id="note-wallpaper"></div>
                <div class="note-title"><input type="text" id="note-title" data-id="${documents[0]._id}"></div>
                <div id="editor" data-document-id="${documents[0]._id}"></div>`;
                  const editorElement = document.getElementById("editor");
                  const documentId = editorElement.dataset.documentId;
                  console.log(documentId);

                  client
                    .query("documents:getEditor", { id: documentId }, {documents}.then((documents) => {
                      const content = documents[0].content;
                    }))
                    .then((content) => {
                      const content = document[0].content;
                      console.log(content);

                      // Initialize EditorJS inside the promise callback
                      const editor = new EditorJS({
                        holder: "editor",
                        onChange: () => {
                          saveEditorData(documentId);
                        },
                        tools: {
                          header: {
                            class: Header,
                            inlineToolbars: true,
                          },
                          list: {
                            class: List,
                          },
                          embed: {
                            class: Embed,
                            config: {
                              services: {
                                youtube: true,
                                coub: true,
                                vimeo: true,
                              },
                            },
                          },
                          paragraph: {
                            class: Paragraph,
                            inlineToolbars: true,
                          },
                          checklist: {
                            class: Checklist,
                            inlineToolbars: true,
                          },
                          table: {
                            class: Table,
                            inlineToolbar: true,
                            config: {
                              rows: 3,
                              cols: 3,
                            },
                          },
                        },
                        data: content, // Assign the retrieved content to the EditorJS instance
                      });

                      // Function to save editor data and handle potential errors
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
            notespace.innerHTML = "";
            notespace.innerHTML += `          <div class="note-wallpaper" id="note-wallpaper"></div>
            <div class="note-title"><input type="text" id="note-title" data-id="${documents[0]._id}"></div>
            <div id="editor" data-id="${documents[0]._id}"></div>`;

            const editor = new EditorJS({
              holder: "editor",
              autofocus: true,
              placeholder: "Start typing here...",
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
                warning: {
                  class: Warning,
                  inlineToolbar: true,
                },
                delimiter: Delimiter,
                inlineCode: InlineCode,
                checklist: {
                  class: Checklist,
                  inlineToolbar: true,
                },
                marker: {
                  class: Marker,
                  inlineToolbar: true,
                },
                embed: {
                  class: Embed,
                  config: {
                    services: {
                      youtube: true,
                      vimeo: true,
                      twitter: true,
                      instagram: true,
                    },
                  },
                },
              },
            });
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
