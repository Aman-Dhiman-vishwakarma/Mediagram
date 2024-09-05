import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  onfrontuser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastmessage: {
    text: { type: String },
    lastmessagedate: { type: Date },
    seen: { type: Boolean, default: false },
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});
export const Conversation = mongoose.model("Conversation", conversationSchema);
