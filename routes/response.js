const router=require('express').Router();
 const conn=require("../db/connection");
 const adminAuth=require("../middleware/admin");

  
  
  
 router.put("/accept/:id",adminAuth, function (req, res) {
  
  const {id} = req.params ;
  
  conn.query("update requests set status_req ='accepted' where id = ?",id,(err,result)=>{


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
 

  

  conn.query("update requests set status_req ='rejected' where id = ?",id,(err,result)=>{


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


  




  
  module.exports=router;