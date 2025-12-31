import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "My E-Commerce Store",
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
