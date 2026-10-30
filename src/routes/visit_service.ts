import { Router } from 'express';
import * as controller from '../controllers/visit_service.controller.js';

const router = Router();

router.post('/', controller.createVisitService);
router.get('/', controller.getVisitServices);
router.get('/:id', controller.getVisitServiceById);
router.get('/by-visit/:id', controller.getVisitServicesByVisit)
router.delete('/:id', controller.deleteVisitService);
router.put('/:id', controller.updateVisitService);

export default router;