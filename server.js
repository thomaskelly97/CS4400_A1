//Thomas Kelly 
//Student Number = 16323455 
"use strict"; 

const express = require("express") 
const request = require("request")
const cors = require("cors")
const app = express() 
const port = 3000 



let city = "" 
let loc = "" 


app.use(cors())
//PARSER FUNCTION - parses the city name out of the url 
function parseUrl(urlPart, name_size){
    let output = ""; 
    let i = 3; 
    for(i=5;i<name_size;i++){
        output = output.concat(urlPart[i])
    }
    return output; //returns city name 
}

//determine temperature rating 
function determineTemp(CT){
    if(CT <= 10 && CT >= -10){
        return ">> Pack for cold weather.";
    } 
    else if (CT > 10 && CT < 20){
        return ">> Pack for warm weather.";
    } 
    else if (CT >= 20){
        return ">> Pack for hot weather."
    }
}

//function to figure out if it will rain
function rain_(OBJ){
    for(let j =0;j<OBJ.length;j++){
        if(OBJ[j].main == "Rain" || OBJ[j].main == "Drizzle"){
            return ">> Pack an umbrella. Rain is forecast.\n"; 
        } else {
            return ">> You shouldn't need an umbrella. Rain isn't forecast.\n"
        }
    }
}

//this function processes api data for user 
function processData(data){
    let d = JSON.parse(data)
    let kelvin = 273.15; 
    let tempStr = ""; 
    let store_data = ""; 
    let log_data = "";
    let take_rain = "";  
    
    
    //01 Deal with rain 
    take_rain = rain_(d.weather); 
    store_data = store_data.concat(take_rain);
    

    //02 Deal with temperature 
    let temp_curr = d.main.temp - kelvin; 
    let temp_min = d.main.temp_min - kelvin; 
    let temp_max = d.main.temp_max - kelvin; 
    log_data = log_data.concat("Min Temperature: ", temp_min, "\nMax Temperature:", temp_max, "\nCurrent Temperature: ", temp_curr)
    tempStr = determineTemp(temp_curr);
    store_data = store_data.concat(tempStr);
    
    //03 Need to summarise data for the next 5 days 


    //console.log(log_data)
    console.log("Summary\n",store_data)	
}

//default case 
app.get("/", (req, res) => res.send("Server awaiting request...")) //default condition

//wait for get to app/city_name
app.get("/api/:loc/", (req, res) => {
    let url = ""; 
    //This parses the city name out of the incoming URL
    let urlPart = req.originalUrl;
    let name_size = urlPart.length;
    let city_name = parseUrl(urlPart,name_size)

    console.log("The requested city is:", city_name)
    
    url = url.concat(url,'http://api.openweathermap.org/data/2.5/weather?q=+', city_name, '&APPID=3e2d927d4f28b456c6bc662f34350957')
    
    request(url, (error, response, body) => {

    if (!error) {
            processData(body); 
            res.status(200).send(body)
          }
    else {
        console.log("Something went wrong")
    }
          
    })
}
)

app.listen(3000, ()=> console.log(`Server listening on port ${port}.`))

