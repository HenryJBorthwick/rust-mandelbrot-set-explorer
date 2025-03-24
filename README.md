# Mandelbrot Set Explorer with WebAssembly

A Mandelbrot set visualization tool built with Rust, WebAssembly, and React.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Building and Running

### 1. Build the WebAssembly Module

```bash
# Navigate to the wasm module directory
cd wasm-module

# Build the WebAssembly module
wasm-pack build --target web
```

### 2. Set Up and Run the Frontend

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
assignment1/
├── frontend/         # React frontend application
├── wasm-module/      # Rust WebAssembly module
└── README.md        # This file
```
