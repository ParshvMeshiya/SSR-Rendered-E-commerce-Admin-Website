import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: String,
    priceAtOrder: Number,
    quantity: Number,
    totalAmount: Number,
    costPriceAtOrder: {
      type: Number,
      required: true, 
    },
  },
  { timestamps: true }
);
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
