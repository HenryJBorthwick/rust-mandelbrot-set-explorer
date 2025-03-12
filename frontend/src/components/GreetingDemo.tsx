import { useState } from 'react';

interface GreetingDemoProps {
  wasmModule: {
    greet: () => string;
  };
}

const GreetingDemo = ({ wasmModule }: GreetingDemoProps) => {
  const [message, setMessage] = useState<string>('');
  const [isGlowing, setIsGlowing] = useState<boolean>(false);

  const handleGreet = () => {
    const greeting = wasmModule.greet();
    setMessage(greeting);
    setIsGlowing(true);
    
    setTimeout(() => {
      setIsGlowing(false);
    }, 2000);
  };

  return (
    <div className="wasm-demo">
      <h2 className="demo-title">Greeting Demo</h2>
      <p>Click the button to receive a greeting from Rust!</p>
      <div className="input-section">
        <button onClick={handleGreet}>Greet Me!</button>
      </div>
      <div className="output-section">
        <p className={isGlowing ? 'glow-effect' : ''}>{message}</p>
      </div>
    </div>
  );
};

export default GreetingDemo; 