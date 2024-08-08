const appError=require('../utils/appErrors')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const User=require('../models/userModel')
const {sendEmail} = require('../utils/email')
const { isEmail } = require('validator')
const catchAsync=require('../utils/catchAsync')
const OTP=require('../utils/OTPGenerator')
const createaToken=require('../utils/tokenGenerator')
const util=require('util')


//restrictTo

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new appError('Role has not been specified.', 403))
      }
      next()
    }
  }
  


//resendOTP

exports.resendOTP=catchAsync(async(req,res,next)=>{ 

    console.log("HITTING RESED OTP:::::::::::::::::::")
  const otp=await OTP(req.body.email)
  console.log('OTP IS : ',otp)
       const otpUser=await User.findOne({email:req.body.email})
       console.log('OTP TIM EUSER IS : ',otpUser)
       const otpExpiryTime= Date.now() + 1 * 60 * 1000
       otpUser.signUpOtpExpiry=otpExpiryTime
       otpUser.OTP=otp
       await otpUser.save()
console.log("OPT EXPIRY IS:",otpUser.signUpOtpExpiry)
        try {
            await sendEmail({
                email:req.body.email,
                message:message
            })
        } catch (err) {
            console.log('Error is  : ', err.message);
        }

        res.status(200).json({
messge:'Email sent again with new OTP',
status:200
        })
})

//signUP

exports.signUp=catchAsync(async(req,res,next)=>{
        console.log("1")
const  otp=await OTP(req.body.email)
const otpExpiryTime= Date.now() + 1 * 60 * 1000
console.log("OPT EXPIRY IS:")

const newUser=await User.create({
    name:req.body.name,
    email:req.body.email,
    OTP:otp
})
newUser.signUpOtpExpiry=otpExpiryTime
await newUser.save()
console.log("OTP CREATED AT : ",otpExpiryTime)
console.log('USER IS : => ',newUser)
console.log('OTP IN SIGNUP IS : ',otp)
if(!newUser)
{
    return next(new appError('User do-not exists !',401))
}
    res.status(200).json({
        message:'user has been signed Up check your Emil for OTP ',
        status:200
    })
})


//verifyUserWhoSignedUp

exports.verify=catchAsync(async(req,res,next)=>{
const {OTP, email} = req.body
    const providedOTP=req.body.OTP
    const getOneUser=await User.findOne({email})
    const checkingDate = Date.now()
    if(checkingDate>getOneUser.signUpOtpExpiry)
    {
        console.log('VALIDATOR CHECKED !!!!!')
        return next(new appError('Time for OTP expired',404))
    }
    const token=createaToken(getOneUser._id)
    const originalOTP=getOneUser.OTP
    if(providedOTP===originalOTP)
    {
        getOneUser.isVerify=true
        await getOneUser.save()

        res.status(200).json({
            message:'Your email has been verified .',
            status:200,
            token:token,
            User:getOneUser
        })
    }
else
{
    return next(new appError('You provided Invalid OTP',404))
}
})

//findTheUser

exports.findUser=catchAsync(async(req,res,next)=>{
 const otp=await OTP(req.body.email)
console.log('Forget password OTP is : ',otp)
    const getUser=await User.findOne({email:req.body.email})
if(!getUser)
{
return next(new appError('This user do-not exist',404))
}
const otpExpiry = Date.now() * 1 * 60 * 1000
console.log('OTP EXPIRY : ',otpExpiry)
getUser.otpExpiry = otpExpiry
getUser.forgotPasswordOTP=otp
await getUser.save()

res.status(200).json({
    message:'check your email'
})
   const message = `Use  ${otp} to complete forgot password.`
console.log('NOW USER IS : ',getUser)
try {
    await sendEmail({
        email:req.body.email,
        message
    })
} catch (err) {
    console.log('Error is  : ', err.message);
}
})

//resetPassowrd

