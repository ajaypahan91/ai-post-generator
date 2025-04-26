import React from 'react';
import { usePost } from '../context/PostContext';

const FilterSelector = () => {
  const { post, updatePost } = usePost();

  const filters = [
    { id: 'normal', name: 'Normal', style: '', },
    { id: 'vintage', name: 'Vintage', style: 'sepia(0.5) contrast(1.2)'},
    { id: 'grayscale', name: 'B&W', style: 'grayscale(1)'},
    { id: 'vibrant', name: 'Vibrant', style: 'saturate(1.8) contrast(1.1)' },
    { id: 'cool', name: 'Cool', style: 'hue-rotate(45deg) brightness(1.1)'},
    { id: 'warm', name: 'Warm', style: 'sepia(0.3) brightness(1.1) saturate(1.3)' }
  ];

  return (
    <div className="form-group">
      <label>Image Filters</label>
      <div 
        className="filter-preview"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
          marginTop: 'var(--spacing-md)',
        }}
      >
        {filters.map(filter => (
          <div
            key={filter.id}
            className={`filter-option ${post.filter === filter.id ? 'active' : ''}`}
            onClick={() => updatePost({ filter: filter.id })}
            style={{
              width: '80px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <img
              src={post.imageUrl || 'https://c7.uihere.com/files/403/612/11/backlit-countryside-dawn-daylight.jpg'}
              alt={`${filter.name} filter`}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--spacing-xs)',
                border: post.filter === filter.id ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'var(--transition)',
                filter: filter.style,
              }}
            />
            <div 
              className="filter-name"
              style={{
                fontSize: '12px',
              }}
            >
              {filter.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;
