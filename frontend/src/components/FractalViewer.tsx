import React, { useEffect, useRef, useState } from 'react';
import * as wasmModule from '../pkg/wasm_module.js';

type ColorScheme = 'rainbow' | 'fire' | 'ocean' | 'grayscale' | 'cosmic' | 'fireAndAsh' | 'monochrome' | 'psychedelic';

interface FractalViewerProps {
  maxIter?: number;
  zoom?: number;
  centerX?: number;
  centerY?: number;
  colorScheme?: ColorScheme;
  onCenterChange?: (x: number, y: number) => void;
  onZoomChange?: (zoom: number) => void;
  onDownload?: () => void;
}

const FractalViewer: React.FC<FractalViewerProps> = ({
  maxIter = 100,
  zoom = 1.0,
  centerX = 0,
  centerY = 0,
  colorScheme = 'rainbow',
  onCenterChange,
  onZoomChange,
  onDownload
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(true);
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
  }, [wasmModule, maxIter, zoom, centerX, centerY, canvasSize, colorScheme]);

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
          centerY,
          colorScheme
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
    const newCenterX = centerX - scaledDx;
    const newCenterY = centerY - scaledDy;
    
    // Call the callback if provided, otherwise update local state
    if (onCenterChange) {
      onCenterChange(newCenterX, newCenterY);
    }
    
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
    
    // Calculate new center coordinates
    const newCenterX = complexX - (complexX - centerX) / zoomFactor;
    const newCenterY = complexY - (complexY - centerY) / zoomFactor;
    
    // Call callbacks if provided
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
    
    if (onCenterChange) {
      onCenterChange(newCenterX, newCenterY);
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    if (onDownload) {
      onDownload();
      return;
    }
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `mandelbrot-x${centerX.toFixed(3)}-y${centerY.toFixed(3)}-zoom${zoom.toFixed(1)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full md:w-2/3">
      <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 relative">
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          className="w-full h-auto cursor-grab"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
        
        {showCoordinates && mousePosition && (
          <div className="bg-gray-900 p-2 rounded text-gray-300 text-sm mt-2">
            <label>
              <input 
                type="checkbox" 
                checked={showCoordinates}
                onChange={() => setShowCoordinates(!showCoordinates)}
                className="mr-2"
              />
              Show coordinates
            </label>
            <div>
              Center: ({centerX.toFixed(4)}, {centerY.toFixed(4)}), Zoom: {zoom.toFixed(2)}x
            </div>
            {mousePosition && (
              <div>
                Cursor: ({mousePosition.x.toFixed(4)}, {mousePosition.y.toFixed(4)})
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FractalViewer; 