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

  // Function to generate caption
  const handleGenerateCaption = async () => {
    try {
      const response = await axios.post('http://localhost:5000/generate-caption', post);
      const captionText = response.data.caption;

      setGeneratedCaption(captionText);
      updatePost({ caption: captionText });

    } catch (error) {
      console.error('❌ Error generating caption:', error);
      setGeneratedCaption('Failed to generate caption. Please try again.');
      updatePost({ caption: 'Failed to generate caption. Please try again.' });
    }
  };

  // Function to handle similar image generation (using image_transformer.py backend)
  const handleGenerateSimilarImage = async (imagePrompt) => {
    try {
      const styleModifier = post.imageStyle ? `with a ${post.imageStyle} style` : ''; // Include the style modifier
      const modifiedPrompt = `${imagePrompt} ${styleModifier}`;

      const response = await axios.post('http://localhost:5000/generate-similar-image', {
        imageUrl: post.imageUrl, // Send the current image URL to the backend for processing
        prompt: modifiedPrompt, // Include the image style and modification in the prompt
      });

      const similarImageUrl = response.data.imageUrl; // Get the generated similar image URL
      updatePost({ generatedImageUrl: similarImageUrl }); // Update the context with the new image URL
    } catch (error) {
      console.error('Error generating similar image:', error);
    }
  };

  return (
    <div className={`tab-content ${activeTab === 'image' ? 'active' : ''}`} id="image-tab">
      <div className="form-group">
        <label>Upload or Generate Image</label>

        {/* Upload Image Section */}
        <ImageUploader />

        {/* OR divider */}
        <div className="flex items-center gap-md" style={{ margin: '15px 0' }}>
          <div style={{ flexGrow: 1, height: 1, backgroundColor: 'var(--light-text)' }}></div>
          <span>OR</span>
          <div style={{ flexGrow: 1, height: 1, backgroundColor: 'var(--light-text)' }}></div>
        </div>

        {/* Generate Image Section */}
        <div className="form-group">
          <label htmlFor="image-prompt">Generate Image from Description</label>
          <textarea
            id="image-prompt"
            rows="3"
            placeholder="Describe the image you want to generate..."
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
          ></textarea>

          <ImageStyleSelector />

          <div className="flex justify-between" style={{ marginTop: '10px', }}>
            <button
              className="button button-primary"
              onClick={() => {
               
                handleGenerateCaption(imagePrompt); // Generate Caption
                generateImage(imagePrompt); // Generate Image
                  
              }}
            >
              <i className="fas fa-image mr-sm"></i>
              Generate Post
            </button>
            <button
              className="button button-outline"
              onClick={() => {
                if (post.imageUrl) {
                  // Generate Similar Image with style modification
                  // handleGenerateSimilarImage(`Similar to the current image but with different composition. ${imagePrompt}`);
                  // Generate Caption for Similar Image
                  handleGenerateCaption(`Similar to the current image but with different composition. ${imagePrompt}`);
                }
              }}
              disabled={!post.imageUrl}
            >
              <i className="fas fa-clone mr-sm"></i>
              Generate Caption
            </button>
          </div>
        </div>
      </div>

      {/* Display the generated caption */}
      {generatedCaption && (
        <div className="generated-caption" style={{ marginTop: '2rem' }}>
          <h3>Generated Caption:</h3>
          <p>{generatedCaption}</p>
        </div>
      )}

      <FilterSelector />
    </div>
  );
};

export default ImageSettings;
