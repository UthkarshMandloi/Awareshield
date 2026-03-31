// Awareshield Password Guardian & Cookie Tracker
// This content script runs on every page you visit.

console.log("[Awareshield] Privacy Guard Active on " + window.location.hostname);

// --- PASSWORD STRENGTH MONITOR (STRICT) ---
const checkPasswordStrength = (password) => {
    if (password.length < 10) return "Weak";
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z\d]/.test(password);
    
    // Reject sequences that are ONLY numbers or ONLY letters
    const isPureNumbers = /^\d+$/.test(password);
    const isPureLetters = /^[a-zA-Z]+$/.test(password);
    if (isPureNumbers || isPureLetters) return "Weak";

    const typesCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    // Must have all 4 types for 'Strong'
    if (typesCount === 4 && password.length >= 10) return "Strong";
    // Must have at least 3 types for 'Medium'
    if (typesCount >= 3) return "Medium";
    
    return "Weak";
};

// Monitor password field inputs
document.addEventListener("input", (e) => {
    if (e.target.type === "password") {
        const pass = e.target.value;
        const result = checkPasswordStrength(pass);
        
        // Show local UI feedback
        let statusEl = document.getElementById("awareshield-pass-meter");
        if (!statusEl) {
            statusEl = document.createElement("div");
            statusEl.id = "awareshield-pass-meter";
            statusEl.className = "awareshield-tooltip";
            e.target.parentNode.appendChild(statusEl);
        }
        
        statusEl.innerText = `Awareshield: ${result} Password`;
        statusEl.style.color = result === "Strong" ? "#39ff14" : (result === "Medium" ? "#ffcc00" : "#ff4444");
    }
});

// --- COOKIE TRACING ---
// This is a simple client-side check for third-party scripts adding cookies.
const scanCookies = () => {
    const cookieCount = document.cookie.split(";").length;
    if (cookieCount > 10) {
        console.warn("[Awareshield] High Cookie density detected on " + window.location.hostname);
    }
};
setInterval(scanCookies, 5000); // Check every 5 seconds
scanCookies();
