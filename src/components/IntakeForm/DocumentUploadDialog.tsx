
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentProcess: (text: string) => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  onDocumentProcess
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here we're just simulating document processing
      // In a real app, you'd send this to a backend for processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockExtractedText = `Business Unit: Technology
Category: Software Development
Project Name: AI Integration
Project Budget: 50000
Due Date: 2025-06-01`;
      
      onDocumentProcess(mockExtractedText);
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#000034]">Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document and I'll help you fill out the form based on its contents.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#7E5DED] rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-8 w-8 text-[#7E5DED]" />
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                PDF, DOC, DOCX, or TXT
              </span>
            </label>
          </div>
          {isUploading && (
            <div className="text-center text-sm text-[#7E5DED]">
              Processing document...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
