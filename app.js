const express=require('express')
const app=express()
const json=require('json')
app.use(express.json())

const globalErrorHandler = require('./controllers/errControllers')
const userRoutes=require('./routes/userRoutes')
const quoteRoutes=require('./routes/quoteRoutes')
const adminRoutes=require('./routes/adminROutes')



app.use('/api/v1/motivationApp',userRoutes)
app.use('/api/v1/app/quotes',quoteRoutes)
app.use('/api/v1/app/admin',adminRoutes)

app.use(globalErrorHandler)

module.exports=app