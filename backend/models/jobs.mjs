import { Schema,model } from "mongoose";

const jobs = Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    staus:{
        type:String,
        enum:["onging","vacant","completed"],
        default:"vacant"
    }, // dought 
    createdAt:{
        type:Date,
        default:Date.now
    },
    image:String, //url //set default value
    imageRatio:String,//dought // set default ratio
})

const jobModel = model("jobs",jobs);

export default jobModel;