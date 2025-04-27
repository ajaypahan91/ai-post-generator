import React from 'react';
import { usePost } from '../context/PostContext';

const defaultImage = "https://cdn.pixabay.com/photo/2025/02/26/09/58/bird-9432600_1280.jpg";

const PostPreview = () => {
  const { post, updatePost, rephraseCaption } = usePost();
  console.log(post.caption);  // Add this line for debugging
  console.log('Updated Post:', post);
  
  const getPreviewHeader = () => {
    switch (post.platform) {
      case 'instagram':
      case 'instagram-post':
      case 'instagram-story':
        return (
          <div className="social-preview-header">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80"
                alt="Profile"
                style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
              />
              <span style={{ fontWeight: 600, fontSize: '14px' }}>
                {post.brandName || 'YourUserName'}
              </span>
            </div>
            <i className="fas fa-ellipsis-v"></i>
          </div>
        );

      case 'twitter-post':
        return (
          <div className="social-preview-header">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80"
                alt="Profile"
                style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
              />
              <div>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {post.brandName || 'YourUserName'}
                </span>
                <div style={{ fontSize: '13px', color: 'var(--light-text)' }}>
                  @{(post.brandName || 'username').toLowerCase().replace(/\s+/g, '')}
                </div>
              </div>
            </div>
            <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i>
          </div>
        );
        
      case 'facebook-post':
        return (
          <div className="social-preview-header">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80"
                alt="Profile"
                style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
              />
              <div>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {post.brandName || 'YourUserName'}
                </span>
                <div style={{ fontSize: '13px', color: 'var(--light-text)' }}>
                  Just now · <i className="fas fa-globe-americas"></i>
                </div>
              </div>
            </div>
            <i className="fas fa-ellipsis-h"></i>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getPreviewActions = () => {
    switch (post.platform) {
      case 'instagram':
      case 'instagram-post':
      case 'instagram-story':
        return (
          <div className="social-preview-actions">
            <i className="far fa-heart"></i>
            <i className="far fa-comment"></i>
            <i className="far fa-paper-plane"></i>
          </div>
        );
        
      case 'twitter-post':
        return (
          <div className="social-preview-actions">
            <i className="far fa-comment"></i>
            <i className="fas fa-retweet"></i>
            <i className="far fa-heart"></i>
            <i className="far fa-share-square"></i>
          </div>
        );
        
      case 'facebook-post':
        return (
          <div className="social-preview-actions">
            <i className="far fa-thumbs-up"></i>
            <i className="far fa-comment"></i>
            <i className="far fa-share-square"></i>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getFilterStyle = () => {
    switch (post.filter) {
      case 'vintage':
        return 'sepia(0.5) contrast(1.2)';
      case 'grayscale':
        return 'grayscale(1)';
      case 'vibrant':
        return 'saturate(1.8) contrast(1.1)';
      case 'cool':
        return 'hue-rotate(45deg) brightness(1.1)';
      case 'warm':
        return 'sepia(0.3) brightness(1.1) saturate(1.3)';
      default:
        return 'none';
    }
  };

  return (
    <div className="card">
      <h3>Live Preview</h3>

      <div
        className={`social-preview ${post.platform}-frame`}
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          backgroundColor: 'white',
          marginBottom: 'var(--spacing-lg)',
          maxWidth: '400px',
        }}
      >
        {getPreviewHeader()}

        <div className="social-preview-content">
          <img
            key={post.generatedImageUrl || post.imageUrl}
            src={
              post.generatedImageUrl && !post.generatedImageUrl.startsWith('data:image')
                ? `${post.generatedImageUrl}?${Date.now()}`
                : post.generatedImageUrl ||
                  (post.imageUrl && !post.imageUrl.startsWith('data:image')
                    ? `${post.imageUrl}?${Date.now()}`
                    : post.imageUrl || defaultImage)
            }
            alt="Post"
            style={{
              width: '100%',
              maxHeight: '100%',
              objectFit: 'cover',
              filter: getFilterStyle(),
            }}
          />
        </div>

        {getPreviewActions()}

        <div
          className="social-preview-caption"
          style={{ padding: 'var(--spacing-md)', fontSize: '14px' }}
        >
          <span style={{ fontWeight: 600, marginRight: '4px' }}>
            {post.brandName || 'YourUserName'}
          </span>
          <span>{post.caption}</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="caption-edit">Edit Caption</label>
        <textarea
          id="caption-edit"
          rows="4"
          value={post.caption}
          onChange={(e) => updatePost({ caption: e.target.value })}
        ></textarea>
        <div
          className="control-buttons"
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-sm)',
          }}
        >
          <button
            className="button button-sm button-outline"
            onClick={rephraseCaption}
          >
            <i className="fas fa-wand-magic-sparkles mr-sm"></i>
            Rephrase
          </button>
          <button
            className="button button-sm button-outline"
            onClick={() => updatePost({ caption: '' })}
          >
            <i className="fas fa-arrows-rotate mr-sm"></i>
            Clear
          </button>
        </div>
      </div>

      <button
        className="button button-primary button-lg"
        onClick={async () => {
          try {
            // 1. Copy caption to clipboard
            await navigator.clipboard.writeText(post.caption || '');
            alert("📋 Caption copied to clipboard!");

            // 2. Auto-download the generated image
            const imageUrl = post.generatedImageUrl || post.imageUrl;
            if (imageUrl) {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              const blobUrl = window.URL.createObjectURL(blob);

              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = `PostImage_${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(blobUrl);
            } else {
              alert("⚠️ No image to download.");
              return;
            }

            // 3. Redirect to social platform
            let platformUrl = '';
            switch (post.platform) {
              case 'instagram':
              case 'instagram-post':
              case 'instagram-story':
                platformUrl = 'https://www.instagram.com/';
                break;
              case 'twitter-post':
                platformUrl = 'https://twitter.com/compose/tweet';
                break;
              case 'facebook-post':
                platformUrl = 'https://www.facebook.com/';
                break;
              default:
                alert('⚠️ Unknown platform selected.');
                return;
            }

            window.open(platformUrl, '_blank');
          } catch (err) {
            console.error('❌ Error in Post Now:', err);
            alert('❌ Something went wrong. Try again.');
          }
        }}
      >
        <i className="fas fa-paper-plane mr-sm"></i>
        Post Now
      </button>
    </div>
  );
};

export default PostPreview;
