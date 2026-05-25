import { Router } from "express";
import {
    getreservations,
    getReservationByInvoice,
    updateReservation,
    activateReservation,
    cancelReservation,
    reservationFilters,
    getReservationStats,
    lockDates,
    unlockDates,
    updateReservationStatus
} from '../controllers/reservation.controller.js';

import { validateRules } from "../middleware/validate.middleware.js";
import {
    rulesCreateReservation,
    rulesUpdateReservation
} from '../validators/reservation.rules.js'

const router = Router();

router.get('/', getreservations);
router.post('/search', getReservationByInvoice);
router.post('/lock/:id', lockDates);
router.delete('/unlock/:lockId', unlockDates);
router.put('/update/:id', updateReservation);
router.put('/updateStatus/:id', updateReservationStatus);
router.put('/activate/:id', activateReservation);
router.put('/delete/:id', cancelReservation);
router.get('/filters', reservationFilters);
router.get('/stats', getReservationStats);

export default router;
