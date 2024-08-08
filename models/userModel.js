const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required !']
    },
    email:{
        type:String,
        required:[true,'Email is compulsory'],
        unique:true,
validate:[validator.isEmail,'provide valid Email']    
    },
    password:{
        type:String,
        min:8
    },
    avatar:{
        type:String
    },
    confirmPassword:{
        type:String,
        min:8,
        validate:{
            validator:function(el){
    return el===this.password
            }
}
    },
    role:{
        type:String,
        default:'user'
    },
    OTP:{
        type:Number
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    forgotPasswordOTP:{
        type:Number
    },
    signUpOtpExpiry:{
        type:Date
    },
 otpExpiry:{
        type: Number
    }
})



// userSchema.pre('save', async function(next) {
//         if (!this.isModified('password')) return next();
    
//         try {
//             this.password = await bcrypt.hash(this.password, 12);
//             this.confirmPassword = undefined
//             next()
//         } catch (err) {
//             next(err)
//         }
//     })

userSchema.methods.checkPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}


const User=mongoose.model('User',userSchema)
module.exports=User