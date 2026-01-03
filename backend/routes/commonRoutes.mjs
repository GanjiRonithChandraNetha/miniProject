import { 
    updateLinks,
    updateSkills,
    getProfile,
    search, 
    viewJob,
    uploadProfilePic
} from "../controllers/common.mjs";

import upload from "../utils/multer.mjs";

import { Router} from "express";

const router = Router();
router.get("/profile",getProfile);
router.post("/profile/update/skill",updateSkills);
router.post("/profile/update/link",updateLinks);
router.get("/search",search);
router.get("/viewJob/:jobId",viewJob);
router.post("/profile/upload/profileimage",upload.single("profilePic"),uploadProfilePic);


export default router;