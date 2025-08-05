import mongoose, { Document, Schema } from "mongoose";


export interface TUser extends Document {
    name:string,
    email:string,
    password:string,
    role: "user" | "admin" | "superadmin",
    category?:string[],
    status:boolean,
}

const userSchema = new Schema<TUser>({
     name:{
        type:String,
        required:[true, "Please Enter your name"],
        minLength:[3, "Enter min Three Words for you name"],
     },
     email:{
        type:String,
        required:true,
        unique:[true, "This Email Already Register"]
     },
     password:{
        type:String,
        required:[true, "Please Enter your Password"],
     },
     role:{
        type:String,
        enum:["user", "admin", "superadmin"],
        default:"user"
     },
     category:{
        type:[String],
        default:[]
     }
},{timestamps:true})

export const User = mongoose.model<TUser>("User",userSchema )