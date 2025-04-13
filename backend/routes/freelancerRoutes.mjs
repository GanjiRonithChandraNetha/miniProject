import { applyJob,viewApplications,updateApplication } from "../controllers/freelancerControllers/applictionControllers.mjs";
import { Router } from "express";
const router = Router();

router.get("/application/read",viewApplications);
router.post("/application/create",applyJob);
router.put("/application/update",updateApplication);

export default router;