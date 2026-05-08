import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'client'], required: true },
  skills: [{ type: String, trim: true }],
  bio: { type: String, default: '' },
  education: { type: String, default: '' },
  university: { type: String, default: '' },
  reliabilityScore: { type: Number, default: 0, min: 0, max: 100 },
  portfolioLinks: [{ type: String }],
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.index({ skills: 1 });
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
