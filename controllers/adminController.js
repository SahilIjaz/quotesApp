const User=require('../models/userModel')
const Quote=require('../models/quotesModel')
const catchAsync=require('../utils/catchAsync')
const roleChecker=require('../utils/roleChecker')
const appError=require('../utils/appErrors')
const Term=require('../models/termsModel')

exports.getAllUsers=catchAsync(async(req,res,next)=>{
    console.log("API HIT")
const users=await User.find()
if(!users)
{
    return next(new appError('There is no user !',404))
}
res.status(200).json({
    message:'All users found',
    status:200,
    users
})
})


exports.deleteUser=catchAsync(async(req,res,next)=>{
        const user=await User.findByIdAndDelete(req.body._id)
if(user)
{
    return next(new appError('User not deleted ',404))
}
res.status(500).json({
    message:'User deleted',
    satus:500
})
})

exports.makeTerms=catchAsync(async(req,res,next)=>{
    const terms=await Term.create(req.body)
    if(!terms)
    {
       return next(new appError('Terms are not created.',404))
    }
    res.status(200).json({
        message:'Terms created !',
        status:200,
        terms
    })
})


exports.updateTerm=catchAsync(async(req,res,next)=>{
    const term=await Term.findByIdAndUpdate(req.params.id,req.body,{new:true})

    if(!term)
    {
        return next(new appError('Term not updated !',404))
    }
    res.status(200).json({
        message:'Term has been updated !',
        status:200,
        newTermIs:term
    })
})

exports.deletTerm=catchAsync(async(req,res,next)=>{
    const term=await Term.findByIdAndDelete(req.params.id)
    if(term)
    {
        return next('Error in deleting term',404)
    }
    res.status(200).json({
        message:'Term has been deletd.',
        status:200
    })
})


exports.getTerms=catchAsync(async(req,res,next)=>{
    const terms=await Term.find()
if(!terms)
{
    return next(new appError('Terms can-not be found they do-not exist.',404))
}
res.status(200).json({
    message:'Terms have been found!',
    status:200,
    TersmAre:{
        terms
    }
})
})