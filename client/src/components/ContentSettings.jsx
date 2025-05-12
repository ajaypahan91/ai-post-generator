import React, { useState } from 'react';
import axios from 'axios';
import { usePost } from '../context/PostContext';
import GeneratingOverlay from './GeneratingOverlay';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ContentSettings = () => {
  const { post, updatePost, activeTab, setIsGenerating, setProgress, setGeneratingMessage } = usePost();
  const [generatedCaption, setGeneratedCaption] = useState('');

  const platformOptions = [
    { id: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
    { id: 'twitter-post', label: 'Twitter', icon: 'fab fa-twitter' },
    { id: 'facebook-post', label: 'Facebook', icon: 'fab fa-facebook' },
  ];

  const toneOptions = [
    'professional', 'casual', 'funny', 'serious', 'promotional', 'informative'
  ];

  const handleGeneratePost = async () => {
    if (!post.brandName || !post.platform || !post.tone || !post.keywords) {
      alert("Please fill out all required fields before generating a post.");
      return;
    }

    try {
      setIsGenerating(true);
      setProgress(10);
      setGeneratingMessage("Generating image...");

      // Generate image first using keywords or brand as prompt
      const imagePrompt = `${post.brandName} ${post.keywords}`.trim();

      const imageResponse = await axios.post(`${BACKEND_URL}/generate-image`, {
        prompt: imagePrompt,
        platform_format: post.platformOption || post.platform,
        style: post.imageStyle,
      });

      const imageUrl = imageResponse.data.imageBase64;
      updatePost({ generatedImageUrl: imageUrl });

      setProgress(60);
      setGeneratingMessage("Generating caption...");

      const captionResponse = await axios.post(`${BACKEND_URL}/generate-caption`, {
        brand: post.brandName,
        tone: post.tone,
        keywords: post.keywords,
        platform: post.platform,
        imageUrl: imageUrl, // Pass image URL if needed
      });

      const caption = captionResponse.data.caption;
      setGeneratedCaption(caption);
      updatePost({ caption });

      setProgress(100);
      setGeneratingMessage("Post ready!");
      setTimeout(() => setIsGenerating(false), 1500);

    } catch (error) {
      console.error('Error generating post:', error);
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
          placeholder="Your name"
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
              <i className={platform.icon}></i> {platform.label}
            </div>
          ))}
        </div>
      </div>

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

      <button className="button button-primary button-lg" onClick={handleGeneratePost}>
        <i className="fas fa-wand-magic-sparkles mr-sm"></i>
        Generate Post
      </button>

      {generatedCaption && (
        <div className="generated-caption">
          <h3 style={{ marginTop: '2.5rem' }}>Generated Captions:</h3>
          {generatedCaption
            .split('\n\n')
            .filter(c => c.trim() !== '')
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
