import {
    userModel,
    tenantModel,
    tenantUserModel
} from "../models/index.js";

import {
    getDataById,
    getDataByValue,
    createData,
    editDataById,
    deleteDataById
} from "./helper.js";

import {
    sendMail,
    sendSMS
} from  "../middlewares/index.js";

import {
    generateCode,
    createToken,
    hashPassword,
    comparePasswords,
    notEmpty
} from "../utils/index.js";

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getDataByValue(userModel, { ['email']: email });
        if (!user.response) {
            return res.status(404).json({ error: "There was no user with this email!" });
        }

        if (user.response.active === false) {
            return  res.status(403).json({ error: "The user is not activated yet!" });
        }

        const matchingPasswords = await comparePasswords(password, user.response.password);
        if (!matchingPasswords) {
            return res.status(401).json({ erorr: "The email or password is invalid!" });
        }

        const tfaCode = generateCode(user.response.email);
        const tfaLink = `${process.env.FRONTEND_BASE_URL}tfa?userId=${user.response._id}&code=${tfaCode}`;

        const setTfaCode = await editDataById(userModel, user.response._id, { tfaCode: tfaCode });
        if (!setTfaCode.response) {
            return;
        }

        if (user.response.tfaSetting === "false") {
            const removeTfaCode = await editDataById(userModel, user.response._id, { tfaCode: "" });
            if (!removeTfaCode.response) {
                return;
            }

            const authToken = createToken({ id: user.response._id });

            sendMail(user.response.email, 'New Login!', `There was a new login detected! If this was you forget about this email. If not, please contact our support team as soon as possible.`);

            return res.status(200).json({ message: "Successfully logged in!", data: { token: authToken } });
        } else if (user.response.tfaSetting === "email") {
            sendMail(user.response.email, 'Two Factor Authentication!', `Here is your two factor authentication link: ${tfaLink}!`);

            return res.status(200).json({ message: "Successfully send two factor authentication email!" });
        } else if (user.response.tfaSetting === "sms") {
            sendSMS(user.response.phonenumber, `Here is your two factor authentication link: ${tfaLink}!`);

            return res.status(200).json({ message: "Successfully send two factor authentication sms!" });
        }
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const registerController = async (req, res) => {
    try {
        const { name, email, phonenumber, tenantId = null, password } = req.body;

        const user = await getDataByValue(userModel, { ['email']: email });
        if (user.response) {
            return res.status(404).json({ error: "A user with this email already exists!" });
        }

        const hashedPassword = await hashPassword(password);
        const activationCode = generateCode(email);

        let newUser = {
            name,
            email,
            phonenumber,
            role: 'user',
            password: hashedPassword,
            active: false,
            tfaSetting: 'false',
            tfaCode: activationCode
        };

        const createdUser = await createData(userModel, newUser);

        if (notEmpty(tenantId)) {
            const tenant = await getDataById(tenantModel, tenantId);
            if (!tenant.response) {
                await deleteDataById(userModel, createdUser.response._id);
                return res.status(404).json({ error: "The tenant does not exist!" });
            }

            let newTenantUser = {
                userId: createdUser.response._id,
                tenantId
            };

            await createData(tenantUserModel, newTenantUser);
        }

        const activationLink = `${process.env.FRONTEND_BASE_URL}activate?userId=${createdUser.response._id}&code=${activationCode}`;

        sendMail(createdUser.response.email, 'Activation Required!', `Here is the activation link: ${activationLink}`);

        return res.status(200).json({ message: "Successfiully registered!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await getDataByValue(userModel, { ['email']: email });
        if (!user.response) {
            return res.status(404).json({ error: "There was no user with this email!" });
        }

        if (user.response.active === false) {
            return  res.status(403).json({ error: "The user is not activated yet!" });
        }

        const newPasswordCode = generateCode(user.response.email);
        const newPasswordLink = `${process.env.FRONTEND_BASE_URL}password/new?userId=${user.response._id}&code=${newPasswordCode}`;

        const setTfaCode = await editDataById(userModel, user.response._id, { tfaCode: newPasswordCode });
        if (!setTfaCode.response) {
            return;
        }

        sendMail(user.response.email, 'New Password Link!', `Here is your new password link: ${newPasswordLink}`);

        return res.status(200).json({ message: "Successfully send a new password link!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const newPasswordController = async (req, res) => {
    try {
        const { userId, newPasswordCode, newPassword } = req.body;

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return res.status(404).json({ error: "There was no user with this user id!" });
        }

        if (user.response.active === false) {
            return  res.status(403).json({ error: "The user is not activated yet!" });
        }

        if (user.response.tfaCode !== newPasswordCode) {
            return  res.status(403).json({ error: "The new password code is invalid!" });
        }

        const hashedPassword = await hashPassword(newPassword);

        const removeTfaCodeAndUpdatePassword = await editDataById(userModel, userId, { tfaCode: "", password: hashedPassword });
        if (!removeTfaCodeAndUpdatePassword.response) {
            return;
        }

        sendMail(user.response.email, 'Password has been changed!', `Your password has been changed! If this was you, you may forget this email, if not please contact our support team as soon as possible!`);

        return res.status(200).json({ message: "Successfully changed the password!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const activateAccountController = async (req, res) => {
    try {
        const { userId, activationCode } = req.body;

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return res.status(404).json({ error: "There was no user with this user id!" });
        }

        if (user.response.tfaCode !== activationCode) {
            return  res.status(403).json({ error: "The activate account code is invalid!" });
        }

        const removeTfaCodeAndUpdateActive = await editDataById(userModel, userId, { tfaCode: "", active: true });
        if (!removeTfaCodeAndUpdateActive.response) {
            return;
        }
        
        sendMail(user.response.email, 'Account Active!', `Your account is now active! You may login now.`);
        
        return res.status(200).json({ message: "Successfully activated account!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const twoFactorAuthenticationController = async (req, res) => {
    try {
        const { userId, tfaCode } = req.body;

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return res.status(404).json({ error: "There was no user with this user id!" });
        }

        if (user.response.active === false) {
            return  res.status(403).json({ error: "The user is not activated yet!" });
        }

        if (user.response.tfaCode !== tfaCode) {
            return  res.status(403).json({ error: "The two factor authentication code is invalid!" });
        }

        const removeTfaCode = await editDataById(userModel, userId, { tfaCode: "" });
        if (!removeTfaCode.response) {
            return;
        }

        const authToken = createToken({ id: user.response._id });

        sendMail(user.response.email, 'New Login!', `There was a new login detected! If this was you forget about this email. If not, please contact our support team as soon as possible.`);

        return res.status(200).json({ message: "Successfully logged in!", data: { token: authToken } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const isLoggedInController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);

        const admin = await isAdmin(currentUserId);

        return res.status(200).json({ loggedIn: user, admin: admin, loggedInUserId: currentUserId });
    } catch (error) { 
        return res.status(500).json({ loggedIn: false, admin: false });
    }
}

export const isUser = async (userId) => {
    try {
        if (! notEmpty(userId)) {
            return false;
        }

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return false;
        }

        return true;
    } catch (error) { 
        return false;
    }
}

export const isAdmin = async (userId) => {
    try {
        if (! notEmpty(userId)) {
            return false;
        }

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return false;
        }

        if (user.response.role === 'admin') {
            return true;
        }

        return false;
    } catch (error) { 
        return false;
    }
}