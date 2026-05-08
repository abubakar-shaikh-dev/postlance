import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  proposedBudget: { type: Number, required: true },
  estimatedDuration: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  aiScore: { type: Number, default: null },
  aiEvaluation: {
    skillMatch: { type: Number, default: 0 },
    portfolioRelevance: { type: Number, default: 0 },
    reliabilityScore: { type: Number, default: 0 },
    proposalQuality: { type: Number, default: 0 },
    availabilityMatch: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    summary: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

proposalSchema.index({ projectId: 1, status: 1 });
proposalSchema.index({ studentId: 1 });
proposalSchema.index({ projectId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.Proposal || mongoose.model('Proposal', proposalSchema);
