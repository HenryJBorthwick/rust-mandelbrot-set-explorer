import init, { greet } from './pkg/wasm_module.js';

async function run() {
    await init();
    const button = document.getElementById('greet-button');
    const message = document.getElementById('greet-message');
    button.addEventListener('click', () => {
        const greeting = greet();
        message.textContent = greeting;
    });
}

run();