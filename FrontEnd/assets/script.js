const gallery = document.querySelector(".gallery")
const filter = document.getElementById("filter")

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

}

const printFilter = ()=>{
    filter.innerHTML=`<button>Tous</button>`
    const categoriesSet = new Set();

    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories =>{
        categories.forEach(element => {
            categoriesSet.add(element.name)
        })
        const categoriesArray = [...categoriesSet];
        categoriesArray.forEach(categorie=>{
            filter.innerHTML += `<button>${categorie}</button>`
        })

    })
}
printWork()
printFilter()