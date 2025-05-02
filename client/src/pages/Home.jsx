import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentSettings from '../components/ContentSettings';
import ImageSettings from '../components/ImageSettings';
import PostPreview from '../components/PostPreview';
import GeneratingOverlay from '../components/GeneratingOverlay';
import { usePost } from '../context/PostContext';

const Home = () => {
  const { activeTab, setActiveTab } = usePost();

  return (
    <>
    <div className="app-container fade-in">
      <Header />
      <main className="main">
      <div className="back-home">
      <a href="/" className=""> 
        <i className="fa-solid fa-house-chimney fa-xl"></i>
      </a>
        </div> 
        <div className="container">
          <div className="grid">
            {/* Input Panel */}
            <div className="col-span-6">
              <div className="card">
                <div className="tabs">
                  <div 
                    className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => setActiveTab('content')}
                  >
                    Content Settings
                  </div>
                  <div 
                    className={`tab ${activeTab === 'image' ? 'active' : ''}`}
                    onClick={() => setActiveTab('image')}
                  >
                    Image Settings
                  </div>
                </div>

                {activeTab === 'content' ? <ContentSettings /> : <ImageSettings />}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="col-span-6">
              <PostPreview />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <GeneratingOverlay />
    </div>
    </>
  );
};

export default Home;
