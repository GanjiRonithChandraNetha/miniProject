import { Schema,model } from "mongoose";

const userJobsMaps = Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref:'jobs'
    },
    freelancerId:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    employerId:{
        type: Schema.Types.ObjectId,
        ref:'users'
    }
});

const userJobsModel = model(userJobsMaps,'userJobsMaps');

export default userJobsModel;