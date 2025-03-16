import FractalViewer from './components/FractalViewer';
import { useWasm } from './hooks/useWasm';
import './pkg/wasm_module.js';

const App = () => {
  const { status } = useWasm();
  const isWasmLoaded = status === 'loaded';

  return (
    <div className="max-w-5xl mx-auto p-8 bg-dark-bg text-light-text min-h-screen">
      <header className="text-center mb-8 pb-4 border-b-2 border-rust-color">
        <h1 className="text-4xl font-bold mb-2 text-rust-color">Mandelbrot Set Explorer</h1>
        <p className="text-xl opacity-80">Explore the fascinating world of fractals</p>
      </header>
      
      {isWasmLoaded ? (
        <FractalViewer />
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 my-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-accent-color">Loading...</h2>
          <p>Please wait while the WebAssembly module is being initialized.</p>
        </div>
      )}
      
      <footer className="text-center mt-12 pt-4 border-t border-gray-700 opacity-70">
        <p>Built with Rust, WebAssembly, React, and Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App; 