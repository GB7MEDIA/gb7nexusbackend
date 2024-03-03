import { notEmpty, isArray } from "../utils/index.js";

export const validateGetAllObjects = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetObjectById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { objectId } = req.params;
    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    next();
}

export const validateGetObjectAdressesByObjectId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { objectId } = req.params;
    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    next();
}

export const validateCreateObject = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { objectname } = req.body;
    if (! notEmpty(objectname)) {
        return res.status(400).json({ error: "The object name can not be left empty!" });
    }

    next();
}

export const validateCreateObjectAdressesByObjectId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { objectId } = req.params;
    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    const { adress, floors } = req.body;
    if (! notEmpty(adress)) {
        return res.status(400).json({ error: "The adress can not be left empty!" });
    }
    if (! notEmpty(floors)) {
        return res.status(400).json({ error: "The floors can not be left empty!" });
    }
    if (!isArray(floors)) {
        return res.status(400).json({ error: "The floors should be an array of data!" });
    }

    next();
}

export const validateEditObjectById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { objectId } = req.params;
    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    const { objectname } = req.body;
    if (! notEmpty(objectname)) {
        return res.status(400).json({ error: "The object name can not be left empty!" });
    }

    next();
}

export const validateEditObjectAdressById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { adressId } = req.params;
    if (! notEmpty(adressId)) {
        return res.status(400).json({ error: "The adress id can not be left empty!" });
    }

    const { adress, floors } = req.body;
    if (! notEmpty(adress)) {
        return res.status(400).json({ error: "The adress can not be left empty!" });
    }
    if (! notEmpty(floors)) {
        return res.status(400).json({ error: "The floors can not be left empty!" });
    }

    next();
}

export const validateDeleteObjectById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { objectId } = req.params;
    if (! notEmpty(objectId)) {
        return res.status(400).json({ error: "The object id can not be left empty!" });
    }

    next();
}

export const validateDeleteObjectAdressById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { adressId } = req.params;
    if (! notEmpty(adressId)) {
        return res.status(400).json({ error: "The adress id can not be left empty!" });
    }

    next();
}