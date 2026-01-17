"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct, CreateProductRequest } from "@/lib/api/products";
import SuccessModal from "@/components/dashboard/SuccessModal";
import styles from "./page.module.css";

export default function CreateProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    image: null as File | null,
    title: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "quantity") {
      // Only allow numbers for price and quantity
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a product title");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a product description");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setIsLoading(true);

    try {
      const productData: CreateProductRequest = {
        image: formData.image,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        ...(formData.quantity && formData.quantity !== "" && parseFloat(formData.quantity) > 0
          ? { quantity: parseInt(formData.quantity) }
          : {}),
      };

      const response = await createProduct(productData);
      
      // Show success modal with payment link
      setPaymentLink(response.paymentLink);
      setIsSuccessModalOpen(true);

      // Clear form
      setFormData({
        image: null,
        title: "",
        description: "",
        price: "",
        quantity: "",
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while creating the product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Product</h1>
        <p className={styles.subtitle}>
          Add a new product to your store
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <Label htmlFor="image">Product Image *</Label>
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              disabled={isLoading}
              className={styles.fileInput}
            />
            
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className={styles.imagePreview}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isLoading}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating Product..." : "Create Product"}
          </Button>
        </form>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Product Created Successfully!"
        description={`Your product has been created. Payment link: ${paymentLink}`}
        viewProductsText="View Products"
        onViewProducts={() => {
          // Will be linked later as per user request
          console.log("View products clicked");
        }}
      />
    </div>
  );
}
