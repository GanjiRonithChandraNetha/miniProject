import { updateLinks,updateSkills,getProfile } from "../controllers/common.mjs";
import { Router} from "express";

const router = Router();
router.get("/profile",getProfile);
router.post("/profile/update/skill",updateSkills);
router.post("/profile/update/link",updateLinks);

export default router;