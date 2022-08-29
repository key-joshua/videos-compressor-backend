import videoCompressRouter from './videoCompressRoute.js';
import Router from 'express';

const router = Router();
router.use('/video', videoCompressRouter);

export default router;