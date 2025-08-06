import mongoose, { Document, Schema } from "mongoose";


export interface TArticle extends Document{
    title:string,
    content:string,
    translatedContent?:string,
    image?:string,
    videoUrl?:string,
    category:string,
    author:mongoose.Types.ObjectId,
    views:number,
    likes:mongoose.Types.ObjectId[],

}

const articleSchema = new Schema<TArticle>({
    title:{
        type:String,
        required:[true, "Can't Submit Empty article"]
    },
    content:{
        type:String,
        required:[true, "Empty Content!"]
    },
    translatedContent:{
        type:String,
        required:false // ✅ Allow article creation before translation
    },
    image:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type:String,
        required:[true, "Please Select One Category"]
    },
    views:{
        type:Number,
        default:0
    },
    likes:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:'User'
    }]

},{timestamps:true})


export const Article = mongoose.model<TArticle>("Article", articleSchema)