
const trashInput = document.getElementById("trashInput");
const trashResults = document.getElementById("trashboxContent");

trashInput.addEventListener("input", function () {
    const searchValue = trashInput.value.trim().toLowerCase(); // Trim whitespace and convert to lowercase

    // Retrieve the documents from Convex
    const userId = localStorage.getItem("userId");
    client
        .query("documents:getArchived", { userId })
        .then((documents) => {
            // Filter documents based on search value
            const filteredDocuments = documents.filter((documentTitle) =>
                documentTitle.title.toLowerCase().includes(searchValue)
            );

            // Render filtered documents or "Not Found" message
            if (filteredDocuments.length > 0) {
                renderArchiveDocumets(filteredDocuments);
            } else {
                trashResults.innerHTML = "Not Found";
            }
        });
});


function renderArchiveDocumets(documents) {
    trashResults.innerHTML = "";

    for (let i = 0; i < documents.length; i++) {
        const documentTitle = documents[i];
        trashResults.innerHTML = `<div class="trashDocuments text-black text-sm" data-document-id="${documentTitle._id}">${documentTitle.title}<div class="deleteActions" data-document-id="${documentTitle._id}"><div class="revert" data-document-id="${documentTitle._id}"><i class="fa fa-reply "></i></div><div data-document-id="${documentTitle._id}" class="perma-delete"><i class="fa-solid fa-trash"></i></div></div></div>
        `;
    }
}