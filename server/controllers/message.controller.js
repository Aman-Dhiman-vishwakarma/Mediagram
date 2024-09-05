import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { io, reciversocketid } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const reciverId = req.params.reciver;
    const { messageText } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      reciverId,
      message: messageText,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.updateOne({lastmessage:{text:newMessage.message, lastmessagedate:newMessage.createdAt}})  
    }
    await conversation.save();

    const reciverSocketId = reciversocketid(reciverId)
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage)
    }

    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const conversationUsers = async (req, res) => {
  try {
    const senderId = req.user.id;
    const frontusers = await Conversation.find({
      participants:senderId,
    }).populate({path:"participants", select:"fullname username profilePicture"});
   
    frontusers.forEach((conversation)=>{
      conversation.participants = conversation.participants.filter(
        (participants)=>participants?._id.toString() !== senderId.toString()
      )
    })
    res.status(200).json({ success: true, frontusers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.reciver;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    res.status(200).json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log(error);
  }
};
