import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

const router = Router();

router.get('/health', HealthController.liveness);
router.get('/health/ready', HealthController.readiness);

export default router;
