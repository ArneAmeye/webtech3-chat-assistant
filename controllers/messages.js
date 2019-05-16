const messageModel = require('../models/messageModel');

//GET callback for messages (ALL or by USER)
let get = (req, res, next) => {

    //If there is a query string for a specific user, then GET messages for USERNAME
    if( req.query.user_id){
        let user_id = req.query.user_id;
        //find all messages for the user_id
        messageModel.find({user_id: user_id}, (err, docs) =>{
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
                    "data": docs
                })
            }
        });
    }
    else{
        //If no query string, get ALL messages
        messageModel.find({}, (err, docs) =>{
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
                    "data": docs
                })
            }
        });
        
        
        
    }
}

//GET callback for getting a SPECIFIC message by it's ID
let getId = (req, res, next) => {
    //get the message id from the parameter in the request
    let messageId = req.params.id;
    //search the specific message by it's id
    messageModel.findById(messageId, (err, docs) =>{
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
                "data": docs
            })
        }
    });
}

//POST callback for adding a message
let post = (req, res, next) => {
    
    console.log(req.user);
    //write this new message to our MongoDB
    let m = new messageModel();
    m.message = req.body.message;
    m.username = req.user.username;
    m.user_id = req.user._id;
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

}

//PUT callback for updating a message by it's ID
let put = (req, res, next) => {
    let messageId = req.params.id;
    let updatedMessage = req.body.message;
    //search the specific message by it's id and update it
    messageModel.findByIdAndUpdate(messageId,{ $set: { message: updatedMessage }}, {new: true}, (err, docs) =>{
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
                "data": docs
            })
        }
    });
}

//DELETE callback for deleting a message by it's ID
let del = (req, res, next) => {
    let messageId = req.params.id;
    //find a message by ID and delete it
    messageModel.findOneAndDelete({_id:messageId, user_id: req.user._id}, (err, docs) =>{
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
                "data": docs
            })
        }
    });
}


module.exports.get = get;
module.exports.getId = getId;
module.exports.post = post;
module.exports.put = put;
module.exports.del = del;