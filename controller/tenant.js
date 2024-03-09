import {
    objectModel,
    tenantModel,
    tenantUserModel,
    userModel
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
    notEmpty
} from "../utils/index.js";

import {
    isUser,
    isAdmin
} from "./auth.js";

export const getAllTenantsController = async (req, res) => {
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

        const tenants = await getData(tenantModel);
        if (tenants.length === 0) {
            return res.status(404).json({ error: "There was no tenants found!" });
        }

        const tenantsWithObjects = await Promise.all(tenants.map(async (tenant) => {
            const object = await getDataById(objectModel, tenant.objectId);
            return {
                id: tenant._id,
                companyname: tenant.companyname,
                object: {
                    id: object._id,
                    objectname: object.objectname
                },
                createdAt: tenant.createdAt,
                updatedAt: tenant.updatedAt
            };
        }));

        return res.status(200).json({ message: "Successfully retrieved all tenants!", data: { tenants: tenantsWithObjects } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getTenantByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        if (! notEmpty(currentUserId)) {
            return res.status(400).json({ error: "The user id can not be left empty!" });
        }

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { tenantId } = req.params;

        const tenant = await getDataById(tenantModel, tenantId);
        if (!tenant) {
            return res.status(404).json({ error: "There was no tenant found!" });
        }

        const object = await getDataById(objectModel, tenant.objectId);

        const tenantWithObjectName = {
            id: tenant._id,
            companyname: tenant.companyname,
            object: {
                id: object._id,
                objectname: object.objectname
            },
            createdAt: tenant.createdAt,
            updatedAt: tenant.updatedAt
        };

        return res.status(200).json({ message: "Successfully retrieved tenant!", data: { tenant: tenantWithObjectName } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getTenantUsersByTenantIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { tenantId } = req.params;

        const usersIds = await getData(tenantUserModel, { ['tenantId']: tenantId });
        if (usersIds.length === 0) {
            return res.status(404).json({ error: "There are no existing users for this tenant." });
        }
        
        const users = await Promise.all(
            usersIds.map(async (user) => {
                const userData = await getDataById(userModel, user.userId);
                return userData;
            })
        );

        return res.status(200).json({ message: "Successfully retrieved all tenant users!", data: { users } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getTenantByUserIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { userId } = req.params;

        const tenantId = await getDataByValue(tenantUserModel, { ["userId"]: userId });
        if (!tenantId) {
            return res.status(404).json({ error: "This user is not a tenant." });
        }

        return res.status(200).json({ message: "Successfully retrieved all tenant users!", data: { tenantId } });
    } catch (error) { 
        console.log(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createTenantController = async (req, res) => {
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

        const { companyname, objectId } = req.body;

        const object = await getDataById(objectModel, objectId);
        if (!object) {
            return res.status(404).json({ error: "There was no object found!" });
        }

        let newTenant = {
            companyname,
            objectId
        };

        await createData(tenantModel, newTenant);

        return res.status(200).json({ message: "Successfully created tenant!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editTenantByIdController = async (req, res) => {
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

        const { tenantId } = req.params;

        const { companyname, objectId } = req.body;

        const tenant = await getDataById(tenantModel, tenantId);
        if (!tenant) {
            return res.status(404).json({ error: "There was no tenant found!" });
        }

        const editedTenant = await editDataById(tenantModel, tenantId, { companyname, objectId });
        if (!editedTenant) {
            return;
        }

        return res.status(200).json({ message: "Successfully edited tenant!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteTenantByIdController = async (req, res) => {
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

        const { tenantId } = req.params;

        const tenant = await getDataById(tenantModel, tenantId);
        if (!tenant) {
            return res.status(404).json({ error: "There was no tenant found!" });
        }

        await deleteDataById(tenantModel, tenantId);

        return res.status(200).json({ message: "Successfully deleted tenant!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}