import { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default models.Appointment || model("Appointment", AppointmentSchema);