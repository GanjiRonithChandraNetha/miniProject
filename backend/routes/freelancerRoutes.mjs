import { applyJob,viewApplications,updateApplication } from "../controllers/freelancerControllers/applictionControllers.mjs";
import { agreeJob,viewJobs } from "../controllers/freelancerControllers/jobControllers.mjs";
import { Router } from "express";
const router = Router();

router.get("/application/read",viewApplications);
router.post("/application/create",applyJob);
router.put("/application/update",updateApplication);

router.get("/job/read",viewJobs);
router.post("/job/agreement/apply",agreeJob);

export default router;