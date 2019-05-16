//CLIENT SIDE

class Message{

    constructor(){
        //check if user has a token
        if(localStorage.getItem('token') == null){
            document.location.href = "http://localhost:3000/login";
        }

        //show all messages
        getAllMessages();

        //Register DOM elements
        const messagesContainer = document.querySelector(".messages");
        const messageInput = document.querySelector("#myMessage");
        const messageBtn = document.querySelector(".btn--send");

        //store this instance in that variable so we can access it later
        let that = this;


        //init primus websocket on this very own page
        this.primus = Primus.connect("/", {
            reconnect: {
                max: Infinity // Number: The max delay before we try to reconnect.
              , min: 500 // Number: The minimum delay before we try reconnect.
              , retries: 10 // Number: How many times we should try to reconnect.
            }
        });


        //primus on data listener ###TODO###
        this.primus.on("data", function(data){
            console.log(data);

            //if it data contains a message: we should create an element and append it to the chatbox!
            if(data.message){
                //create messageWrapper div and add it's class
                let messageWrapper = document.createElement("div");
                messageWrapper.classList.add("messageWrapper", "flex", "flex--container");
                //set data (id) of message
                messageWrapper.dataset.id = data.id;

                //use literal template to add different elements at once (instead of doing multiple createElements)
                let messageTemplate = ` 
                <div class="profile flex flex--container">
                    <img class="profpic flex--item" src="https://fakeimg.pl/75x75/" alt="profPic">
                    <h4 class="title title--name flex--item" data-user_id="${data.user_id}">${data.username}</h4>
                </div>

                <h3 class="message title title--message flex--item">${data.message}</h3>
                <h5 class="message--time title title--time flex--item">Timestamp here</h5>

                <div class="iconsWrap flex--item">
                    <img class="icons icons--pen" src="../images/edit.svg" alt="penIcon">
                    <img class="icons icons--trash" src="../images/delete.svg" alt="trashIcon">
                </div>
                `;
                //add the chat template inside the messageContainer
                messageWrapper.innerHTML = messageTemplate;

                //finally append the messageWrapper to the messagesContainer
                messagesContainer.appendChild(messageWrapper);

                //add action buttons
                ShowActions();
            }

            if(data.action == "delete"){
                console.log(data);
                //get the specific message that was deleted
                let deletedMessage = document.querySelector(`[data-id="${data.messageId}"]`);
                //show to all users that this message was deleted
                deletedMessage.querySelector(".title--message").innerHTML = "This message is deleted by it's user";
                deletedMessage.querySelector(".title--message").classList.add("title--message--deleted");
            }


        });


        //listen for user clicking on the send message btn
        messageBtn.addEventListener("click", function(e){

            //get value (message) from the inputfield and store it in a variable
            let myMessage = messageInput.value;

            //send message over our API
            fetch('/api/v1/messages', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "message": myMessage,
                })
            })
            .then(res=>res.json())
            .then(res => {
                
                //check if message posted successfully
               if(res['status'] == "success"){

                    //send the message over websocket
                    that.primus.write({
                        "message": myMessage,
                        "username": res.message.username,
                        "user_id": res.message.user_id,
                        "id": res.message._id
                    });
               }

            });

            //clear the chatbox (so we can send more messages!)
            messageInput.value = "";

            //prevent default click action
            e.preventDefault(that);

        });

        //listen for user pressing ENTER on the message field
        messageInput.addEventListener("keypress", function(e){
            //check for ENTER key
            let key = e.which || e.keyCode;
            if (key === 13){
                
                //get value (message) from the inputfield and store it in a variable
                let myMessage = messageInput.value;

                //send message over our API
                fetch('/api/v1/messages', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        "message": myMessage,
                    })
                })
                .then(res=>res.json())
                .then(res => {
                    
                    //check if message posted successfully
                    if(res['status'] == "success"){

                        //send the message over websocket
                        that.primus.write({
                            "message": myMessage,
                            "username": res.message.username,
                            "user_id": res.message.user_id,
                            "id": res.message._id
                        });
                    }

                });

                //clear the chatbox (so we can send more messages!)
                messageInput.value = "";

                //prevent default the ENTER action
                e.preventDefault();
            }

        });


        //delete messages
        messagesContainer.addEventListener('click', function(e){
            //check if clicked element is a delete element
            if (e.target.matches('.icons--trash')){
                
                //get the ID of the message
                let messageId = e.target.parentElement.parentElement.dataset.id;

                //delete message over our API
                fetch(`/api/v1/messages/${messageId}`, {
                    method: 'delete',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        
                    })
                })
                .then(res=>res.json())
                .then(res => {

                    console.log(res);
                    //check if message posted successfully
                    if(res['status'] == "success"){

                        //send the message over websocket
                        that.primus.write({
                            "action": "delete",
                            "messageId": messageId
                        });
                    }

                });
                

            }
        })

    }
    

}


//GET all messages via the API
function getAllMessages(){
    fetch('/api/v1/messages', {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res=>res.json())
    .then(res => {
        console.log(res);
        //check if message posted successfully
       if(res['status'] == "success"){

            //loop over the messages to add them into the UI
            for(i = 0; i < res.data.length; i++){
            
                //create messageWrapper div and add it's class
                let messageWrapper = document.createElement("div");
                messageWrapper.classList.add("messageWrapper","flex", "flex--container");
                //set data (id) of the message
                messageWrapper.dataset.id = res.data[i]._id;

                //use literal template to add different elements at once (instead of doing multiple createElements)
                let messageTemplate = ` 
                <div class="profile flex flex--container">
                    <img class="profpic flex--item" src="https://fakeimg.pl/75x75/" alt="profPic">
                    <h4 class="title title--name flex--item" data-user_id="${res.data[i].user_id}">${res.data[i].username}</h4>
                </div>

                <h3 class="message title title--message flex--item">${res.data[i].message}</h3>
                <h5 class="message--time title title--time flex--item">Timestamp here</h5>

                <div class="iconsWrap flex--item">
                    <img class="icons icons--pen" src="../images/edit.svg" alt="penIcon">
                    <img class="icons icons--trash" src="../images/delete.svg" alt="trashIcon">
                </div>
                `;
                //add the chat template inside the messageContainer
                messageWrapper.innerHTML = messageTemplate;

                //finally append the messageWrapper to the messagesContainer
                const messagesContainer = document.querySelector(".messages");
                messagesContainer.appendChild(messageWrapper);
            }
       }

       //now call the showDeletables function to show edit and delete buttons for your own messages
       ShowActions();

    });
}

function ShowActions(){
    let myUserId = localStorage.getItem("user_id");
    let myMessages = document.querySelectorAll(`[data-user_id="${myUserId}"]`);
    
    //loop over the users messages and show the edit and delete buttons
    for(i = 0; i < myMessages.length; i++){
        let thisActions = myMessages[i].parentElement.parentElement.querySelector(".iconsWrap");
        thisActions.style.display = "block";
    }
}

let message = new Message();