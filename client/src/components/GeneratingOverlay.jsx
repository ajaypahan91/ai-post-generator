import React from 'react';
import { usePost } from '../context/PostContext';

const GeneratingOverlay = () => {
  const { isGenerating, progress, generatingMessage } = usePost();

  if (!isGenerating) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <div 
        className="overlay-card" 
        style={{
          width: '400px', 
          maxWidth: '90%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <h3 
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px',
          }}
        >
          Generating your content...
        </h3>
        <div 
          className="progress-bar-container"
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '16px',
            overflow: 'hidden', // Prevents overflow of animation
          }}
        >
          <div 
            className="progress-bar-fill"
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4caf50, #8bc34a, #4caf50)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s infinite linear',
              transform: `scaleX(${progress / 100})`, // Animates scaling effect
            }}
          ></div>
        </div>
        <p 
          style={{
            fontSize: '16px',
            color: '#555',
            fontStyle: 'italic',
          }}
        >
          {generatingMessage || 'Please wait while we generate your content...'}
        </p>
      </div>
    </div>
  );
};

export default GeneratingOverlay;
