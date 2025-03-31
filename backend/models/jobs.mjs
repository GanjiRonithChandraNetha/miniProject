import { Schema,model } from "mongoose";

const jobs = Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    skill:{
        type:[String],
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    deadLine:{
        type:Date,
        required:true
    },
    staus:String, // dought 
    createdAt:{
        type:Date,
        required:true
    }
})

const jobModel = model(jobs,"jobs");

export default jobModel;