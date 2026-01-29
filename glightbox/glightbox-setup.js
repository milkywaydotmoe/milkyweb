const glightbox = GLightbox(); // initializing the glightbox gallery variable

// if you want multiple separate galleries on single html page
// initialize more variables like this
// const glightbox2 = GLightbox();

function setupGallery(lightbox, selector) {

    // if a gallery is already set up, destroy it first to avoid errors
    if (lightbox) {
        lightbox.destroy();
    }

    // set up a new gallery
    lightbox = GLightbox({
        selector: `.${selector}`, // images with the selector class will be added to gallery
    });
}

// set up the gallery when the page loads
document.addEventListener("DOMContentLoaded", function () {

    // chosen selector class for images is glightbox
    setupGallery(glightbox, "glightbox");

    // if you want multiple separate galleries on single html page
    // set up every gallery with a different selector
    // setupGallery(glightbox2, "glightbox2");

});