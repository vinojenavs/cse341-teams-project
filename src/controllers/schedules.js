
// /src/controllers/schedules.js
import { getSchedulesByTripId } from '../models/schedules.js';

export async function getSchedulesForTrip(req, res) {
  try {
    const { id } = req.params;

    const schedules = await getSchedulesByTripId(id);

    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error retrieving trip schedules:', error);

    return res.status(500).json({
      message: 'Failed to retrieve schedules'
    });
  }
}

export async function getSchedulesForTripAndMonth(req, res) {
  try {
    const { id } = req.params;
    const month = Number(req.query.month);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({
        message: 'Month must be a number between 1 and 12'
      });
    }

    const schedules = await getSchedulesByTripId(id, month);

    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error retrieving monthly schedules:', error);

    return res.status(500).json({
      message: 'Failed to retrieve schedules'
    });
  }
}
