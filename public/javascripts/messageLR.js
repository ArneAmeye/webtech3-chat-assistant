//CLIENT SIDE

class Message{

    constructor(){
        
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
                    <h4 class="message__username flex--item" data-user_id="${data.user_id}">${data.username}</h4>
                </div>

                <h3 class="message__content title title--message flex--item">${data.message}</h3>
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

        

    }
    

}


//GET all messages via the API
function getAllMessages(){
    fetch('/api/v1/messages', {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
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

    });
}

let message = new Message();