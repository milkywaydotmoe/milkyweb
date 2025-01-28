// onionring.js is made up of four files - onionring-widget.js, onionring-index.js, onionring-variables.js (this one!), and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (蒜) house, last updated 2020-11-24

// === ONIONRING-VARIABLES ===
//this file contains the stuff you edit to set up your specific webring

//the full URLs of all the sites in the ring
// Define an empty array for the sites
var sites = [];

// Load the sites from a text file (sites.txt)
fetch('sites.txt')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    // Split the text file content by newlines and populate the sites array
    sites = data.split('\n').map(site => site.trim()).filter(site => site.length > 0);
  })
  .catch(error => {
    console.error('Error loading sites:', error);
  });

//the name of the ring
var ringName = 'OnlineWire';

/* the unique ID of the widget. two things to note:
 1) make sure there are no spaces in it - use dashes or underscores if you must
 2) remember to change 'webringid' in the widget code you give out and all instances of '#webringid' in the css file to match this value!*/
var ringID = 'onlinewire-webring';

//should the widget include a link to an index page?
var useIndex = false;
//the full URL of the index page. if you're not using one, you don't have to specify anything here
var indexPage = 'https://milkyway.moe/onlinewire.html';

//should the widget include a random button?
var useRandom = true;
