const User = require('../models/User');
const Profile = require('../models/Profile')
const jwt = require('jsonwebtoken');
const empty = require('is-empty');

const signup = async (req,res,next)=>{
    let username = req.body.username; // UI of postman
    let password = req.body.password; // UI of postman
    
    const user = new User({
        username: username
    });
        await user.setPassword(password);
        await user.save().then(result =>{
            let token = jwt.sign({
                uid: result._id,
                username: result.username
            }, "MyVerySecretWord");
            let user_id = result._id;
            let username = result.username;

            res.json({
                "status": "success",
                "data": {
                    "token": token,
                    "user_id": user_id,
                    "username": username
                }
            })
        }).catch(error =>{
            console.log(error);
            res.json({
                "status": "error"
            })
        });
}
const login = async (req,res,next) =>{
    
    const user = await User.authenticate()(req.body.username, req.body.password).then(result =>{
        
        if(!result.user){
            return res.json({
                "status": "failed",
                "message": "login failed"
            })
        }

        let token = jwt.sign({
            uid: result.user._id,
            username: result.user.username
        }, "MyVerySecretWord");
        let user_id = result.user._id;
        let username = result.user.username;

        return res.json({
            "status": "success",
            "data": {
                "token": token,
                "user_id": user_id,
                "username": username
            }
        })
    }).catch(error => {
        res.json({
            "status": "error",
            "message": error
        })
    });
}
const saveSkill = (req,res)=>{
    let user = req.body.userId;
    let skill = req.body.skill;
    
    //write this new message to our MongoDB
    let p = new Profile();
    p.skill = skill;
    p.user_id = user;

    p.save((err, doc) =>{
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

const deleteSkill = (req, res) => {
    let user = req.body.userId;
    let skill = req.body.skill;

    //find a skill by skillname and userID and delete it
    Profile.findOneAndDelete({skill:skill, user_id: user}, (err, docs) =>{
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
const getSkills= (req,res)=>{
    //let user = req.body.userId;
    let user = req.params.userId;

    Profile.find({user_id: user}, (err, docs) =>{
        //handle error if there is any (don't block the thread!)
        if( err ){
            res.json({
                "status": "error",
                "message": err.message
            });
        }
        //if no errors, go ahead and do your job!
        if( !err ){
            // if docs return empty (npm package), its a fail else success
            if( empty(docs) ){
                res.json({
                    "status": "Fail",
                    "message": "No skills yet!"
                })
            }else{
                res.json({
                    "status": "success",
                    "data": {
                        "skills": docs
                    }
                })
            } 
        }
    });
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.getSkills = getSkills;
module.exports.saveSkill = saveSkill;
module.exports.deleteSkill = deleteSkill;