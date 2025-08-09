import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        minLength: [3, "Enter min Three Words for you name"],
    },
    email: {
        type: String,
        required: true,
        unique: [true, "This Email Already Register"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
    },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    category: {
        type: [String],
        default: []
    }
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);
