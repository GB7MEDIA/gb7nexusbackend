import express from 'express';

import {
    getAllDamagesController,
    getAllDamagesByUserIdController,
    getDamageByIdController,
    createDamageController,
    editDamageByIdController,
    deleteDamageByIdController
} from  "../controller/index.js";

import {
    validateGetAllDamages,
    validateGetAllDamagesByUserId,
    validateGetDamageById,
    validateCreateDamage,
    validateEditDamageById,
    deleteDamageById
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetAllDamages, getAllDamagesController);
router.get('/all/users/one/:userId', validateGetAllDamagesByUserId, getAllDamagesByUserIdController);
router.get('/one/:damageId', validateGetDamageById, getDamageByIdController);
router.post('/one/create', validateCreateDamage, createDamageController);
router.put('/one/:damageId/edit', validateEditDamageById, editDamageByIdController);
router.delete('/one/:damageId/delete', deleteDamageById, deleteDamageByIdController);

export const damageRoutes = router;