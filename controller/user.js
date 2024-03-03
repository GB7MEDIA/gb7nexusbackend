import { userModel, tenantModel, tenantUserModel } from "../models/index.js";
import { getData, getDataById, getDataByValue, createData, deleteDataById } from "./helper.js";
import { sendMail } from  "../middlewares/index.js";
import { generateCode, hashPassword, notEmpty } from "../utils/index.js";
import { isUser, isAdmin } from "./auth.js";

export const getAllUsersController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const users = await getData(userModel);
        if (users.response.length === 0) {
            return res.status(404).json({ error: "There are no users!" });
        }

        return res.status(200).json({ message: "Successfully retrieved all users!", data: { users: users.response } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getUserByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        if (! notEmpty(currentUserId)) {
            return res.status(400).json({ error: "The user id can not be left empty!" });
        }

        const currentUserIsAdmin  = await isAdmin(currentUserId);

        const { userId } = req.params;
        if (userId !== currentUserId && !currentUserIsAdmin) {
            return res.status(403).json({ error: "You are not authorized for this action!" });
        }

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return res.status(404).json({ error: "There was no user found!" });
        }

        return res.status(200).json({ message: "Successfully retrieved user!", data: { user: user.response } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createUserController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { name, email, phonenumber, role = "user", tenantId = null, password } = req.body;


        const userData = await getDataByValue(userModel, {['email']: email});
        if (userData.response.length > 0) {
            return res.status(404).json({ error: "A user with this email already exists!" });
        }

        const hashedPassword = await hashPassword(password);
        const activationCode = generateCode(email);

        let newUser = {
            name,
            email,
            phonenumber,
            role,
            password: hashedPassword,
            active: false,
            tfaSetting: 'false',
            tfaCode: activationCode
        };

        const createdUser = await createData(userModel, newUser);

        if (notEmpty(tenantId)) {
            console.log(tenantId);
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

        return res.status(200).json({ message: "Successfully created user!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editUserByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUserIsAdmin  = await isAdmin(currentUserId);

        const { userId } = req.params;
        if (!currentUserIsAdmin) {
            return res.status(403).json({ error: "You are not authorized for this action!" });
        }

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { name, email, phonenumber, twoFactorAuthType, role = 'user',} = req.body;

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return res.status(404).json({ error: "The user does not exist!" });
        }

        user.response.name = name;
        user.response.email = email;
        user.response.phonenumber = phonenumber;
        if (userId !== currentUserId) {
            if (user.response.role === "admin") {
                user.response.role = "admin";
            } else {
                user.response.role = role;
            }
        }
        user.response.tfaSetting = twoFactorAuthType;
        await user.response.save();

        return res.status(200).json({ message: "Successfully changed all data!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteUserByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUserIsAdmin  = await isAdmin(currentUserId);

        const { userId } = req.params;
        if (!currentUserIsAdmin) {
            return res.status(403).json({ error: "You are not authorized for this action!" });
        }
        
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const user = await getDataById(userModel, userId);
        if (!user.response) {
            return res.status(404).json({ error: "The user does not exist!" });
        }

        await deleteDataById(userModel, userId);

        return res.status(200).json({ message: "Successfully deleted user!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}