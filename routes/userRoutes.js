const express=require('express')
const userController=require('../controllers/userController')

const router=express.Router()

router.post('/register',userController.UserRegistration)
router.post('/login',userController.UserLogin)

module.exports=router