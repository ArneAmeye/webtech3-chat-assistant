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
// Get all skills via API
function getAllSkills(){
    fetch('/api/v1/messages', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + localStorage.getItem('token')
        }
    })
    .then(res=>res.json())
    .then(res => {
        console.log(res);
        //check if message posted successfully
       if(res['status'] == "success"){

            //loop over the messages to add them into the UI
            for(i = 0; i < res.data.length; i++){
            
                // //create messageWrapper div and add it's class
                // let messageWrapper = document.createElement("div");
                // messageWrapper.classList.add("messageWrapper","flex", "flex--container");
                // //set data (id) of the message
                // messageWrapper.dataset.id = res.data[i]._id;

                // //use literal template to add different elements at once (instead of doing multiple createElements)
                // let messageTemplate = ` 
                // <div class="profile flex flex--container">
                //     <img class="profpic flex--item" src="https://fakeimg.pl/75x75/" alt="profPic">
                //     <h4 class="title title--name flex--item" data-user_id="${res.data[i].user_id}">${res.data[i].username}</h4>
                // </div>

                // <h3 class="message title title--message flex--item">${res.data[i].message}</h3>
                // <h5 class="message--time title title--time flex--item">Timestamp here</h5>

                // <div class="iconsWrap flex--item">
                //     <img class="icons icons--pen" src="../images/edit.svg" alt="penIcon">
                //     <img class="icons icons--trash" src="../images/delete.svg" alt="trashIcon">
                // </div>
                // `;
                // //add the chat template inside the messageContainer
                // messageWrapper.innerHTML = messageTemplate;

                // //finally append the messageWrapper to the messagesContainer
                // const messagesContainer = document.querySelector(".messages");
                // messagesContainer.appendChild(messageWrapper);
            }
       }

    });
}