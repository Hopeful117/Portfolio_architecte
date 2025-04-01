const gallery = document.querySelector(".gallery")
const filter = document.getElementById("filter")
const filterBtn = document.querySelectorAll("#filter button")
const header=document.querySelector("header")
const editMode=document.getElementById("edit-mode")
const login=document.querySelector("#login a")
const back=document.querySelector("#return")
const editBtn=document.querySelector("#projet-title button")
const modale=document.querySelector("aside")
const overlay=document.getElementById("overlay")
const galleryMdl=document.getElementById("gallerie-modale")
const closeBtn=document.getElementById("close")
const titleMdl=document.getElementById("title-modale")
const form=document.querySelector("aside form")
const select=document.querySelector("aside select")
const mdlBtn=document.querySelector('[data-id="add-photo"]')
const addBlock=document.getElementById("add-block")
const addFile=document.getElementById("add-file")
const preview=document.getElementById("preview")
const addLabel=document.querySelector(".add-block-btn")
const addP=document.querySelector("#add-p")
const token = localStorage.getItem("token");
const formImg= document.getElementById("img-form")
const imageTitle=document.getElementById("img-title")
const toHide = document.getElementById("to-hide")

document.addEventListener('DOMContentLoaded', function() {
printWork()
printFilter()

})


const printWork = () => {
    gallery.innerHTML="";

    fetch("http://localhost:5678/api/works")
    .then(response =>response.json())
    .then(works=>{
        works.forEach(element => {
            gallery.innerHTML += `<figure><img src ="${element.imageUrl}" alt="${element.title}"
            <figcaption>${element.title}</figcaption>
            </figure>`
       
        });
    
    })
    .catch(error=>console.error("Error:",error))

}

const printFilter = ()=>{
    filter.innerHTML=`<button data-id="Tous">Tous</button>`
  
    const categoriesSet = new Set();

    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories =>{
        
        categories.forEach(element => {
            categoriesSet.add(element.name)
        })
        const categoriesArray = [...categoriesSet];
     
        categoriesArray.forEach(categorie=>{
          
            filter.innerHTML+=`<button data-id="${categorie}">${categorie}</button>`
        
        })

    })
    .catch(error=>console.error("Error:",error))

}

const printCategorie=(cat)=>{
    gallery.innerHTML="";
    fetch("http://localhost:5678/api/works")
    .then(response =>response.json())
    .then(works=>{
        works.forEach(element =>{
            if(element.category.name === cat){
                gallery.innerHTML += `<figure><img src ="${element.imageUrl}" alt="${element.title}"
                <figcaption>${element.title}</figcaption>
                </figure>`

            }
        })
    })
}

    filter.addEventListener("click",(event)=>{
        if(event.target.dataset.id==="Tous"){
            
            printWork()
        }
        else{
            
            printCategorie(event.target.dataset.id)
        }

    })


    // Si l'utilisateur est connecté


    if(localStorage.getItem("token"))
{
   
    
    
    header.style.paddingTop = "50px";
    editMode.style.display="flex";
    editBtn.style.display="flex";
    filter.style.display="none";
    login.innerHTML ="logout";
    login.href="#"
    gallery.style.marginTop="50px";
    

    login.addEventListener("click",() =>{
        localStorage.clear();
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
                galleryMdl.innerHTML=""
            }

            if(event.target.dataset.id==="add-photo"){
                event.preventDefault();
                if(event.target.getAttribute("value")==="Ajouter une photo"){
                    mdlBtn.disabled=false;
                    mdlBtn.style.backgroundColor="#1D6154";
                    
                    addPhotoMdl()
                    
                   
                }
              
          
            }
           if(event.target.dataset.id && event.target.dataset.id.match(/[0-9]/g)){
            deleteWork(event.target.dataset.id)
            }

         

           
        })
    


    })
    
}

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
    })
    .catch(error => console.error("Erreur:",error))

  
    }
  

const addPhotoMdl=()=>{
   
    preview.src="assets/icons/picture.png"
    preview.style.width="76px"
    preview.style.height="76px"
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
    formImg.addEventListener("change",(event)=>{
        event.preventDefault();
    
        const formData= new FormData(formImg)
  
        if (formData.get("title") && formData.get("category")!=="none" && formData.get("image")) {
            mdlBtn.disabled =false;
            mdlBtn.style.backgroundColor="#1D6154";
            mdlBtn.addEventListener("click",()=>{
        
               
                sendWork(formData)
            })
           
               
        
        }
   

    })
   
    
   
    
 
   
 
    


}

const printMdl = () => {
   
  

    fetch("http://localhost:5678/api/works")
    .then(response =>response.json())
    .then(works=>{
        works.forEach(element => {
            galleryMdl.innerHTML += `<div>
            <figure>
            <img class="img-modale"  src ="${element.imageUrl}" alt="${element.title}">
           </figure>
           <img class="trash" src="assets/icons/trash.png" data-id="${element.id}">
           </div>`
       
        });
    
    })
    .catch(error=>console.error("Error:",error))

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
    console.log("hello")
   
     fetch("http://localhost:5678/api/works",{
        method:"POST",
        headers:{
          
            "Authorization":`Bearer ${token}`
        },
        body:form
        })
        .then(response => response.json()) 
        .then(data => console.log("Réponse du serveur : ", data))
        .catch(error => console.error("Error:", error));

   
     }


     const printOption =() =>{
        const categoriesSet = new Set();
        fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories =>{
            
            categories.forEach(element => {
                categoriesSet.add(element)
            })
            
            select.innerHTML=`<option value="none">Sélectionner une catégorie</option>`
         
            categoriesSet.forEach(categorie=>{
                let option = document.createElement("option");
                option.value=categorie.id
                option.textContent=categorie.name
                select.appendChild(option)
               
                
              
                
            
            })
    
        })
        .catch(error=>console.error("Error:",error))

     }


    