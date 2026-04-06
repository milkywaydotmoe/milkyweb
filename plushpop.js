// ==========================
// CONFIGURATION
// ==========================
const AUDIO_SRC = "/assets/1derhoy.ogg";
const DEFAULT_IMAGE_URL = "https://disk.milkyway.moe/web/other%20assets/stelle_scrunk.avif";
const RARE_IMAGE_URL = "https://disk.milkyway.moe/web/other%20assets/june-proud.avif";
const POPUP_ID = "popupImage";

// Initialize audio once (and set volume)
let audio = new Audio(AUDIO_SRC);
audio.volume = 0.5;

/**
 * Toggles the popup visibility and manages audio/image logic.
 * - Only changes image when opening (hidden → visible)
 * - 10% chance to show rare variant on open
 * - Resets audio position & plays on open, pauses on close
 */
function togglePopupImage() {
  const popup = document.getElementById(POPUP_ID);
  
  // Safety: exit if element not found
  if (!popup) return console.error(`#${POPUP_ID} not found in DOM`);

  // Determine current state: is it hidden?
  const isHidden = popup.style.display === "none" || popup.style.display === "";
  
  // Toggle visibility
  popup.style.display = isHidden ? "block" : "none";

  if (isHidden) {
    // 👉 POPUP IS BEING OPENED (hidden → visible)
    
    // 🎨 10% chance to show rare image
    const useRareImage = Math.random() < 0.1;
    popup.src = useRareImage 
      ? RARE_IMAGE_URL 
      : DEFAULT_IMAGE_URL;

    // 🎧 Audio: reset & play
    audio.currentTime = 0;
    
    // Handle potential autoplay blocking (e.g., in some browsers)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("Autoplay blocked. User interaction required:", error);
      });
    }

    // Optional: log for debugging
    console.log(`Popup opened. ${useRareImage ? "🔥 RARE image loaded!" : "Default image"}`);
  } else {
    // 👉 POPUP IS BEING CLOSED (visible → hidden)
    
    audio.pause();
    audio.currentTime = 0;
    console.log("Popup closed. Audio paused & reset.");
  }
}

// ==========================
// EVENT LISTENER INITIALIZATION
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(".title");
  
  if (titles.length === 0) {
    console.warn('No elements with class ".title" found — togglePopupImage will not be triggered.');
  }

  titles.forEach(el => {
    el.addEventListener("click", (e) => {
      // Prevent accidental double-firing from nested elements (optional)
      e.stopPropagation();
      togglePopupImage();
    });
  });

  console.log(`✅ JS initialized. Ready to toggle popup & play audio.`);
});