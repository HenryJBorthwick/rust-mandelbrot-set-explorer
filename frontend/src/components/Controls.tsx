import React from 'react';

type ColorScheme = 'rainbow' | 'fire' | 'ocean' | 'grayscale' | 'cosmic' | 'fireAndAsh' | 'monochrome' | 'psychedelic';

interface ControlsProps {
  maxIter?: number;
  onMaxIterChange?: (value: number) => void;
  zoom?: number;
  onZoomChange?: (value: number) => void;
  colorScheme?: ColorScheme;
  onColorSchemeChange?: (value: ColorScheme) => void;
  onReset?: () => void;
  onDownload?: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  maxIter = 100,
  onMaxIterChange,
  zoom = 1.0,
  onZoomChange,
  colorScheme = 'rainbow',
  onColorSchemeChange,
  onReset,
  onDownload
}) => {
  return (
    <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg shadow-md md:mr-4 mb-4 md:mb-0">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Fractal Settings</h2>
      
      <div className="flex gap-2 mb-4">
        <button 
          onClick={onReset}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Reset View
        </button>
        
        <button 
          onClick={onDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Download Image
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="max-iter" className="text-gray-100 mb-1 block">Max Iterations: {maxIter}</label>
          <input
            id="max-iter"
            type="range"
            min="10"
            max="1000"
            step="10"
            value={maxIter}
            onChange={(e) => onMaxIterChange?.(parseInt(e.target.value))}
            className="bg-gray-700 text-white p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="zoom" className="text-gray-100 mb-1 block">Zoom Level:</label>
          <input
            id="zoom"
            type="number"
            min="0.1"
            step="0.1"
            value={zoom.toFixed(1)}
            onChange={(e) => onZoomChange?.(Math.max(0.1, parseFloat(e.target.value)))}
            className="bg-gray-700 text-white p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="color-scheme" className="text-gray-100 mb-1 block">Color Scheme:</label>
          <select
            id="color-scheme"
            value={colorScheme}
            onChange={(e) => onColorSchemeChange?.(e.target.value as ColorScheme)}
            className="bg-gray-700 text-white p-2 rounded w-full mb-4 hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="rainbow">Rainbow</option>
            <option value="fire">Fire</option>
            <option value="ocean">Ocean</option>
            <option value="grayscale">Grayscale</option>
            <option value="cosmic">Cosmic Nebula</option>
            <option value="fireAndAsh">Fire and Ash</option>
            <option value="monochrome">Monochrome with Twist</option>
            <option value="psychedelic">Psychedelic Ultraviolet</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Controls; 