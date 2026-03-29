import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: {
    type: String,
    enum: ["Employee", "Manager", "Admin"],
    default: "Employee",
  },
});

export default mongoose.model("User", userSchema);
