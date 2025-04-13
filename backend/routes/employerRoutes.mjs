import {Router} from 'express';
import {createJob,viewJobs,updateJob} from '../controllers/employer.mjs';

const router = Router();
router.post("/create",createJob);
router.get("/read",viewJobs);
router.put("/update",updateJob);
export default router;