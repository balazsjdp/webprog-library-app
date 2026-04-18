import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/books/search-ol', asyncHandler(AdminController.searchOpenLibrary));
router.post('/books/import', asyncHandler(AdminController.importFromOpenLibrary));
router.post('/books', asyncHandler(AdminController.createBook));
router.put('/books/:id', asyncHandler(AdminController.updateBook));
router.delete('/books/:id', asyncHandler(AdminController.deleteBook));
router.patch('/books/:id/copies', asyncHandler(AdminController.updateCopies));

export default router;
