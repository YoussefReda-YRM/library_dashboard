const adminAuth=(req,res,next)=>{
const {admin} =req.headers;
if (admin == 1) next();
else{

    req.statusCode=403;

      
      
    res.send({

      message:"not authorized",
    } );
}

};
module.exports= adminAuth;