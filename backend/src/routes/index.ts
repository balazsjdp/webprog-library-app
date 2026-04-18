import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HealthController } from '../controllers/HealthController';
import booksRouter from './books.routes';
import borrowingsRouter from './borrowings.routes';
import adminRouter from './admin.routes';

const router = Router();

router.get('/health', HealthController.liveness);
router.get('/health/ready', asyncHandler(HealthController.readiness));

router.use('/books', booksRouter);
router.use('/borrowings', borrowingsRouter);
router.use('/admin', adminRouter);

export default router;
