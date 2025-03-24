# COSC 473 Assignment 1 Report - Mandelbrot Set Explorer

## How application works

### wasm-module

The Rust WebAssembly module performs the core mathematical computations of the Mandelbrot set.

The generation of the Mandelbrot set begins with mapping each pixel to a point in the complex plane. For each point c, we perform the iterative calculation z = z² + c, starting with z = 0. The number of iterations before |z| exceeds 2 determines whether the point is in the set and its colouring.

The computation flow works as follows:

1. The module receives viewport parameters (width, height, zoom, center coordinates) from JavaScript
2. For each pixel coordinate (x, y), it:
   - Maps the pixel to complex coordinates using viewport transformations
   - Performs the Mandelbrot iteration loop (z = z² + c)
   - Tracks iteration count and escape velocity
3. The resulting data is stored in a pre-allocated RGBA buffer:
   - Buffer size is calculated as width × height × 4 (for R,G,B,A channels)
   - Points inside the set (reaching max iterations) are coloured black
   - Points outside are coloured based on escape velocity using HSV color space

Color processing involves converting iteration counts to visually appealing colors:

- HSV color space is used for smooth transitions
- Hue is calculated from normalized iteration count
- Different color schemes modify the HSV parameters differently:
  - Rainbow: Full hue rotation (0-360°)
  - Fire: Limited hue range (0-60°) with high saturation
  - Ocean: Blue-cyan range (180-240°) with varying brightness

### Frontend Architecture

The frontend is where the visualisation is rendered:

The rendering process follows this sequence:

1. User interactions (pan/zoom) trigger state updates in React
2. The FractalViewer component:
   - Calculates new viewport parameters
   - Calls the WebAssembly module with updated parameters
   - Receives the RGBA buffer
   - Renders the buffer to canvas using ImageData

Interaction handling works through coordinate space transformations:

1. Mouse coordinates are captured in screen space
2. Screen coordinates are transformed to complex plane coordinates:
   - Transform includes current zoom level and center position
   - Maintains aspect ratio to prevent distortion
3. During zooming:
   - The point under cursor becomes the new center
   - Zoom factor is applied relative to this point
   - Complex plane coordinates are recalculated

State management flows in a cycle:

1. App component maintains global state (zoom, center, iterations)
2. User interactions update this state
3. State changes trigger:
   - New WebAssembly calculations
   - Canvas updates
   - UI element updates (coordinate display, controls)
4. Loading states are managed during computation to maintain responsiveness

The canvas rendering system:

1. Uses a direct pixel manipulation approach
2. WebAssembly module writes to a shared memory buffer
3. Buffer is converted to ImageData
4. ImageData is drawn to canvas in a single operation
5. Canvas size dynamically adjusts to viewport while maintaining aspect ratio

## Any challenges faced and approach to solving them

### 1. WebAssembly Performance Optimization

**Challenge**: Initial implementations exhibited performance issues with large viewports and high iteration counts. Key bottlenecks were:

- Memory allocation overhead during pixel buffer generation
- Data transfer costs between Rust and JavaScript
- Complex number calculations performance
- Memory access patterns affecting cache efficiency

**Solution**: 

1. Memory Management Optimization:
   - Implemented single pre-allocated Vec<u8> buffer: `Vec::with_capacity((width * height * 4) as usize)`
   - Utilized WebAssembly linear memory through wasm-bindgen
   - Direct buffer manipulation without intermediate allocations
   - Rust's compile-time optimizations via Cargo.toml settings:

     ```toml
     [profile.release]
     opt-level = 3
     lto = true
     codegen-units = 1
     ```

2. Computation Optimization:
   - Used `norm_sqr()` for escape condition checking: `z.norm_sqr() <= 4.0`
   - Efficient viewport boundary calculations
   - Minimized floating-point operations in the main loop
   - Implemented early bailout for invalid parameters

### 2. Color Scheme Implementation

**Challenge**: Initial color mapping had issues:

- Abrupt color transitions between iteration values
- Limited visual differentiation in high-iteration areas
- Color scheme consistency across different zoom levels
- Performance impact of color calculations

**Solution**:

1. Color Space Implementation:

   ```rust
   fn hsv_to_rgb(h: f64, s: f64, v: f64) -> (u8, u8, u8) {
       let c = v * s;
       let h_prime = h / 60.0;
       let x = c * (1.0 - (h_prime % 2.0 - 1.0).abs());
       let m = v - c;
       // Color component calculation
       let (r, g, b) = ((r_prime + m) * 255.0) as u8;
       // ...
   }
   ```

2. Color Scheme System:
   - Implemented 8 distinct color schemes with specific ranges:

     ```rust
     match colour_scheme {
         "rainbow" => { // Full spectrum
             let hue = normalized * 360.0;
             let (r, g, b) = hsv_to_rgb(hue, 1.0, 1.0);
         },
         "fire" => { // Warm colors
             let (r, g, b) = hsv_to_rgb(normalized * 60.0, 1.0, 1.0);
         },
         // Additional schemes...
     }
     ```

   - Dynamic saturation and value adjustments for schemes like "cosmic" and "fireAndAsh"
   - Linear interpolation for smooth transitions

### 3. User Interface Responsiveness

**Challenge**: UI responsiveness issues:

- Blocking during WebAssembly computations
- State update cascades triggering multiple re-renders
- Canvas performance with frequent updates
- Memory leaks in the rendering pipeline

**Solution**:

1. State Management:

   ```typescript
   const FractalViewer = forwardRef<FractalViewerHandle, FractalViewerProps>(({
     maxIter, zoom, centerX, centerY, colorScheme,
     onCenterChange, onZoomChange
   }, ref) => {
     const [isGenerating, setIsGenerating] = useState<boolean>(false);
     
     useEffect(() => {
       if (!isGenerating) {
         renderFractal();
       }
     }, [maxIter, zoom, centerX, centerY, colorScheme]);
   });
   ```

2. Render Pipeline:
   - Direct ImageData manipulation for efficient updates:

     ```typescript
     const imageData = new ImageData(
       new Uint8ClampedArray(pixels), 
       width, 
       height
     );
     ctx.putImageData(imageData, 0, 0);
     ```

   - Loading state management during computation
   - Efficient event handling for mouse interactions

3. Resource Management:
   - Proper clean up of event listeners in useEffect
   - Canvas context management
   - Efficient state updates to prevent render cascades

## Self-Assessment

### Functionality (40%)

- Complete implementation of core Mandelbrot set visualization
- Efficient WebAssembly computation
- Multiple interactive features
- Smooth user experience

### Rust Code Quality (20%)

- Clean, well-structured Rust code
- Effective use of Rust's type system
- Proper error handling
- Efficient algorithms
- Good documentation

### JavaScript Interop (20%)

- Seamless WebAssembly integration
- Efficient data transfer between Rust and JavaScript
- Well-structured TypeScript interfaces
- Proper memory management

### Creativity & Usability (20%)

- Multiple color schemes
- Interactive zoom and pan
- Image download capability
- Responsive design

#### Total Self-Assessed Grade: A range
