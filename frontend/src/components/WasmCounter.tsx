import { useEffect, useState } from 'react';

interface WasmCounterProps {
  wasmModule: {
    increment_counter: () => number;
    decrement_counter: () => number;
    get_counter: () => number;
    reset_counter: () => number;
  };
}

const WasmCounter = ({ wasmModule }: WasmCounterProps) => {
  const [counter, setCounter] = useState<number>(0);
  const [animation, setAnimation] = useState<string>('');

  useEffect(() => {
    // Set initial value
    setCounter(wasmModule.get_counter());
  }, [wasmModule]);

  const handleIncrement = () => {
    const newValue = wasmModule.increment_counter();
    setCounter(newValue);
    applyAnimation('increment-animation');
  };

  const handleDecrement = () => {
    const newValue = wasmModule.decrement_counter();
    setCounter(newValue);
    applyAnimation('decrement-animation');
  };

  const handleReset = () => {
    const newValue = wasmModule.reset_counter();
    setCounter(newValue);
  };

  const applyAnimation = (animationClass: string) => {
    setAnimation(animationClass);
    setTimeout(() => {
      setAnimation('');
    }, 300);
  };

  return (
    <div className="wasm-demo">
      <h2 className="demo-title">WASM Counter</h2>
      <p>A simple counter implemented in Rust and compiled to WebAssembly:</p>
      <div className="counter-section">
        <button onClick={handleDecrement}>-</button>
        <div 
          className={`counter-display ${animation}`} 
          onDoubleClick={handleReset}
        >
          {counter}
        </div>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default WasmCounter; 