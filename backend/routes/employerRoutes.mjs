import {Router} from 'express';
import {createJob,employerViewJobs,updateJob, sendAgreement, viewAgreed, getApplicantsByJob,proviedProject} from '../controllers/employer.mjs';

const router = Router();
router.post("/create",createJob);
router.get("/read",employerViewJobs);
router.put("/update",updateJob);
router.post("/read/send-agreement",sendAgreement);
router.post("/read/agreed",viewAgreed);
router.post("/read/applicants",getApplicantsByJob);
router.post("/read/provied-project",proviedProject);

export default router;