import mongoose from "mongoose";

const userModels = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    pic: { type: String },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User",userModels)
export default User