const {Wit, log} = require('node-wit');

const client = new Wit({
  accessToken: 'E3UDPK7Z2YMGXEOK7LYIKYARHNRQ26A7',
  //logger: new log.Logger(log.DEBUG) // optional
});


let handleMessage = (question, lat, lng) => {

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
                console.log(data.entities.skillset[0].value); //what skill is the user searching for?
                let skillSearched = data.entities.skillset[0].value;
                
                //we could now do a fetch to our own api to find users out of our DB that have this skill => /api/v1/skills ? with a body that contains "skillSearched"?
                
                /*messageModel.find({skill: skillSearched}, (err, docs) =>{
                    //handle error if there is any (don't block the thread!)
                    if( err){
                        console.log(err.message);
                        //show custom error message to users on front-end
                        
                    }
                    //if no errors, go ahead and do your job!
                    if(!err){
                        console.log(docs);
                        //get all user_id from docs
                        //link usernames to user_id's?
                        //show users to front-end
                    }
                });*/

                //reurned result could be used to call an emitToAll method in primus

                break;
            
            case 'get_weather':
                console.log("weather is asked");

                //check weather a time value is given
                if(data.entities.time != undefined){
                    //get time value
                    let time = data.entities.time[0].value;
                    
                    //do different lookup for today than for tomorrow
                    if (time == 'today'){
                        getWeatherToday(lat,lng);
                    }else{
                        getWeatherTomorrow(lat,lng)
                    }

                }else{
                    //default time is today/now, search weather for current day
                    let time = "today";
                    getWeatherToday(lat, lng);
                }
                
                
                //handle a fetch with a weather api for the given location

                break;

            default:
                console.log("oops"); //this is when the intent is none of the above
        }

    })
    .catch(console.error);

}


function getWeatherToday(lat, lng){
    //build url to fetch
    let url = `https://api.darksky.net/forecast/6c8db87a5cad6ff776ad9d85d14e54aa/${lat},${lng}?units=si`;
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {

            let forecast = "The weather is " + json.currently.summary + " with a temperature of " + json.currently.temperature + "°C";
            console.log(forecast);
            //emit forecast?
        })
        .catch( (err) =>{
            //catch error if any to not block the nodejs process
            console.log(err);
        })
}

function getWeatherTomorrow(lat, lng){
    
    //build url to fetch
    let url = `https://api.darksky.net/forecast/6c8db87a5cad6ff776ad9d85d14e54aa/${lat},${lng}?units=si`;
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {

            let forecast = "Tomorrow the weather is " + json.daily.data[1].summary + " with a temperature of MIN: " + json.daily.data[1].temperatureLow + "°C and MAX: " + json.daily.data[1].temperatureHigh;
            console.log(forecast);
            //emit forecast?
            let primus = require('../primus/live');
            primus.emitBotResponse(forecast);
        })
        .catch( (err) =>{
            //catch error if any to not block the nodejs process
            console.log(err);
        })
}


module.exports.handleMessage = handleMessage;

