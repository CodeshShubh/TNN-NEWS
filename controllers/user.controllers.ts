import { Request, Response } from "express";
import { User } from "../models/user.models.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "secret"

export const register = async(req:Request, res:Response)=>{
 try {
    const {name,email,password} = req.body || {};
    // console.log("request", req.body)
    if(!name || !email || !password) 
        return res.status(400).json({Success:false, Message:"Plese Enter All fields"})

    if(password.length<6){
        return res.status(400).json({Success:false, Message:"Password Length Should be 6 min."})

    }
    if(name.length<3){
        return res.status(400).json({Success:false, Message:"Name Latter Should be 3 min."})

    }

     const existUser = await User.findOne({email})

     if(existUser) return res.status(409).json({Success:false, Message:"Email Alrady register"})
     
        const hashedPassowrd = await bcrypt.hash(password,10)

    const user = await User.create({
        name,
        email,
        password:hashedPassowrd,
    })
    res.status(201).json({Success:true, Message:"User Register Successfully"})
    
 } catch (error) {
        res.status(400).json({Success:false, Message:"Register Failed", Error:error})
 }    
}


export const login = async(req:Request, res:Response)=>{
   try {
      const {email,password} = req.body;

     const existUser = await User.findOne({email})
     if(!existUser) return res.status(404).json({Success:false, Message:"User Not Found"})

        const isMatchPassword = await bcrypt.compare(password, existUser.password);

        if(!isMatchPassword)
            return res.status(401).json({Success:false, Message:'invalid Credentials'})

        const token = jwt.sign({id:existUser._id, role:existUser.role}, JWT_SECRET, {expiresIn:'7d'})

        res.json({token, user:{id:existUser._id, role:existUser.role, email:existUser.email, name:existUser.name}})
    
    
   } catch (error) {
     res.status(400).json({Success:false, Message:"Login Failed", Error:error})
   }
}