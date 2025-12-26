import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    costPrice: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
      validate: {
        validator: function (v) {
          return !v || v >= this.price;
        },
        message: "Compare price must be greater than selling price",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Electronics",
        "Clothing",
        "Food",
        "Books",
        "Home",
        "Sports",
        "Beauty",
        "Toys",
        "Other",
      ],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
        alt: {
          type: String,
          default: "Product image",
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: Map,
      of: String,
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["kg", "g", "lb", "oz"],
        default: "kg",
      },
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "m", "in", "ft"],
        default: "cm",
      },
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    sales: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ status: 1, stock: 1 });
// Virtual for profit margin
ProductSchema.virtual("profitMargin").get(function () {
  if (this.costPrice && this.price) {
    return (((this.price - this.costPrice) / this.price) * 100).toFixed(2);
  }
  return 0;
});

// Method to check if product is in stock
ProductSchema.methods.isInStock = function () {
  return this.stock > 0;
};

// Method to check if product is low stock
ProductSchema.methods.isLowStock = function (threshold = 10) {
  return this.stock <= threshold && this.stock > 0;
};

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
