const express = require('express'),
  path = require('path'),
  app = express(),
  request = require('request');
  
const apiKey = '31b99117155541d79aa5b17983e33470',
  station = '9193',
  timeWindow = '20',
  cycleLength = 30;
  
let apiResponse,
  lastUpdate,
  timeLeft,
  time;

app.get('/external-api', (req, res) => {

  let responseData = JSON.parse(apiResponse),
      timeNow = (new Date().getTime());
  
  lastUpdate = ( timeNow - time ) / 1000;


  timeLeft = Math.round(cycleLength - lastUpdate);
  console.log(timeLeft)

  const data = {
    response: responseData,
    cycleLength: cycleLength,
    timeLeft: timeLeft
  }
  res.send(data);
})


/*
 * Api request 
 */

const getData = () => {
  
  request(`http://api.sl.se/api2/realtimedeparturesv4.json?key=${apiKey}&siteid=${station}&timewindow=${timeWindow}`, function (error, response, body) {

    console.log('error:', error); // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    apiResponse = body;

    time = new Date().getTime();

    setTimeout(getData, (cycleLength * 1000) )

  });

}

getData();

/*
 * Serve static files
 */

app.use(express.static('./client/public/'));


app.listen(5000, (err) => {
  if (err) throw err;
  console.log(':rocket:  Ready on http://localhost:5000/');
});