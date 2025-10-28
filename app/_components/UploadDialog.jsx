'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useState } from "react";

export function UploadDialog({ isOpen, onClose, onUpload, uploadType, accept = "*" }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
       toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUpload(selectedFile); // Call the provided upload handler
       toast({
        title: `${uploadType} Uploaded Successfully`,
        description: `${selectedFile.name} has been uploaded.`,
      });
      setSelectedFile(null); // Reset file input
      onClose(); // Close dialog on success
    } catch (error) {
       toast({
        title: `Upload Failed`,
        description: `Could not upload ${uploadType}. Please try again.`,
        variant: "destructive",
      });
       console.error(`Error uploading ${uploadType}:`, error);
    } finally {
       setIsUploading(false);
    }
  };

  // Reset state when dialog closes
  const handleOpenChange = (open) => {
    if (!open) {
      setSelectedFile(null);
      setIsUploading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload {uploadType}</DialogTitle>
          <DialogDescription>
            Select a file to upload. Accepted formats: {accept === "*" ? "Any" : accept}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept={accept}
                disabled={isUploading}
                required
                className="file:text-primary file:font-medium hover:file:text-accent"
              />
               {selectedFile && <p className="text-sm text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
            </div>
             {/* Add more fields if needed, e.g., Course selection */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isUploading}>
              {isUploading ? "Uploading..." : <> <Upload className="mr-2 h-4 w-4"/> Upload </>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
