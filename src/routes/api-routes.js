import express from "express";
import { getAllTripsController, getTripByIdController } from "../controllers/trips.js";

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

apiRouter.get('/text', (req, res) => {
    return res.status(200).json({ message: 'API is working!' })
});

export default apiRouter;