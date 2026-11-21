import express from 'express';
import {
    renderTripsList,
    renderTripDetails
} from '../controllers/trips.js';

const ejsRouter = express.Router();

ejsRouter.get('/trips', renderTripsList);
ejsRouter.get('/trips/:tripId', renderTripDetails);

export default ejsRouter;