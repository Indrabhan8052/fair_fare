import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '😊' },
    isAdmin: { type: Boolean, default: false },
    preferences: {
      metro: { type: Boolean, default: true },
      bus: { type: Boolean, default: true },
      taxi: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Never send the hash back in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model('User', userSchema);
