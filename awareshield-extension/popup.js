// Awareshield Extension Popup Controller

document.getElementById('generate-btn').addEventListener('click', () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const output = document.getElementById('password-output');
    output.innerText = password;
    
    // Auto-copy to clipboard for UX
    navigator.clipboard.writeText(password).then(() => {
        const btn = document.getElementById('generate-btn');
        const oldText = btn.innerText;
        btn.innerText = "COPIED TO CLIPBOARD!";
        setTimeout(() => { btn.innerText = oldText; }, 2000);
    });
});

console.log("[Awareshield] Extension Popup Ready.");
