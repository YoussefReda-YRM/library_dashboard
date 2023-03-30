const router=require('express').Router();
const conn=require("../db/connection");

/////////////////////////////////////////// show search /////////////////////////////
router.get("/:id", function (req, res) {
    const {id} = req.params ;
    conn.query("select search_value from search_values where reader_id = ?",id,(error,result,fields)=>{
      if(result.length == 0){
        res.json({    
          message:"not search about any thing",
                });
              }
       else{
      res.json(result);
    }  
    })
  });
  
  module.exports=router;