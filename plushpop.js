const audio = new Audio("/assets/1derhoy.ogg");
audio.volume = 0.5;

function togglePopupImage() {
  const popup = document.getElementById("popupImage");
  if (!popup) return console.error("#popupImage not found");

  const isHidden = popup.style.display === "none" || popup.style.display === "";
  popup.style.display = isHidden ? "block" : "none";

  if (isHidden) {
    audio.currentTime = 0;
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".title").forEach(el => {
    el.addEventListener("click", togglePopupImage);
  });
});