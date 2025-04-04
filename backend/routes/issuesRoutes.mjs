import { raiseIssue,viewIssue } from "../controllers/common.mjs";
import { Router } from "express";

const router = Router();
router.get("/issues/read",viewIssue)
router.post("/issues/create",raiseIssue);

export default router;