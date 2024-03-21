jQuery(document).ready(function () {
  $("#publish").click(function () {
    let wspFrame = document.getElementById("iframe").contentWindow;
    const editorNoteTitle = document.getElementById("editorNoteTitle");

    wspFrame.focus();
    wspFrame.print();

  });
});
