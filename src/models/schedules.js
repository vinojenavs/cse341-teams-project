// /src/model/schedules.js

import Schedule from "./schemas/schedules.js";

export async function getSchedulesByTripId(tripId, month) {
    const query = {
        tripId: tripId
    };
    if (month !== undefined) {
        query.$expr = {
            $eq: [
                { $month: '$date' },
                Number(month)
            ]
        };
    }
    return await Schedule.find(query).sort({ date: 1 });
}