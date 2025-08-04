import mongoose from "mongoose";
let URI = process.env.URI || '';
export const dB = () => {
    mongoose.connect(URI).then((res) => {
        console.log("Mongodb Connected");
    }).catch((error) => {
        console.log(error);
    });
};
