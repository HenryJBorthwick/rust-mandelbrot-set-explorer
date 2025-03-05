import init, { greet, increment_counter, decrement_counter, get_counter, reset_counter } from './pkg/wasm_module.js';

async function run(): Promise<void> {
    try {
        await init();
        setupGreeting();
        setupCounter();
    } catch (error) {
        console.error('Failed to initialize Wasm module:', error);
    }
}

function setupGreeting(): void {
    const button: HTMLButtonElement = document.getElementById('greet-button') as HTMLButtonElement;
    const message: HTMLParagraphElement = document.getElementById('greet-message') as HTMLParagraphElement;
    
    if (button && message) {
        button.addEventListener('click', () => {
            const greeting: string = greet();
            message.textContent = greeting;
            message.classList.add('glow-effect');
            setTimeout(() => {
                message.classList.remove('glow-effect');
            }, 2000);
        });
    }
}

function setupCounter(): void {
    const incrementButton: HTMLButtonElement = document.getElementById('increment-button') as HTMLButtonElement;
    const decrementButton: HTMLButtonElement = document.getElementById('decrement-button') as HTMLButtonElement;
    const counterDisplay: HTMLElement = document.getElementById('counter-value') as HTMLElement;
    
    if (incrementButton && decrementButton && counterDisplay) {
        // Set initial value
        counterDisplay.textContent = get_counter().toString();
        
        incrementButton.addEventListener('click', () => {
            const newValue = increment_counter();
            counterDisplay.textContent = newValue.toString();
            applyCounterAnimation(counterDisplay, true);
        });
        
        decrementButton.addEventListener('click', () => {
            const newValue = decrement_counter();
            counterDisplay.textContent = newValue.toString();
            applyCounterAnimation(counterDisplay, false);
        });
        
        // Double-click on counter resets it
        counterDisplay.addEventListener('dblclick', () => {
            const newValue = reset_counter();
            counterDisplay.textContent = newValue.toString();
        });
    }
}

function applyCounterAnimation(element: HTMLElement, isIncrement: boolean): void {
    const animationClass = isIncrement ? 'increment-animation' : 'decrement-animation';
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, 300);
}

run();