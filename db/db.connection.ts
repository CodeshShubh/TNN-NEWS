import mongoose from "mongoose";



export const dB = (URI:string)=>{
     mongoose.connect(URI).then((res)=>{
        console.log("Mongodb Connected")
     }).catch((error)=>{
        console.log(error)
     })
}