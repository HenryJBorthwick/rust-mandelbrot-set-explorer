declare module '*.js' {
  export function greet(): string;
  export function increment_counter(): number;
  export function decrement_counter(): number;
  export function get_counter(): number;
  export function reset_counter(): number;
  export default function init(): Promise<void>;
} 