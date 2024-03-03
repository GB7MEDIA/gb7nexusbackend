import express from 'express';

import {
    getAllChatsController,
    getAllChatsByUserIdController,
    getChatByIdController,
    getChatMessagesByChatIdController,
    getChatMessageByMessageIdController,
    getChatUsersByChatIdController,
    createChatController,
    createChatMessageByChatIdController,
    editChatByIdController,
    editChatMessageByIdController,
    deleteChatByIdController,
    deleteChatMessageByIdController
} from  "../controller/index.js";

import {
    validateGetAllChats,
    validateGetAllChatsByUserId,
    validateGetChatById,
    validateGetChatMessagesByChatId,
    validateGetChatMessageByMessageId,
    validateGetChatUsersByChatId,
    validateCreateChat,
    validateCreateChatMessageByChatId,
    validateEditChatById,
    validateEditChatMessageByMessageId,
    validateDeleteChatById,
    validateDeleteChatMessageByMessageId
} from "../middlewares/index.js";

const router = express.Router();

router.get('/all', validateGetAllChats, getAllChatsController);
router.get('/all/users/one/:userId', validateGetAllChatsByUserId, getAllChatsByUserIdController);
router.get('/one/:chatId', validateGetChatById, getChatByIdController);
router.get('/one/:chatId/messages/all', validateGetChatMessagesByChatId, getChatMessagesByChatIdController);
router.get('/one/messages/one/:messageId', validateGetChatMessageByMessageId, getChatMessageByMessageIdController);
router.get('/one/:chatId/users/all', validateGetChatUsersByChatId, getChatUsersByChatIdController);
router.post('/one/create', validateCreateChat, createChatController);
router.post('/one/:chatId/messages/one/create', validateCreateChatMessageByChatId, createChatMessageByChatIdController);
router.put('/one/:chatId/edit', validateEditChatById, editChatByIdController);
router.put('/one/messages/one/:messageId/edit', validateEditChatMessageByMessageId, editChatMessageByIdController);
router.delete('/one/:chatId/delete', validateDeleteChatById, deleteChatByIdController);
router.delete('/one/messages/one/:messageId/delete', validateDeleteChatMessageByMessageId, deleteChatMessageByIdController);

export const chatRoutes = router;