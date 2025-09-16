import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sendTo: {
      type: String,
      enum: ["All Users", "Students Only", "Instructors Only", "Specific User"],
      required: true,
    },
    specificUser: {
      type: String  ,
      required: function () {
        return this.sendTo === "Specific User";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);