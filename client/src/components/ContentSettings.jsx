import React, { useState } from 'react';
import { usePost } from '../context/PostContext';
import GeneratingOverlay from './GeneratingOverlay';
import axios from 'axios';

const ContentSettings = () => {
  const { post, updatePost, activeTab, setIsGenerating, setProgress, setGeneratingMessage } = usePost();
  const [generatedCaption, setGeneratedCaption] = useState('');

  const platformOptions = [
    { id: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
    { id: 'twitter-post', label: 'Twitter', icon: 'fab fa-twitter' },
    { id: 'facebook-post', label: 'Facebook', icon: 'fab fa-facebook' }
  ];

  const toneOptions = [
    'professional', 'casual', 'funny', 'serious', 'promotional', 'informative'
  ];

  // Function to handle caption generation
  const handleGenerateCaption = async () => {
    //Input validation
    if (!post.brandName || !post.platform || !post.tone || !post.keywords) {
      alert("Please fill out all required fields before generating a post.");
      return;
    }

    try {
      setIsGenerating(true); // Set generating state
      setProgress(10); // Set progress state
      setGeneratingMessage("Generating caption...");

      const response = await axios.post('http://localhost:5000/generate-caption', post);
      const captionText = response.data.caption;

      // Update the generated caption in the state and post context
      setGeneratedCaption(captionText);
      updatePost({ caption: captionText }); // Sync to shared context
      setProgress(50);
      setGeneratingMessage("Generating image...");

      // Now, generate the image based on the caption and platform
      const imageResponse = await axios.post('http://localhost:5000/generate-image', {
        prompt: captionText, // Use the caption as the prompt
        platform_format: post.platform,
        style: post.imageStyle,
      });

      const imageUrl = imageResponse.data.imageUrl;
      // Update the post context with the generated image URL
      updatePost({ generatedImageUrl: imageUrl });

      setProgress(100);
      setGeneratingMessage("Done!");
      setTimeout(() => setIsGenerating(false), 2000);

    } catch (error) {
      console.error('Error generating:', error);
      setIsGenerating(false);
      setGeneratingMessage("Error generating content.");
      setGeneratedCaption('Failed to generate. Please try again.');
      updatePost({ caption: 'Failed to generate caption. Please try again.' });
    }
  };

  return (

    <div className={`tab-content ${activeTab === 'content' ? 'active' : ''}`} id="content-tab">
      <GeneratingOverlay />
      <div className="form-group">
        <label htmlFor="brand-name">User Name</label>
        <input
          type="text"
          id="brand-name"
          
          placeholder="Enter your user name"
          value={post.brandName}
          onChange={(e) => updatePost({ brandName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Select Platform</label>
        <div className="platform-selector">
          {platformOptions.map(platform => (
            <div
              key={platform.id}
              className={`platform-option ${post.platform === platform.id ? 'active' : ''}`}
              onClick={() => updatePost({ platform: platform.id })}
            >
              <i className={platform.icon}></i>
              {platform.label}
            </div>
          ))}
        </div>
      </div>

      {/* Conditionally render platform-specific options */}
      {post.platform === 'instagram' && (
        <div className="form-group">
          <label>Type</label>
          <div className="platform-selector">
            <div
              className={`platform-option ${post.platformOption === 'instagram-story' ? 'active' : ''}`}
              onClick={() => updatePost({ platformOption: 'instagram-story' })}
            >
              Story
            </div>
            <div
              className={`platform-option ${post.platformOption === 'instagram-post' ? 'active' : ''}`}
              onClick={() => updatePost({ platformOption: 'instagram-post' })}
            >
              Post
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Select Tone</label>
        <div className="tone-selector">
          {toneOptions.map(tone => (
            <div
              key={tone}
              className={`tone-option ${post.tone === tone ? 'active' : ''}`}
              onClick={() => updatePost({ tone })}
            >
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image-style">Image Style</label>
        <select
          id="image-style"
          value={post.imageStyle}
          onChange={(e) => updatePost({ imageStyle: e.target.value })}
        >
          <option value="realistic">Realistic</option>
          <option value="fantasy">Fantasy</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="anime">Anime</option>
          <option value="sketch">Sketch</option>
          <option value="oil-painting">Oil Painting</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="keywords">Keywords (separated by commas)</label>
        <input
          type="text"
          id="keywords"
          placeholder="product, launch, innovation, tech"
          value={post.keywords}
          onChange={(e) => updatePost({ keywords: e.target.value })}
        />
      </div>

      <button className="button button-primary button-lg" onClick={handleGenerateCaption}>
        <i className="fas fa-wand-magic-sparkles mr-sm"></i>
        Generate Post
      </button>

      {/* Display the generated caption */}
      {generatedCaption && (
        <div className="generated-caption">
          <h3 style={{ marginTop: '2.5rem' }}>Generated Captions:</h3>
          {generatedCaption
            .split('\n\n') // assuming each caption is separated by a double newline
            .filter(c => c.trim() !== '') // remove any blank entries
            .map((caption, index) => (
              <p key={index} style={{ marginBottom: '1rem' }}>
                {caption}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContentSettings;
