import React, { useState } from 'react';
import { usePost } from '../context/PostContext';
import ImageUploader from './ImageUploader';
import ImageStyleSelector from './ImageStyleSelector';
import FilterSelector from './FilterSelector';
import axios from 'axios';

const ImageSettings = () => {
  const { post, updatePost, generateImage, activeTab } = usePost();
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState('');

  // Function to generate caption
  const generateCaption = async () => {
    try {
      const response = await axios.post('http://localhost:5000/generate-caption', { prompt: imagePrompt, ...post });
      const captionText = response.data.caption;

      setGeneratedCaption(captionText);
      updatePost({ caption: captionText });
    } catch (error) {
      console.error('Error generating caption:', error);
      setGeneratedCaption('Failed to generate caption. Please try again.');
      updatePost({ caption: 'Failed to generate caption. Please try again.' });
    }
  };

  // Function to generate post (both image + caption)
  const handleGeneratePost = async () => {
    if (!imagePrompt) {
      alert('Please provide a description.');
      return;
    }

    setIsGenerating(true);
    setGeneratingMessage('Generating post...');

    try {
      updatePost({
             
        keywords: '',
       
      });
      
      // First, generate image
      await generateImage(imagePrompt);

      // Then, generate caption
      await generateCaption();
    } catch (error) {
      console.error('Error generating post:', error);
      setGeneratingMessage('Error generating post. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingMessage('');
    }
  };

  // Function to generate caption only
  const handleGenerateCaptionOnly = async () => {
    if (!imagePrompt) {
      alert('Please provide a description.');
      return;
    }

    setIsGenerating(true);
    setGeneratingMessage('Generating caption...');

    try {
      await generateCaption();
    } catch (error) {
      console.error('Error generating caption only:', error);
      setGeneratingMessage('Error generating caption. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingMessage('');
    }
  };

  return (
    <div className={`tab-content ${activeTab === 'image' ? 'active' : ''}`} id="image-tab">
      <div className="form-group">
        <label>Upload image to generate caption</label>

        {/* Upload Section */}
        <ImageUploader />

        {/* OR divider */}
        <div className="flex items-center gap-md" style={{ margin: '15px 0' }}>
          <div style={{ flexGrow: 1, height: 1, backgroundColor: 'var(--light-text)' }}></div>
          <span>OR</span>
          <div style={{ flexGrow: 1, height: 1, backgroundColor: 'var(--light-text)' }}></div>
        </div>

        {/* Generate Section */}
        <div className="form-group">
          <label htmlFor="image-prompt">Generate Post from Description</label>
          <textarea
            id="image-prompt"
            rows="3"
            placeholder="Describe the post you want to generate..."
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
          ></textarea>

          <ImageStyleSelector />

          <div className="flex justify-between" style={{ marginTop: '10px' }}>
            <button
              className="button button-primary"
              onClick={handleGeneratePost}
              disabled={isGenerating}
            >
              <i className="fas fa-image mr-sm"></i>
              Generate Post
            </button>
            <button
              className="button button-outline"
              onClick={handleGenerateCaptionOnly}
              disabled={isGenerating || !imagePrompt}
            >
              <i className="fas fa-clone mr-sm"></i>
              Generate Caption
            </button>
          </div>
        </div>
      </div>

      {/* Generated caption output */}
      {generatedCaption && (
        <div className="generated-caption" style={{ marginTop: '2rem' }}>
          <h3>Generated Caption:</h3>
          <p>{generatedCaption}</p>
        </div>
      )}

      {/* Optionally display loading message */}
      {isGenerating && (
        <div className="generating-message" style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>
          {generatingMessage}
        </div>
      )}

      <FilterSelector />
    </div>
  );
};

export default ImageSettings;
