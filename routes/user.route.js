const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {User} = require("../model/user.model")
const userRouter = express.Router()

userRouter.post("/add",async(req,res)=>{
    const {name,email,password} = req.body
    try {
        const userEx =await  User.findOne({email})
        if(userEx){
            res.status(400).send({msg:"User already exist"})
        }
        const hash = bcrypt.hashSync(password,5)
        const user = new User({name,email,password:hash})
        await user.save()
        console.log(user)
        res.status(200).send("successful")
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const userExist = await User.findOne({email})
        if(!userExist){
            res.status(400).send({msg:"User doesnot exist please register"})

        }
        let name = userExist.name
        const isPassword = await bcrypt.compare(password,userExist.password)
        const token = jwt.sign({userid:userExist._id,username:userExist.name},process.env.JWT_TOKEN,{expiresIn:"1h"})
        res.status(200).send({"msg":"Login Successful",token:token,name:name})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

module.exports = {userRouter}
