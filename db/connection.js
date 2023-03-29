const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "library_ia",
   port:"3306" ,
});
 
connection.connect((err) =>{

    if (err) {
        console.error("error connecting");
        return;
      }
      console.log("connect to mysql");    

}
 

);
 

 
 
module.exports=connection;