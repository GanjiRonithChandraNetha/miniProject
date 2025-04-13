import { Schema,model } from "mongoose";

const jobApplicationsMaps = Schema({
    applicationId:{
        type:Schema.Types.ObjectId,
        ref:'applications'
    },
    jobId:{
        type:Schema.Types.ObjectId,
        ref:'jobs'
    }
});

const jobApplicationsmodel = model('jobApplicationsMaps',jobApplicationsMaps);

export default jobApplicationsmodel