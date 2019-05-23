const messageModel = require('../models/Message');
const wit = require('../wit/wit');

let post = (req, res, next) => {

    //get time of posting
    let d = new Date();
    let time = d.getTime();

    //get values from req body (question and geodata)
    let question = req.body.message;
    let lat = req.body.lat;
    let lng = req.body.lng;

    //handle the wit logic
    wit.handleMessage(question, lat, lng, function(err, response){
        let answer = response;
        console.log(answer);

        //write this Bot message to our MongoDB
        let m = new messageModel();
        m.message = answer;
        m.username = "Bot";
        m.user_id = "5ce703c07a18415350da583a";
        m.timestamp = time;
        m.save((err, doc) =>{
            //handle error if there is any (don't block the thread!)
            if( err){
                res.json({
                    "status": "error",
                    "message": err.message
                });
            }
            //if no errors, go ahead and do your job!
            if(!err){
                res.json({
                    "status": "success",
                    "message": doc
                });
                
            }
        });


    });
    
    
}

module.exports.post = post;