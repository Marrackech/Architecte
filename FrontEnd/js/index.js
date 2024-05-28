
//variables

const gallery = document.querySelector(".gallery");
const body = document.querySelector("body");
const containerFiltres = document.querySelector(".container-filtres");



// Variables for conexion
const logOut = document.getElementById("login-link");
const sectionPortfolio = document.querySelector("#portfolio");
const sectionPortfolioH2 = document.querySelector("#portfolio h2");

// connexion
const token = window.sessionStorage.getItem("token");
const user = window.sessionStorage.getItem("userId");



const adminText = "Modifier";

const adminLogo = `<i class="fa-regular fa-pen-to-square"></i>`;
const adminConexionUP = `<div class="admin-edit">
<p>${adminLogo}${adminText}</p>

</div>`;



const divEdit = document.createElement("div");
const spanEdit = document.createElement("span");
const adminConexionDown = `${adminLogo}  ${adminText} `;

// une requête a l API /
async function getWorks() {
  const requete = await fetch("http://localhost:5678/api/works");
  return requete.json();
}
async function getCategory() {
  const requete = await fetch("http://localhost:5678/api/categories");
  return requete.json();
}

async function main() {
  displayWorksGallery();
  createAllButtons();
  logginAdmin();
  logoutAdmin();
  displayByCategory();
}
main();

// affichage des works dans la page /
function displayWorksGallery() {
  gallery.innerHTML = "";
  getWorks().then((data) => {
    //crer pour chaque élément du tableau
    
    data.forEach((work) => {
      createWork(work);
    });
  });
}

function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  img.src = work.imageUrl;
  img.alt = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// filter mode


/*loop for creates  bouton by categorie*/
function createAllButtons() {
  getCategory().then((data) => {
    data.forEach((category) => {
      createButton(category);
    });
  });
}
function createButton(category) {
  const btn = document.createElement("button");
  btn.classList.add("buttons-filtres");
  btn.textContent = category.name;
  btn.id = category.id;
  containerFiltres.appendChild(btn);

}

// fonctionner  boutons filtres
async function displayByCategory() {
  const works = await getWorks();
  const buttons = document.querySelectorAll(".container-filtres button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
      const btnId = e.target.id;
      gallery.innerHTML = "";
      works.forEach((work) => {
        if (btnId == work.categoryId) {
          createWork(work);
         
        }
        if (btnId == "0") {
          createWork(work);
        
        }
      });
    });
  });
 
}

/*Login part*/
function logginAdmin() {
  if (user) {
    // if log in 
   
    logOut.textContent = "logout";
    document.body.insertAdjacentHTML("afterbegin", adminConexionUP);
    spanEdit.innerHTML = adminConexionDown;
    divEdit.classList.add("div-edit");
    divEdit.appendChild(sectionPortfolioH2);
    divEdit.appendChild(spanEdit);
    sectionPortfolio.prepend(divEdit);
    containerFiltres.style = "display:none";
  } else {
    // not log in

  }
}

/*Suprim  userToken by storage if click in log Out*/
function logoutAdmin() {
  logOut.addEventListener("click", () => {
    if (user) {
      window.sessionStorage.setItem("token", "");
      logOut.textContent = "login";
      window.sessionStorage.setItem("userId", "");
      window.location.href = "index.html";
    } else {
      //go back login page
      window.location.href = "login.html";
    }
  });
}
