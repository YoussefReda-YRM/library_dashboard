const router=require('express').Router();
const conn=require("../db/connection");
//read book_chapters
router.get("/onechapter/:id", function (req, res) {
  const {id} = req.params ;
  conn.query("select * from  book_chapters where id=? ", id,(error,result,fields)=>{
    res.json(result);

  });
 
});






//add chapter


router.post("/", function (req, res) {
  const data =req.body ;

        conn.query("INSERT INTO book_chapters set ?",
        {Title:data.Title,Description:data.Description,Book_Id:data.Book_Id} ,
        (error,result,fields)=>{ 
          if(error){
            res.statusCode=500;  
            res.json({
              message:"chapter not added",
                    });
                    }
          else{
          res.json({
            message:"chapter added",
                  });
              }
        })}
  
);






//read chapter related to spacific book

  router.get("/:id", function (req, res) {
    const {id} = req.params ;
    conn.query("select * from book_chapters where  ?",{Book_Id:id},(error,result,fields)=>{
      if(error){
        res.statusCode=500;
        res.json({

          message:"book not found",
      });
    }

      res.json(result );


    })
  

});


// update chapters


router.put("/:id", function (req, res) {


const {id} = req.params ;

const data = req.body ;


conn.query("update book_chapters set ? where id = ?",[ {Title:data.Title,Description:data.Description},id],(err,result)=>{


  if (result.affectedRows == 0) {
    res.json({
      message: "failed to update",
    });
  }
  else {
    res.json(result);
  }
})


});

// delete chapter from book

router.delete("/:id", function (req, res) {

const {id} = req.params ;



conn.query("delete from book_chapters where  ?",{id:id},(err,result)=>{


  if (result.affectedRows == 0) {
    res.json({
      message: "failed to delete",
    });
  }
  else {
    res.json({
      message: "reader delete",
    });
  }

})
});




module.exports=router;