exports.resetPassword=catchAsync(async(req,res,next)=>{
    console.log('API HIT RESET ')
const {email}=req.body
    const providedforgotOTP=req.body.forgotPasswordOTP
    const originalUser=await User.findOne({email})
    const originalFOTP=originalUser.forgotPasswordOTP
    console.log('OTP OBTAINED  RE-SET ')
    const checkingDate = Date.now()

    console.log('Time of CREATION:',originalUser.otpExpiry)

    console.log('Time of CHECKING :',checkingDate)
    if(checkingDate>originalUser.otpExpiry)
    {
        return next(new appError('Your time has been expired tocheck OTP\n Go and get new one.',404))
    }
    if(!providedforgotOTP===originalFOTP)
    {
        return next(new appError('Provide valid OTPs ',402))
    }
    console.log('OTP CHECKED  RESET ')
        const url_reset='127.0.0.1:8000/api/v1/motivationApp/resetPassword'
        const message = `Use  ${url_reset} URL to reset your password.`
        console.log('NOW USER IS : ',originalUser)
        try {
            await sendEmail({
                email:req.body.email,
                message
            })
        } catch (err) {
            console.log('Error is  : ', err.message);
        }
console.log('EMAIL SENT ')
    res.status(200).json({
        message:'OTP verified',
        status:200
    })
})

//updateRe-setPassworOfUser

exports.updateResetedPassword=catchAsync(async(req,res,next)=>{
    const getUserUpdate=await User.findOneAndUpdate({email:req.body.email},
        req.body,{ new:true} )
if(!getUserUpdate)
{
    return next(new appError('User do-not exists!',302))
}
if(!getUserUpdate.isVerify)
{
    return next('You are not logged-In',404)
}
res.status(200).json({
    message:'your pasword has been updated successfully !',
    updatedUSer:getUserUpdate
})
})


//logIN
exports.logIn=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body
    console.log('ENTERRED')

    const user=await User.findOne({email})
    console.log("WORKING")
const Token=createaToken(user._id)
if(!email||!password)
    {
        console.log('Email or password not provided !')
        return next(new appError('Email or password not provided !',404))
    }
    const check=user.isVerify
if(!check)
{
    console.log('Not logged in !')
}
//     const logIn=await User.findOne(req.body.email)
// if(!logIn||!logIn.isVerify)
// {
//     console.log('You are not logged in .')
//     return next(new appError('You are not logged in .',404))
// }
const passwordChecker=user.checkPassword(password,user.password)
    if(!passwordChecker)
    {
        console.log('Your password is in-correct')
return next(new ('Your password is in-correct',404))
    }

    res.status(200).json({
        message:'You have logged-In',
        status:200,
        Token:Token,
    User:{
        user
    }
    })
    
})



//logOut
exports.logOut=catchAsync(async(req,res,next)=>{
    console.log("API HIT ")
    const user=await User.findById({
        _id:req.user._id
    })
    console.log("VERIFYING CHECKER : ",user.isVerify)
    if(!user)
    {
        return next(new appError('You are not logged in !',404))
    }
console.log("STATUS UPDATING ")
    user.isVerify=false
    await user.save()
    console.log("STATUS UPDATED !!!!!! ")

    res.status(200).json({
        message:"You have been logged out",
        status:200,
        user
    })
})


//getProfileInformation 
exports.getProfileInformation=catchAsync(async(req,res,next)=>{
    const getUser=await User.findById(req.params.id)

    console.log('EMAIL IS: ',getUser)
    console.log('EMAIL IS: ',getUser.email)
    console.log('LOGGED IN STATUS : ',getUser.isVerify)
    if(!getUser.email||!getUser.isVerify)
    {
        return next(new appError('This do-not exists or you  are not legged in',404))
    }
    console.log('User is : ',getUser)
res.status(200).json({
message:'success',
userExists:
    getUser
})})

//protectTours

