// CLIENT-SIDE
window.addEventListener("load", getAllSkills());

let saveSkill = document.querySelector(".profile__skills").addEventListener("change", e => {
    if(e.target.classList.contains("profile__skill")){
        let skill = e.target.getAttribute("data-skill");
        
        if( e.target.getAttribute("data-edited") == 0 ){
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
        
        //check if message posted successfully
       if(res['status'] == "success"){
            let marked = res.data.skills;
            
            // loop true skills
            for(let i = 0; i < marked.length; i++){
                // select element by data-skill attribute by res.data.skills.skill
                let markedSkill = document.querySelector(`[data-skill='${marked[i].skill}']`);
                // check those skills and edit data-edited attribute
                markedSkill.checked = true;
                markedSkill.setAttribute("data-edited", 1);
            }
       }

    });
}