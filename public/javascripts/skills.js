let saveBtn = document.querySelector(".skills").addEventListener("change", e => {
    if(e.target.classList.contains("skill")){
        let skill = e.target.getAttribute("data-skill");
        //console.log(skill);

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
        }).catch(err => {
            console.log(err);
        })
    }

    // let checkboxes = document.querySelectorAll(".skills");
    // let names = [];
    // let selected = [];
    // for (let i=0; i<checkboxes.length; i++) {
    //         selected.push(checkboxes[i].checked);
    //         names.push(checkboxes[i].name);
    // }
    // let everything = toObject(names,selected);
    // // console.log(everything)



    // e.preventDefault();
})

// function toObject(names, selected) {
//     var result = {};
//     for (var i = 0; i < names.length; i++)
//          result[names[i]] = selected[i];
//     return result;
// }