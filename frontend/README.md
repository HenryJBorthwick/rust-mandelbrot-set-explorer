# Rust WebAssembly with React

This project demonstrates the integration of Rust WebAssembly with a React TypeScript frontend.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Setup

1. Install wasm-pack if you haven't already:
   ```
   cargo install wasm-pack
   ```

2. Build the WebAssembly module:
   ```
   cd ../wasm-module
   wasm-pack build --target web --out-dir ../frontend/src/pkg
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

## Running the Development Server

Start the development server with:

```
npm run dev
```

This will:
1. Watch for changes in the Rust WASM module and rebuild it automatically
2. Start the Vite development server for the React frontend

## Building for Production

To build the project for production:

```
npm run build
```

The output will be in the `dist` directory.

## Project Structure

- `frontend/` - React TypeScript frontend
  - `src/` - Source code
    - `components/` - React components
    - `pkg/` - WebAssembly module (generated)
- `wasm-module/` - Rust WebAssembly module
  - `src/` - Rust source code

## Features

- Greeting demo that calls a Rust function
- Counter implemented in Rust with WebAssembly
- Modern React TypeScript frontend with Vite 