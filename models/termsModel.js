const mongoose=require('mongoose')

const termsSchema=new mongoose.Schema({
    terms:{
        type:String,
        required:[true,'Terms must be enterred ']
    }
})

const Term=mongoose.model('Term',termsSchema)
module.exports=Term
