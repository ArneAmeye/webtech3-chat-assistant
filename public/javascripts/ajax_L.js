let loginBtn = document.querySelector('.btn--login').addEventListener("click", ()=>{
    let username = document.querySelector('#myUsername').value;
    let password = document.querySelector('#myPassword').value;
    
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
            let token = json.data.token;
            let user_id = json.data.user_id;
            let username = json.data.username;
            
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("username", username);
            window.location.href = "http://localhost:3000";
        }else{
            alert("login failed");
        }
    })
});