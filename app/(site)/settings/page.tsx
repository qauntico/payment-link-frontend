"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, UpdateUserProfileRequest } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import styles from "./page.module.css";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    supportEmail: "",
  });
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    supportEmail: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const initialData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        businessName: user.businessName || "",
        supportEmail: user.supportEmail || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    const changed =
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.phoneNumber !== originalData.phoneNumber ||
      formData.businessName !== originalData.businessName ||
      formData.supportEmail !== originalData.supportEmail;

    setHasChanges(changed);
  }, [formData, originalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges || isSaving) return;

    setIsSaving(true);

    try {
      const updateData: UpdateUserProfileRequest = {};

      // Only include changed fields
      if (formData.firstName !== originalData.firstName) {
        updateData.firstName = formData.firstName.trim();
      }
      if (formData.lastName !== originalData.lastName) {
        updateData.lastName = formData.lastName.trim();
      }
      if (formData.phoneNumber !== originalData.phoneNumber) {
        updateData.phoneNumber = formData.phoneNumber.trim();
      }
      if (formData.businessName !== originalData.businessName) {
        updateData.businessName = formData.businessName.trim();
      }
      if (formData.supportEmail !== originalData.supportEmail) {
        updateData.supportEmail = formData.supportEmail.trim() || null;
      }

      const updatedUser = await updateUserProfile(updateData);

      // Update original data to reflect saved changes
      setOriginalData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
        businessName: updatedUser.businessName || "",
        supportEmail: updatedUser.supportEmail || "",
      });

      // Update form data with response to ensure consistency
      setFormData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
        businessName: updatedUser.businessName || "",
        supportEmail: updatedUser.supportEmail || "",
      });

      // Refresh user context
      await refreshUser();

      toast.success("Profile updated successfully");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to update profile"
          : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading user data...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.settingsCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="firstName" className={styles.label}>
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your first name"
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="lastName" className={styles.label}>
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your last name"
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="email" className={styles.label}>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className={`${styles.input} ${styles.disabledInput}`}
                placeholder="Email address"
              />
              <p className={styles.helperText}>
                Email cannot be changed
              </p>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="businessName" className={styles.label}>
                Business Name
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your business name"
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="supportEmail" className={styles.label}>
                Support Email
              </Label>
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                value={formData.supportEmail}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter support email (optional)"
              />
              <p className={styles.helperText}>
                Optional: Email for customer support inquiries
              </p>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              disabled={!hasChanges || isSaving}
              className={styles.saveButton}
            >
              {isSaving ? (
                <>
                  <Loader2 className={styles.buttonLoader} size={16} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
