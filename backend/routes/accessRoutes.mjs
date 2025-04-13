import {Router} from 'express';
import {signIn,login} from '../controllers/common.mjs'

const router = Router();
router.post('/login',login);
router.post('/signIn',signIn);

export default router;