import init, { greet } from './pkg/wasm_module.js';

async function run(): Promise<void> {
    try {
        await init();
        const button: HTMLButtonElement = document.getElementById('greet-button') as HTMLButtonElement;
        const message: HTMLParagraphElement = document.getElementById('greet-message') as HTMLParagraphElement;
        button.addEventListener('click', () => {
            const greeting: string = greet();
            message.textContent = greeting;
        });
    } catch (error) {
        console.error('Failed to initialize Wasm module:', error);
    }
}

run();