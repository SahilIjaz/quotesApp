const express=require('express')
const app=express()
const router=express.Router()

const authControllers=require('../controllers/authControllers')
const adminControllers=require('../controllers/adminController')

router
.route('/getAllUsers')
.get(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    adminControllers.getAllUsers
)

router
.route('/deleteUser')
    .delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    adminControllers.deleteUser
)

router
.route('/makeTerms')
.post(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    adminControllers.makeTerms
)

router
.route('/updateTerms/:id')
.patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    adminControllers.updateTerm
)


router
.route('/deleteTerms/:id')
.delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    adminControllers.deletTerm
)


module.exports=router

