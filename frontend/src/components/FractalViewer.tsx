import React, { useEffect, useRef, useState } from 'react';
import * as wasmModule from '../pkg/wasm_module.js';
import { Button } from './ui/Button';

type ColorScheme = 'rainbow' | 'fire' | 'ocean' | 'grayscale';

const FractalViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maxIter, setMaxIter] = useState<number>(100);
  const [zoom, setZoom] = useState<number>(1.0);
  const [centerX, setCenterX] = useState<number>(0);
  const [centerY, setCenterY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('rainbow');
  const [showCoordinates, setShowCoordinates] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);

  // Handle window resize to make the canvas responsive
  useEffect(() => {
    const updateCanvasSize = () => {
      const maxWidth = window.innerWidth > 1200 ? 1000 : window.innerWidth - 40;
      const width = Math.min(maxWidth, 800);
      const height = Math.floor(width * 0.75); // 4:3 aspect ratio
      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Render the fractal whenever parameters change
  useEffect(() => {
    renderFractal();
  }, [wasmModule, maxIter, zoom, centerX, centerY, canvasSize]);

  const renderFractal = () => {
    if (canvasRef.current && !isGenerating) {
      setIsGenerating(true);
      const { width, height } = canvasSize;
      
      try {
        // Call Rust function to generate the Mandelbrot set
        const pixels = wasmModule.generate_mandelbrot(
          width, 
          height, 
          maxIter,
          zoom,
          centerX,
          centerY
        );

        // Render pixels to canvas
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const imageData = new ImageData(
            new Uint8ClampedArray(pixels), 
            width, 
            height
          );
          ctx.putImageData(imageData, 0, 0);
        }
      } catch (error) {
        console.error('Error generating fractal:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    // Update mouse position for coordinate display
    const { width, height } = canvasSize;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    
    const complexX = centerX + (mouseX / width - 0.5) * 3.0 / zoom;
    const complexY = centerY + (mouseY / height - 0.5) * 3.0 / zoom;
    
    setMousePosition({ x: complexX, y: complexY });
    
    // Handle dragging
    if (!isDragging || !dragStart) return;
    
    // Calculate drag distance in canvas coordinates
    const dx = mouseX - dragStart.x;
    const dy = mouseY - dragStart.y;
    
    // Convert to complex plane coordinates (scaled by zoom)
    const scaledDx = dx * (3.0 / width) / zoom;
    const scaledDy = dy * (3.0 / height) / zoom;
    
    // Update center position (move in opposite direction of drag)
    setCenterX(centerX - scaledDx);
    setCenterY(centerY - scaledDy);
    
    // Update drag start position
    setDragStart({
      x: mouseX,
      y: mouseY
    });
  };

  const handleMouseLeave = () => {
    handleMouseUp();
    setMousePosition(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    // Calculate where in the canvas the mouse is pointing
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert mouse position to complex plane coordinates
    const { width, height } = canvasSize;
    const complexX = centerX + (mouseX / width - 0.5) * 3.0 / zoom;
    const complexY = centerY + (mouseY / height - 0.5) * 3.0 / zoom;
    
    // Determine zoom factor based on wheel direction
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
    const newZoom = zoom * zoomFactor;
    
    // Adjust center so that we zoom towards mouse position
    setCenterX(complexX - (complexX - centerX) / zoomFactor);
    setCenterY(complexY - (complexY - centerY) / zoomFactor);
    
    setZoom(newZoom);
  };

  const handleReset = () => {
    setMaxIter(100);
    setZoom(1.0);
    setCenterX(0);
    setCenterY(0);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `mandelbrot-x${centerX.toFixed(3)}-y${centerY.toFixed(3)}-zoom${zoom.toFixed(1)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 my-8 shadow-lg">
      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <h2 className="text-2xl font-bold text-accent">Fractal Settings</h2>
        
        <div className="flex gap-2">
          <button 
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded transition"
            onClick={handleReset}
          >
            Reset View
          </button>
          
          <button 
            className="bg-rust hover:bg-orange-600 px-4 py-2 rounded transition"
            onClick={downloadImage}
          >
            Download Image
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col">
          <label htmlFor="max-iter" className="mb-2 text-accent">Max Iterations: {maxIter}</label>
          <input
            id="max-iter"
            type="range"
            min="10"
            max="1000"
            step="10"
            value={maxIter}
            onChange={(e) => setMaxIter(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="zoom" className="mb-2 text-accent">Zoom Level:</label>
          <input
            id="zoom"
            type="number"
            min="0.1"
            step="0.1"
            value={zoom.toFixed(1)}
            onChange={(e) => setZoom(Math.max(0.1, parseFloat(e.target.value)))}
            className="w-full p-2 bg-gray-700 rounded border-none"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="color-scheme" className="mb-2 text-accent">Color Scheme:</label>
          <select
            id="color-scheme"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
            className="w-full p-2 bg-gray-700 rounded border-none"
          >
            <option value="rainbow">Rainbow</option>
            <option value="fire">Fire</option>
            <option value="ocean">Ocean</option>
            <option value="grayscale">Grayscale</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-center mb-6 relative">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded">
            <div className="text-white text-xl">Generating...</div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          width={canvasSize.width} 
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          className="border-2 border-gray-600 rounded shadow-xl"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>
      
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-coords"
            checked={showCoordinates}
            onChange={(e) => setShowCoordinates(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="show-coords" className="text-accent">Show coordinates</label>
        </div>
        
        {showCoordinates && mousePosition && (
          <div className="text-sm opacity-80 font-mono">
            x: {mousePosition.x.toFixed(6)}, y: {mousePosition.y.toFixed(6)}
          </div>
        )}
        
        <div className="text-sm opacity-80">
          Center: ({centerX.toFixed(4)}, {centerY.toFixed(4)}), Zoom: {zoom.toFixed(2)}x
        </div>
      </div>
      
      <div className="bg-gray-700 rounded p-4 mt-6 text-sm opacity-90">
        <p>
          <strong>Instructions:</strong> Drag to pan, use mouse wheel to zoom in/out at the cursor position.
          Increase max iterations for more detail (may be slower). Try different color schemes for varied visual effects.
        </p>
      </div>
    </div>
  );
};

export default FractalViewer; 