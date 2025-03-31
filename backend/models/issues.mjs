import { Schema,model } from "mongoose";

const issues = Schema({
    raisedBy:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:[]//should decide
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const issueModel = model(issues,"issues");

export default issueModel;