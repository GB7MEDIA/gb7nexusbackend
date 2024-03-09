import {
    userModel,
    marketPlaceModel
} from "../models/index.js";

import {
    getData,
    getDataById,
    createData,
    editDataById,
    deleteDataById,
} from "./helper.js";

import {
    isUser
} from "./auth.js";

export const getMarketPlaceProductsController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const products = await getData(marketPlaceModel);
        if (products.length === 0) {
            return res.status(404).json({ error: "There are no products!" });
        }

        const productsWithUserNames = await Promise.all(products.map(async (product) => {
            const user = await getDataById(userModel, product.userId);
            return {
                id: product._id,
                title: product.title,
                files: product.mediaUrls,
                description: product.description,
                user: {
                    id: user._id,
                    name: user.name
                },
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
        }));

        return res.status(200).json({ message: "Successfully retrieved all products!", data: { products: productsWithUserNames } });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getMarketPlaceProductByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { productId } = req.params;

        const product = await getDataById(marketPlaceModel, productId);
        if (!product) {
            return res.status(404).json({ error: "There is no product with this id!" });
        }

        const user = await getDataById(userModel, product.userId);

        const productWithUserName = {
            id: product._id,
            title: product.title,
            files: product.mediaUrls,
            description: product.description,
            user: {
                id: user._id,
                name: user.name
            },
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

        return res.status(200).json({ message: "Successfully retrieved product!", data: { product: productWithUserName } });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createMarketPlaceProductController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { title, mediaUrls = "", description } = req.body;

        let newProduct = {
            userId: currentUserId,
            title,
            mediaUrls: mediaUrls ?? '',
            description
        };

        const createdProduct = await createData(marketPlaceModel, newProduct);

        return res.status(200).json({ message: "Successfully created product!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editMarketPlaceProductByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { productId } = req.params;
        const product = await getDataById(marketPlaceModel, productId);
        if (!product) {
            return res.status(404).json({ error: "There is no product with this id!" });
        }

        const { title, description } = req.body;

        const editedProduct = await editDataById(marketPlaceModel, productId, { title, description });
        if (!editedProduct) {
            return;
        }

        return res.status(200).json({ message: "Successfully edited product!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteMarketPlaceProductByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { productId } = req.params;
        const product = await getDataById(marketPlaceModel, productId);
        if (!product) {
            return res.status(404).json({ error: "There is no product with this id!" });
        }


        await deleteDataById(marketPlaceModel, productId);

        return res.status(200).json({ message: "Successfully deleted product!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}