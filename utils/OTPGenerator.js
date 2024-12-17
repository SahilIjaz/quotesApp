const User=require('../models/userModel')
const {sendEmail}=require('../utils/email')
const OTP=async(email)=>{
    const user = await User.findOne({ email})
    const myRandomNumbers=Math.floor(1000 + Math.random() * 9000)
   const Otp =myRandomNumbers
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