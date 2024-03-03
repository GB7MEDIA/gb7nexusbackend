import express from 'express';

import {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    editUserByIdController,
    deleteUserByIdController
} from  "../controller/index.js";

import {
    validateGetAllUsers,
    validateGetUserById,
    validateCreateUser,
    validateEditUserById,
    validateDeleteUserById
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetAllUsers, getAllUsersController);
router.get('/one/:userId', validateGetUserById, getUserByIdController);
router.post('/one/create', validateCreateUser, createUserController);
router.put('/one/:userId/edit', validateEditUserById, editUserByIdController);
router.delete('/one/:userId/delete', validateDeleteUserById, deleteUserByIdController);

export const userRoutes = router;