let registerBtn = document.querySelector('.btn--login').addEventListener("click", ()=>{
    let username = document.querySelector('#myUsername').value;
    let password = document.querySelector('#myPassword').value;

    fetch('http://localhost:3000/users/signup', {
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
            // let feedback = document.querySelector('.alert');
            // feedback.textContent = "Register is complete!";
            // feedback.classList.remove('hidden');
        }
    })
});