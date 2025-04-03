//Le formulaire est vidé à chaque chargement
const form = document.querySelector("form")
document.addEventListener('DOMContentLoaded', function() {
    clearPage()
   
    });


//Listener sur le form
form.addEventListener("submit",(event)=>{
        event.preventDefault()
        email=event.target.querySelector("#email").value
        password=event.target.querySelector("#password").value
        userLogin(email,password)
    });


//fonction pour verifier le login par l'api
const userLogin =(userEmail,userMdp)=>{
    fetch("http://localhost:5678/api/users/login",{
        method:"POST",
        headers:{"Content-Type": "application/json" },
        body:
         JSON.stringify({
            email:userEmail,
            password:userMdp

         })
    })
    .then(response =>{
        if(!response.ok){
            alert("Email ou mot de passe incorrect")
        }
        return response.json();
    })
    .then(data => {
        if (data.token){
           
            sessionStorage.setItem("token",data.token);
          
            sessionStorage.setItem("userId",data.userId);
            window.location.href="index.html";
        }
        else {
            alert("L'authentification à echoué")
        }
    })
    .catch(error=> console.error("Erreur :", error))
   
   
};

const clearPage = () => {
    document.getElementById("email").value ="";
    document.getElementById("password").value="";
    
}