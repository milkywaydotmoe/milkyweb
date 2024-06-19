function sanitizeInput(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML.toLowerCase(); // Convert sanitized input to lowercase
}

function sanitizeOutput(output) {
    const element = document.createElement('div');
    element.innerText = output;
    return element.innerHTML;
}

function checkPassword() {
    const password = sanitizeInput(document.getElementById('password').value); // Sanitize and convert input to lowercase
    const correctPassword = 'Cinnamoroll'.toLowerCase(); // Convert correct password to lowercase
    const message = document.getElementById('message');
    const incorrectRedirectURL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    if (password === correctPassword) {
        window.location.href = 'https://drive.google.com/drive/folders/1F577zy-4obR9neERc7GFheW4SPczQtc7?usp=sharing';
    } else {
        const sanitizedMessage = sanitizeOutput('Incorrect password, redirecting...');
        message.innerHTML = sanitizedMessage;
        setTimeout(() => {
            window.location.href = incorrectRedirectURL;
        }, 2000); // Redirects after 2 seconds
    }
}

// Countdown Timer
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    const targetDate = new Date('June 30, 2024 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = "THE ALBUM IS OUT. THE CORRECT PASSWORD WILL NOW REDIRECT TO THE DELUXE VERSION.";
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
