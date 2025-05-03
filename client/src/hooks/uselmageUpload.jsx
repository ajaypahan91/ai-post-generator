import { useState, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

const useImageUpload = (onUploadSuccess) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback(async (e) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  }, []);

  const uploadFile = async (file) => {
    if (!file.type.match('image.*')) {
      const message = 'Please upload an image file';
      setError(message);
      toast({
        title: "Invalid File",
        description: message,
        variant: "destructive",
      });
      return;
    }
  
    setUploading(true);
    setError(null);
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
  
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: base64Image,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
  
        const data = await response.json();
  
        toast({
          title: "Image Uploaded",
          description: "Your image has been uploaded successfully.",
        });
  
        if (onUploadSuccess) {
          onUploadSuccess(data.imageUrl || base64Image);
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setError('Failed to upload image. Please try again.');
        toast({
          title: "Upload Failed",
          description: "Something went wrong while uploading. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };
  
    reader.readAsDataURL(file); // Reads the image as base64
  };
  

  return {
    dragActive,
    uploading,
    error,
    handleDrag,
    handleDrop,
    handleFileChange,
  };
};

export default useImageUpload;
