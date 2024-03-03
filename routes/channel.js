import express from 'express';

import {
    getAllChannelsController,
    getAllChannelsByUserIdController,
    getChannelByIdController,
    getChannelMessagesByChannelIdController,
    getChannelMessageByMessageIdController,
    getChannelUsersByChannelIdController,
    createChannelController,
    createChannelMessageByChannelIdController,
    editChannelByIdController,
    editChannelMessageByIdController,
    deleteChannelByIdController,
    deleteChannelMessageByIdController
} from  "../controller/index.js";

import {
    validateGetAllChannels,
    validateGetAllChannelsByUserId,
    validateGetChannelById,
    validateGetChannelMessagesByChannelId,
    validateGetChannelMessageByMessageId,
    validateGetChannelUsersByChannelId,
    validateCreateChannel,
    validateCreateChannelMessageByChannelId,
    validateEditChannelById,
    validateEditChannelMessageByMessageId,
    validateDeleteChannelById,
    validateDeleteChannelMessageByMessageId
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetAllChannels, getAllChannelsController);
router.get('/all/users/one/:userId', validateGetAllChannelsByUserId, getAllChannelsByUserIdController);
router.get('/one/:channelId', validateGetChannelById, getChannelByIdController);
router.get('/one/:channelId/messages/all', validateGetChannelMessagesByChannelId, getChannelMessagesByChannelIdController);
router.get('/one/messages/one/:messageId', validateGetChannelMessageByMessageId, getChannelMessageByMessageIdController);
router.get('/one/:channelId/users/all', validateGetChannelUsersByChannelId, getChannelUsersByChannelIdController);
router.post('/one/create', validateCreateChannel, createChannelController);
router.post('/one/:channelId/messages/one/create', validateCreateChannelMessageByChannelId, createChannelMessageByChannelIdController);
router.put('/one/:channelId/edit', validateEditChannelById, editChannelByIdController);
router.put('/one/messages/one/:messageId/edit', validateEditChannelMessageByMessageId, editChannelMessageByIdController);
router.delete('/one/:channelId/delete', validateDeleteChannelById, deleteChannelByIdController);
router.delete('/one/messages/one/:messageId/delete', validateDeleteChannelMessageByMessageId, deleteChannelMessageByIdController);

export const channelRoutes = router;