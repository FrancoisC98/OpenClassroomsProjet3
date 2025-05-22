let allProjects = [];

fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    allProjects = data; // stocke la liste dans la variable globale
    
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // on vide la galerie pour ne pas avoir d'anciens contenus
    

    filterProjects(0); // si tu veux appliquer un filtre dès le chargement
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des travaux :", error);
  });





// LES FILTRES //

const filterButtons = document.querySelectorAll(".filters");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    filterButtons.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const categoryId = parseInt(button.dataset.id);

    filterProjects(categoryId);
  });
});

function filterProjects(categoryId) {

    const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  allProjects.forEach(project => {
    if (categoryId === 0 || project.categoryId === categoryId) {

      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");

      img.src = project.imageUrl;
      img.alt = project.title;
      caption.innerText = project.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    }
  });
}