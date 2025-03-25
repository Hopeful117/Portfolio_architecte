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


filterBtn.forEach(button=>{
    button.addEventListener("click",()=>{
        if(button.dataset.id==="Tous"){
            printWork()
        }

    })
} )
