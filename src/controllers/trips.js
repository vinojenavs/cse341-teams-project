import { getTripById, getAllTrips } from "../models/trips.js";

export async function getTripByIdController(req, res) {
    try {
        const { id } = req.params;
        const trip = await getTripById(id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        return res.json(trip);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching trip", error });
    }
}

export async function getAllTripsController(req, res) {
    try {
        const trips = await getAllTrips();
//        if (!trips || trips.length === 0) {
//            return res.status(404).json({ message: "No trips found" });
//        }
        return res.json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        return res.status(500).json({ message: "Error fetching trips", error });
    }
}

export function renderTripsList(req, res) {
    return res.render('trips/list', {
        title: 'Scenic Train Trips'
    });
}

export async function renderTripDetails(req, res) {
    try {
        const { tripId } = req.params;
        const details = await getTripById(tripId);
        if (!details) {
            return res.status(404).send('Trip not found');
        }
        const db = getDb();
        details.schedules = await db.collection('schedules')
            .find({ tripId })
            .toArray();

        return res.render('trips/details', {
            title: 'Trip Details',
            details
        });
        } catch (error) {
        console.error('Error retrieving trip details:', error);
        return res.status(500).send('Internal Server Error');
    }
}