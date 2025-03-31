import applicatonModel from "../../models/applications.mjs";
import userApplicationsModel from "../../models/maps/userApplicationMap.mjs";
import jobApplicationsmodel from "../../models/maps/jobApplicationMap.mjs";

const applyJob = async(req,res)=>{
    const jobId = req.jobId;
    const userId = req.userId;
    const applicationDetails = req.applicationDetails
    
    // initate Transaction
    const application = new applicatonModel(applicationDetails);
    const savedapplication = await application.save();
    jobApplicationsmodel.create({
        applicationId:savedapplication._id,
        jobId:jobId
    });
    userApplicationsModel.create({
        userId:userId,
        applicationId:savedapplication._id
    })
    // end transaction
    
}