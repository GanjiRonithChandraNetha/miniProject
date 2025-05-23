import applicationModel from "../../models/applications.mjs";
import userApplicationsModel from "../../models/maps/userApplicationMap.mjs";
import jobApplicationsmodel from "../../models/maps/jobApplicationMap.mjs";
import jobModel from "../../models/jobs.mjs"
import { applicationChecker,applicationModularChecker } from "../../utils/validaters/applicationValidator.mjs";
import  Mongoose  from "mongoose";


const applyJob = async (req, res) => {
    try {
        const { jobId, data } = req.body;

        // Validate input
        if (!jobId || !data || typeof data !== "object" || Array.isArray(data)) {
            return res.status(400).json({ message: "Bad request: Invalid jobId or data" });
        }

        // Validate and sanitize bidAmount
        if (data.bidAmount) {
            if (isNaN(data.bidAmount)) {
                return res.status(400).json({ message: "Invalid bidAmount" });
            }
            data.bidAmount = parseInt(data.bidAmount);
        }

        // Validate individual fields using applicationModularChecker
        for (const [key, value] of Object.entries(data)) {
            const result = applicationModularChecker(key, value);
            if (!result.success) {
                return res.status(400).json({ message: "Invalid fields in request data" });
            }
        }

        // Check job existence and deadline
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.deadline < Date.now()) {
            return res.status(400).json({ message: "Cannot apply for this job as it has expired" });
        }

        // Create application and related entries
        const application = await applicationModel.create(data);
        await userApplicationsModel.create({
            applicationId: application._id,
            freelancerId: req.user._id,
        });
        await jobApplicationsmodel.create({
            applicationId: application._id,
            jobId,
        });

        res.status(200).json({ message: "Applied for the job successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// {
//     jobId:
//     data:
// }

const viewApplications = async(req,res)=>{
    try {
        const data = await userApplicationsModel.aggregate([
            {
                $match:{
                    freelancerId:new Mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup:{
                    from:"applications",
                    localField:"applicationId",
                    foreignField:"_id",
                    as:"applicationDetails"
                }
            },
            {
                $unwind:{
                    path:"$applicationDetails",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $lookup:{
                    from:"jobapplicationsmaps",
                    localField:"applicationId",
                    foreignField:"applicationId",
                    as:"jobMap"
                }
            },
            {
                $unwind:{
                    path:"$jobMap",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $project:{
                    _id:0,
                    freelancerId:1,
                    applicationId:1,
                    applicationDetails:"$applicationDetails",
                    jobId:"$jobMap.jobId"
                }
            }
        ]);
        const rejected = [];
        const draft = [];
        const appointed = [];
        const published = [];
        const selected = [];
        const ready = [];
        console.log(Array.isArray(data));
        for(let i=0;i<data.length;i++){
            if(data[i].applicationDetails === undefined) continue;
            console.log(Array.isArray(data[i]))
            // console.log(data[i].applicationDetails === undefined);
            console.log(data[i]);
            if(data[i].applicationDetails.status === 'rejected')rejected.push(data[i]);
            else if(data[i].applicationDetails.status === 'draft')draft.push(data[i]);
            else if(data[i].applicationDetails.status === "appointed")appointed.push(data[i]);
            else if(data[i].applicationDetails.status === "published")published.push(data[i]);
            else if(data[i].applicationDetails.status === "selected")selected.push(data[i]);
            else if(data[i].applicationDetails.status === "ready")ready.push(data[i])
        }
        // for(const ele of data)
        //     console.log(ele.applicationDetails.status);

        res.status(200).json({
            rejected,
            draft,
            appointed,
            published,
            selected,
            ready
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

const updateApplication = async(req,res)=>{
    try {
        console.log("HELLO");
        console.log(req.body);
        if(!req.body.applicationId)
            return res.status(404).json({message:"application not provided"})
        
        const application = await applicationModel.findById(req.body.applicationId)
        if(!application){
            return res.status(409).json({message:"application not found"})
        }

        const {bidAmount,coverLetter,status} = req.body.data;
        
        if(application.status === "selected" && status === "ready"){
            application.status = "ready";
            await application.save();
            return status(200).json({message:"status updated"})
        }


        if(application.status != 'draft')
            return res.status(409).json({message:"application already published"})
        
        if(!req.body.data || (!bidAmount && !coverLetter && !status))
            return res.status(404).json({message:"no data provided"})
        
        if(bidAmount && !/^\d+(\.\d+)?$/.test(bidAmount)){
            return res.status(409).json({message:"wrong data given"})
        }

        if(status && status !== "published" && status !== "draft")
            return res.status(409).json({message:`application can be converted to ${status}`})
        
        if(bidAmount)
            application.bidAmount = parseFloat(bidAmount);
        if(coverLetter)
            application.coverLetter = coverLetter;
        if(status)
            application.status = status;

        await application.save();
        res.status(200).json({message:"data updated"})
    
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })   
    }
}

export {applyJob,viewApplications,updateApplication}