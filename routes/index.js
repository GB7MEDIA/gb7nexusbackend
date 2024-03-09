import express from 'express';

import { verifyTokenMiddleware } from "../middlewares/index.js";

import { authRoutes } from "./auth.js";
import { userRoutes } from "./user.js";
import { objectRoutes } from "./object.js";
import { tenantRoutes } from "./tenant.js";
import { damageRoutes } from "./damage.js";
import { chatRoutes } from "./chat.js";
import { channelRoutes } from "./channel.js";
import { marketPlaceRoutes } from "./marketPlace.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', verifyTokenMiddleware,  userRoutes);
router.use('/objects', verifyTokenMiddleware, objectRoutes);
router.use('/tenants', verifyTokenMiddleware, tenantRoutes);
router.use('/damages', verifyTokenMiddleware, damageRoutes);
router.use('/chats', verifyTokenMiddleware, chatRoutes);
router.use('/channels', verifyTokenMiddleware, channelRoutes);
router.use('/products', verifyTokenMiddleware, marketPlaceRoutes);

export const AllRoutes = router;