import {
    damageModel
} from "../models/index.js";

import {
    getData,
    getDataById,
    createData,
    editDataById,
    deleteDataById
} from "./helper.js";

import {
    isUser,
    isAdmin
} from "./auth.js";

export const getAllDamagesController = async (req, res) => {
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

        const damages = await getData(damageModel);
        if (damages.response.length === 0) {
            return res.status(404).json({ error: "There are no damages!" });
        }

        return res.status(200).json({ message: "Successfully retrieved all damages!", data: { damages: damages.response } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getAllDamagesByUserIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { userId } = req.params;

        const damages = await getData(damageModel, { ['userId']: userId });
        if (damages.response.length === 0) {
            return res.status(404).json({ error: "There are no damages!" });
        }

        return res.status(200).json({ message: "Successfully retrieved all damages!", data: { damages: damages.response } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getDamageByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { damageId } = req.params;

        const damage = await getDataById(damageModel, damageId);
        if (!damage.response) {
            return res.status(404).json({ error: "This damage does not exist!" });
        }

        return res.status(200).json({ message: "Successfully retrieved the damage!", data: { damage: damage.response } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createDamageController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { title, objectId, adressId, floor, remarks } = req.body;

        let newDamage = {
            title,
            userId: currentUserId,
            objectId,
            adressId,
            floor,
            remarks,
            damageStatus: 'received'
        };

        await createData(damageModel, newDamage);

        return res.status(200).json({ message: "Successfully created damage!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editDamageByIdController = async (req, res) => {
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

        const { damageId } = req.params;

        const damage = await getDataById(damageModel, damageId);
        if (!damage.response) {
            return res.status(404).json({ error: "This damage does not exist!" });
        }

        const { title, remarks, damageStatus = "received" } = req.body;

        const editedDamage = await editDataById(damageId, { title, remarks, damageStatus });
        if (!editedDamage) {
            return;
        }

        return res.status(200).json({ message: "Successfully edited damage!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteDamageByIdController = async (req, res) => {
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

        const { damageId } = req.params;
        
        await deleteDataById(damageModel, damageId);

        return res.status(200).json({ message: "Successfully deleted damage!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}