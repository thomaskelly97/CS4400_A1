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
        return " >> Pack for cold weather.\n";
    } 
    else if (CT > 10 && CT < 20){
        return " >> Pack for warm weather.\n";
    } 
    else if (CT >= 20){
        return " >> Pack for hot weather.\n"
    }
}

//function to figure out if it will rain in the next 5 days 
function rain_(OBJ){
    for(let j =0;j<OBJ.length;j++){
        //console.log(OBJ[j].weather[0].main, " - ")
        if(OBJ[j].weather[0].main == "Rain" || OBJ[j].weather[0].main == "Drizzle"){
            console.log("--> The forecast predicts ", OBJ[j].weather[0].main)
            return ">> Pack an umbrella. Rain is forecast.\n"; 
        } 
    }
    console.log("--> No rain forecast")
    return ">> No need to pack an umbrella. No rain is forecast.\n";
}

//function to get the average temperature of the next 5 days, and return the appropriate temperature rating 
function temp_ (OBJ){
    let kelvin = 273.15; 
    let sum = 0; 
    for(let i =0;i<OBJ.length;i++){
        sum = sum + (OBJ[i].main.temp - kelvin)
        //console.log(OBJ[i].main.temp - kelvin)
    }
    console.log("--> Average Temperature for the next 5 days:", (sum/OBJ.length).toFixed(3), " C")
    return determineTemp(sum/OBJ.length)
}

//display weather conditions for 5 days 
function display5DayWeather(OBJ){
    let table = ""; //store the table as a string 
    let date_now = ["", "", "", "", "",]; 
    let curr=0, prev=0,loop_c =0;
    let map = -1; 
    let wind_data= [0,0,0,0,0,0,0]; // hold total wind speed for each day 
    let rain_data = [0,0,0,0,0]; // hold rain fall 
    let temp_data = [0,0,0,0,0]; // hold average temperatures 
    let rain = ""; 
    let n = [0,0,0,0,0]; // hold the number of times accessed for each day 
    console.log("Display Table");
    for(let i = 0; i<OBJ.list.length; i++){ // loop through every 3 hour period every day 
        
        curr =  parseInt((OBJ.list[i].dt_txt).substr(8,2)); //get the current day 
        if(curr != prev){ //if the day is different, it has changed 
            map = map +1 //this map value, maps the day to a number between 0-5 essentially. 
            date_now[map] = (OBJ.list[i].dt_txt); 
            //onsole.log(map)
        }
        
        
        if(curr == prev || prev == 0){ //if the day is the same as it was last loop 
            wind_data[map] = wind_data[map] +  OBJ.list[i].wind.speed; // add the wind speed to a total
            temp_data[map] = temp_data[map] +  OBJ.list[i].main.temp; //add temperatures to temp_Data array 
            
            
            if(OBJ.list[i].rain != undefined){ //don't account for times it does not rain 
                rain = JSON.stringify(OBJ.list[i].rain); 
                rain = rain.substr(6,5) //get rain data out 
                rain = parseFloat(rain) 
                if(rain != NaN){
                    rain_data[map] = rain_data[map] + rain; //store the total rainfall for that day
                }
                     
            }
            n[map] = n[map] + 1; // hold the number of times this day has been accessed 
        }
        
        prev = curr; 
    }
    //load all data into the table string
    table = " \t\t|Wind (m/s) |Rain (mm) |Temperature (C)|\n";
    for(let j =0;j<5;j++){
         table = table + "> " + date_now[j].substr(0,10) +"    |"+ (wind_data[j]/n[j]).toFixed(2) + "\t\t"+(rain_data[j]).toFixed(2) + "\t\t"+ parseFloat((temp_data[j]/n[j]) - 273.15).toFixed(3)+"  |\n";

    }

    //Print the table in the server to verify correct transmission 
    console.log(table)
    return table; 
    
}

//this function processes api data for user 
function processData(data){
    let d = JSON.parse(data)
    let store_data = ""; 
    let location = ""; 
    if(d.city != undefined){
        location = "--> The requested city is "+ d.city.name+ " in "+ d.city.country + "\n";
        console.log("--> The requested city is ", d.city.name, "in", d.city.country)
    } else {
        location = "Nowhere"; 
    }
    
    
    if(d.list != undefined){
        store_data = store_data.concat(location);
        //01 Deal with rain 
        let take_rain = rain_(d.list); 
        store_data = store_data.concat(take_rain);
    
        //02 Deal with temperature 
        let take_temp = temp_(d.list); 
        store_data = store_data.concat(take_temp);

        //03 Need to summarise data for the next 5 days 
        let take_table = display5DayWeather(d); 
        store_data = store_data.concat(take_table);

        //Now store_data has all of the necessary summarised data and can be sent to the client 
        console.log(">> All data successfully compiled into string for sending to client...\n"); 
        return store_data;
    } else {
        return "Please enter a valid city\n"; 
    }
    
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
    let returnData; 
    
    //build the requested url with the specified city 
    url = url.concat(url,'http://api.openweathermap.org/data/2.5/forecast?q=+', city_name, '&APPID=3e2d927d4f28b456c6bc662f34350957')
    
    request(url, (error, response, body) => {

    if (!error) {
            res.status(200).send(processData(body) ); //respond with the processed, summarised data
          }
    else {
        console.log("Something went wrong")
    }
          
    })
}
)

app.listen(3000, ()=> console.log(`>> Server listening on port ${port}.`))

