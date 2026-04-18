import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/requireRole.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(asyncHandler(authenticate));
router.use(requireRole('admin'));

router.get('/books/search-ol', asyncHandler(AdminController.searchOpenLibrary));
router.post('/books/import', asyncHandler(AdminController.importFromOpenLibrary));
router.post('/books', asyncHandler(AdminController.createBook));
router.put('/books/:id', asyncHandler(AdminController.updateBook));
router.delete('/books/:id', asyncHandler(AdminController.deleteBook));
router.patch('/books/:id/copies', asyncHandler(AdminController.updateCopies));
router.get('/borrowings', asyncHandler(AdminController.getAllBorrowings));

export default router;
