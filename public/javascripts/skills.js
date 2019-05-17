let saveBtn = document.querySelector(".btn--save").addEventListener("click", (e) => {
    let checkboxes = document.querySelectorAll(".skills");
    let names = [];
    let selected = [];
    for (let i=0; i<checkboxes.length; i++) {
            selected.push(checkboxes[i].checked);
            names.push(checkboxes[i].name);
    }
    let everything = toObject(names,selected);
    // console.log(everything)



    e.preventDefault();
})

function toObject(names, selected) {
    var result = {};
    for (var i = 0; i < names.length; i++)
         result[names[i]] = selected[i];
    return result;
}