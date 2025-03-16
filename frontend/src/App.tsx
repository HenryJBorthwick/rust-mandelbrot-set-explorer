import { useEffect, useState } from 'react'
import GreetingDemo from './components/GreetingDemo'
import WasmCounter from './components/WasmCounter'
import TechStack from './components/TechStack'
import FractalViewer from './components/FractalViewer'

// Import WASM module
let wasmModule: any = null;

const App = () => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('fractal');

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasm = await import('./pkg/wasm_module.js');
        await wasm.default();
        wasmModule = wasm;
        setIsWasmLoaded(true);
      } catch (error) {
        console.error('Failed to initialize Wasm module:', error);
      }
    };

    loadWasm();
  }, []);

  return (
    <div className="container">
      <header>
        <h1 className="glow-effect">Rust + WebAssembly</h1>
        <p className="tagline">Experience the power and performance of Rust on the web</p>
      </header>
      
      <div className="tab-navigation">
        <button 
          className={activeTab === 'fractal' ? 'active' : ''}
          onClick={() => setActiveTab('fractal')}
        >
          Mandelbrot Explorer
        </button>
        <button 
          className={activeTab === 'demo' ? 'active' : ''}
          onClick={() => setActiveTab('demo')}
        >
          Wasm Demo
        </button>
      </div>
      
      {isWasmLoaded ? (
        <>
          {activeTab === 'fractal' && <FractalViewer wasmModule={wasmModule} />}
          {activeTab === 'demo' && (
            <>
              <GreetingDemo wasmModule={wasmModule} />
              <WasmCounter wasmModule={wasmModule} />
            </>
          )}
        </>
      ) : (
        <div className="wasm-demo">
          <h2 className="demo-title">Loading WebAssembly...</h2>
          <p>Please wait while the WASM module is being initialized.</p>
        </div>
      )}
      
      <TechStack />
      
      <footer>
        <p>Built with Rust, WebAssembly, and React</p>
      </footer>
    </div>
  )
}

export default App 