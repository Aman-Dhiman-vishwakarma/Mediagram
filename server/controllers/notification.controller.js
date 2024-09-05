import { Notification } from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user.id })
      .populate({ path: "from", select: "username fullname profilePicture" })
      .sort({ createdAt: -1 });

    await Notification.updateMany({ to: req.user.id }, { read: true });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async  (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate("to");
    if (!notification) {
      return res
        .status(400)
        .json({ success: false, message: "Notification not found" });
    }
   
    if (notification.to._id.toString() !== req.user.id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Not allow to delete tjis notification",
        });
    }

    const deleteNotification = await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, deleteNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
