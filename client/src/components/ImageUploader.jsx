import React, { useCallback, useState } from 'react';
import { usePost } from '../context/PostContext';
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ImageUploader = () => {
  const { post, updatePost, isGenerating } = usePost();
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [post.imageStyle]);

  const handleFileChange = useCallback(async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  }, [post.imageStyle]);

  const handleFileUpload = async (file) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('style', post.imageStyle || 'default');

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/image-caption`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();

      updatePost({
        imageUrl: data.originalImageUrl || '',
        caption: data.captions ,
        generatedImageUrl: data.transformedImageUrl || data.imageUrl || '',
      });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`image-upload-area ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('image-upload').click()}
      style={{
        position: 'relative',
        border: '2px dashed var(--light-text)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        cursor: isLoading || isGenerating ? 'not-allowed' : 'pointer',
        opacity: isLoading || isGenerating ? 0.6 : 1,
        pointerEvents: isLoading || isGenerating ? 'none' : 'auto',
        transition: 'var(--transition)',
      }}
    >
      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '36px', color: 'var(--light-text)', marginBottom: 'var(--spacing-sm)' }}></i>
      <p>Drag & drop your image here or click to browse</p>
      <p style={{ color: 'var(--light-text)' }}>JPG, PNG or GIF • Max 5MB</p>
      <input
        type="file"
        id="image-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
        disabled={isGenerating || isLoading}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 'var(--radius-md)',
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--primary)' }}></i>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
