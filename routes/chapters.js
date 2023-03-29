
const {v4} =require('uuid');
const router=require('express').Router();
const conn=require("../db/connection");
const adminAuth=require("../middleware/admin");
const multer = require('multer')
const path = require('path');
var url = require('url');
var fs = require('fs');



var storage = multer.diskStorage({
destination: function (req, file, cb) {
   cb(null,path.join(__dirname,'../images'));
},
filename: function (req, file, cb) {
   cb(null, Date.now() + '-' + file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}
});
var upload = multer({ storage: storage });



//read book_chapters
router.get("/", function (req, res) {
  conn.query("select * from  book_chapters",(error,result,fields)=>{
    res.json(result);

  });
 
});







//add chapter

router.post("/", upload.single('PDF_File'), function (req, res) {
  const data =req.body ;
  const imgsrc = req.get('host')+'/images/' + req.file.filename;
  
  conn.query("INSERT INTO book_chapters set ?",
  {Title:data.Title,Description:data.Description,Book_Id:data.Book_Id,PDF_File:imgsrc},(error,result,fields)=>{
    
    if(error){
      res.statusCode=500;
      
      res.json({

        message:"chapter not created",
    });
    }
    else{
    res.json({

      message:"chapter created",
    } );
  }
  })

  });

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


// update chapter
router.put("/:id",upload.single('PDF_File'), function (req, res) {


const {id} = req.params ;
conn.query(`select PDF_File from  book_chapters where id = ${id}`,(error,result,fields)=>{
  if(result){
  const filpath=JSON.parse(JSON.stringify(result));
  fs.unlinkSync(path.join(__dirname,"../",filpath[0].PDF_File.slice(req.get('host').length)));

  }
});

const data = req.body ;
const imgsrc = req.get('host')+'/images/' + req.file.filename;

conn.query("update book_chapters set ? where id = ?",[ {Title:data.Title,Description:data.Description,PDF_File:imgsrc},id],(err,result)=>{


if(err)
{
res.statusCode=500;
res.json({
  message:"failed to update" 
});
}
else{
res.json({
message:"updated" 
});
}
})


});

// delete chapter from book

router.delete("/:id", function (req, res) {

const {id} = req.params ;

conn.query(`select PDF_File from  book_chapters where id = ${id}`,(error,result,fields)=>{
  if(result){
  const filpath=JSON.parse(JSON.stringify(result));
  fs.unlinkSync(path.join(__dirname,"../",filpath[0].PDF_File.slice(req.get('host').length)));
  }
});

conn.query("delete from book_chapters where  ?",{id:id},(err,result)=>{


  if(err)
  {
    res.statusCode=500;
    res.json({
      message:"failed to deleted" 
    });
  }
  else{
  res.json("chapter deleted");
  }

})
});




module.exports=router;
