import express from 'express';

import {
    getMarketPlaceProductsController,
    getMarketPlaceProductByIdController,
    createMarketPlaceProductController,
    editMarketPlaceProductByIdController,
    deleteMarketPlaceProductByIdController
} from  "../controller/index.js";

import {
    validateGetMarketPlaceProducts,
    validateGetMarketPlaceProductById,
    validateCreateMarketPlaceProduct,
    validateEditMarketPlaceProductById,
    validateDeleteMarketPlaceProductById
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetMarketPlaceProducts, getMarketPlaceProductsController);
router.get('/one/:productId', validateGetMarketPlaceProductById, getMarketPlaceProductByIdController);
router.post('/one/create', validateCreateMarketPlaceProduct, createMarketPlaceProductController);
router.put('/one/:productId/edit', validateEditMarketPlaceProductById, editMarketPlaceProductByIdController);
router.put('/one/:productId/delete', validateDeleteMarketPlaceProductById, deleteMarketPlaceProductByIdController);

export const marketPlaceRoutes = router;