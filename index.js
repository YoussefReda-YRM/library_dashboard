const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

const app = express();
const books=require('./routes/books');
const chapters=require('./routes/chapters')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"")));
app.use("/books",books); 
app.use("/chapters",chapters); 
app.listen(4000,"localhost",()=>{

  console.log("server is running");
});
// API request
// get request retreive data from server
// post request save data
// put request update data
// delete request delete data
 