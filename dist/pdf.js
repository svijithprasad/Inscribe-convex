jQuery(document).ready(function () {
  $("#publish").click(function () {
    // Get base64 image for notetitle
    html2canvas(document.querySelector(".note-title"), { scale: 2 }).then((titleCanvas) => {
      const titleBase64Image = titleCanvas.toDataURL("image/png");

      // Get base64 image for iframe content
      const iframe = document.getElementById("iframe");
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      html2canvas(iframeDocument.body, { scale: 2 }).then((iframeCanvas) => {
        const iframeBase64Image = iframeCanvas.toDataURL("image/png");

        // Create a new jsPDF instance
        let pdf = new jsPDF('p', 'px', [titleCanvas.width, titleCanvas.height + iframeCanvas.height]);

        // Add notetitle image to PDF
        pdf.addImage(titleBase64Image, 'PNG', 0, 0, titleCanvas.width, titleCanvas.height);

        // Add iframe image to PDF below the notetitle
        pdf.addImage(iframeBase64Image, 'PNG', 0, titleCanvas.height, iframeCanvas.width, iframeCanvas.height);

        const noteTitle = document.getElementById("note-title").value;
        pdf.save(`${noteTitle}.pdf`);
      });
    });
  });
});
