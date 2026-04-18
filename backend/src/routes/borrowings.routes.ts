import { Router } from 'express';
import { BorrowingController } from '../controllers/BorrowingController';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(asyncHandler(authenticate));

router.get('/my', asyncHandler(BorrowingController.myBorrowings));
router.post('/', asyncHandler(BorrowingController.borrow));
router.post('/:id/return', asyncHandler(BorrowingController.returnBook));

export default router;
