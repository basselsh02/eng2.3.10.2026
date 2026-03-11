const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const committeeMemberSchema = new Schema({
  memoId: {
    type: Schema.Types.ObjectId,
    ref: 'Memo',
    required: true
  },
  
  // Member Details
  name: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    default: ''
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'CommitteeRole',
    required: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  hasSigned: {
    type: Boolean,
    default: false
  },
  signatureDate: {
    type: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
committeeMemberSchema.index({ memoId: 1 });
committeeMemberSchema.index({ isActive: 1 });

module.exports = mongoose.model('CommitteeMember', committeeMemberSchema);
