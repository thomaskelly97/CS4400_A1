# CS4400_A1
Fourth Year Network Applications Assignment - Client-Server Applications consuming OpenWeatherMap API services<br />


**client.html** <br />
Consists of a simple web page constructed with HTML and Vue.js enabling the user to enter a city name into a text field. The city name will be concatenated into a URL which then has a GET request on it. The city name will then be used by the server to return weather data to the client. The data is then displayed in the client web page. 

**server.js** <br />
A server module written in JavaScript using node.js. The server is written to handle incoming get requests from the client, and upon receiving an appropriate request with a desired city name in the url, the server makes a get request to the open weather API resource. After receiving the data, its most important points are parsed out of the JSON response and then sent on to the client. 
