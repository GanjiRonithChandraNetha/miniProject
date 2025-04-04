import jobModel from "../models/jobs.mjs";
import jobCredentialChecker from "../utils/validaters/jobValidator.mjs";
import userJobsModel from "../models/maps/userJobMap.mjs";
import mongoose from "mongoose";
import jobSet from "../data/jobFields.mjs";
import jobModularChecker from "../utils/validaters/jobModularValidator.mjs";

const createJob = async(req,res)=>{
    try {
        req.body.deadline = new Date(req.body.deadline);
        console.log(req.body);
        const {success,error,data} = jobCredentialChecker(req.body);
        if(!success){
            res.status(400).json({
                message:"incorrect data sent",
                error:error
            })
        }else{
            // const job = await jobModel.create({
            //     title:req.body.title,
            //     description:req.body.description,
            //     skill:req.body.skill,
            //     budget:req.body.budget,
            //     deadline:req.body.deadline,
            //     status:req.body.status,
            //     image:req.body.image,
            //     imageRatio:req.body.imageRatio
            // })
            const job = await jobModel.create(data);
            await userJobsModel.insertOne({
                jobId:job._id,
                employerId:req.user._id
            })
            res.status(200).json({message:"job created"})
        }
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

// this will increase the complexcity but is a good feature to have 
// we ristrict one to have same named jobs with same user 
// need team oppineone

const viewJobs = async(req,res)=>{
    try {
        const jobs = await userJobsModel.aggregate([
            {
                $match:{employerId: new mongoose.Types.ObjectId(req.user._id)}
            },
            {
                $lookup:{
                    from:'jobs',
                    localField:'jobId',
                    foreignField:'_id',
                    as:"jobDetails"
                }
            },{$unwind:"$jobDetails"},
            {
                $lookup:{
                    from:"users",
                    localField:"freelancerId",
                    foreignField:"_id",
                    as:"freelancerDetails"
                }
            },
            {
                $unwind:{
                    path:"$freelancerDetails",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $project:{
                    jobId:1,
                    employerId:1,
                    freelancerId:1,
                    job:"$jobDetails",
                    freelancer:"$freelancerDetails"
                }
            }
        ]);
        console.log(jobs);
        const engagedJobs = []
        const vacantJobs = []
        jobs.forEach(element => {
            if(element.freelancer)
                engagedJobs.push(element);
            else
                vacantJobs.push(element);
        });
        res.status(200).json({
            vacantJobs:vacantJobs,
            engagedJobs:engagedJobs
        })
    } catch (error) {
        res.status(500).json({
            message:"failed to retrive jobs",
            error:error.message
        })
    }
}

const updateJob = async(req,res)=>{
    try {
        if(req.body.jobId && req.body.data && !Array.isArray(req.body.data)){
            for(const key of Object.keys(req.body.data)){
                const obj = jobModularChecker(key,req.body.data[key])
                if(!obj.success){
                    return res.status(401).json({
                        message:"in compatable data sent",
                        error:obj.error
                    });
                }
            }
            const jobs = await userJobsModel.findOne({jobId:req.body.jobId});
            if(!jobs)
                res.status(400).json({message:"no job found"})
            else if(jobs.freelancerId)
                res.status(400).json({
                    message:"job can not be edited after an aggrement"
                })
            else{
                await jobModel.updateOne({_id:req.body.jobId},{$set:req.body.data})
                res.status(200).json({message:"data updated"})
            }
        }else
            res.status(400).json({
                message:"bad request"
            })
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}
export {createJob,viewJobs};