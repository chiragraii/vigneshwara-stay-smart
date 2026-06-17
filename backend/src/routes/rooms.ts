import { Router } from 'express';
import {
  listRooms,
  getRoomBySlug,
  getCategoriesSummary,
  listAmenities,
  checkAvailability,
  getRoomBookedDates,
} from '../controllers/roomController.js';
import { validateQuery, validateBody, validateParams } from '../middleware/validate.js';
import {
  listRoomsQuerySchema,
  slugParamSchema,
  checkAvailabilitySchema,
} from '../schemas/roomSchemas.js';

const router = Router();

router.get('/', validateQuery(listRoomsQuerySchema), listRooms);
router.get('/categories/summary', getCategoriesSummary);
router.get('/amenities', listAmenities);
router.post('/check-availability', validateBody(checkAvailabilitySchema), checkAvailability);
router.get('/booked-dates/:roomId', getRoomBookedDates);
router.get('/detail/:slug', validateParams(slugParamSchema), getRoomBySlug);

export default router;
