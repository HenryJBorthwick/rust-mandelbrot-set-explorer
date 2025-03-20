import { useWasm } from './hooks/useWasm';
import './pkg/wasm_module.js';
import { useState, useRef } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import FractalViewer, { FractalViewerHandle } from './components/FractalViewer';
import Footer from './components/Footer';

type ColorScheme = 'rainbow' | 'fire' | 'ocean' | 'grayscale' | 'cosmic' | 'fireAndAsh' | 'monochrome' | 'psychedelic';

const App = () => {
  const { status } = useWasm();
  const isWasmLoaded = status === 'loaded';
  const [maxIter, setMaxIter] = useState<number>(100);
  const [zoom, setZoom] = useState<number>(1.0);
  const [centerX, setCenterX] = useState<number>(0);
  const [centerY, setCenterY] = useState<number>(0);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('rainbow');
  const fractalViewerRef = useRef<FractalViewerHandle>(null);
  
  const handleReset = () => {
    setMaxIter(100);
    setZoom(1.0);
    setCenterX(0);
    setCenterY(0);
  };
  
  const handleDownload = () => {
    // Call the downloadImage method from FractalViewer
    fractalViewerRef.current?.downloadImage();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      
      {isWasmLoaded ? (
        <main className="flex flex-col md:flex-row mx-auto max-w-7xl p-4 flex-grow">
          <Controls 
            maxIter={maxIter}
            onMaxIterChange={setMaxIter}
            zoom={zoom}
            onZoomChange={setZoom}
            colorScheme={colorScheme}
            onColorSchemeChange={setColorScheme}
            onReset={handleReset} 
            onDownload={handleDownload}
          />
          <FractalViewer 
            ref={fractalViewerRef}
            maxIter={maxIter}
            zoom={zoom}
            centerX={centerX}
            centerY={centerY}
            colorScheme={colorScheme}
            onCenterChange={(x, y) => {
              setCenterX(x);
              setCenterY(y);
            }}
            onZoomChange={setZoom}
          />
        </main>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-8 my-8 shadow-lg text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Loading...</h2>
            <p className="text-gray-300">Please wait while the WebAssembly module is being initialized.</p>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default App; 