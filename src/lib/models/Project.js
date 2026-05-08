import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String, trim: true }],
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  },
  hiredStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  agreedAmount: { type: Number, default: null },
  paidAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ skillsRequired: 1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
