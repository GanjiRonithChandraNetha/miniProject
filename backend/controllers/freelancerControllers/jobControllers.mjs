import applicationModel from "../../models/applications.mjs";
import userJobsModel from "../../models/maps/userJobMap.mjs"
import mongoose from "mongoose"

const freelancerViewJobs = async(req,res)=>{
    try {
        const appointedJobs = await userJobsModel.aggregate([
            {
                $match:{
                    freelancerId:new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup:{
                    from:'jobs',
                    localField:'jobId',
                    foreignField:'_id',
                    as:"jobDetails"
                }
            },
            {
                $unwind:{
                    path:"$jobDetails",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $project:{
                    _id:0,
                    freelancerId:1,
                    jobId:1,
                    employerId:1,
                    jobDetails:"$jobDetails"
                }
            }
        ])
        console.log(appointedJobs);
        res.status(200).json({jobs:appointedJobs})
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

const agreeJob = async(req,res)=>{
    try {
        let {applicationId} = req.body;
        console.log(applicationId)
        if(!applicationId)
            return res.status(400).json({message:"application not specified"});
        applicationId = new mongoose.Types.ObjectId(applicationId)
        await applicationModel.updateOne(
            {_id:applicationId},
            {$set :{status:"ready"}}
        );
        res.status(200).json({message:"updated application to ready state"})
    } catch (error) {
        res.status(500).json({
            message:"interanl server error",
            error:error.message
        })
    }
}

export {freelancerViewJobs,agreeJob}