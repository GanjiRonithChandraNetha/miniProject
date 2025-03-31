import { Schema,model } from "mongoose";

const applicatons = Schema({
    bidAmount:Number,
    cover_letter:String, //dought
    status:String,
    createdAt:{
        type:Date,
        required:true
    }
})

const applicatonModel = model(applicatons,"appplications");

export default applicatonModel;