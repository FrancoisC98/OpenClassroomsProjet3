// On déclare une variable globale pour stocker tous les projets récupérés depuis l'APIMore actions
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

  let password = ""; // déclaration en dehors du if
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    password = passwordInput.value; // assignation si input existe
  }

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


const formAddPhoto = document.getElementById("formAddPhoto");
const openBtn = document.getElementById("openModale");
const modale = document.getElementById("modale");
const closeBtn = document.getElementById("closeModale");
const closeAddPhotoModaleBtn = document.getElementById('closeAddPhotoModale');


const galleryContent = document.querySelector(".modale-content");
const galleryModale = document.querySelector(".gallery-modale");
const addPhotoContent = document.querySelector(".modale-add-photo-content");

const addPhotoBtn = document.querySelector(".add-photos");
const backToGalleryBtn = document.getElementById("backToGallery");

const photoFileInput = document.getElementById("photoFile");
const previewImage = document.getElementById("previewImage");
const photoIcon = document.getElementById("photoIcon");
const uploadButton = document.getElementById("uploadPhoto");
const fileInfo = document.querySelector(".file-info");

const inputTitle = document.getElementById("photoTitle");
const inputCategory = document.getElementById("photoCategory");

// ⚙️ OUVERTURE & FERMETURE DE LA MODALE
if (token) {
  openBtn.style.display = "flex";

  openBtn.addEventListener("click", () => {
    modale.style.display = "flex";
    galleryContent.style.display = "block";
    addPhotoContent.style.display = "none";
    renderGallery();
  });

  closeBtn.addEventListener("click", () => {
    modale.style.display = "none";
  });

  closeAddPhotoModaleBtn.addEventListener('click', () => {
    addPhotoContent.style.display = 'none';
    modale.style.display = 'none';
  });   

  window.addEventListener("click", (e) => {
    if (e.target === modale) {
      modale.style.display = "none";
    }
  });

  addPhotoBtn.addEventListener("click", () => {
    galleryContent.style.display = "none";
    addPhotoContent.style.display = "flex";
  });

  backToGalleryBtn.addEventListener("click", () => {
    addPhotoContent.style.display = "none";
    galleryContent.style.display = "block";
    renderGallery();
  });
}

uploadButton.addEventListener("click", (event) => {
  event.preventDefault();
  photoFileInput.click();
});

photoFileInput.addEventListener("change", () => {
  const file = photoFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    photoIcon.style.display = "none";
    uploadButton.style.display = "none";
    fileInfo.style.display = "none";
  };
  reader.readAsDataURL(file);
});

//  ENVOI FORMULAIRE 

const submitButton = document.querySelector('.submit-btn');


submitButton.addEventListener('click', (e) => {
  e.preventDefault(); // pour éviter un éventuel rechargement si c’est dans un <form>

  const imageFile = document.getElementById('photoFile').files[0];
  const title = document.getElementById('photoTitle').value;
  const category = document.getElementById('photoCategory').value;

  if (!imageFile || !title || !category) {
    alert("Merci de remplir tous les champs !");
    return;
  }

  const newFormData = new FormData();
  newFormData.append('image', imageFile);
  newFormData.append('title', title);
  newFormData.append('category', category);

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: newFormData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l’envoi du formulaire');
      }
      return response.json();
    })
    .then(newProject => {
      allProjects.push(newProject);
      filterProjects(0);
      renderGallery();

      alert("Photo ajoutée avec succès !");
      document.getElementById('photoFile').value = '';
      document.getElementById('photoTitle').value = '';
      document.getElementById('photoCategory').value = '';
      document.getElementById('previewImage').style.display = 'none';
      document.getElementById('photoIcon').style.display = 'block';
      document.getElementById('uploadPhoto').style.display = 'inline-block';
      document.querySelector('.file-info').style.display = 'block';
      modale.style.display ='none';
    })
    .catch(err => {
      console.error('erreur precise', err);
      alert("Une erreur est survenue." + err.message);
    });
});


// 🧼 RÉINITIALISATION PRÉVIEW
function resetPreview() {
  previewImage.style.display = "none";
  photoIcon.style.display = "block";
  uploadButton.style.display = "inline-block";
  fileInfo.style.display = "block";
}

// 🖼️ AFFICHAGE DE LA GALERIE DANS LA MODALE

function renderGallery() {
  galleryModale.innerHTML = "";

  allProjects.forEach((project) => {
    const figure = document.createElement("figure");
    figure.classList.add("modale-figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    trash.dataset.id = project.id;


    trash.addEventListener("click", () => {
      deleteImage(project.id);
    });

    figure.appendChild(img);
    figure.appendChild(trash);
    galleryModale.appendChild(figure);
  });
}

function deleteImage(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // On met à jour le tableau JS :
      allProjects = allProjects.filter((proj) => proj.id !== id);

      // On recharge la galerie principale et la modale
      filterProjects(0);
      renderGallery(); // ← important pour recharger la modale avec les bonnes données
    })
    .catch((error) => {
      console.error(error);
      alert("Impossible de supprimer ce projet.");
    });
}
