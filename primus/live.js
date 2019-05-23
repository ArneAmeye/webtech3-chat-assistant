//SERVER SIDE


//go function will be called from "www" file in the bin folder!
let go = function(server) {
    
    const Primus = require("primus");
    let primus = new Primus(server, {});
    
    primus.on("connection", function(spark){
        //spark is the connection of a client -> browser

        //On receiving live websocket data, we do something with it:
        spark.on("data", function(data){
            //write data back to all connected users
            primus.write(data);
            

        });


    });
}

//exporteer deze functie/methode zodat we deze effectief kunnen aanroepen vanuit een ander file
module.exports.go = go;
