import express from 'express';

import {
    getAllTenantsController,
    getTenantByIdController,
    getTenantUsersByTenantIdController,
    getTenantByUserIdController,
    createTenantController,
    editTenantByIdController,
    deleteTenantByIdController
} from  "../controller/index.js";

import {
    validateGetAllTenants,
    validateGetTenantById,
    validateGetTenantUsersByTenantId,
    validateGetTenantByUserId,
    validateCreateTenant,
    validateEditTenantById,
    validateDeleteTenantById
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetAllTenants, getAllTenantsController);
router.get('/one/:tenantId', validateGetTenantById, getTenantByIdController);
router.get('/one/:tenantId/users/all', validateGetTenantUsersByTenantId, getTenantUsersByTenantIdController);
router.get('/one/users/one/:userId', validateGetTenantByUserId, getTenantByUserIdController);
router.post('/one/create', validateCreateTenant, createTenantController);
router.put('/one/:tenantId/edit', validateEditTenantById, editTenantByIdController);
router.delete('/one/:tenantId/delete', validateDeleteTenantById, deleteTenantByIdController);

export const tenantRoutes = router;