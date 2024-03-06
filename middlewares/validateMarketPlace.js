import {
    notEmpty
} from "../utils/index.js";

export const validateGetMarketPlaceProducts = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetMarketPlaceProductById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { productId } = req.params;
    if (! notEmpty(productId)) {
        return res.status(400).json({ error: "The product id can not be left empty!" });
    }

    next();
}

export const validateCreateMarketPlaceProduct = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { title, description } = req.body;
    if (! notEmpty(title)) {
        return res.status(400).json({ error: "The title can not be left empty!" });
    }
    if (! notEmpty(description)) {
        return res.status(400).json({ error: "The description can not be left empty!" });
    }

    next();
}

export const validateEditMarketPlaceProductById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { productId } = req.params;
    if (! notEmpty(productId)) {
        return res.status(400).json({ error: "The product id can not be left empty!" });
    }

    const { title, description } = req.body;
    if (! notEmpty(title)) {
        return res.status(400).json({ error: "The title can not be left empty!" });
    }
    if (! notEmpty(description)) {
        return res.status(400).json({ error: "The description can not be left empty!" });
    }

    next();
}

export const validateDeleteMarketPlaceProductById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { productId } = req.params;
    if (! notEmpty(productId)) {
        return res.status(400).json({ error: "The product id can not be left empty!" });
    }

    next();
}