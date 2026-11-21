import mongoose from "mongoose";

const tripsSchema = new mongoose.Schema(
  {
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    departure: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    departureDate: {
      type: Date,
      required: true
    },
    arrivalDate: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripsSchema);

export default Trip;