import mongoose from 'mongoose';

const offerTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Offer type name is required'],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('OfferType', offerTypeSchema);
