"use client";
import React, { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name cannot exceed 200 characters"),
  description: z
    .string()
    .min(1, "Product description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
  costPrice: z.number().min(0, "Cost price cannot be negative").optional(),
  price: z.number().min(0, "Price must be at least 0"),
  compareAtPrice: z
    .number()
    .min(0, "Compare price cannot be negative")
    .optional(),
  category: z.enum([
    "Electronics",
    "Clothing",
    "Food",
    "Books",
    "Home",
    "Sports",
    "Beauty",
    "Toys",
    "Other",
  ]),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().min(1, "SKU is required").toUpperCase(),
  stock: z.number().min(0, "Stock cannot be negative"),
  tags: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
  featured: z.boolean(),
  weight: z
    .object({
      value: z.number().optional(),
      unit: z.enum(["kg", "g", "lb", "oz"]).optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    })
    .optional(),
});
export default function ProductForm({
  mode = "create",
  initialData = null,
  productId = null,
}) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        costPrice: initialData.costPrice ?? "",
        price: initialData.price ?? "",
        compareAtPrice: initialData.compareAtPrice ?? "",
        category: initialData.category ?? "Electronics",
        subCategory: initialData.subCategory ?? "",
        brand: initialData.brand ?? "",
        sku: initialData.sku ?? "",
        stock: initialData.stock ?? "",
        tags: initialData.tags?.join(", ") ?? "",
        status: initialData.status ?? "draft",
        featured: initialData.featured ?? false,
        weight: {
          value: initialData.weight?.value ?? "",
          unit: initialData.weight?.unit ?? "kg",
        },
        seo: {
          title: initialData.seo?.title ?? "",
          description: initialData.seo?.description ?? "",
          keywords: initialData.seo?.keywords?.join(", ") ?? "",
        },
      });
    }
  }, [mode, initialData]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    costPrice: "",
    price: "",
    compareAtPrice: "",
    category: "Electronics",
    subCategory: "",
    brand: "",
    sku: "",
    stock: "",
    tags: "",
    status: "draft",
    featured: false,
    weight: { value: "", unit: "kg" },
    seo: { title: "", description: "", keywords: "" },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [step, setStep] = useState(1);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const validateStepOne = () => {
    try {
      const dataToValidate = {
        ...formData,
        costPrice: formData.costPrice
          ? parseFloat(formData.costPrice)
          : undefined,
        price: formData.price === "" ? undefined : Number(formData.price),
        stock: formData.stock === "" ? undefined : Number(formData.stock),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : undefined,
        weight: formData.weight.value
          ? {
              value: parseFloat(formData.weight.value),
              unit: formData.weight.unit,
            }
          : undefined,
      };

      productSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.issues.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };
  const handleSubmit = async (e) => {
    const user = JSON.parse(localStorage.getItem("user"));
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Prepare data for validation
      const dataToValidate = {
        ...formData,
        costPrice: formData.costPrice
          ? parseFloat(formData.costPrice)
          : undefined,
        price: formData.price === "" ? undefined : Number(formData.price),
        stock: formData.stock === "" ? undefined : Number(formData.stock),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : undefined,
        weight: formData.weight.value
          ? {
              value: parseFloat(formData.weight.value),
              unit: formData.weight.unit,
            }
          : undefined,
      };

      // Validate with Zod
      const validatedData = productSchema.parse(dataToValidate);
      let uploadedImage = null;

      if (image) {
        const formDataImg = new FormData();
        formDataImg.append("file", image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataImg,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error("Image upload failed");
        }

        uploadedImage = uploadData.data; // { url, publicId }
      }

      // Convert tags string to array
      const finalData = {
        ...validatedData,
        ...(mode === "create" && { createdBy: user._id }),

        tags: validatedData.tags
          ? validatedData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],

        seo: {
          ...validatedData.seo,
          keywords: validatedData.seo?.keywords
            ? validatedData.seo.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : [],
        },
        ...(uploadedImage && { images: [uploadedImage] }),
      };

      const response = await fetch(
        mode === "edit" ? `/api/products/${productId}` : "/api/products",
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (mode === "edit"
              ? "Failed to update product"
              : "Failed to create product")
        );
      }

      setSubmitSuccess(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};

        error.issues.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });

        setErrors(fieldErrors);
      }
      // API / runtime error
      else {
        console.error(error);
        setErrors({
          submit:
            error?.message || "Something went wrong while creating product",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderStepOne = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/products")}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center text-sm font-medium"
          >
            ← Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to create a new product
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Product created successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                    placeholder="PROD-001"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brand name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pricing
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.costPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.costPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compare At Price (₹)
                </label>
                <input
                  type="number"
                  name="compareAtPrice"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.compareAtPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.compareAtPrice}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Organization */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Organization
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Toys">Toys</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Smartphones"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="new, featured, sale"
              />
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Inventory
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
          {/* Weight */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping (Optional)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight Value
                </label>
                <input
                  type="number"
                  name="weight.value"
                  value={formData.weight.value}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight Unit
                </label>
                <select
                  name="weight.unit"
                  value={formData.weight.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              SEO (Optional)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seo.title"
                  value={formData.seo.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Description
                </label>
                <textarea
                  name="seo.description"
                  value={formData.seo.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="SEO meta description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="seo.keywords"
                  value={formData.seo.keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
        </div>
      </div>
      <div className="flex justify-end pt-6 border-t">
        <button
          type="button"
          onClick={() => {
            if (validateStepOne()) setStep(2);
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
  const renderStepTwo = () => (
    <div className="mb-8 bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Product Images
      </h2>

      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 text-gray-900 border rounded text-sm"
      >
        Upload Image
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          setImage(file);
          setImagePreview(URL.createObjectURL(file));
        }}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-4 h-24 rounded border"
        />
      )}

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-2 border rounded-lg text-gray-900"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </div>
  );
  return (
    <form onSubmit = {handleSubmit}>
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
    </form>
  );
}
