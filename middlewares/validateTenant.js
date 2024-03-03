import { notEmpty } from "../utils/index.js";

export const validateGetAllTenants = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetTenantById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { tenantId } = req.params;
    if (! notEmpty(tenantId)) {
        return res.status(400).json({ error: "The tenant id can not be left empty!" });
    }

    next();
}

export const validateGetTenantUsersByTenantId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { tenantId } = req.params;
    if (! notEmpty(tenantId)) {
        return res.status(400).json({ error: "The tenant id can not be left empty!" });
    }

    next();
}

export const validateGetTenantByUserId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { userId } = req.params;
    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateCreateTenant = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { companyname, objectId } = req.body;
    if (! notEmpty(companyname)) {
        return res.status(400).json({ error: "The companyname can not be left empty!" });
    }

    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    next();
}

export const validateEditTenantById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { tenantId } = req.params;
    if (! notEmpty(tenantId)) {
        return res.status(400).json({ error: "The tenant id can not be left empty!" });
    }

    const { companyname, objectId } = req.body;
    if (! notEmpty(companyname)) {
        return res.status(400).json({ error: "The companyname can not be left empty!" });
    }

    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    next();
}

export const validateDeleteTenantById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { tenantId } = req.params;
    if (! notEmpty(tenantId)) {
        return res.status(400).json({ error: "The tenant id can not be left empty!" });
    }

    next();
}