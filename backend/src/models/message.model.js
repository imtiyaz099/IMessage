import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: { 
      type: String,
    },
    video: {
      type: String,
    },
  },
  { timeStamps: true },
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
