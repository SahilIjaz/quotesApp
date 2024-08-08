const mongoose=require('mongoose')
const User=require('../models/userModel')

const quotesSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title can-not be empty ']
    },
    time:{
        type:String,
       default:0
    },
    days:{
        type:String,
        enum:['Monday',"Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        default:' '
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
     ref:'User'
    },
    favourite:{
        type:Boolean,
        default:false
    }
})

quotesSchema.pre([/^find/,'save'],function(){
    this.populate({
        path:'user'
    })
})


const quote=mongoose.model('quote',quotesSchema)
module.exports=quote

