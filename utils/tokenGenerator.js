const jwt=require('jsonwebtoken')

const createaToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,
       { expiresIn:process.env.EXPIRES_IN}
    )
}

module.exports=createaToken