import mongoose from 'mongoose';

const savedSearchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cityId: { type: String, required: true },
    from: { name: String, lat: Number, lng: Number },
    to: { name: String, lat: Number, lng: Number },
    durationMin: Number,
  },
  { timestamps: true }
);

export default mongoose.model('SavedSearch', savedSearchSchema);
