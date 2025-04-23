import jobModel from "../models/jobs.mjs";
import jobCredentialChecker from "../utils/validaters/jobValidator.mjs";
import userJobsModel from "../models/maps/userJobMap.mjs";
import jobApplicationsmodel from "../models/maps/jobApplicationMap.mjs";
import applicationModel from "../models/applications.mjs";
import userApplicationsModel from "../models/maps/userApplicationMap.mjs"
import mongoose from "mongoose";
import jobModularChecker from "../utils/validaters/jobModularValidator.mjs"


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
            console.log(job._id+"\n"+req.user._id);
            await userJobsModel.create({
                jobId: job._id,
                employerId: req.user._id,
            });
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

const employerViewJobs = async(req,res)=>{
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
        // console.log(jobs);
        const engagedJobs = []
        const vacantJobs = []
        jobs.forEach(element => {
            if(element.freelancer){
                element.expired = false;
                engagedJobs.push(element);
            }
            else{
                element.expired = element.deadline < Date.now() ? true : false;
                vacantJobs.push(element);
            }
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
        console.log("hello")
        const {jobId,data} = req.body;
        console.log(jobId,data)
        if (!jobId || !data || Array.isArray(data)) {
            res.status(400).json({message:"bad request"})
        }

        if(req.body.data.deadline){
            req.body.data.deadline = new Date(req.body.data.deadline)
        }

        for (const [key, value] of Object.entries(data)) {
            const obj = jobModularChecker(key, value);
            if (!obj.success) {
                return res.status(401).json({
                    message: "Incompatible data sent",
                    error: obj.error,
                });
            }
        }
        
        const jobs = await userJobsModel.findOne({jobId:jobId});
        if(!jobs)
            res.status(400).json({message:"no job found"})

        else if(jobs.freelancerId)
            res.status(400).json({message:"job can not be edited after an aggrement"})
            
        else{
            await jobModel.updateOne({_id:req.body.jobId},{$set:req.body.data})
            // console.log(res);
            if(req.updatePromises)
                await Promise.all(req.updatePromises);
            res.status(200).json({
                message:"data updated",
                success:true
            })
        }
            
    } catch (error) {
        console.log("update");
        console.log(error);
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

// {
//     jobId,
//     data:{
//         json with proper fields
//     }
// }

const getApplicantsByJob = async(req,res)=>{
    try {
        if(!req.body.jobId)
            return res.status(404).json({message:"jobId not provided"})
        const applicants = await jobApplicationsmodel.aggregate([
            {
                $match:{
                    jobId:new mongoose.Types.ObjectId(req.body.jobId)
                }
            },
            {
                $lookup:{
                    from:"applications",
                    localField:'applicationId',
                    foreignField:'_id',
                    as:'applicationDetails'
                }
            },
            {
                $unwind:"$applicationDetails"
            },
            {
                $lookup:{
                    from:'userapplicationsmaps',
                    localField:"applicationId",
                    foreignField:"applicationId",
                    as:'userMap'
                }
            },
            {
                $unwind:{
                    path:"$userMap",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:'userMap.freelancerId',
                    foreignField:'_id',
                    as:'userDetails'
                }
            },
            {
                $lookup:{
                    from:"skills",
                    localField:"userMap.freelancerId",
                    foreignField:"userId",
                    as:"skillsArr"
                }
            },
            {
                $lookup:{
                    from:"links",
                    localField:'userMap.freelancerId',
                    foreignField:"userId",
                    as:"links"
                }
            },
            {
                $project:{
                    _id:1,
                    jobId:1,
                    applicationId:1,
                    applicationDetails:{
                        bidAmount:"$applicationDetails.bidAmount",
                        coverLetter:"$applicationDetails.coverLetter",
                        status:"$applicationDetails.status"
                    },
                    userDetails:{
                        username:"$userDetails.userName",
                        email:"$userDetails.email",
                        profilePic:"$userDetails.profilePic"
                    },
                    userSkills:["$skillsArr.skill"],
                    links:{
                        $map:{
                            input:"$links",
                            as:"link",
                            in:{
                                key:"$$link.linkKey",
                                value:"$$link.linkValue"
                            }
                        }
                    }
                }
            }
        ])
        const ans = applicants.filter(ele => ele.applicationDetails.status !== "draft")
        res.status(200).json(ans);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

const sendAgreement = async(req,res)=>{
    try {
        const { jobId, selected } = req.body;
        // First get all applicationIds for this job
        const jobApps = await jobApplicationsmodel.find({ jobId }).distinct('applicationId');

        // Convert to ObjectId for comparison
        const selectedIds = selected.map(id => new mongoose.Types.ObjectId(id));

        // Update all in two operations (still more efficient than individual updates)
        console.log(selected);
        await applicationModel.updateMany(
            { 
                $and:[
                    {_id: { $in: jobApps }},
                    {_id: { $in: selectedIds }},
                    {status:{$ne:"draft"}}
                ]
            },
            { $set: { status: "selected" } }
        );

        await applicationModel.updateMany(
            { 
              _id: { $in: jobApps },
              $and: [
                {
                  status: { $ne: 'selected' }
                },
                {
                  $or: [
                    { status: { $eq: 'draft' } },
                    { _id:{$nin:selectedIds} }
                  ]
                }
              ]
            },
            { 
              $set: { status: "rejected" }
            }
          );          
        res.status(200).json({message:"data updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}


// can be replaced with above code

// // Add these optimizations for very large datasets
// const batchSize = 1000; // Adjust based on your document size

// const cursor = jobApplicationsmodel
//   .find({ jobId }, { applicationId: 1 })
//   .lean()
//   .cursor({ batchSize });

// const bulkSelected = applicationModel.collection.initializeUnorderedBulkOp();
// const bulkRejected = applicationModel.collection.initializeUnorderedBulkOp();

// for await (const doc of cursor) {
//   const isSelected = selectedSet.has(doc.applicationId.toString());
//   const bulkOp = isSelected ? bulkSelected : bulkRejected;
  
//   bulkOp.find({ _id: doc.applicationId }).updateOne({
//     $set: { status: isSelected ? "selected" : "rejected" }
//   });
// }

// await Promise.all([
//   bulkSelected.length > 0 ? bulkSelected.execute() : Promise.resolve(),
//   bulkRejected.length > 0 ? bulkRejected.execute() : Promise.resolve()
// ]);


const viewAgreed = async(req,res)=>{
    try {
        const {jobId} = req.body;
        if(!jobId)
            return res.status(400).json({message:"incomplete data sent"})
        const agreedApplicants = await jobApplicationsmodel.aggregate([
            {
                $match:{
                    jobId:new mongoose.Types.ObjectId(jobId)
                }
            },
            {
                $lookup:{
                    from:"applications",
                    localField:'applicationId',
                    foreignField:'_id',
                    as:"applicationDetails"
                }
            },
            {
                $unwind:"$applicationDetails"
            },
            {
                $match:{
                    "applicationDetails.status":"ready"
                }
            },
            {
                $lookup:{
                    from:"userapplicationsmaps",
                    localField:'applicationId',
                    foreignField:"applicationId",
                    as:'userMap'
                }
            },
            {
                $unwind:"$userMap"
            },
            {
                $lookup:{
                    from:"users",
                    localField:'userMap.freelancerId',
                    foreignField:"_id",
                    as:"userDetails"
                }
            },
            {
                $unwind:{
                    path:"$userDetails",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $lookup:{
                    from:"skills",
                    localField:"userDetails._id",
                    foreignField:"userId",
                    as:"skillsArr"
                }
            },
            {
                $lookup:{
                    from:"links",
                    localField:"userDetails._id",
                    foreignField:"userId",
                    as:"links"
                }
            },
            {
                $project: {
                    jobId: 1,
                    applicationId: 1,
                    bidAmount: "$applicationDetails.bidAmount",
                    coverLetter: "$applicationDetails.coverLetter",
                    userName: "$userDetails.userName",
                    email: "$userDetails.email",
                    profilePic:"$userDetails.profilePic",
                    skills: "$skills.skill",
                    links: { 
                      key: "$links.linkKey",
                      value: "$links.linkValue"
                    }
                }
            }
        ])
        console.log(agreedApplicants);
        res.status(200).json({agreedApplicants})
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

const proviedProject = async(req,res)=>{
    try {
        const {jobId,applicationId} = req.body;
        if(!jobId || !applicationId)
            return res.status(400).json({message:"incomple paramenters sent"})
        
        const applications = await jobApplicationsmodel.find({jobId:jobId})
         
        const updatePromises =[            
            applicationModel.updateMany(
                {
                    $and:[
                        {_id:{$in:[applications.applicationId]}},
                        {_id:{$ne:applicationId}}
                    ]
                },
                {$set:{status:"rejected"}}
            ),
            applicationModel.updateOne(
                {_id:applicationId},
                {$set:{status:"appointed"}}
            )
        ]
        
        const freelancer = await userApplicationsModel.findOne({applicationId:applicationId})
        if (!freelancer) {
            return res.status(400).json({message: "Freelancer not found" });
        }
        console.log(freelancer.freelancerId);
        updatePromises.push(
            userJobsModel.updateOne(
                {jobId:jobId},
                {$set:{freelancerId:freelancer.freelancerId}}
            )
        );

        // await Promise.all(updatePromises);
        req.updatePromises = updatePromises
        req.body.data={status:"ongoing"}
        
        updateJob(req,res);
    } catch (error) {
        console.log("provied");
        console.log(error);
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

export {
    createJob,
    employerViewJobs,
    updateJob,
    getApplicantsByJob,
    sendAgreement,
    viewAgreed,
    proviedProject
};