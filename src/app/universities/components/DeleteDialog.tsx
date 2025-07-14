// components/ui/delete-confirmation-dialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Props interface for the reusable delete confirmation dialog
interface DeleteConfirmationDialogProps {
  isOpen: boolean;            // Controls dialog open state
  onClose: () => void;        // Callback when dialog is closed
  onConfirm: () => void;      // Callback when delete is confirmed
  title: string;              // Dialog title text
  description: string;        // Dialog description text
  confirmText?: string;       // Optional custom confirm button text
  cancelText?: string;        // Optional custom cancel button text
}

/**
 * DeleteConfirmationDialog
 * -------------------------
 * A reusable dialog component for confirming deletion actions.
 * Designed to provide a consistent user experience for any destructive action.
 */
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        
        {/* Dialog Header with Warning Icon, Title, and Description */}
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>{title}</DialogTitle>
          </div>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Footer with Cancel and Confirm Buttons */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>

          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
