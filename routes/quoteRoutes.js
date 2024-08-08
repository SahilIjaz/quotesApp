const quoteController=require('../controllers/quotesControllers')
const authControllers=require('../controllers/authControllers')
const express=require('express')
const router=express.Router()


router
.route('/createQuote')
.post(
    authControllers.protect,
  quoteController.createQuote
)

router
.route('/getQuote')
.put(
  authControllers.protect,
   quoteController.getQuotesForToday
)


router
.route('/makeFavourite/:id')
.put(
  authControllers.protect,
  quoteController.favouriteQuote
)


router
.route('/getFavouriteQuotes')
.get( 
  authControllers.protect,
  quoteController.favouriteQuotes
)

router
.route('/remainder')
.get(
  authControllers.protect,
  quoteController.remainder
)

module.exports=router
