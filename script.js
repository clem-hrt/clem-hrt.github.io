function showSection(id) {



  // hide all sections

  document.querySelectorAll(".section").forEach(sec => {

    sec.classList.remove("active");

  });



  // remove active from tabs

  document.querySelectorAll(".tab").forEach(tab => {

    tab.classList.remove("active");

  });



  // show selected section

  document.getElementById(id).classList.add("active");



  // activate clicked tab

  event.target.classList.add("active");

}
