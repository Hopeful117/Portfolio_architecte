const gallery = document.querySelector(".gallery")
const filter = document.getElementById("filter")
const filterBtn = document.querySelectorAll("#filter button")

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
            console.log("test")
            printWork()
        }
        else{
            console.log("test")
            printCategorie(event.target.dataset.id)
        }

    })


    // Si l'utilisateur est connecté


    if(localStorage.getItem("token"))
{
    const header=document.querySelector("header")
    const editMode=document.getElementById("edit-mode")
    const login=document.querySelector("#login a")
    const gallery= document.querySelector(".gallery")
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

    const printMdl = () => {

        fetch("http://localhost:5678/api/works")
        .then(response =>response.json())
        .then(works=>{
            works.forEach(element => {
                galleryMdl.innerHTML += `<div>
                <figure>
                <img class="img-modale" src ="${element.imageUrl}" alt="${element.title}">
               </figure>
               <img class="trash" src="assets/icons/trash.png">
               </div>`
           
            });
        
        })
        .catch(error=>console.error("Error:",error))

    }

    // Si la modale est active

    editBtn.addEventListener("click",()=>{
        const categoriesSet = new Set();
        modale.style.display="flex";
        overlay.style.display="block";
        printMdl();



        document.addEventListener("click",(event)=>{
            if(event.target.id === "overlay" || event.target.id ==="close"){
                modale.style.display="none";
                overlay.style.display="none";
                galleryMdl.innerHTML=""
            }

            if(event.target.dataset.id==="add-photo"){
                titleMdl.innerHTML="Ajout photo"
                galleryMdl.style.display="none"
                form.style.display="flex"
                mdlBtn.value="Valider"
                addBlock.style.display="flex"
                fetch("http://localhost:5678/api/categories")
                .then(response => response.json())
                .then(categories =>{
                    
                    categories.forEach(element => {
                        categoriesSet.add(element.name)
                    })
                    const categoriesArray = [...categoriesSet];
                 
                    categoriesArray.forEach(categorie=>{
                        let option = document.createElement("option");
                        option.value=categorie
                        option.textContent=categorie
                        select.appendChild(option)
                       
                        
                      
                        
                    
                    })
            
                })
                .catch(error=>console.error("Error:",error))


            }
        })
    


    })
    
}