"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  viewProductsText?: string;
  onViewProducts?: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  viewProductsText = "View Products",
  onViewProducts,
}: SuccessModalProps) {
  const handleViewProducts = () => {
    if (onViewProducts) {
      onViewProducts();
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} className="text-black">
            Close
          </Button>
          <AlertDialogAction onClick={handleViewProducts} className="text-black">
            {viewProductsText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
