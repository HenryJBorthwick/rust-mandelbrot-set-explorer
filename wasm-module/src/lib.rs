use wasm_bindgen::prelude::*;
use num_complex::Complex;

// Global static mutable counter
static mut COUNTER: i32 = 0;

#[wasm_bindgen]
pub fn greet() -> String {
    "Hello from Rust Wasm!".to_string()
}

#[wasm_bindgen]
pub fn increment_counter() -> i32 {
    unsafe {
        COUNTER += 1;
        COUNTER
    }
}

#[wasm_bindgen]
pub fn decrement_counter() -> i32 {
    unsafe {
        COUNTER -= 1;
        COUNTER
    }
}

#[wasm_bindgen]
pub fn get_counter() -> i32 {
    unsafe { COUNTER }
}

#[wasm_bindgen]
pub fn reset_counter() -> i32 {
    unsafe {
        COUNTER = 0;
        COUNTER
    }
}

#[wasm_bindgen]
pub fn generate_mandelbrot(width: u32, height: u32, max_iter: u32, zoom: f64, 
                          center_x: f64, center_y: f64) -> Vec<u8> {
    // Input validation
    if width == 0 || height == 0 || max_iter == 0 || zoom <= 0.0 {
        return Vec::new();
    }

    let mut pixels = Vec::with_capacity((width * height * 4) as usize); // RGBA format

    // Coordinate scaling based on zoom and center point
    let x_min = center_x - 2.0 / zoom;
    let x_max = center_x + 1.0 / zoom;
    let y_min = center_y - 1.5 / zoom;
    let y_max = center_y + 1.5 / zoom;

    for y in 0..height {
        for x in 0..width {
            let cx = x_min + (x as f64 / width as f64) * (x_max - x_min);
            let cy = y_min + (y as f64 / height as f64) * (y_max - y_min);
            let c = Complex::new(cx, cy);
            let mut z = Complex::new(0.0, 0.0);

            let mut i = 0;
            while i < max_iter && z.norm_sqr() <= 4.0 {
                z = z * z + c;
                i += 1;
            }

            // Color mapping based on iteration count
            if i == max_iter {
                // Point is in the Mandelbrot set (black)
                pixels.push(0);    // R
                pixels.push(0);    // G
                pixels.push(0);    // B
                pixels.push(255);  // A
            } else {
                // Outside the set - create a smooth color gradient
                let hue = (i as f64 / max_iter as f64) * 360.0;
                let (r, g, b) = hsv_to_rgb(hue, 1.0, 1.0);
                
                pixels.push(r);    // R
                pixels.push(g);    // G
                pixels.push(b);    // B
                pixels.push(255);  // A
            }
        }
    }

    pixels
}

// Helper function to convert HSV to RGB for more vibrant colors
fn hsv_to_rgb(h: f64, s: f64, v: f64) -> (u8, u8, u8) {
    let c = v * s;
    let h_prime = h / 60.0;
    let x = c * (1.0 - (h_prime % 2.0 - 1.0).abs());
    let m = v - c;

    let (r_prime, g_prime, b_prime) = if h_prime < 1.0 {
        (c, x, 0.0)
    } else if h_prime < 2.0 {
        (x, c, 0.0)
    } else if h_prime < 3.0 {
        (0.0, c, x)
    } else if h_prime < 4.0 {
        (0.0, x, c)
    } else if h_prime < 5.0 {
        (x, 0.0, c)
    } else {
        (c, 0.0, x)
    };

    let r = ((r_prime + m) * 255.0) as u8;
    let g = ((g_prime + m) * 255.0) as u8;
    let b = ((b_prime + m) * 255.0) as u8;

    (r, g, b)
}

