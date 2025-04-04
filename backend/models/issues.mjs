import { Schema,model } from "mongoose";

const issues = Schema({
    raisedBy:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["vacant","ongoing","completed"],//should decide
        default:"vacant"
    },
    solution:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    solvedAt:Date,
    jobId:{
        type:Schema.Types.ObjectId,
        ref:'jobs',
        required:true
    }
})

const issueModel = model("issues",issues);

export default issueModel;