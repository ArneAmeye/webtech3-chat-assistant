// CLIENT-SIDE
window.addEventListener("load", getAllSkills());

let saveSkill = document.querySelector(".skills").addEventListener("change", e => {
    if(e.target.classList.contains("skill")){
        let skill = e.target.getAttribute("data-skill");
        //console.log(skill);
        if( e.target.getAttribute("data-edited") == 0 ){
            console.log("save");
            fetch('http://localhost:3000/users/profile/' + skill, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Autorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "userId": localStorage.getItem('user_id'),
                    "skill": skill
                })
            }).then(result =>{
                return result.json();
            }).then(json =>{
                console.log(json);
                e.target.setAttribute("data-edited", 1);
            }).catch(err => {
                console.log(err);
            })
        }else{
            console.log("update");
            fetch('http://localhost:3000/users/profile/' + skill, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Autorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "userId": localStorage.getItem('user_id'),
                    "skill": skill
                })
            }).then(result =>{
                return result.json();
            }).then(json =>{
                console.log(json);
                e.target.setAttribute("data-edited", 0);
            }).catch(err => {
                console.log(err);
            })
        }
        
    }
})
// Get all skills via API
function getAllSkills(){
    let userId = localStorage.getItem('user_id');
    fetch('http://localhost:3000/users/profile/' + userId, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + localStorage.getItem('token')
        }
    })
    .then(res=>{
       return res.json();
    })
    .then(res => {
        console.log(res);
        //check if message posted successfully
       if(res['status'] == "success"){
            alert("yo!");
            
       }

    });
}