// Cookie management functions
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Dark mode toggle function
var buttonState = 0;
function toggleStylesheet() {
    var stylesheet = document.getElementById("stylesheet");
    var toggleButton = document.getElementById("toggleButton");
    if (stylesheet.getAttribute("href") === "index_lite.css") {
        stylesheet.setAttribute("href", "index_dark.css");
        toggleButton.src = "day.png";
        buttonState = 1;
    } else {
        stylesheet.setAttribute("href", "index_lite.css");
        toggleButton.src = "night.png";
        buttonState = 0;
    }
    setCookie("darkMode", buttonState, 7); // Save the preference in a cookie for 7 days
}

// Load the saved preference on page load
window.onload = function() {
    var darkMode = getCookie("darkMode");
    var stylesheet = document.getElementById("stylesheet");
    var toggleButton = document.getElementById("toggleButton");
    if (darkMode == 1) {
        stylesheet.setAttribute("href", "index_dark.css");
        toggleButton.src = "day.png";
        buttonState = 1;
    } else {
        stylesheet.setAttribute("href", "index_lite.css");
        toggleButton.src = "night.png";
        buttonState = 0;
    }
};
