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
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
        <h3>Generating your content...</h3>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{generatingMessage}</p>
      </div>
    </div>
  );
};

export default GeneratingOverlay;
