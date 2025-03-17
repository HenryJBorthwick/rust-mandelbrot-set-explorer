import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white p-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Instructions:</h3>
        <ul className="list-disc ml-6 text-gray-300 text-sm mb-4">
          <li>Drag to pan, use mouse wheel to zoom in/out at the cursor position.</li>
          <li>Increase max iterations for more detail (may be slower).</li>
          <li>Try different color schemes for varied visual effects.</li>
        </ul>
        <p className="text-gray-300 text-sm text-center mt-4">
          Built with Rust, WebAssembly, React, and Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer; 