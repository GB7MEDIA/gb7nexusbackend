import {
    userModel,
    tenantModel,
    tenantUserModel
} from "../models/index.js";

import {
    getData,
    getDataById,
    getDataByValue,
    createData,
    editDataById,
    deleteDataById
} from "./helper.js";

import {
    sendMail
} from  "../middlewares/index.js";

import {
    generateCode,
    hashPassword,
    notEmpty
} from "../utils/index.js";

import {
    isUser,
    isAdmin
} from "./auth.js";

export const getAllUsersController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const users = await getData(userModel);
        if (users.length === 0) {
            return res.status(404).json({ error: "There are no users!" });
        }

        const usersArray = users.map((user) => {
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                phonenumber: user.phonenumber,
                role: user.role,
                tfaSetting: user.tfaSetting,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        });

        return res.status(200).json({ message: "Successfully retrieved all users!", data: { users: usersArray } });
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

        const { userId } = req.params;

        const user = await getDataById(userModel, userId);
        if (!user) {
            return res.status(404).json({ error: "There was no user found!" });
        }

        const userArray = {
            id: user._id,
            name: user.name,
            email: user.email,
            phonenumber: user.phonenumber,
            role: user.role,
            tfaSetting: user.tfaSetting,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({ message: "Successfully retrieved user!", data: { user: userArray } });
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


        const userData = await getDataByValue(userModel, { ['email']: email });
        if (userData) {
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
            const tenant = await getDataById(tenantModel, tenantId);
            if (!tenant) {
                await deleteDataById(userModel, createdUser._id);
                return res.status(404).json({ error: "The tenant does not exist!" });
            }

            let newTenantUser = {
                userId: createdUser._id,
                tenantId
            };

            await createData(tenantUserModel, newTenantUser);
        }

        const activationLink = `${process.env.FRONTEND_BASE_URL}activate?userId=${createdUser._id}&code=${activationCode}`;

        sendMail(createdUser.email, 'Activation Required!', `Here is the activation link: ${activationLink}`);

        return res.status(200).json({ message: "Successfully created user!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editUserByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const currentUserIsAdmin  = await isAdmin(currentUserId);

        const { userId } = req.params;
        if (!(userId === currentUserId || currentUserIsAdmin)) {
            return res.status(403).json({ error: "You are not authorized for this action!" });
        }

        const { name, email, phonenumber, twoFactorAuthType, role = 'user' } = req.body;

        const user = await getDataById(userModel, userId);
        if (!user) {
            return res.status(404).json({ error: "The user does not exist!" });
        }

        let roleChange = role;

        if (userId === currentUserId || currentUserIsAdmin) {
            if (user.role === "admin") {
                roleChange = "admin";
            } else {
                roleChange = role;
            }
        }

        const editedUser = await editDataById(userModel, userId, { name, email, phonenumber, role: roleChange, tfaSetting: twoFactorAuthType });
        if (!editedUser) {
            return;
        }

        return res.status(200).json({ message: "Successfully changed all data!" });
    } catch (error) { 
        console.error(error);
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
        if (!user) {
            return res.status(404).json({ error: "The user does not exist!" });
        }

        await deleteDataById(userModel, userId);

        return res.status(200).json({ message: "Successfully deleted user!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}