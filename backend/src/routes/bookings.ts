import { Router } from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { validateBody } from '../middleware/validate.js';
import { createBookingSchema } from '../schemas/roomSchemas.js';

const router = Router();

router.post('/', validateBody(createBookingSchema), createBooking);

export default router;
