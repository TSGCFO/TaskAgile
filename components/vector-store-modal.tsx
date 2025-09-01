"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import useToolsStore from "@/stores/useToolsStore";

interface VectorStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VectorStoreModal({ open, onOpenChange }: VectorStoreModalProps) {
  const [storeName, setStoreName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { setCurrentVectorStore, setFileSearch } = useToolsStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateStore = async () => {
    if (!storeName.trim()) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create vector store
      const storeResponse = await fetch("/api/vector_stores/create_store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: storeName }),
      });

      if (!storeResponse.ok) {
        throw new Error("Failed to create vector store");
      }

      const vectorStore = await storeResponse.json();
      setUploadProgress(25);

      // Upload files if any
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("file", files[i]);
          formData.append("vectorStoreId", vectorStore.id);

          const uploadResponse = await fetch("/api/vector_stores/upload_file", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.error(`Failed to upload ${files[i].name}`);
          }

          setUploadProgress(25 + ((i + 1) / files.length) * 75);
        }
      } else {
        setUploadProgress(100);
      }

      // Update store state
      setCurrentVectorStore({
        id: vectorStore.id,
        name: vectorStore.name,
      });
      
      setFileSearch(true);

      // Reset form
      setStoreName("");
      setFiles([]);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating vector store:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-vector-store">
        <DialogHeader>
          <DialogTitle>Manage Vector Stores</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Store Name
            </label>
            <Input
              type="text"
              placeholder="Enter store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              disabled={uploading}
              data-testid="input-store-name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Files
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
              }`}
              data-testid="dropzone-files"
            >
              <input {...getInputProps()} />
              <i className="fas fa-cloud-upload-alt text-2xl text-muted-foreground mb-2"></i>
              <p className="text-sm text-muted-foreground">
                {isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, TXT, DOCX files
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Selected Files ({files.length})
              </label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 bg-secondary rounded text-sm"
                    data-testid={`file-${index}`}
                  >
                    <span className="truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                      data-testid={`button-remove-file-${index}`}
                    >
                      <i className="fas fa-times text-xs"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Creating store...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} data-testid="progress-upload" />
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={handleCreateStore}
              disabled={!storeName.trim() || uploading}
              className="flex-1"
              data-testid="button-create-store"
            >
              {uploading ? 'Creating...' : 'Create Store'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
              className="flex-1"
              data-testid="button-cancel-store"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
