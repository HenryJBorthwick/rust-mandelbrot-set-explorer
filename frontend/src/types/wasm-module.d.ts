declare module '*.js' {
  export function greet(): string;
  export function increment_counter(): number;
  export function decrement_counter(): number;
  export function get_counter(): number;
  export function reset_counter(): number;
  export function render_mandelbrot(
    canvas_id: string, 
    width: number, 
    height: number, 
    zoom: number, 
    offset_x: number, 
    offset_y: number, 
    max_iterations: number
  ): void;
  export default function init(): Promise<void>;
} 