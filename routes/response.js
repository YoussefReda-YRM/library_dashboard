 const router=require('express').Router();
 const conn=require("../db/connection");
 const adminAuth=require("../middleware/admin");

  
  
  
 router.put("/accept/:id",adminAuth, function (req, res) {
  
  
  const {id} = req.params ;
 
  const data = req.body ;
  

  conn.query("update requests set ? where id = ?",[{status_req:data.status_req},id],(err,result)=>{


if(err)
{
  res.statusCode=500;
  res.json({
    message:"failed to update" 
  });
}
else{
res.json({
  message:"req accepted" 
});
  }
  })


});

 
router.put("/reject/:id",adminAuth, function (req, res) {
  
  
  const {id} = req.params ;
 
  const data = req.body ;
  

  conn.query("update requests set ? where id = ?",[{status_req:data.status_req},id],(err,result)=>{


if(err)
{
  res.statusCode=500;
  res.json({
    message:"failed to update" 
  });
}
else{
res.json({
  message:"req rejected" 
});
  }
  })


});


  




  // accept a request
/*app.put('/requests/:id/accept', (req, res) => {
  const requestId = parseInt(req.params.id);
  const requestIndex = requests.findIndex(request => request.id === requestId);

  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  const request = requests[requestIndex];

  // check if book is still available
  const book = books.find(book => book.id === request.bookId);
  if (!book.available) {
    return res.status(400).json({ error: 'Book is no longer available for borrowing.' });
  }

  // update request and book availability
  request.status = 'accepted';
  book.available = false;

  res.json(request);
});*/
  module.exports=router;