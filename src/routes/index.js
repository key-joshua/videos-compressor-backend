import Router from 'express';
import videoCompressRouter from './videoCompressRoute.js';

const router = Router();
router.use('/video', videoCompressRouter);

export default router;
