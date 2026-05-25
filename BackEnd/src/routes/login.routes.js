import { Router } from "express";
import { login, createLogin, sendVerificationCode, sendResetCode, resetPassword } from "../controllers/login.controller.js";

const router = Router();

router.post('/', login);
router.post('/send-verification-code', sendVerificationCode);
router.post('/create', createLogin);

router.post('/send-reset-code', sendResetCode);
router.post('/reset-password', resetPassword);

export default router;

