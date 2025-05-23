import React, { createContext, useState, useContext } from 'react';
import { apiRequest } from '../lib/queryClient';



const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const PostContext = createContext();

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [post, setPost] = useState({
    brandName: '',
    platform: '',
    tone: '',
    keywords: '',
    caption: '',
    imageUrl: '',
    generatedImageUrl: '',
    filter: '',
    imageStyle: '',
    platformOption: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatingMessage, setGeneratingMessage] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  const updatePost = (newValues) => {
    setPost(prev => ({ ...prev, ...newValues }));
  };

  const resetPost = () => {
    setPost({
      brandName: '',
      platform: '',
      tone: '',
      keywords: '',
      caption: '',
      imageUrl: '',
      generatedImageUrl: '',
      filter: '',
      imageStyle: '',
      platformOption: '',
    });
  };

  const generateCaption = async () => {
    if (!post.brandName || !post.keywords) {
      alert('Please enter brand name and keywords');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratingMessage('Creating the perfect caption for your brand...');

    const timer = simulateProgress(0, 90);

    try {
      const response = await apiRequest('POST', `${BACKEND_URL}/generate-caption`, {
        brand: post.brandName,
        tone: post.tone,
        keywords: post.keywords,
        platform: post.platform
      });

      const data = await response.json();
      updatePost({ caption: data.caption });

      clearInterval(timer);
      setProgress(100);
      setGeneratingMessage('Done!');

      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error generating caption:', error);
      clearInterval(timer);
      setGeneratingMessage('Error generating caption. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
    }
  };

  const generateImage = async (description) => {
    if (!description) {
      alert('Please enter an image description');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratingMessage('Creating your image...');

    const timer = simulateProgress(0, 95);

    try {
      const response = await apiRequest('POST', `${BACKEND_URL}/generate-image`, {
        prompt: description,
        style: post.imageStyle,
        platform_format: post.platform,
      });

      const data = await response.json();
      const imageBase64 = data?.imageBase64;

      if (!imageBase64) {
        throw new Error('Image generation failed. No image returned.');
      }

      updatePost({
        imageUrl: imageBase64,
        generatedImageUrl: imageBase64,
        imageStyle: data?.style || post.imageStyle,
        platformOption: data?.platform_format || post.platform,
      });

      clearInterval(timer);
      setProgress(100);
      setGeneratingMessage('Image created successfully!');

      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error generating image:', error);
      clearInterval(timer);
      setGeneratingMessage('Error generating image. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
    }
  };


  const generateCaptionFromImage = async () => {
    if (!post.imageUrl) {
      alert('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratingMessage('Generating caption from the uploaded image...');
    const timer = simulateProgress(0, 90);

    try {
      const response = await apiRequest('POST', `${BACKEND_URL}/image-caption`, {
        imageBase64: post.imageUrl,
      });

      const data = await response.json();
      console.log("Generated Caption Data:", data);

      if (data.captions) {
        updatePost({ caption: data.captions });
        setProgress(100);
        setGeneratingMessage('Caption generated successfully!');
      } else {
        alert('No caption was returned from the server');
      }

    } catch (error) {
      console.error('Error generating caption from image:', error);
      setGeneratingMessage('Error generating caption. Please try again.');
    } finally {
      clearInterval(timer);
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };


  const savePost = async () => {
    if (!post.brandName || !post.caption) {
      alert('Please enter brand name and caption');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratingMessage('Saving your post...');

    const timer = simulateProgress(0, 90);

    try {
      await apiRequest('POST', `${BACKEND_URL}/save-post`, {
        brandName: post.brandName,
        platform: post.platform,
        tone: post.tone,
        keywords: post.keywords,
        caption: post.caption,
        imageUrl: post.generatedImageUrl || post.imageUrl,
        filter: post.filter,
        imageStyle: post.imageStyle,
        createdAt: new Date().toISOString()
      });

      clearInterval(timer);
      setProgress(100);
      setGeneratingMessage('Post saved successfully!');

      setTimeout(() => {
        setIsGenerating(false);
        // Optionally reset form or show success message
      }, 500);
    } catch (error) {
      console.error('Error saving post:', error);
      clearInterval(timer);
      setGeneratingMessage('Error saving post. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
    }
  };

  const simulateProgress = (start, end) => {
    setProgress(start);
    return setInterval(() => {
      setProgress(prev => {
        if (prev >= end) {
          return end;
        }
        return prev + Math.random() * 5;
      });
    }, 100);
  };

  const rephraseCaption = async () => {
    if (!post.caption) {
      alert('No caption to rephrase');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratingMessage('Rephrasing your caption...');

    const timer = simulateProgress(0, 90);

    try {
      // Pass the existing caption to generate a rephrased version
      const response = await apiRequest('POST', `${BACKEND_URL}/generate-caption`, {
        brand: post.brandName,
        tone: post.tone,
        keywords: post.keywords,
        platform: post.platform,
        existingCaption: post.caption
      });

      const data = await response.json();
      updatePost({ caption: data.caption });

      clearInterval(timer);
      setProgress(100);
      setGeneratingMessage('Caption rephrased!');

      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error rephrasing caption:', error);
      clearInterval(timer);
      setGeneratingMessage('Error rephrasing caption. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
    }
  };

  return (
    <PostContext.Provider value={{
      post,
      updatePost,
      resetPost,
      generateCaption,
      generateImage,
      generateCaptionFromImage,
      savePost,
      rephraseCaption,
      setIsGenerating,
      isGenerating,
      progress,
      setProgress,
      generatingMessage,
      setGeneratingMessage,
      activeTab,
      setActiveTab
    }}>
      {children}
    </PostContext.Provider>
  );
};
