
const form = document.querySelector("form")


form.addEventListener("submit",(event)=>{
        event.preventDefault()
        email=event.target.querySelector("#email").value
        password=event.target.querySelector("#password").value
        userLogin(email,password)
    })



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
    })
    .then(data => {
        if (data.token){
            localStorage.setItem("token",data.token);
            localStorage.setItem("userId",data.userId);
            window.location.href="index.html";
        }
        else {
            alert("L'authentification à echoué")
        }
    })
    .catch(error=> console.error("Erreur :", error))
   
   
}
