use wasm_bindgen::prelude::*;

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

