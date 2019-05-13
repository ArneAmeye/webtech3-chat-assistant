let loginBtn = document.querySelector('.btn--login').addEventListener("click", ()=>{
    let username = document.querySelector('#myUsername').value;
    let password = document.querySelector('#myPassword').value;
    console.log(username)
    console.log(password)
    fetch('http://localhost:3000/users/login', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response =>{
        return response.json();
    }).then(json =>{
        if(json.status === "success"){
            console.log("gelukt")
            // let feedback = document.querySelector('.alert');
            // feedback.textContent = "Register is complete!";
            // feedback.classList.remove('hidden');
        }
    })
});