const userControllers=require('../controllers/userControllers')
const express=require('express')
const router=express.Router()
const authControllers=require('../controllers/authControllers')
const adminControllers=require('../controllers/adminController')

router
.route('/signUp')
.post(authControllers.signUp)


router
.route('/resendOTP')
.post(authControllers.resendOTP)

router
.route('/verify')
.post(authControllers.verify)

router
.route('/forgotPassword')
.post(authControllers.findUser)


router
.route('/verifyResetPassword')
.get(authControllers.resetPassword)

router
.route('/resetPassword')
.patch(authControllers.updateResetedPassword)

router
.route('/profileInformation/:id')
.get(authControllers.getProfileInformation)

router
.route('/logIn')
.post(authControllers.logIn)

router.route('/logOut')
.post(
    authControllers.protect,
    authControllers.logOut
)
router
.route('/getTerms')
.get(
    authControllers.protect,
    adminControllers.getTerms
)

router.route('/profileInformation')
.get(
    authControllers.protect,
    userControllers.profileInformation
)

router.route('/makeChanges')
.patch(
    authControllers.protect,
    userControllers.makeChanges
)

router
.route('/getTerms')
.get(
    authControllers.protect,
    adminControllers.getTerms
)

module.exports=router



