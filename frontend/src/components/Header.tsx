import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-orange-500 text-center">Mandelbrot Set Explorer</h1>
      <p className="text-xl text-gray-300 text-center mt-2">Explore the fascinating world of fractals</p>
    </header>
  );
};

export default Header; 