import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String },
  gender: { type: String },
  age: { type: Number },
  contact: { type: String },
  email: { type: String },
  nationality: { type: String },
  address: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);