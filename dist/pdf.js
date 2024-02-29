jQuery(document).ready(function () {
  $("#publish").click(function () {
    html2canvas(document.querySelector(".note-space")).then((canvas) => {
      let base64Image = canvas.toDataURL("image/png");
    //   console.log(base64Image);

    let pdf = new jsPDF('p','px',[2480 , 3508]);
    pdf.addImage(base64Image, 'PNG', 5,5, 2480, 1296 );
    pdf.save('ExportedDocs.pdf');
    });
  });
});
