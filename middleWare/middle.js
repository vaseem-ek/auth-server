const jwt=require('jsonwebtoken')

const jwtmiddle=async(req,res,next)=>{
    try {
        const token =req.headers.token
        const verifiedUser=await jwt.verify(token,process.env.JWT_SECRET)
        req.payoad=verifiedUser.userId
        
    } catch (error) {
        console.log(error);
        return res.json(error.message)
    }
}