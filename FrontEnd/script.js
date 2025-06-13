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


// AJOUT MODALE //


const formAddPhoto = document.getElementById("formAddPhoto");
const openBtn = document.getElementById('openModale');
const modale = document.getElementById('modale');
const closeBtn = document.getElementById('closeModale');

const galleryContent = document.querySelector('.modale-content');
const galleryModale = document.querySelector('.gallery-modale');
const addPhotoContent = document.querySelector('.modale-add-photo-content');

const addPhotoBtn = document.querySelector('.add-photos');
const backToGalleryBtn = document.getElementById('backToGallery');


if (token) {
  openBtn.style.display = 'flex';

  openBtn.addEventListener('click', () => {
    modale.style.display = 'flex';
    galleryContent.style.display = 'block';
    addPhotoContent.style.display = 'none';
    renderGallery();
  });

  closeBtn.addEventListener('click', () => {
    modale.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modale) {
      modale.style.display = 'none';
    }
  });


  addPhotoBtn.addEventListener('click', () => {
    galleryContent.style.display = 'none';
    addPhotoContent.style.display = 'flex';



  });


  backToGalleryBtn.addEventListener('click', () => {
    addPhotoContent.style.display = 'none';
    galleryContent.style.display = 'block';

    renderGallery();
  });
}



// 🔄 Fonction pour remplir la galerie de la modale
function renderGallery() {
  galleryModale.innerHTML = "";

  allProjects.forEach(project => {
    const figure = document.createElement("figure");
    figure.classList.add("modale-figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    trash.dataset.id = project.id;

    figure.appendChild(img);
    figure.appendChild(trash);
    galleryModale.appendChild(figure);
  });
}




// CATEGORIE

formAddPhoto.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formAddPhoto);
  const imageFile = document.getElementById('imageInput').files[0];
  const title = formData.get('title');
  const category = formData.get('category');

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
  .then(response => response.json())
  .then(newProject => {

    allProjects.push(newProject);
    reloadGallery(); 
    formAddPhoto.reset(); 
    alert("Photo ajoutée avec succès !");
  })
  .catch(err => console.error("Erreur lors de l'ajout :", err));
});


// AJOUTER IMG


const uploadPhotoBtn = document.getElementById("uploadPhoto");
const photoFileInput = document.getElementById("photoFile");

uploadPhotoBtn.addEventListener("click", () => {
  event.preventDefault();
  photoFileInput.click(); 
});

const previewImage = document.getElementById("previewImage");
const photoIcon = document.getElementById("photoIcon");
const uploadButton = document.getElementById("uploadPhoto");
const fileInfo = document.querySelector(".file-info");

photoFileInput.addEventListener("change", () => {
  const file = photoFileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      photoIcon.style.display = "none";
      uploadButton.style.display = "none";
      fileInfo.style.display = "none";
    };
    reader.readAsDataURL(file);

    const selectedFileName = file.name.split('.').slice(0, -1).join('.').toLowerCase();
    const matchingProject = allProjects.find(project => {
    const projectTitle = project.title.toLowerCase();
      return projectTitle.includes(selectedFileName);
    });

    if (matchingProject) {
      fetchWorkData(matchingProject.id); 
    }
  }
});
  

async function fetchWorkData(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`);
    const work = await response.json();

    document.getElementById("photoTitle").value = work.title;
    document.getElementById("photoCategory").value = work.categoryId.toString();

    const previewImage = document.getElementById("previewImage");
    const photoIcon = document.querySelector(".fa-image");
    const uploadButton = document.getElementById("uploadPhoto");
    const fileInfo = document.querySelector(".upload-box p");

    previewImage.src = work.imageUrl;
    previewImage.style.display = "block";
    photoIcon.style.display = "none";
    uploadButton.style.display = "none";
    fileInfo.style.display = "none";
  } catch (error) {
    console.error("Erreur lors du chargement de l'image :", error);
  }
}


// AJOUTER PHOTO DANS LA GALERIE //

formAddPhoto.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!token) {
    alert("Vous devez être connecté pour ajouter une photo.");
    return;  
  }

  const fileInput = document.getElementById("photoFile");
  const titleInput = document.getElementById("photoTitle");
  const categoryInput = document.getElementById("photoCategory");

  if (!fileInput || !titleInput || !categoryInput) {
    alert("Champs manquants dans le DOM.");
    return;
  }

  const image = fileInput.files[0];
  const title = titleInput.value;
  const category = categoryInput.value;


  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const newProject = await response.json();

      allProjects.push(newProject);

      reloadGallery();
      reloadModaleGallery();

      formAddPhoto.reset();

      document.getElementById('modale-add-photo').style.display = 'none';
      document.getElementById('modale').style.display = 'flex';

      alert("Photo ajoutée avec succès !");
    } 

  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    alert("Erreur technique.");
  }
});


// RELOAD MODLAE

function reloadModaleGallery() {
  const galleryModale = document.querySelector(".gallery-modale");
  galleryModale.innerHTML = "";

  allProjects.forEach(project => {
    const figure = document.createElement("figure");
    figure.classList.add("modale-figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    trash.dataset.id = project.id;

    const titleCaption = document.createElement("figcaption");
    titleCaption.textContent = project.title;

    const categoryCaption = document.createElement("span");
    const category = categories.find(cat => cat.id === project.categoryId);
    categoryCaption.textContent = category ? category.name : "Catégorie inconnue";
    categoryCaption.classList.add("caption-category");

    figure.appendChild(img);
    figure.appendChild(titleCaption);
    figure.appendChild(categoryCaption);
    figure.appendChild(trash);
    galleryModale.appendChild(figure);
  });
}
