const gallery = document.querySelector(".gallery")
const filter = document.getElementById("filter")
const filterBtn = document.querySelectorAll("#filter button")

document.addEventListener('DOMContentLoaded', function() {
printWork()
printFilter()

})


const printWork = () => {

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
    
}