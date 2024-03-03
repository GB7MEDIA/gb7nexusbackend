import express from 'express';

import {
    getAllObjectsController,
    getObjectByIdController,
    getObjectAdressesByObjectIdController,
    createObjectController,
    createObjectAdressesByObjectIdController,
    editObjectByIdController,
    editObjectAdressByIdController,
    deleteObjectByIdController,
    deleteObjectAdressByIdController
} from  "../controller/index.js";

import {
    validateGetAllObjects,
    validateGetObjectById,
    validateGetObjectAdressesByObjectId,
    validateCreateObject,
    validateCreateObjectAdressesByObjectId,
    validateEditObjectById,
    validateEditObjectAdressById,
    validateDeleteObjectById,
    validateDeleteObjectAdressById
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetAllObjects, getAllObjectsController);
router.get('/one/:objectId', validateGetObjectById, getObjectByIdController);
router.get('/one/:objectId/adresses/all', validateGetObjectAdressesByObjectId, getObjectAdressesByObjectIdController);
router.post('/one/create', validateCreateObject, createObjectController);
router.post('/one/:objectId/adresses/one/create', validateCreateObjectAdressesByObjectId, createObjectAdressesByObjectIdController);
router.put('/one/:objectId/edit', validateEditObjectById, editObjectByIdController);
router.put('/one/adresses/one/:adressId/edit', validateEditObjectAdressById, editObjectAdressByIdController);
router.delete('/one/:objectId/delete', validateDeleteObjectById, deleteObjectByIdController);
router.delete('/one/adresses/one/:adressId/delete', validateDeleteObjectAdressById, deleteObjectAdressByIdController);

export const objectRoutes = router;