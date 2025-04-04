import { Schema,model } from "mongoose";

const userJobsMaps = Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref:'jobs',
        required:true
    },
    freelancerId:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    employerId:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
});

const userJobsModel = model('userJobsMaps',userJobsMaps);

export default userJobsModel;