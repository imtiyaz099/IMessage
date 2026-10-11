import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }, //createdAt , updatedAt
);

// Transform dates to IST when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.createdAt) {
      ret.createdAtIST = new Date(ret.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
    }
    if (ret.updatedAt) {
      ret.updatedAtIST = new Date(ret.updatedAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
    }
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
