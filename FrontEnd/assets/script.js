const gallery = document.querySelector(".gallery");
const filter = document.getElementById("filter");
const filterBtn = document.querySelectorAll("#filter button");
const header=document.querySelector("header");
const editMode=document.getElementById("edit-mode");
const login=document.querySelector("#login a");
const back=document.querySelector("#return");
const editBtn=document.querySelector("#projet-title button");
const modale=document.querySelector("aside");
const overlay=document.getElementById("overlay");
const galleryMdl=document.getElementById("gallerie-modale");
const closeBtn=document.getElementById("close");
const titleMdl=document.getElementById("title-modale");
const form=document.querySelector("aside form");
const select=document.querySelector("aside select");
const mdlBtn=document.querySelector('[data-id="add-photo"]');
const addBlock=document.getElementById("add-block");
const addFile=document.getElementById("add-file");
const preview=document.getElementById("preview");
const addLabel=document.querySelector(".add-block-btn");
const addP=document.querySelector("#add-p");
const token = sessionStorage.getItem("token");
const formImg= document.getElementById("img-form");
const imageTitle=document.getElementById("img-title");
const toHide = document.getElementById("to-hide");
const formContact=document.getElementById("formContact")

document.addEventListener('DOMContentLoaded', function() {
printWork()
printFilter()

});
if (window.__liveReloadEnabled) {
    console.warn("Désactivation de LiveReload !");
    window.__liveReloadEnabled = false;
    window.stop(); // Arrête tout chargement supplémentaire
}


formContact.addEventListener("submit",(event)=>{
    event.preventDefault();
})


// Récupérer les travaux
const printWork = () => {
    gallery.innerHTML="";

    fetch("http://localhost:5678/api/works")
    .then(response =>response.json())
    .then(works=>{
        localStorage.setItem("worksItem",JSON.stringify(works));
        works.forEach(element => {
            gallery.innerHTML += `<figure class="I${element.id}"><img src ="${element.imageUrl}" alt="${element.title}">
            <figcaption>${element.title}</figcaption>
            </figure>`
       
        });
    
    })
    .catch(error=>console.error("Error:",error))

};
// Récupérer les catégories pour créer les bouttons
const printFilter = ()=>{
    filter.innerHTML=`<button data-id="Tous">Tous</button>`;
  
    const categoriesSet = new Set();

    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories =>{
        localStorage.setItem("categoriesItem",JSON.stringify(categories))
        
        categories.forEach(element => {
            categoriesSet.add(element.name)
        })
        const categoriesArray = [...categoriesSet];
     
        categoriesArray.forEach(categorie=>{
          
            filter.innerHTML+=`<button data-id="${categorie}">${categorie}</button>`
        
        })

    })
    .catch(error=>console.error("Error:",error))

};
//afficher les éléments de la catégorie mise en paramètre
const printCategorie=(cat)=>{
    gallery.innerHTML="";
    const works=JSON.parse(localStorage.getItem("worksItem"))
    
   
        works.forEach(element =>{
            if(element.category.name === cat){
                gallery.innerHTML += `<figure class="I${element.id}"><img src ="${element.imageUrl}" alt="${element.title}">
                <figcaption>${element.title}</figcaption>
                </figure>`

            }
        })
    }

//event listener sur la barre de filtre et réutilisation des fonctions
    
filter.addEventListener("click",(event)=>{
    gallery.innerHTML="";
        if(event.target.dataset.id==="Tous"){
            works=JSON.parse(localStorage.getItem("worksItem"))
            works.forEach(element => {
                gallery.innerHTML += `<figure><img src ="${element.imageUrl}" alt="${element.title} class="I${element.id}"
                <figcaption>${element.title}</figcaption>
                </figure>`

            
            
        })
    }
        else{
            
            printCategorie(event.target.dataset.id)
        }

    });


    // ***********************************************************Si l'utilisateur est connecté*********************************************************************


    if(sessionStorage.getItem("token")){

   
    
    
    header.style.paddingTop = "50px";
    editMode.style.display="flex";
    editBtn.style.display="flex";
    filter.style.display="none";
    login.innerHTML ="logout";
    login.href="#";
    gallery.style.marginTop="50px";
    

    login.addEventListener("click",() =>{
        sessionStorage.clear();
        window.location.reload();
    })

  

    // Si la modale est active

    editBtn.addEventListener("click",()=>{
        
        modale.style.display="flex";
        overlay.style.display="block";
        printMdl();
        returnMdl();
        formImg.style.display="flex";
        toHide.style.display="none";
        



        document.addEventListener("click",(event)=>{
           
            if(event.target.id === "overlay" || event.target.id ==="close"){
                modale.style.display="none";
                overlay.style.display="none";
                galleryMdl.innerHTML="";
            };

            if(event.target.dataset.id==="add-photo"){
                
                if(event.target.getAttribute("value")==="Ajouter une photo"){
                    mdlBtn.disabled=false;
                    mdlBtn.style.backgroundColor="#1D6154";
                    
                    addPhotoMdl()
                    
                   
                };
              
          
            };
        
        });
    


    });
      
    


const deleteWork = (id)=> {

 
   
    fetch(`http://localhost:5678/api/works/${id}`,{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "accept": "*/*",
            "Authorization":`Bearer ${token}`
    }})
    .then(response => {
       
        if(!response.ok){
            alert("Erreur lors de la suppression")
        }
        else{
            
            const item =document.querySelectorAll(`.I${id}`)
            item.forEach(element=>element.remove())
            modale.style.display="none";
            overlay.style.display="none";
            const works = JSON.parse(localStorage.getItem("worksItem"));
            const updatedWorks = works.filter(work => work.id !== parseInt(id)); 
            localStorage.setItem("worksItem", JSON.stringify(updatedWorks));
            
        }

    })
    .catch(error => console.error("Erreur:",error))

  
    };
  

