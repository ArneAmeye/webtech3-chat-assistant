const messageModel = require('../models/Message');
const wit = require('../wit/wit');

let post = (req, res, next) => {

    //get values from req body (question and geodata)
    let question = req.body.message;
    let lat = req.body.lat;
    let lng = req.body.lng;

    //handle the wit logic
    wit.handleMessage(question, lat, lng, function(err, response){
        let answer = response;
        console.log(answer);

        res.json({
            "status": "bot success",
            "bot": answer/*,
            "message": doc*/
        });

    });
    
    
}

module.exports.post = post;