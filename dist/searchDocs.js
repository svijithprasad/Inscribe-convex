const CONVEX_URL = "https://fantastic-alligator-877.convex.cloud";
const client = new convex.ConvexClient(CONVEX_URL);

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key === 'k') {
        event.preventDefault(); // Prevent default behavior
        my_modal_2.showModal();
    }
});

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.trim().toLowerCase(); // Trim whitespace and convert to lowercase

  // Retrieve the documents from Convex
  const userId = localStorage.getItem("userId");
  client
    .query("documents:getSidebar", { userId })
    .then((documents) => {
      // Filter documents based on search value
      const filteredDocuments = documents.filter((document) =>
        document.title.toLowerCase().includes(searchValue)
      );

      // Render filtered documents or "Not Found" message
      if (filteredDocuments.length > 0) {
        renderDocuments(filteredDocuments);
      } else {
        searchResults.innerHTML =
          "<div class='not-found text-center text-muted-foreground font-semibold text-sm'>No results for '" +
          searchValue +
          "'</div>";
      }
    })
    .catch((error) => {
      console.error("Error retrieving documents:", error);
    });
});

// Function to render documents
function renderDocuments(documents) {
  searchResults.innerHTML = "";
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const documentId = document._id;
    const documentTitle = document.title;
    const timeStamp = document._creationTime;
    const date = new Date(timeStamp);
    const creationTime = date.toLocaleString();
    searchResults.innerHTML += `
            <div class='document-title' data-document-id="${documentId}" onclick='openDocument("${documentId}")'>
                <div class='titleContainer'>
                    <div class='title text-medium truncate'>${documentTitle}</div>
                </div>
                <div class="lastModified pr-2 text-sm">
                    <i class="fa-regular fa-clock"></i> ${creationTime}
                </div>
            </div>`;
  }
}

function openDocument(documentId) {
    my_modal_2.close();
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
      client.onUpdate("documents:get", { id: documentId }, (documents) => {
        const wallpaper = document.getElementById("note-wallpaper");
        const dynamicTitle = documents[0].title;
        navTitle.innerHTML = `<p>${dynamicTitle}</p>`;
      });
      publishMenu.innerHTML = "";
      publishMenu.innerHTML += `
                <div class="flex items-center fixed right-3 top-2">
                  <div class="publish">
                    <div id="publishBtn" class="btn btn-sm btn-ghost rounded-sm cursor-pointer" >Export <i class="fa-solid fa-globe"></i></div>
                  </div>
                  <div class="ml-2 btn btn-ghost btn-sm "><i class="fa-solid fa-ellipsis"></i></div>
                </div>`;

      notespace.innerHTML = `
              <iframe src="editor.html" width="100%" height="100%" data-document-id="${documents[0]._id}"></iframe>
              `;

      const iconAndCover = document.querySelector(".iconAndCover");
      const notetitle = document.querySelector(".note-title");

      document.addEventListener("mouseover", function (event) {
        const isMouseOverNotetitle = notetitle.contains(event.target);
        const isMouseOverIconAndCover = iconAndCover.contains(event.target);

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
      // initializeEditor(documentId);

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
}

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
