
// Variables Globales
const modalContent = document.getElementById("modalContent");
const modalGallery = document.querySelector(".modalGallery");
//Variables pour l affichage de la deuxieme mmodale partie
const buttonAddPhoto = document.querySelector(".container-button button");
const modalPortfolio = document.querySelector(".modalPortfolio");
const modalAddWorks = document.querySelector(".modalAddWorks");
//Variables Pour le form
const formAddWorks = document.querySelector("#formAddWorks");
const labelFile = document.querySelector("#formAddWorks label")
const previewImage = document.getElementById("previewImage");
const paragraphFile = document.querySelector("#formAddWorks p")
const inputFile = document.querySelector("#file");

const inputTitle = document.querySelector("#title");
const inputCategory = document.querySelector("#categoryInput");
//Fonction Principale pour l'affichage des works dans la Modale
function mainModal() {
  displayCategoryModal();
  if (user) {
    displayModal();
    displayWorksModal();
    closeModalGallery();
    displayModalAddWorks();
    returnToModalPortfolio();
    addWorks();
    prevImg();
    verifFormCompleted();
  }
}
mainModal();

// Affichage de la Modal uniquement si conecte grace au click sur le bouton modifie
function displayModal() {
  const modeEdition = document.querySelector(".div-edit span");
  modeEdition.addEventListener("click", () => {
   
    modalContent.style.display = "flex";
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
  });
}
// recuperation des works et appel de la fonction de creation de works dans la gallery de la modal
function displayWorksModal() {
  modalGallery.innerHTML = "";
  getWorks().then((works) => {
    //Boucle qui parcours  nos works
    
    works.forEach((work) => {
      createWorkModal(work);
    });
    deleteWork();
  });
}
// creation des balises et injection des donnes a partir du fetchworks
function createWorkModal(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const span = document.createElement("span")
  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = work.id;
  img.src = work.imageUrl;
  img.alt = work.title;
  span.appendChild(trash)
  figure.appendChild(img);
  figure.appendChild(span);
  modalGallery.appendChild(figure);
}
//Gestion de lafermeture des modale
function closeModalGallery() {
  //Fermuture de lamodal sur la croi a
  const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
  xmarkModal.addEventListener("click", () => {
    modalContent.style.display = "none";
  });
  //Fermuture de lamodal sur la croi b
  const xmarkModal2 = document.querySelector(".modalAddWorks span .fa-xmark");
  xmarkModal2.addEventListener("click", () => {
    //Supression de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    modalContent.style.display = "none";
  });

  //Fermeture de la modal sur le container grise
  body.addEventListener("click", (e) => {
    if (e.target == modalContent) {
      //Supression de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    modalContent.style.display = "none";
    
    }
  });
}

//Supression dees works grace a la methode DELETE et au token user depuis la poubelle de la modale
//Objet   paramétrage  de la requette DELETE avec token
const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "same-origin",
};
//Supression au click sur la poubelle et mise a jour modale et gallery principale
function deleteWork() {
  const trashs = document.querySelectorAll(".fa-trash-can")

  trashs.forEach(trash => {
    trash.addEventListener("click", (e) => {
      const workID = trash.id;
     
      fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID).then(
        () => {
          displayWorksModal();
          displayWorksGallery();
        }
      );
    });
  });
}

//fonction d affichage au click sur btn "ajouter-photo" de la modalAddWorks
function displayModalAddWorks() {
  buttonAddPhoto.addEventListener("click", () => {
    modalPortfolio.style.display = "none";
    modalAddWorks.style.display = "flex";
  });
}

// Retour sur modalPortfolio depuis la fleche de la modalAddWorks
function returnToModalPortfolio() {
  const arrowLeftModalWorks = document.querySelector(
    ".modalAddWorks .fa-arrow-left"
  );
  arrowLeftModalWorks.addEventListener("click", () => {
    //Supréssion de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    console.log("coucou");
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
  });
}
//Function add projet
function addWorks() {
  formAddWorks.addEventListener("submit", (e) => {
    e.preventDefault();
    // Recuperer value du Formulaire
    const formData = new FormData(formAddWorks);
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du fichier");
        }
        return response.json();
      })
      .then((data) => {
   
        displayWorksModal();
        displayWorksGallery();
        formAddWorks.reset();
        modalPortfolio.style.display = "flex";
        modalAddWorks.style.display = "none";
        previewImage.style.display = "none";
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
  });
}

//Fonction how generates categoris dynamiquement pour la modale
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categorys = await getCategory();
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
//fonction prévisualisation de l'image
function prevImg() {
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
 
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
     
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });
}
// fontion verify if all  les inputs are empty
function verifFormCompleted() {
  const buttonValidForm = document.querySelector(
    ".container-button-add-work  button"
  );
  formAddWorks.addEventListener("input", () => {
    if (!inputTitle.value == "" && !inputFile.files[0] == "") {
      buttonValidForm.classList.remove("button-add-work");
      buttonValidForm.classList.add("buttonValidForm");
    } else {
      buttonValidForm.classList.remove("buttonValidForm");
      buttonValidForm.classList.add("button-add-work");
    }
  });
}
