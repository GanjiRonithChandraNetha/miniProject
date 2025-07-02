import {Router} from 'express';
import {signIn,signUp} from '../controllers/common.mjs'

const router = Router();
router.post('/signin',signIn);
router.post('/signUp',signUp);

export default router;