//CLIENT SIDE

class Message{

    constructor(){
        //check if user has a token
        if(localStorage.getItem('token') == null){
            document.location.href = "/login";
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

        //set username in sidebar
        let myUsername = localStorage.getItem("username");
        document.querySelector(".account__username").innerHTML = myUsername;

        //logout on clicking logout btn
        let logoutBtn = document.querySelector(".btn--logout");
        logoutBtn.addEventListener('click', function(e){

            //send live user over websockets
            that.primus.write({
                "action": "liveUserGone",
                "username": localStorage.getItem('username')
            });

            //delete localstorage token, user_id and username
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            
            //redirect to login page
            document.location.href = "http://localhost:3000/login";

            e.preventDefault();
        })


        //primus on data listener ###TODO###
        this.primus.on("data", function(data){
            console.log(data);

            //if it data contains a message: we should create an element and append it to the chatbox!
            if(data.message){
                //create messageWrapper div and add it's class
                let messageWrapper = document.createElement("div");
                messageWrapper.classList.add("message", "flex", "flex--container");
                //set data (id) of message
                messageWrapper.dataset.id = data.id;

                //determine timestamp
                let postedTime = data.timestamp;
                let time = new Date(postedTime);
                time = time.toLocaleString();

                //use literal template to add different elements at once (instead of doing multiple createElements)
                let messageTemplate = ` 
                <div class="message__user flex flex--container">
                    <img class="message__userpic flex--item" src="https://fakeimg.pl/75x75/" alt="profPic">
                    <h4 class="message_username flex--item" data-user_id="${data.user_id}">${data.username}</h4>
                </div>

                <h3 class="message__content flex--item">${data.message}</h3>
                <h5 class="message__time title title--time flex--item">${time}</h5>

                <div class="icons flex--item">
                    <img class="icons__icon icons--pen" src="../images/edit.svg" alt="penIcon">
                    <img class="icons__icon icons--trash" src="../images/delete.svg" alt="trashIcon">
                </div>
                `;
                //add the chat template inside the messageContainer
                messageWrapper.innerHTML = messageTemplate;

                //finally append the messageWrapper to the messagesContainer
                messagesContainer.appendChild(messageWrapper);

                //add action buttons
                ShowActions();
                
                //scroll to bottom
                var objDiv = document.querySelector(".messages");
                objDiv.scrollTop = objDiv.scrollHeight;
            }

            if(data.action == "delete"){
                console.log(data);
                //get the specific message that was deleted
                let deletedMessage = document.querySelector(`[data-id="${data.messageId}"]`);
                //show to all users that this message was deleted
                deletedMessage.querySelector(".message__content").innerHTML = "This message is deleted by it's user";
                deletedMessage.querySelector(".message__content").classList.add("message--deleted");
            }

            if(data.action == "update"){
                console.log(data);
                //get the specific message that was updated
                let updatedMessage = document.querySelector(`[data-id="${data.messageId}"]`);
                //show to all users that this message was updated
                data.updatedMessage += " (edited)";
                updatedMessage.querySelector(".message__content").innerHTML = data.updatedMessage;
                updatedMessage.querySelector(".message__content").style.fontStyle = "italic";
                
            }

            //new user logged on, show to all other users!
            if(data.action == "liveUser"){  // & data.username !== localStorage.getItem("username")
                let userElement = document.createElement('div');
                userElement.classList.add('online__friend', 'flex', 'flex--container');
                userElement.dataset.username = data.username;
                let userTemplate = `
                    <img class="online__userpic flex--item" src="https://api.adorable.io/avatars/75/abott@adorable.png" alt="profPic">
                    <h4 class="online__username flex--item">${data.username}</h4>
                `;
                userElement.innerHTML = userTemplate;
                document.querySelector(".online").appendChild(userElement);
            }

            //a user leaves the chat (logout), show to all other users!
            if(data.action == "liveUserGone"){
                let userElement = document.querySelector(`[data-username="${data.username}"]`)
                userElement.parentNode.removeChild(userElement);
            }


        });


        //listen for user clicking on the send message btn
        messageBtn.addEventListener("click", function(e){

            //get value (message) from the inputfield and store it in a variable
            let myMessage = messageInput.value;

            //get location coords
            navigator.geolocation.getCurrentPosition(position => {
                //save lat and lng
                localStorage.setItem("lat", position.coords.latitude);
                localStorage.setItem("lng", position.coords.longitude);
            });
            
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
                    "lat": localStorage.getItem('lat'),
                    "lng": localStorage.getItem('lng')
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
                        "id": res.message._id,
                        "timestamp": res.message.timestamp
                    });
               }

            });

            //check if bot is asked a message, if it is, this will return the answer and send it over Primus websocket.
            botAsked(myMessage, function(err, res){
                //send the message over websocket
                that.primus.write({
                    "message": res.message.message,
                    "username": res.message.username,
                    "user_id": res.message.user_id,
                    "id": res.message._id,
                    "timestamp": res.message.timestamp
                });
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

                //get location coords
                navigator.geolocation.getCurrentPosition(position => {
                    //save lat and lng
                    localStorage.setItem("lat", position.coords.latitude);
                    localStorage.setItem("lng", position.coords.longitude);
                });

                //check if bot is asked a message, if it is, this will return the answer and send it over Primus websocket.
                botAsked(myMessage, function(err, res){
                    //send the message over websocket
                    that.primus.write({
                        "message": res.message.message,
                        "username": res.message.username,
                        "user_id": res.message.user_id,
                        "id": res.message._id,
                        "timestamp": res.message.timestamp
                    });
                });

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
                        "lat": localStorage.getItem('lat'),
                        "lng": localStorage.getItem('lng')
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
                            "id": res.message._id,
                            "timestamp": res.message.timestamp
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
                    //check if message deleted successfully
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


        //update messages
        messagesContainer.addEventListener('click', function(e){
            //check if clicked element is a delete element
            if (e.target.matches('.icons--pen')){
                
                //get the ID of the message
                let messageId = e.target.parentElement.parentElement.dataset.id;
                
                //get the message element and convert to an inputfield
                let messageElement = e.target.parentElement.previousElementSibling.previousElementSibling;
                let EditField = document.createElement('input');
                EditField.classList.add('message__content', 'flex--item', 'input');
                EditField.value = messageElement.innerHTML;
                messageElement.parentNode.replaceChild(EditField,messageElement);
                
                //check if user presses enter to update the message
                EditField.addEventListener('keypress', function(e){
                    let key = e.which || e.keyCode;
                    if(key === 13){
                        let updatedMessage = EditField.value;

                        //update message over our API
                        fetch(`/api/v1/messages/${messageId}`, {
                            method: 'put',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                "message": updatedMessage
                            })
                        })
                        .then(res=>res.json())
                        .then(res => {

                            console.log(res);
                            //check if message updated successfully
                            if(res['status'] == "success"){

                                //convert the input field back to the regular message element
                                let messageElement = document.createElement("h3");
                                messageElement.classList.add('message__content', 'flex--item' );
                                messageElement.innerHTML = EditField.value;
                                EditField.parentNode.replaceChild(messageElement, EditField);

                                //send the updated message over websocket
                                that.primus.write({
                                    "action": "update",
                                    "messageId": messageId,
                                    "updatedMessage": updatedMessage
                                });
                            }

                        });

                        

                    }
                })                
                

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

                //determine timestamp
                let postedTime = res.data[i].timestamp;
                let time = new Date(postedTime);
                time = time.toLocaleString();
            
                //create messageWrapper div and add it's class
                let messageWrapper = document.createElement("div");
                messageWrapper.classList.add("message","flex", "flex--container");
                //set data (id) of the message
                messageWrapper.dataset.id = res.data[i]._id;

                //use literal template to add different elements at once (instead of doing multiple createElements)
                let messageTemplate = ` 
                <div class="message__user flex flex--container">
                    <img class="message__userpic flex--item" src="https://fakeimg.pl/75x75/" alt="profPic">
                    <h4 class="message__username flex--item" data-user_id="${res.data[i].user_id}">${res.data[i].username}</h4>
                </div>

                <h3 class="message__content flex--item">${res.data[i].message}</h3>
                <h5 class="message__time title title--time flex--item">${time}</h5>

                <div class="icons flex--item">
                    <img class="icons__icon icons--pen" src="../images/edit.svg" alt="penIcon">
                    <img class="icons__icon icons--trash" src="../images/delete.svg" alt="trashIcon">
                </div>
                `;
                //add the chat template inside the messageContainer
                messageWrapper.innerHTML = messageTemplate;

                //finally append the messageWrapper to the messagesContainer
                const messagesContainer = document.querySelector(".messages");
                messagesContainer.appendChild(messageWrapper);
            }

            //scroll to bottom
            var objDiv = document.querySelector(".messages");
            objDiv.scrollTop = objDiv.scrollHeight;
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
        let thisActions = myMessages[i].parentElement.parentElement.querySelector(".icons");
        thisActions.style.display = "block";
    }
}

function botAsked(myMessage, callback){
    
    //check if @bot is at start of this message
    if(myMessage.indexOf("@bot") == 0 ){
        
        //@bot summoned!
        fetch('/api/v1/wit', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                "message": myMessage,
                "lat": localStorage.getItem('lat'),
                "lng": localStorage.getItem('lng')
            })
        })
        .then(res=>res.json())
        .then(res => {
            console.log(res);
            
            //check if message posted successfully
           if(res['status'] == "success"){

                callback(null, res);
           }

        });
    }
}

let message = new Message();