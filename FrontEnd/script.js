console.log("🎉 script.js bien chargé !");


// On déclare une variable globale pour stocker tous les projets récupérés depuis l'API
let allProjects = [];
let categorie = [];

// FILTRES //

// Récupérer les catégories depuis l'API
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
    categories = data;

    // Générer dynamiquement les boutons filtres
    const filtersContainer = document.querySelector(".filters-containers");
    filtersContainer.innerHTML = ""; // vider d'abord au cas où

    // Ajouter le bouton "Tous" à la main, car il n'existe pas dans l'API (ou tu peux vérifier)
    const allBtn = document.createElement("button");
    allBtn.classList.add("filters-active"); // actif par défaut
    allBtn.dataset.id = 0;
    allBtn.textContent = "Tous";
    filtersContainer.appendChild(allBtn);

    // Ajouter les boutons pour chaque catégorie récupérée
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.classList.add("filters");
      btn.dataset.id = cat.id;  // récupère l'id de la catégorie depuis l'API
      btn.textContent = cat.name;  // récupère le nom de la catégorie
      filtersContainer.appendChild(btn);
    });

    // Maintenant que les boutons sont créés, on peut ajouter les événements dessus
    addFilterEvents();
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des catégories :", error);
  });


  // BOUTONS //

// On effectue une requête pour récupérer les projets depuis le back-end
fetch("http://localhost:5678/api/works")
  .then(response => response.json())   // On convertit la réponse en format JSON
  .then(data => {
    allProjects = data; // stocke la liste dans la variable globale
    

// On sélectionne la galerie dans le DOM
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // on vide la galerie pour ne pas avoir d'anciens contenus
    
// On affiche tous les projets au chargement de la page (filtre "Tous")
    filterProjects(0);
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des travaux :", error);
  });


// Fonction pour ajouter les événements sur les boutons filtres
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

// Cette fonction affiche uniquement les projets qui correspondent à la catégorie donnée
function filterProjects(categoryId) {

    // On sélectionne à nouveau la galerie et on la vide pour afficher une nouvelle sélection
    const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  // On parcourt tous les projets récupérés depuis l'API
  allProjects.forEach(project => {

    // On vérifie : si la catégorie est 0 ("Tous"), on affiche tout
    // Sinon, on affiche uniquement les projets qui ont la bonne catégorie
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


function handleLogin(event) {
  event.preventDefault();
  console.log("handleLogin déclenchée");

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  console.log("Email:", email, "Password:", password);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  .then(res => {
    console.log("Status:", res.status);
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("Réponse serveur :", data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      throw new Error("Pas de token reçu");
    }
  })
  .catch(error => {
    console.error("Erreur dans fetch:", error);
    const errorMsg = document.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.textContent = error.message || "Erreur inconnue";
      errorMsg.style.display = "block";
    }
  });
}

document.querySelector('form.email').addEventListener('submit', handleLogin);