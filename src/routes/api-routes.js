import express from "express";
import { getAllTripsController, getTripByIdController } from "../controllers/trips.js";
import { getSchedulesForTrip, getSchedulesForTripAndMonth } from "../controllers/schedules.js";

const apiRouter = express.Router();

/**
 * @openapi
 * tags:
 *   name: Trips
 *   description: API endpoints for managing train trips
 */

/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     description: Retrieves a list of all available trips.
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Successfully retrieved all trips.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error.
 */
apiRouter.get("/trips", getAllTripsController);


/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     description: Retrieves a single trip using its MongoDB ID.
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the trip.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip retrieved successfully.
 *       400:
 *         description: Invalid trip ID.
 *       404:
 *         description: Trip not found.
 *       500:
 *         description: Internal server error.
 */
apiRouter.get("/trips/:id", getTripByIdController);

// src/routes/api-routes.js
// Add the following


/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get all schedules for a specific trip
 *     description: Returns all schedules associated with a trip.
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the trip
 *         schema:
 *           type: string
 *         example: TRIP001
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tripId:
 *                     type: string
 *                     example: TRIP001
 *                   title:
 *                     type: string
 *                     example: Departure from Lagos
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: '2026-12-01T08:00:00.000Z'
 *                   description:
 *                     type: string
 *                     example: Journey begins from Lagos.
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
apiRouter.get('/trips/:id/schedules', getSchedulesForTrip);

/**
 * @openapi
 * /api/trips/{id}/schedules/month:
 *   get:
 *     summary: Get schedules for a trip by month
 *     description: Returns schedules associated with a trip for a specific month.
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the trip
 *         schema:
 *           type: string
 *         example: TRIP001
 *       - in: query
 *         name: month
 *         required: true
 *         description: Month number (1 = January, 12 = December)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 12
 *     responses:
 *       200:
 *         description: Monthly schedules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tripId:
 *                     type: string
 *                     example: TRIP001
 *                   title:
 *                     type: string
 *                     example: Departure from Lagos
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   description:
 *                     type: string
 *       400:
 *         description: Invalid or missing month parameter
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
apiRouter.get('/trips/:id/schedules/month', getSchedulesForTripAndMonth);


apiRouter.get('/text', (req, res) => {
    return res.status(200).json({ message: 'API is working!' })
});

export default apiRouter;