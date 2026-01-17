"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentStore } from "@/stores/paymentStore";
import { initiatePayment, InitiatePaymentRequest } from "@/lib/api/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import styles from "./page.module.css";
import { AxiosError } from "axios";

function ProceedPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { productData, paymentSessionId, setPaymentId, setError, error: storeError } = usePaymentStore();

  const [formData, setFormData] = useState({
    paymentMode: "MOMO",
    phoneNumber: "",
    quantity: "",
    fullName: "",
    emailAddress: "",
    currencyCode: "XAF",
    countryCode: "CM",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        quantity: value,
      }));
      if (errors.quantity) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.quantity;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!formData.phoneNumber.trim()) {
      setErrors((prev) => ({ ...prev, phoneNumber: "Phone number is required" }));
      setIsSubmitting(false);
      return;
    }

    if (!formData.fullName.trim()) {
      setErrors((prev) => ({ ...prev, fullName: "Full name is required" }));
      setIsSubmitting(false);
      return;
    }

    if (!formData.emailAddress.trim()) {
      setErrors((prev) => ({ ...prev, emailAddress: "Email address is required" }));
      setIsSubmitting(false);
      return;
    }

    if (showQuantity && (!formData.quantity || parseInt(formData.quantity) <= 0)) {
      setErrors((prev) => ({ ...prev, quantity: "Valid quantity is required" }));
      setIsSubmitting(false);
      return;
    }

    if (!sessionId) {
      setError("Payment session not found. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const paymentData: InitiatePaymentRequest = {
        paymentId: sessionId,
        paymentMode: formData.paymentMode,
        phoneNumber: formData.phoneNumber.trim(),
        fullName: formData.fullName.trim(),
        emailAddress: formData.emailAddress.trim(),
        currencyCode: formData.currencyCode,
        countryCode: formData.countryCode,
        ...(showQuantity && formData.quantity
          ? { quantity: parseInt(formData.quantity) }
          : {}),
      };

      const response = await initiatePayment(paymentData);
      console.log("Initiate payment response:", response);
      // Store payment ID and redirect to waiting page (replace history to prevent back navigation)
      setPaymentId(response.id);
      router.replace(`/waiting?paymentId=${response.id}`);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err instanceof AxiosError ? err.response?.data.message : "Failed to initiate payment";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (!sessionId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Payment session not found</p>
        </div>
      </div>
    );
  }

  const showQuantity = productData?.product.quantity !== null;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Proceed with Payment</h1>
          <p className={styles.subtitle}>
            Please fill in your payment details to continue
          </p>
        </div>
        {storeError && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{storeError}</p>
            </div>
          )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <Label htmlFor="paymentMode">Payment Mode *</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => handleSelectChange("paymentMode", value)}
            >
              <SelectTrigger id="paymentMode" className={styles.selectTrigger}>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                <SelectItem value="MOMO" className={styles.selectItem}>MOMO</SelectItem>
                <SelectItem value="OM" className={styles.selectItem}>OM</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMode && (
              <span className={styles.errorText}>{errors.paymentMode}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && (
              <span className={styles.errorText}>{errors.phoneNumber}</span>
            )}
          </div>

          {showQuantity && (
            <div className={styles.formGroup}>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleQuantityChange}
                required
                min="1"
              />
              {errors.quantity && (
                <span className={styles.errorText}>{errors.quantity}</span>
              )}
            </div>
          )}

          <div className={styles.formGroup}>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && (
              <span className={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="emailAddress">Email Address *</Label>
            <Input
              id="emailAddress"
              name="emailAddress"
              type="email"
              placeholder="Enter your email address"
              value={formData.emailAddress}
              onChange={handleChange}
              required
            />
            {errors.emailAddress && (
              <span className={styles.errorText}>{errors.emailAddress}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="currencyCode">Currency *</Label>
            <Select
              value={formData.currencyCode}
              onValueChange={(value) =>
                handleSelectChange("currencyCode", value)
              }
            >
              <SelectTrigger id="currencyCode" className={styles.selectTrigger}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                <SelectItem value="XAF" className={styles.selectItem}>Francs CFA</SelectItem>
                <SelectItem value="USD" className={styles.selectItem}>Dollar</SelectItem>
              </SelectContent>
            </Select>
            {errors.currencyCode && (
              <span className={styles.errorText}>{errors.currencyCode}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              name="countryCode"
              type="text"
              value={formData.countryCode}
              readOnly
              className={styles.readOnlyInput}
            />
          </div>

          <Button
            type="submit"
            className={styles.submitButton}
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className={styles.buttonLoader} size={16} />
                Processing...
              </>
            ) : (
              "Continue Payment"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ProceedPaymentPage() {
  return <ProceedPaymentContent />;
}
