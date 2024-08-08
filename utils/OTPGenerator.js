const User=require('../models/userModel')
const {sendEmail}=require('../utils/email')


const OTP=async(email)=>{
    console.log('GENERATING OTP::::::::::::::::::::')
    // const newUser=await User.find()
    // console.log('USER IS :',newUser)
    console.log("--------------------------------------")
    console.log("EMAIL IS:", email)
    const user = await User.findOne({ email})
    console.log('USER EMAIL IS :',user)

    const myRandomNumbers=Math.floor(1000 + Math.random() * 9000)
   const Otp =myRandomNumbers
   console.log('OTP is => ', Otp);
//    const URL = `${req.protocol}://${req.get('host')}/api/v1/motivationApp/logIn`;
   const message = `Use this OTP ${Otp} to complete your process.`
      try {
        await sendEmail({
            email:email,
            message:message
        })
    } catch (err) {
        console.log('Error is  : ', err.message);
    }
return Otp
}

module.exports=OTP