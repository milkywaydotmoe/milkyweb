// === ONIONRING-VARIABLES ===
// This file contains the stuff you edit to set up your specific webring

// Fetch sites from an external file
var sites = [];

fetch('sites.txt')
  .then(response => response.text())
  .then(text => {
    sites = text.split('\n').map(site => site.trim()).filter(site => site.length > 0);
  })
  .catch(error => console.error('Error loading sites:', error));

// The name of the ring
var ringName = 'OnlineWire';

// The unique ID of the widget
var ringID = 'onlinewire-webring';

// Should the widget include a link to an index page?
var useIndex = true;
var indexPage = 'https://milkyway.moe/onlinewire/index.html';

// Should the widget include a random button?
var useRandom = true;
