import React, { useEffect, useRef, useState } from 'react';

interface FractalViewerProps {
  wasmModule: any;
}

const FractalViewer: React.FC<FractalViewerProps> = ({ wasmModule }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maxIter, setMaxIter] = useState<number>(100);
  const [zoom, setZoom] = useState<number>(1.0);
  const [centerX, setCenterX] = useState<number>(0);
  const [centerY, setCenterY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

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
    if (!wasmModule || !canvasRef.current) return;

    const renderFractal = () => {
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
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          const imageData = new ImageData(
            new Uint8ClampedArray(pixels), 
            width, 
            height
          );
          ctx.putImageData(imageData, 0, 0);
        }
      } catch (error) {
        console.error('Error generating Mandelbrot:', error);
      }
    };

    renderFractal();
  }, [wasmModule, maxIter, zoom, centerX, centerY, canvasSize]);

  // Mouse event handlers for interactive zooming
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
    if (!isDragging || !dragStart || !canvasRef.current) return;

    // Get canvas dimensions
    const { width, height } = canvasSize;
    
    // Calculate drag distance in canvas coordinates
    const dx = e.nativeEvent.offsetX - dragStart.x;
    const dy = e.nativeEvent.offsetY - dragStart.y;
    
    // Convert to complex plane coordinates (scaled by zoom)
    const scaledDx = dx * (3.0 / width) / zoom;
    const scaledDy = dy * (3.0 / height) / zoom;
    
    // Update center position (move in opposite direction of drag)
    setCenterX(centerX - scaledDx);
    setCenterY(centerY - scaledDy);
    
    // Update drag start position
    setDragStart({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
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
    // Only apply the adjustment if we're actually zooming (zoomFactor is not 1.0)
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

  return (
    <div className="fractal-viewer">
      <h2>Mandelbrot Set Explorer</h2>
      
      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          width={canvasSize.width} 
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="max-iter">Max Iterations:</label>
          <input
            id="max-iter"
            type="range"
            min="10"
            max="1000"
            step="10"
            value={maxIter}
            onChange={(e) => setMaxIter(parseInt(e.target.value))}
          />
          <span>{maxIter}</span>
        </div>
        
        <div className="control-group">
          <label htmlFor="zoom">Zoom Level:</label>
          <input
            id="zoom"
            type="number"
            min="0.1"
            step="0.1"
            value={zoom.toFixed(1)}
            onChange={(e) => setZoom(Math.max(0.1, parseFloat(e.target.value)))}
          />
        </div>
        
        <button className="reset-button" onClick={handleReset}>
          Reset View
        </button>
      </div>
      
      <div className="instructions">
        <p>
          <strong>Instructions:</strong> Drag to pan, use mouse wheel to zoom in/out, 
          adjust sliders to change detail level.
        </p>
      </div>
    </div>
  );
};

export default FractalViewer; 