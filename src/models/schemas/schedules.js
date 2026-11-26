// /src/model/schema/schedules.js

import mongoose from "mongoose";

const schedulesSchema = new mongoose.Schema({
    tripId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
});

const Schedule = mongoose.model('Schedule', schedulesSchema);

export default Schedule;
