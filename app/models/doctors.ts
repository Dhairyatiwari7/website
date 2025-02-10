import { Schema, model, models } from "mongoose";

const DoctorSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    fees: { type: Number, required: true },
    availability: { type: [String] },
    rating: { type: Number, default: 4.5 },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "doctors" }
);

export default models.Doctor || model("Doctor", DoctorSchema);
