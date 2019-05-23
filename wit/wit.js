const {Wit, log} = require('node-wit');
const Profile = require('../models/Profile');
const User = require('../models/User');

const client = new Wit({
  accessToken: 'E3UDPK7Z2YMGXEOK7LYIKYARHNRQ26A7',
  //logger: new log.Logger(log.DEBUG) // optional
});


let handleMessage = (question, lat, lng, callback) => {

    //replace @bot in the sentence with nothing so we keep just the question
    question = question.replace("@bot", "");
    console.log(question);

    //handle the question with wit
    client.message(question, {})
    .then((data) => {
        console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));

        //check which intent the bot perceives (skill searching, weahter, ...)
        switch(data.entities.intent[0].value){
            case 'skill':

                //what skill is the user searching for?
                console.log(data.entities.skillset[0].value); 
                let skillSearched = data.entities.skillset[0].value;
                
                //find user_id's that have the skill that is being asked for
                Profile.find({skill: skillSearched}, (err, docs) =>{
                    //handle error if there is any (don't block the thread!)
                    if( err){
                        console.log(err.message);
                        //show custom error message to users on front-end
                        
                    }
                    //if no errors, go ahead and do your job!
                    if(!err){

                        //init (empty) users array
                        let user_ids = [];

                        //loop over docs and add user_id's to array
                        for(i = 0; i < docs.length; i++){
                            user_ids.push(docs[i].user_id);
                        }

                        //find usernames for the respective user_id's
                        let userfields = {
                            __v: false,
                            _id: false,
                            salt: false,
                            hash: false
                        }
                        User.find({_id:{$in: user_ids} }, userfields, (err, docs) =>{
                            if(err){
                                console.log(err.message);
                            }
                            if(!err){
                                //build an array of the returned usernames in docs
                                let users = [];
                                for(i = 0; i < docs.length; i++){
                                    users.push(docs[i].username);
                                }
                                //set empty array to "none"
                                if (users.length == 0){
                                    users.push("nobody added this skill 😢" );
                                }
                                //build your answer
                                let answer = skillSearched + " is known by: " + users;
                                //console.log(answer);
                                callback(null, answer);
                            }
                        });
                        
                        
                    }
                });

                break;
            
            case 'get_weather':
                console.log("weather is asked");

                //check weather a time value is given
                if(data.entities.time != undefined){
                    //get time value
                    let time = data.entities.time[0].value;
                    
                    //do different lookup for today than for tomorrow
                    if (time == 'today'){
                        getWeatherToday(lat,lng, function(err, res){
                            let forecast = res;
                            callback(null, forecast);
                        });
                        
                    }else{
                        getWeatherTomorrow(lat,lng, function(err, res){
                            let forecast = res;
                            callback(null, forecast);
                        })
                    }

                }else{
                    //default time is today/now, search weather for current day
                    getWeatherToday(lat, lng, function(err, res){
                        let forecast = res;
                        callback(null, forecast);
                    });
                }

                break;

            default:
                console.log("oops"); //this is when the intent is none of the above
        }

    })
    .catch(console.error);

}


function getWeatherToday(lat, lng, callback){
    //build url to fetch
    let url = `https://api.darksky.net/forecast/6c8db87a5cad6ff776ad9d85d14e54aa/${lat},${lng}?units=si`;
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {

            let forecast = "The weather is " + json.currently.summary + " with a temperature of " + json.currently.temperature + "°C";
            callback(null, forecast);
        })
        .catch( (err) =>{
            //catch error if any to not block the nodejs process
            console.log(err);
        })
}

function getWeatherTomorrow(lat, lng, callback){
    
    //build url to fetch
    let url = `https://api.darksky.net/forecast/6c8db87a5cad6ff776ad9d85d14e54aa/${lat},${lng}?units=si`;
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {

            let forecast = "Tomorrow the weather is " + json.daily.data[1].summary + " with a temperature of MIN: " + json.daily.data[1].temperatureLow + "°C and MAX: " + json.daily.data[1].temperatureHigh + "°C";
            callback(null, forecast);
        })
        .catch( (err) =>{
            //catch error if any to not block the nodejs process
            console.log(err);
        })
}


module.exports.handleMessage = handleMessage;

