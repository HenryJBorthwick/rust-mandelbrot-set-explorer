# Mandelbrot Set Explorer with WebAssembly

A Mandelbrot set visualization tool built with Rust, WebAssembly, and React. [Link to project recordings](https://drive.google.com/drive/folders/1l3dRC8Xoe5sIWdJNtHJkqTVCakvrLaIG?usp=drive_link)

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Building and Running

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
# This will automatically build the WebAssembly module if needed
npm run dev
```

If you encounter any issues with the WebAssembly module, you can manually build it:

```bash
# Navigate to the wasm module directory
cd wasm-module

# Build the WebAssembly module
wasm-pack build --target web
```

## Project Structure

```
assignment1/
├── frontend/        # React frontend application
├── wasm-module/     # Rust WebAssembly module
└── README.md        # This file
```
