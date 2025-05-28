// List of image objects with src and alt text
const images = [
    { src: '/assets/logos/1.png', alt: 'Logo 1' },
    { src: '/assets/logos/2.png', alt: 'Logo 2' },
    { src: '/assets/logos/3.png', alt: 'Logo 3' }
    // Add more as needed
];

// Pick a random image
const randomIndex = Math.floor(Math.random() * images.length);
const selectedImage = images[randomIndex];

// Apply src and alt to the <img id="title">
const img = document.getElementById('title');
img.src = selectedImage.src;
img.alt = selectedImage.alt;
</script>

<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
const noJsImage = document.querySelector('.no-js-image');
if (noJsImage) {
    noJsImage.style.display = 'none';
}
});
