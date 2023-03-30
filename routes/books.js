
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

//read books
  router.get("/", function (req, res) {
    conn.query("select * from  books",(error,result,fields)=>{
      res.json(result);

    });
   
  });
//add book 
 
  router.post("/", upload.single('PDF_File'), function (req, res) {
    const data =req.body ;
    const imgsrc = req.get('host')+'/images/' + req.file.filename;
    
    conn.query("INSERT INTO books set ?",
    {Book_Name:data.Book_Name,Description:data.Description,Author:data.Author,Field:data.Field,PDF_File:imgsrc},(error,result,fields)=>{
      
      if(error){
        res.statusCode=500;
        
        res.json({

          message:"book not created",
      });
      }
      else{
      res.json({

        message:"book created",
      } );
    }
    })
  
    });



    router.get("/:id", function (req, res) {
      const {id} = req.params ;
      conn.query("select * from books where ?",{id:id},(error,result,fields)=>{
        if(error){
          res.statusCode=500;
          res.json({
  
            message:"book not found",
        });
      }

        res.json(result );


      })
    

  });



router.put("/:id",upload.single('PDF_File'), function (req, res) {
  
  
  const {id} = req.params ;
  conn.query(`select PDF_File from  books where id = ${id}`,(error,result,fields)=>{
    if(result){
    const filpath=JSON.parse(JSON.stringify(result));
    fs.unlinkSync(path.join(__dirname,"../",filpath[0].PDF_File.slice(req.get('host').length)));
    // console.log(path.join(__dirname,"../",filpath[0].PDF_File.slice(req.get('host').length)))
    }
  });
  
  const data = req.body ;
  const imgsrc = req.get('host')+'/images/' + req.file.filename;

  conn.query("update books set ? where id = ?",[{Book_Name:data.Book_Name,Description:data.Description,Author:data.Author,Field:data.Field,PDF_File:imgsrc},id],(err,result)=>{


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


router.delete("/:id", function (req, res) {
 
  const {id} = req.params ;

  conn.query(`select PDF_File from  books where id = ${id}`,(error,result,fields)=>{
    if(result){
    const filpath=JSON.parse(JSON.stringify(result));
    fs.unlinkSync(path.join(__dirname,"../",filpath[0].PDF_File.slice(req.get('host').length)));
    }
  });

  conn.query("delete from books where  ?",{id:id},(err,result)=>{


    if(err)
    {
      res.statusCode=500;
      res.json({
        message:"failed to deleted" 
      });
    }
    else{
    res.json("book deleted");
    }

})
});

// filter with book name

router.get("/filtername/:name", function (req, res) {
  const {name} = req.params ;
  const data = req.body ;
  conn.query(`INSERT INTO search_values (search_value, reader_id) VALUES ( '${name}' ,${data.reader_id} ) `);
  conn.query(`select * from books where Book_Name LIKE '%${name}%'`,(error,result,fields)=>{
    if(result.length==0){
      res.statusCode=500;
      res.json({

        message:"book not found",
    });
  }

    res.json(result);


  })
});


// filter with author name

router.get("/filterauthor/:name", function (req, res) {
  const {name} = req.params ;

  conn.query(`select * from books where Author LIKE '%${name}%'`,(error,result,fields)=>{
    if(error){
      res.statusCode=500;
      res.json({

        message:"book not found",
    });
  }

    res.json(result);


  })
});


module.exports=router;
