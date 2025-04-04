import {Router} from 'express';
import {createJob,viewJobs} from '../controllers/employer.mjs';

const router = Router();
router.post("/create",createJob);
router.get("/read",viewJobs);
export default router;