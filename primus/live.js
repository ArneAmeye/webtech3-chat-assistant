//SERVER SIDE

const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');

//go function will be called from "www" file in the bin folder!
let go = function(server) {
    const Primus = require("primus");
    let primus = new Primus(server, {});
    
    primus.on("connection", function(spark){
        //spark is the connection of a client -> browser

        //on client connect: get the latest messages from Atlas MongoDB
            //inside that messageModel.find() function we should also write the data to the client: primus.write({ //code here });


        //On receiving live websocket data, we do something with it:
        spark.on("data", function(data){
            //write data back to all connected users
            primus.write(data);

            //check if incoming data in our websocket contains data for a message ( -> save new message)
            if(data.message){
                //write this new poll to our MongoDB
                let m = new messageModel();
                m.message = data.message;
                // => ###TODO### add more data to the message being saved in MongoDB (username, user_id, timestamp)
                m.save();
            }
            
            //check if user data received to register a user??

            //check if user data received to login a user??

        });


    });
}

//exporteer deze functie/methode zodat we deze effectief kunnen aanroepen vanuit een ander file
module.exports.go = go;