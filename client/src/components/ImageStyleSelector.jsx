import React from 'react';
import { usePost } from '../context/PostContext';

const ImageStyleSelector = () => {
  const { post, updatePost } = usePost();

  const styles = [
    { id: 'realistic', name: 'Realistic', image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
    { id: 'fantasy', name: 'Fantasy', image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c424bbb0-a0e6-4a95-b422-56f707c6e172/dg95q5l-edb1ce2a-8086-45ae-91cd-748bb4d973a7.png/v1/fill/w_1024,h_683,q_80,strp/open_book_pages____fantasy_world_coming_outside____by_gabimedia_dg95q5l-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M0MjRiYmIwLWEwZTYtNGE5NS1iNDIyLTU2ZjcwN2M2ZTE3MlwvZGc5NXE1bC1lZGIxY2UyYS04MDg2LTQ1YWUtOTFjZC03NDhiYjRkOTczYTcucG5nIiwiaGVpZ2h0IjoiPD02ODMiLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiJcL3dtXC9jNDI0YmJiMC1hMGU2LTRhOTUtYjQyMi01NmY3MDdjNmUxNzJcL2dhYmltZWRpYS00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.mkjYfBWRDi50Xbj7b3TipCPYDjneg5TEqI4Ae6ncWVQ' } ,
    { id: 'cyberpunk', name: 'Cyberpunk', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
    { id: 'anime', name: 'Anime', image: 'https://img.goodfon.com/original/1920x1080/0/9a/asta-black-clover-anime-manga-japonese-mahou-madoshi-weapon.jpg' },
    { id: 'oil-painting', name: 'Oil Painting', image: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
    { id: 'sketch', name: 'Sketch', image: 'https://st2.depositphotos.com/1024516/7360/v/450/depositphotos_73603819-stock-illustration-vector-pencil-concet-logo-design.jpg'  }
  ];

  return (
    <div className="form-group">
      <label>Image Style</label>
      <div 
        className="image-style-selector" 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        {styles.map(style => (
          <div
            key={style.id}
            className={`image-style-option ${post.imageStyle === style.id ? 'active' : ''}`}
            onClick={() => updatePost({ imageStyle: style.id })}
            style={{
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              width: '100px',
              height: '100px',
              position: 'relative',
              border: post.imageStyle === style.id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition)',
              transform: post.imageStyle === style.id ? 'translateY(-2px)' : 'none',
              boxShadow: post.imageStyle === style.id ? 'var(--shadow-md)' : 'none',
            }}
          >
            <img
              src={post.imageUrl || style.image}
              alt={`${style.name} style`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              className="style-name"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                fontSize: '12px',
                padding: '4px',
                textAlign: 'center',
              }}
            >
              {style.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStyleSelector;
