const express=require('express')
const mongoose=require('mongoose')
const app=require('./app')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})





const port=process.env.PORT
const DB=process.env.DATABASE_URL
mongoose.connect(DB,{
}).then(con=>console.log('connection established....')).catch((err)=>{
    console.log('Error occured....')
})

app.listen(process.env.PORT, ()=>{
    if (process.env.NODE_ENV === "development") {
        console.log(
          `Server is running in Development mode on Port : ${port}`
        );
      } else if (process.env.NODE_ENV === "production") {
        console.log(
          `Server is running in Production mode on Port : ${port}`
        );
        }
    })