exports.protect = catchAsync(async (req, res, next) => {
    console.log("API HIT")
    let token;
    console.log("START OF PROTECT ")
    console.log('Headers:', req.headers)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    console.log('Hy .......... ! ')
    console.log('Token:', token)
    if (!token) {
        return next(new appError('Login in order to get Access!', 401))
    }
    console.log("BEFOR BEING DECODED !!!!! ")
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log('PRIOR TO FREASH USER ')
    console.log('DECODED IS ',decoded)
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new appError('This user no longer exists.', 401))
    }
    // if (freshUser.passwordChangedAfter(decoded.iat)) {
    //     return next(new appError('Password has been changed! Log in again.', 401))
    // }
    console.log("ENDING PROTECT ")
    req.user = freshUser
    console.log("PROTECT COMPLETED !!!! ")
    next()
})

//restrictTo

// exports.restrcitTo=catchAsync(async(role)=>{
//     if(role!='admin')
//     {
// return res.status(404).json({
//     message:'You can-not perform this work.',
//     status:404
// })
//     }
//     res.status(200).json({
//         messge:'You can perform this work',
//         status:200
//     })
// })




















// //logIn

// exports.logIn=catchAsync(async(req,res,next)=>{
//     const { email, password } = req.body

//     if (!email || !password) {
//         return next(new appError('Email or password not provided!', 401))
//     }

//     const user = await User.findOne({ email }).select('+password')
//     console.log('This is user', user)

//     if (!user) {
//         return next(new appError('User does not exist.', 402))
//     }

//     const passwordCorrect = await user.checkPassword(password, user.password);
//     if (!passwordCorrect) {
//         return next(new appError('Password is incorrect.', 402))
//     }

//     const token=createaToken(user._id)
//     res.status(200).json({
//         tokenIs:token,
// userIs:user
//     })

// })







//createSendToken

const createSendToken=(user,statusCode,res)=>{
    const token = createaToken(user._id);
//makingCookie
const cookieOptions={expires:new Date(
    Date.now()+process.env.COOKIE_EXPIRES_IN*24*60*60*1000
),
httpOnly:true
}
if(process.env.NODE_ENV==='production') cookieOptions.secure=true,
res.cookie=('jwt',token,cookieOptions)
User.password=undefined
    res.status(statusCode).json({
        message: 'success! Logged In',
        tokenIs: token,
    })
}





//reserPassowrd

// exports.forgotPassword = catchAsync(async (req, res, next) => {
//     const User = await User.findOne({ email: req.body.email });
//         console.log('User is =>', User);
//         if (!User) {
//             return next(new appError('User does not exist!', 404));
//         }
//         const resetPassword = User.resetPasswordToken();
//         console.log('Reset password', resetPassword);
//         await User.save({ validateBeforeSave: false });  
//         const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetPassword}`;
//         const message = `Forgot password? Go to ${resetURL} to reset your password.`;

//     try {
//         await sendEmail({
//             email: req.body.email,
//             message:message
//         })
//         res.status(200).json({
//             message: 'success',
//             // newPassword:resetPassword
//         })
//     } catch (err) {
//         console.log('Error is: ', err.message);
//         next(new appError('Error occurred right now!', 404));
//     }
// });





//resetPassword

// exports.resetPassword=catchAsync(async (req,res,next)=> {
//     const hashedToken=crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest('hex')
//     const User=User.findOne({
//         passwordResetToken:hashedToken,
//         passwordExpiration:{$gt:Date.now()-1000}
//     })
// console.log('User from resetPassword : ',User)
//         if(!User)
//         {
//             return next(new appError('User do-not exists in Reser Password ! ',404))
//         }
//         User.password=req.params.password
//         User.passwordResetToken=undefined,
// User.passwordExpiration=undefined,
// User.confirmPassword=req.params.confirmPassword
// await User.save()
// createSendToken(User,200,res)
// })


//updatePassword

exports.updatePassword=catchAsync(async(req,res,next)=>{
const USer=await User.findById(req.User.id).select('+password')
if(!(await USer.correctPassword(req.body.password,USer.password)))
{
return next(new appError('Password is not correct !',401))
}
USer.password=req.body.password
USer.confirmPassword=req.body.confirmPassword
await USer.save()
createSendToken(USer,202,res)
})