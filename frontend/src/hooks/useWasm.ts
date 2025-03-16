import { useState, useEffect } from 'react';
import init from '../pkg/wasm_module.js';

type WasmStatus = 'loading' | 'loaded' | 'error';

export function useWasm() {
  const [status, setStatus] = useState<WasmStatus>('loading');

  useEffect(() => {
    const initWasm = async () => {
      try {
        await init();
        setStatus('loaded');
      } catch (error) {
        console.error('Failed to initialize WASM module:', error);
        setStatus('error');
      }
    };

    initWasm();
  }, []);

  return { status };
} 