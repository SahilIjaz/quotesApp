const catchAsync=require('../utils/catchAsync')
const jwt =require('jsonwebtoken')
const User=require('../models/userModel')
const validator=require('validator')
const authControllers=require('../controllers/authControllers')
const appError = require('../utils/appErrors')

exports.profileInformation=catchAsync(async(req,res,next)=>{
    const user=await User.findById({_id:req.user._id})
    if(!user)
    {
        return next(new appError('User do-not exists !',404))
    }
    console.log(user)
    res.status(200).json({
        message:'Your profile information found and is as follows',
        status:200,
    ProfileInformation:{
        user
    }})
})


exports.makeChanges=catchAsync(async(req,res,next)=>{
    const user=await User.findById({_id:req.user._id})

    if(!user)
    {
        console.log('Not logged In.',404)
    }
    const newUser=await User.findByIdAndUpdate(user._id,req.body,{new:true})

    res.status(200).json({
        message:'changes saved ',
        status:200,
        newUser
    })
})


