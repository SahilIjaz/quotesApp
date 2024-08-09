const catchAsync=require('../utils/catchAsync')
const appError=require('../utils/appErrors')
const User=require('../models/userModel')
const moment=require('moment')
const quote = require('../models/quotesModel')



exports.createQuote=catchAsync(async(req,res,next)=>{
    console.log("API HIT CREATE QUOTE ")
    const userID=await User.findById(req.user._id)
    console.log('USER ID : ',userID)
    const newQuote=await quote.create(req.body)
    if(!newQuote)
    {
        return next(new appError('Quote do-not exists. ',404))
    }
    newQuote.user=userID
    await newQuote.save()
    res.status(200).json({
        message:'Quote has been created',
        status:200,
        data:{
            newQuote
        }
    })
})


exports.getQuotesForToday = catchAsync(async(req,res,next)=>{
    console.log('API HIT ')
    const currentDay = moment().format('dddd'); // Current day of the week, e.g., 'Monday'
    const currentTime = moment().format('HH:mm');
    console.log('Current day is: ',currentDay)
    console.log('Current time is : ',currentTime)
    const userID=await User.findById(req.user._id)
    const quotes=await quote.find({
        user: req.user._id,
        days: currentDay,
        time: currentTime,

    })
    console.log("QUOTES ARE:", quotes)
    return res.status(200).json({
        message: "Quote found for today",
        status:200,
        quotes
    })
})


exports.favouriteQuote=catchAsync(async(req,res,next)=>{
    const Quote=await quote.findById(req.params.id)
    console.log('QUOTE IS :',Quote)
    if(!Quote)
    {
        return next(new appError('There is no such Quote !',404))
    }
    Quote.favourite=true
    await Quote.save()
    res.status(200).json({
        messaeg:'Quote added to favourities',
        status:200,
        Quote:{
            Quote
        }
    })
})


exports.favouriteQuotes=catchAsync(async(req,res,next)=>{
    console.log('API HIT GET FAVOURITE QUOTE')
    const quotes=await quote.find({
        user:req.user._id,
        favourite:true,
    })
    console.log("BEFOR CHECK ")
if(!quotes)
{
    return next(new appError('You have not any favourite quote.',404))
}
console.log("BEFOR STATUS")
res.status(200).json({
    message:"Your favourite quote found ",
    status:200,
    quotes
})
console.log("AFTER CHECK")
})


exports.remainder=catchAsync(async(req,res,next)=>{
    const remainders=await quote.find({
        user:req.user._id,
        remainder:' ',
        time:'0'
    })

if(!remainders)
{
    return next(new appError('No remainders to be shown!',404))
}
res.status(200).json({
    messaeg:'Your remeainders found !',
    status:200,
    remainders
})
})
