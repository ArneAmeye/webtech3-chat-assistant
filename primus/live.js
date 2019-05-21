//SERVER SIDE

const messageModel = require('../models/Message');
const userModel = require('../models/User');

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
            
            //check if user data received to register a user??

            //check if user data received to login a user??

        });


    });
}

let emitBotResponse = function(answer){
    
    const Primus = require("primus");
    const Emitter = require('primus-emitter');
    let server = require('http').createServer();

    let primus = new Primus(server, {});
    primus.plugin('emitter', Emitter);

    primus.send('bot', answer);
    

}

//exporteer deze functie/methode zodat we deze effectief kunnen aanroepen vanuit een ander file
module.exports.go = go;
module.exports.emitBotResponse = emitBotResponse;