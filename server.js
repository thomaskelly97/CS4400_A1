//
"use strict"; 

const express = require("express") 
const request = require("request")
const app = express() 
const port = 3000 
//let city = "madrid"
let city = "" 
let loc = "" 
//document.domain = "http://localhost:3000"

app.get("/", (req, res) => res.send("Server awaiting request...")) //default condition

app.get("/api/:loc/", (req, res) => 
request('http://api.openweathermap.org/data/2.5/weather?q=+' + loc +'&APPID=3e2d927d4f28b456c6bc662f34350957', (error, response, body) => {
    console.log("You have requested the API")    
    if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body)) 
            console.log("Success!!")
            res.status(200)
            res.send(JSON.parse(body))
          }
    else {
        res.status(404)
        console.log("Something went wrong")
    }
          
    })
)

app.listen(3000, ()=> console.log(`Server listening on port ${port}.`))



module.exports = {
    devServer: {
        proxy: 'http://localhost:3000/api/' + city
    }
}