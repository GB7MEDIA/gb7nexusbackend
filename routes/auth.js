import express from 'express';

import {
    loginController,
    registerController,
    forgotPasswordController,
    newPasswordController,
    activateAccountController,
    twoFactorAuthenticationController,
    isLoggedInController
} from  "../controller/index.js";

import {
    verifyTokenMiddleware,
    validateLogin,
    validateRegister,
    validateForgotPassword,
    validateNewPassword,
    validateActivateAccount,
    validateTwoFactorAuthentication,
    validateIsLoggedIn
} from "../middlewares/index.js";

const router = express.Router();

router.post('/login', validateLogin, loginController);
router.post('/register', validateRegister, registerController);
router.post('/password/forgot', validateForgotPassword, forgotPasswordController);
router.post('/password/new', validateNewPassword, newPasswordController);
router.post('/activate', validateActivateAccount, activateAccountController);
router.post('/tfa', validateTwoFactorAuthentication, twoFactorAuthenticationController);
router.post('/isLoggedIn', verifyTokenMiddleware, validateIsLoggedIn, isLoggedInController);

export const authRoutes = router;