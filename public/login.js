const loginBtn = document.querySelector(".btn-login");
const loginMsg = document.querySelector(".login-msg");


const displayErrorMsg = () => {
    loginMsg.style.visibility = "visible";
    setTimeout(()=> {loginMsg.style.visibility = "hidden"}, 5000);
}

loginBtn.addEventListener("click", async()=> {
    const email = document.querySelector(".input-user");
    const password = document.querySelector(".input-password");

    const tkn = await axios.post("/api/v1/auth/login", {"email": email.value, "password":password.value})
                           .then((res)=> {
                               if(res.status === 200) {
                                   localStorage.setItem("token", res.data.token);
                                   console.log("authenticated")
                               }
                           })
                           .catch((err)=> {
                               console.log(err);
                               displayErrorMsg();
                           })
})

