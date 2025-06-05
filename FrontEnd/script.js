

// On déclare une variable globale pour stocker tous les projets récupérés depuis l'API
let allProjects = [];
let categorie = [];

// FILTRES //

// Récupérer les catégories depuis l'API
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
    categories = data;


    // Générer les boutons filtres
    const token = localStorage.getItem('token');
    if (!token) {
    const filtersContainer = document.querySelector(".filters-containers");

    if (filtersContainer) {
    filtersContainer.innerHTML = ""; 

    const allBtn = document.createElement("button");
    allBtn.classList.add("filters-active");
    allBtn.dataset.id = 0;
    allBtn.textContent = "Tous";
    filtersContainer.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.classList.add("filters");
      btn.dataset.id = cat.id;  // récupère l'id de la catégorie depuis l'API
      btn.textContent = cat.name;  // récupère le nom de la catégorie depuis l'API
      filtersContainer.appendChild(btn);
    });
  }
}
    
    addFilterEvents();
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des catégories :", error);
  });


  // BOUTONS //

// On effectue une requête pour récupérer les projets depuis le back-end
fetch("http://localhost:5678/api/works")
  .then(response => response.json())  
  .then(data => {
    allProjects = data; 
    
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    
// On affiche tous les projets au chargement de la page (filtre "Tous")
    filterProjects(0);
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des travaux :", error);
  });


function addFilterEvents() {
  const filterButtons = document.querySelectorAll(".filters, .filters-active");
  
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const categoryId = parseInt(button.dataset.id);
      filterProjects(categoryId);
    });
  });
}


// IMAGES // FILTRES 

function filterProjects(categoryId) {

    const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  allProjects.forEach(project => {

    if (categoryId === 0 || project.categoryId === categoryId) {

      // On crée les éléments HTML pour afficher le projet
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");

      // On remplit les éléments avec les infos du projet
      img.src = project.imageUrl;
      img.alt = project.title;
      caption.innerText = project.title;

      // On assemble l’image et le titre dans le conteneur "figure"
      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    }
  });
}


// LOGIN //

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Connexion réussie :", data);

      localStorage.setItem("token", data.token);


      window.location.href = "index.html"; 
    } else {
  
      const errorData = await response.json();
      alert("Échec de la connexion : " + errorData.message);
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
    alert("Une erreur est survenue. Vérifie que ton backend tourne !");
  }
});


// LOGOUT //

const loginLink = document.getElementById('login-link');
const token = localStorage.getItem('token')

if(token) {
  loginLink.textContent = 'logout';
  loginLink.href = '#';

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.reload();
  });
}


// EDITION //

if(token) {
const editNav = document.createElement('div');
editNav.classList.add('edit-nav');

const editIcon = document.createElement('icon');
editIcon.classList.add("fa-pen-to-square");

const editText = document.createElement('span');
editText.textContent = 'Mode édition';

editNav.appendChild(editIcon);
editNav.appendChild(editText);

document.body.prepend(editNav)

}
//RETIRER LES FILTRES //

if(token) {
  const filtersContainer = document.querySelector('.filters-containers')
  if (filtersContainer) filtersContainer.remove();
}


// AJOUT MODALE //


const openBtn = document.getElementById('openModale')
const modale = document.getElementById('modale')
const closeBtn = document.getElementById ('closeModale')
const galleryModale = document.querySelector('.gallery-modale')

if(token){
   openBtn.style.display ='flex';

openBtn.addEventListener('click', () => {
  console.log("Bouton cliqué");
  console.log("allProjects au clic :", allProjects);
  modale.style.display = 'flex';
  galleryModale.innerHTML = "";

  allProjects.forEach(project => {
    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;
    galleryModale.appendChild(img);
  });
});


closeBtn.addEventListener('click', () => {
  modale.style.display = 'none';
});


window.addEventListener('click', (e) => {
  if (e.target === modale) {
    modale.style.display = 'none';
  }
});

}


// DELETE IMG //

