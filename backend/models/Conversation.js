import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [String], // Firebase auth UIDs
      required: true,
      validate: v => v.length === 2,
    },
    participantInfo: {
      type: Map,
      of: new mongoose.Schema(
        {
          displayName: String,
          photoURL: String,
          email: String,
        },
        { _id: false }
      ),
      default: {},
    },
    lastMessage: { type: String, default: null },
    lastMessageTime: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index participants for faster lookups (not unique; a user can be in many conversations)
ConversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model('Conversation', ConversationSchema);
