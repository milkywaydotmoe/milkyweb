const e = document.getElementById(“unix-time-placeholder”);
function updateUnixTime() {
    const t = (Date.now() / 1000 | 0).toString(16).toUpperCase();
    e.textContent = t;
}
setInterval(updateUnixTime, 1000);
updateUnixTime();