//
"use strict"; 

const express = require("express") 
const request = require("request")
const app = express() 
const port = 3000 

let city = "" 
let loc = "" 

//PARSER FUNCTION - parses the city name out of the url 
function parseUrl(urlPart, name_size){
    let output = ""; 
    let i = 3; 
    for(i=5;i<name_size;i++){
        output = output.concat(urlPart[i])
        console.log(urlPart[i])
    }
    return output; //returns city name 
}

//default case 
app.get("/", (req, res) => res.send("Server awaiting request...")) //default condition

app.get("/api/:loc/", (req, res) => {
    let url = ""; 

    let urlPart = req.originalUrl;
    let name_size = urlPart.length;
    let city_name = parseUrl(urlPart,name_size)

    console.log("The requested city is:", city_name)
    
    url = url.concat(url,'http://api.openweathermap.org/data/2.5/weather?q=+', city_name, '&APPID=3e2d927d4f28b456c6bc662f34350957')
    console.log("Requesting API: ", url )
    request(url, (error, response, body) => {
    console.log("You have requested the API")    
    //console.log(response)
    if (!error) {
            console.log("Success!!")
            //console.log(JSON.parse(body)) 
            res.status(200)
            res.send(JSON.parse(body))
          }
    else {
        //res.status(404)
        console.log("Something went wrong")
    }
          
    })
}

)

app.listen(3000, ()=> console.log(`Server listening on port ${port}.`))


/*
module.exports = {
    devServer: {
        proxy: 'http://localhost:3000/api/' + city
    }
}*/ 