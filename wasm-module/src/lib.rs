use wasm_bindgen::prelude::*;
use num_complex::Complex;

#[wasm_bindgen]
pub fn generate_mandelbrot(width: u32, height: u32, max_iter: u32, zoom: f64, 
                          center_x: f64, center_y: f64, colour_scheme: &str) -> Vec<u8> {
    // validate input parameters to prevent undefined behaviors
    if width == 0 || height == 0 || max_iter == 0 || zoom <= 0.0 {
        return Vec::new();
    }

    // pre-allocate the pixel buffer for RGBA values
    // each pixel requires 4 bytes (R,G,B,A) hence width * height * 4
    let mut pixels = Vec::with_capacity((width * height * 4) as usize); // RGBA format

    // Calculate the viewport boundaries in the complex plane
    // mandelbrot set is typically viewed in the region [-2, 1] x [-1.5, 1.5]
    // calculations maintain aspect ratio while allowing zoom and pan
    let x_min = center_x - 2.0 / zoom;
    let x_max = center_x + 1.0 / zoom;
    let y_min = center_y - 1.5 / zoom;
    let y_max = center_y + 1.5 / zoom;

    // iterate over each pixel in the output image
    for y in 0..height {
        for x in 0..width {
            // Map pixel coordinates to complex plane coordinates
            let cx = x_min + (x as f64 / width as f64) * (x_max - x_min);
            let cy = y_min + (y as f64 / height as f64) * (y_max - y_min);
            let c = Complex::new(cx, cy);
            let mut z = Complex::new(0.0, 0.0);

            // Core Mandelbrot set iteration
            // A point is in the set if |z| <= 2 after max_iter iterations
            // where z = z² + c repeatedly
            let mut i = 0;
            while i < max_iter && z.norm_sqr() <= 4.0 {
                z = z * z + c;
                i += 1;
            }

            // Colour mapping based on iteration count
            if i == max_iter {
                // Point is in the Mandelbrot set (black)
                pixels.push(0);    // R
                pixels.push(0);    // G
                pixels.push(0);    // B
                pixels.push(255);  // A
            } else {
                // Points outside the set are coloured based on how quickly they escaped
                let normalized = i as f64 / max_iter as f64;
                
                // outside set create a colour based on the selected scheme
                match colour_scheme {
                    "rainbow" => {
                        // Rainbow colour scheme (hue variation)
                        let hue = normalized * 360.0;
                        let (r, g, b) = hsv_to_rgb(hue, 1.0, 1.0);
                        pixels.push(r);
                        pixels.push(g);
                        pixels.push(b);
                    },
                    "fire" => {
                        // Fire colour scheme (red to yellow)
                        let (r, g, b) = hsv_to_rgb(normalized * 60.0, 1.0, 1.0);
                        pixels.push(r);
                        pixels.push(g);
                        pixels.push(b);
                    },
                    "ocean" => {
                        // Ocean colour scheme (blue to cyan)
                        let (r, g, b) = hsv_to_rgb(180.0 + normalized * 60.0, 1.0, 1.0);
                        pixels.push(r);
                        pixels.push(g);
                        pixels.push(b);
                    },
                    "grayscale" => {
                        // Grayscale
                        let value = (normalized * 255.0) as u8;
                        pixels.push(value);
                        pixels.push(value);
                        pixels.push(value);
                    },
                    "cosmic" => {
                        // Cosmic Nebula (Blues and Purples)
                        // Interpolate from deep navy to purples, electric blues, and magenta
                        let hue = 240.0 + normalized * 60.0; // 240 (blue) to 300 (purple)
                        let saturation = 0.7 + normalized * 0.3; // More saturated as we move out
                        let value = 0.6 + normalized * 0.4; // Brighter as we move out
                        let (r, g, b) = hsv_to_rgb(hue, saturation, value);
                        pixels.push(r);
                        pixels.push(g);
                        pixels.push(b);
                    },
                    "fireAndAsh" => {
                        // Fire and Ash (Reds to Grays)
                        if normalized < 0.5 {
                            // Deep reds to yellows for lower iterations
                            let sub_normalized = normalized * 2.0; // Rescale to [0,1]
                            let hue = 0.0 + sub_normalized * 60.0; // Red to yellow
                            let (r, g, b) = hsv_to_rgb(hue, 1.0, 1.0);
                            pixels.push(r);
                            pixels.push(g);
                            pixels.push(b);
                        } else {
                            // Cooling off to grays and whites for higher iterations
                            let sub_normalized = (normalized - 0.5) * 2.0; // Rescale to [0,1]
                            let saturation = 1.0 - sub_normalized; // Desaturate to gray
                            let value = 0.5 + sub_normalized * 0.5; // Brighten to white
                            let (r, g, b) = hsv_to_rgb(30.0, saturation, value); // Starting from orange-ish
                            pixels.push(r);
                            pixels.push(g);
                            pixels.push(b);
                        }
                    },
                    "monochrome" => {
                        // Monochrome with a Twist
                        if normalized > 0.9 {
                            // Accent colour at the edges (high iteration)
                            let (r, g, b) = hsv_to_rgb(320.0, 1.0, 1.0); // Neon pink accent
                            pixels.push(r);
                            pixels.push(g);
                            pixels.push(b);
                        } else {
                            // Grayscale for most iterations
                            let value = (normalized * 255.0) as u8;
                            pixels.push(value);
                            pixels.push(value);
                            pixels.push(value);
                        }
                    },
                    "psychedelic" => {
                        // Psychedelic Ultraviolet
                        // Cycling through ultraviolet, hot pink and neon yellows
                        let hue = (normalized * 3.0 * 360.0) % 360.0; // Fast colour cycle
                        
                        // Favouring purple/pink/yellow ranges
                        let adjusted_hue = if hue < 60.0 {
                            270.0 + hue / 2.0 // Purple to pink
                        } else if hue < 180.0 {
                            300.0 + (hue - 60.0) / 4.0 // Pink to magenta
                        } else {
                            60.0 + (hue - 180.0) / 6.0 // Some yellows and greens
                        };
                        
                        // High saturation and value for vibrancy
                        let (r, g, b) = hsv_to_rgb(adjusted_hue, 0.9, 1.0);
                        pixels.push(r);
                        pixels.push(g);
                        pixels.push(b);
                    },
                    _ => {
                        // default to rainbow if unknown scheme
                        let hue = normalized * 360.0;
                        let (r, g, b) = hsv_to_rgb(hue, 1.0, 1.0);
                        pixels.push(r);
                        pixels.push(g);
                        pixels.push(b);
                    }
                }
                
                pixels.push(255);  // A
            }
        }
    }

    pixels
}

// helper function converts HSV or Hue, Saturation, Value colour space to RGB colour space.
// h is hue angle in degrees [0, 360]
// s is saturation [0, 1]
// v is value [0, 1]
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

    // * (u8, u8, u8) - RGB color components [0, 255]
    let r = ((r_prime + m) * 255.0) as u8;
    let g = ((g_prime + m) * 255.0) as u8;
    let b = ((b_prime + m) * 255.0) as u8;

    (r, g, b)
}
