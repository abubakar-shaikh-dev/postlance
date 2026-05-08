import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

invitationSchema.index({ studentId: 1, status: 1 });
invitationSchema.index({ projectId: 1 });
invitationSchema.index({ clientId: 1 });

export default mongoose.models.Invitation || mongoose.model('Invitation', invitationSchema);
