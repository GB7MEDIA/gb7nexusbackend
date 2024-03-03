import { notEmpty } from "../utils/index.js";

export const validateGetAllDamages = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetAllDamagesByUserId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { userId } = req.params;
    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }
    if (userId !== currentUserId) {
        return res.status(403).json({ error: "You are not authorized for this action!" });
    }

    next();
}

export const validateGetDamageById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { damageId } = req.params;
    if (! notEmpty(damageId)) {
        return res.status(400).json({ error: "The damage id can not be left empty!" });
    }

    next();
}

export const validateCreateDamage = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { title, objectId, adressId, floor, remarks } = req.body;

        if (! notEmpty(title)) {
            return res.status(400).json({ error: "The title can not be left empty!" });
        }

        if (! notEmpty(objectId)) {
            return res.status(400).json({ error: "The object id can not be left empty!" });
        }

        if (! notEmpty(adressId)) {
            return res.status(400).json({ error: "The adress id can not be left empty!" });
        }

        if (! notEmpty(floor)) {
            return res.status(400).json({ error: "The floor can not be left empty!" });
        }

        if (! notEmpty(remarks)) {
            return res.status(400).json({ error: "The remarks can not be left empty!" });
        }

        next();
}

export const validateEditDamageById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { damageId } = req.params;
    if (! notEmpty(damageId)) {
        return res.status(400).json({ error: "The damage id can not be left empty!" });
    }

    const { title, remarks, damageStatus = "received" } = req.body;

    if (! notEmpty(title)) {
        return res.status(400).json({ error: "The title can not be left empty!" });
    }

    if (! notEmpty(remarks)) {
        return res.status(400).json({ error: "The remarks can not be left empty!" });
    }

    if (! notEmpty(damageStatus)) {
        return res.status(400).json({ error: "The damage status can not be left empty!" });
    }

    next();
}

export const deleteDamageById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { damageId } = req.params;
    if (! notEmpty(damageId)) {
        return res.status(400).json({ error: "The damage id can not be left empty!" });
    }

    next();
}