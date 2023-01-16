const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

// const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET = 'NOTEBOOKDATA$123'


//Create a user using POST : api/auth/createUser
router.post('/createUser',[
    body('email',"Enter a valid email").isEmail(),
    body('name',"Enter a valid name").isLength({min:3}),
    body('password',"Password must be atleast 6 characters").isLength({min:6})
],async (req,res)=>{
    let success = false;
    //If there are errors , return Bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try{
    //Check if email exists already
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({success,error:"Sorry this email is already in use"})
    }

    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password,salt)
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password:secPass
        // password: req.body.password,
    });
    const data = {
        user:{
            id:user.id
        }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success,authToken})
    }catch(err){
        // console.error(err.message);
        res.status(500).send("Internal Server error occured")
    }
    //   .then(user => res.json(user))
    //   .catch((err)=>{
    //     // res.json(err);
    //     res.json({error:"Email already exists",message:err.message})
    //   })
})


//Authenticate a User using POST: /api/auth/login
router.post('/login',[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password Can't be Blank").exists()
],async (req,res)=>{
    //Check for errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error:"Please try to login with correct credentials"})
        }
        const passwordCompare =await bcrypt.compare(password,user.password);
        if(!passwordCompare){   
            return res.status(400).json({success,error:"Please try to login with correct credentials"})
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken});


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error occured")
    }


})

//Get User details in POST /api/auth/getuser
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error occured")
    }
})

module.exports = router