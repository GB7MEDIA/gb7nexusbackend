import {
    objectModel,
    objectAdressModel
} from "../models/index.js";

import {
    getData,
    getDataById,
    createData,
    editDataById,
    deleteDataById
} from "./helper.js";

import {
    notEmpty
} from "../utils/index.js";

import {
    isUser,
    isAdmin
} from "./auth.js";

export const getAllObjectsController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const objects = await getData(objectModel);
        if (objects.length === 0) {
            return res.status(404).json({ error: "No objects found!" });
        }

        return res.status(200).json({ message: "Successfully retrieved all objects!", data: { objects: objects } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getObjectByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { objectId } = req.params;

        const object = await getDataById(objectModel, objectId);
        if (!object) {
            return res.status(404).json({ error: "There was no object found!" });
        }

        return res.status(200).json({ message: "Successfully retrieved object!", data: { object: object } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getObjectAdressesByObjectIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { objectId } = req.params;

        const adresses = await getData(objectAdressModel, { ['objectId']: objectId });
        if (adresses.length === 0) {
            return res.status(404).json({ error: "There were no adresess found!" });
        }

        return res.status(200).json({ message: "Successfully retrieved all adresses!", data: { adresses: adresses } });
    } catch (error) { 
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createObjectController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { objectname } = req.body;

        let newObject = {
            objectname
        };

        const createdObject = await createData(objectModel, newObject);

        return res.status(200).json({ message: "Successfully created Object!", data: { createdObject } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createObjectAdressesByObjectIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { objectId } = req.params;

        const { adress, floors } = req.body;

        let newAdress = {
            objectId,
            adress,
            floors
        };

        const createdAdress = await createData(objectAdressModel, newAdress);

        return res.status(200).json({ message: "Successfully created adress!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editObjectByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        if (! notEmpty(currentUserId)) {
            return res.status(400).json({ error: "The user id can not be left empty!" });
        }

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { objectId } = req.params;

        const { objectname } = req.body;

        const object = await getDataById(objectModel, objectId);
        if (!object) {
            return  res.status(404).json({ error: "The object does not exist!" });
        }

        const editedObject = await editDataById(objectId, { objectname });
        if (!editedObject) {
            return;
        }

        return res.status(200).json({ message: "Successffully edited object!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editObjectAdressByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { adressId } = req.params;

        const { adress, floors } = req.body;

        const adressData = await getDataById(objectAdressModel, adressId);
        if (!adressData) {
            return res.status(404).json({ error: "The adress does not exist!" });
        }

        const editedObjectAdress = await editDataById(objectAdressModel, adressId, { adress, floors });
        if (!editedObjectAdress) {
            return;
        }

        return res.status(200).json({ message: "Successfully edited adress!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteObjectByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const user = await isUser(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { objectId } = req.params;

        const object = await getDataById(objectModel, objectId);
        if (!object) {
            return  res.status(404).json({ error: "The object does not exist!" });
        }

        const adresses = await getData(objectAdressModel, { [objectId]: objectId });
        const deletionPromises = adresses.map(async (address) => await deleteAddressById(address._id));
        await Promise.all(deletionPromises);

        await deleteDataById(objectModel, objectId);

        return res.status(200).json({ message: "Successfully deleted object and all related data!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteObjectAdressByIdController = async (req, res) => {
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

        const { adressId } = req.params;

        const adress = await getDataById(objectAdressModel, adressId);
        if (!adress) {
            return  res.status(404).json({ error: "The adress does not exist!" });
        }

        await deleteDataById(objectAdressModel, adressId);

        return res.status(200).json({ message: "Successfully deleted the adress!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}