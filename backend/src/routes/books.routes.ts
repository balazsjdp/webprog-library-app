import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(BookController.list));
router.get('/:id', asyncHandler(BookController.getById));

export default router;
