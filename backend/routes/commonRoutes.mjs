import { updateLinks,updateSkills,getProfile,search, viewJob } from "../controllers/common.mjs";
import { Router} from "express";

const router = Router();
router.get("/profile",getProfile);
router.post("/profile/update/skill",updateSkills);
router.post("/profile/update/link",updateLinks);
router.get("/search",search);
router.get("/viewJob/:jobId",viewJob);


export default router;