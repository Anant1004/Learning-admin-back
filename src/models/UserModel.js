import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phoneNo: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["instructor", "student"],
    required: true,
    default: "student",
  },
  bio: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "instructor";
    },
  },
  expertise: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "instructor";
    },
  },
  profile_image: {
    type: String,
  },
  purchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", 
    },
  ],
  purchasedTestSeries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSeries", 
    },
  ],
}, { timestamps: true } );

export default mongoose.models.User || mongoose.model('User', userSchema);
