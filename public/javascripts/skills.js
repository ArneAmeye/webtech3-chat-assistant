let saveBtn = document.querySelector(".skills").addEventListener("change", e => {
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
                e.target.setAttribute("data-edited", 1)
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
                e.target.setAttribute("data-edited", 0)
            }).catch(err => {
                console.log(err);
            })
        }
        
    }
})