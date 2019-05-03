//GET callback for messages (ALL or by USER)
let get = (req, res, next) => {

    //If there is a query string for a specific user, then GET messages for USERNAME
    if( req.query.user){
        let username = req.query.user;
        res.json({
            "status": "success",
            "message": "GETTING messages for USER: " + username
        })
    }
    else{
        //If no query string, get ALL messages
        res.json({
            "status": "success",
            "message": "GETTING messages"
        })
    }
}

//GET callback for getting a SPECIFIC message by it's ID
let getId = (req, res, next) => {
    let messageId = req.params.id;
    res.json({
        "status": "success",
        "message": "GETTING message with ID: " + messageId
    })
}

//POST callback for adding a message
let post = (req, res, next) => {
    let user = req.body.message.user;
    res.json({
        "status": "success",
        "message": "POSTING a new message for user: " + user
    })
}

//PUT callback for updating a message by it's ID
let put = (req, res, next) => {
    let messageId = req.params.id;
    res.json({
        "status": "success",
        "message": "UPDATING a message with ID: " + messageId
    })
}

//DELETE callback for deleting a message by it's ID
let del = (req, res, next) => {
    let messageId = req.params.id;
    res.json({
        "status": "success",
        "message": "DELETING a message with ID: " + messageId
    })
}


module.exports.get = get;
module.exports.getId = getId;
module.exports.post = post;
module.exports.put = put;
module.exports.del = del;