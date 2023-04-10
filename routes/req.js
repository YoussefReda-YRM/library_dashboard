const router=require('express').Router();
const conn=require("../db/connection");
const adminAuth=require("../middleware/admin");


//reader send req
router.post('/send-request' , (req, res) => {
 
   const data =req.body;

   conn.query("INSERT INTO requests set ?",
   {reader_id:data.reader_id,book_id:data.book_id},(error,result, fields)=>{
    console.log(error);
    if(error){
        res.statusCode=500;
        res.json({
          message:"error in req",
      });
      }
      else{
      res.json({
        message:"req send successfully",
      } );
    }
    })
    });
   
    //admin retrieve all requests
    router.get("/",adminAuth, function (req, res) {
      conn.query("select requests.id ,users.email, books.Book_Name,requests.status_req  from requests inner join books on requests.book_id=books.id inner join users on requests.reader_id=users.id where status_req = 'pending'",(error,result,fields)=>{
        res.json(result);
  
      });
     
    });
  
   //reader retrieve his requests
    router.get("/:id", function (req, res) {
      const {id} = req.params ;
      conn.query("select * from requests INNER JOIN books ON requests.book_id = books.id  WHERE requests.reader_id  = ?",[id],(error,result,fields)=>{
        if(result.length == 0){
          res.json({
            message:"req not found",
        });
      }
      else{
        res.json(result );
      }
      })
  });
 // get on request to one book
 router.get("/:reader_id/:book_id", function (req, res) {
  const {reader_id} = req.params ;
  const {book_id} = req.params ;
  conn.query(`select * from requests where reader_id =${reader_id} and book_id=${book_id} `,(error,result,fields)=>{
    if(result.length == 0){
      res.json({
        message:"req not found",
    });
  }
  else{
    res.json(result );
  }
  })
});

  
  
module.exports = router;