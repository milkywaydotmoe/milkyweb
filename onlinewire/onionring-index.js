// onionring.js is made up of four files - onionring-widget.js, onionring-index.js (this one!), onionring-variables.js, and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (蒜) house, last updated 2020-11-24

// === ONIONRING-INDEX ===
// this file builds the list of sites in the ring for displaying on your index page

var tag = document.getElementById('index');
var regex = /^https:\/\/|\/$/g; // strips the https:// and trailing slash off the URLs for aesthetic purposes

fetch('sites.txt')
  .then(response => response.text())
  .then(text => {
    var sites = text.split('\n').map(line => line.trim()).filter(line => line);
    
    var list = "";
    for (var i = 0; i < sites.length; i++) {
      list += `<li><a href='${sites[i]}' onmouseover="document.getElementById('hover').play()" onclick="delayLink(event, '${sites[i]}')">${sites[i].replace(regex, "")}</a></li>`;
    }

    tag.insertAdjacentHTML('afterbegin', `
      <ul>
      ${list}
      </ul>
    `);
  })
  .catch(error => console.error('Error loading sites:', error));