const addPhotoMdl=()=>{
   
    preview.src="assets/icons/picture.png";
    preview.style.width="76px";
    preview.style.height="76px";
    titleMdl.innerHTML="Ajout photo";
    galleryMdl.style.display="none";
    form.style.display="flex";
    mdlBtn.value="Valider";
    addLabel.style.display="flex";
    addP.style.display="block";
    addBlock.style.display="flex";
    back.style.display="block";
    imageTitle.value="";
    toHide.style.display="flex";
    

    back.addEventListener("click",()=>{
        returnMdl();
        
        
     
    })
    addFile.addEventListener("change",()=>{
        if(addFile.files.length >0){
            const file = addFile.files[0];
            if(addFile.files.size> 41000000){
                alert("Le fichier est trop volumineux")
                addFile.value="";
            }
            else{
                const reader = new FileReader();
                reader.onload=function(e){
                    preview.src=e.target.result
                    preview.style.width="129px";
                    preview.style.height="193px";
                    addLabel.style.display="none";
                    addP.style.display="none";

                }
                reader.readAsDataURL(file);

            }
    }

    })
    printOption()

    mdlBtn.disabled=true;
    mdlBtn.style.backgroundColor="#A7A7A7"; 
    formImg.addEventListener("change",checkFormCompletion);
    formImg.addEventListener("input",checkFormCompletion);
    formImg.addEventListener("submit",(event)=>{
        event.preventDefault();
        console.log("hello")
        const formData= new FormData(formImg);
        sendWork(formData);
       
       
    
    })
   
    
       

}

const printMdl = () => {
    galleryMdl.innerHTML="";
   
    const works=JSON.parse(localStorage.getItem("worksItem"))
   
        works.forEach(element => {
            galleryMdl.innerHTML += `<div class="I${element.id}">
            <figure>
            <img class="img-modale" src ="${element.imageUrl}" alt="${element.title}">
           </figure>
           <img class="trash I${element.id}" src="assets/icons/trash.png" data-id="${element.id}">
           </div>`
       
        })
        galleryMdl.addEventListener("click",(event)=>{
        if(event.target.dataset.id && event.target.dataset.id.match(/[0-9]/g)){
            
           
            deleteWork(event.target.dataset.id)
            };
        })
    
    }
    




const returnMdl = ()=>{
    titleMdl.innerText="Galerie photo";
    toHide.style.display="none";
    mdlBtn.disabled=false;
    mdlBtn.style.backgroundColor="#1D6154";
                    
   
    mdlBtn.value="Ajouter une photo";
    addBlock.style.display="none";
    back.style.display="none";
    galleryMdl.style.display="flex";


}

const sendWork=(form)=>{
   
   
    
   
     fetch("http://localhost:5678/api/works",{
        method:"POST",
        headers:{
          
            "Authorization":`Bearer ${token}`
            
        },
        body:form
        })
        .then(response =>response.JSON)
        .then(data => console.log(data))
           
        
           
         
        .catch(error => console.error("Error:", error));

   
     };
     


     const printOption =() =>{
        const categories=JSON.parse(localStorage.getItem("categoriesItem"))
      
            select.innerHTML=`<option value="none">Sélectionner une catégorie</option>`;
         
            categories.forEach(categorie=>{
                let option = document.createElement("option");
                option.value=categorie.id;
                option.textContent=categorie.name;
                select.appendChild(option);
               

            })
    
        }
        

     const checkFormCompletion = () => {
        const formData = new FormData(formImg);
      

        if (formData.get("title") && formData.get("category") !== "none" && formData.get("image").size > 0) {
           
            mdlBtn.disabled = false;
            mdlBtn.style.backgroundColor = "#1D6154";
        } else {
            
            mdlBtn.disabled = true;
            mdlBtn.style.backgroundColor = "#A7A7A7";
        }
    };

    }