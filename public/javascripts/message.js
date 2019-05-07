//CLIENT SIDE

class Message{

    constructor(){

        //Get chatbox input field and BTN
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


        });


        //listen for user clicking on the send message btn
        messageBtn.addEventListener("click", function(e){

            //get value (message) from the inputfield and store it in a variable
            let myMessage = messageInput.value;
            console.log(myMessage);
            //send the message over websocket
            that.primus.write({
                "message": myMessage
            });

            //clear the chatbox (so we can send more messages!)
            messageInput.value = "";

            //prevent default click action
            e.preventDefault();

        });

    }

}

let message = new Message();