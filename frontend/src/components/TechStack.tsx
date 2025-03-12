import React from 'react';

const TechStack = () => {
  return (
    <div className="tech-stack">
      <div className="tech-item">
        <img 
          className="tech-logo" 
          src="https://rustacean.net/assets/rustacean-flat-happy.svg" 
          alt="Rust logo" 
        />
        <p>Rust</p>
      </div>
      <div className="tech-item">
        <img 
          className="tech-logo" 
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/WebAssembly_Logo.svg" 
          alt="WebAssembly logo" 
        />
        <p>WebAssembly</p>
      </div>
      <div className="tech-item">
        <img 
          className="tech-logo" 
          src="https://vitejs.dev/logo.svg" 
          alt="Vite logo" 
        />
        <p>Vite</p>
      </div>
      <div className="tech-item">
        <img 
          className="tech-logo" 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
          alt="React logo" 
        />
        <p>React</p>
      </div>
    </div>
  );
};

export default TechStack; 