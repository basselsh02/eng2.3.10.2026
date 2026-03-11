import mongoose from 'mongoose';

// Predefined roles: رئيس اللجنة, عضو اللجنة, مندوب العقود, عضو هيئة القضاء
const committeeRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CommitteeRole', committeeRoleSchema);
