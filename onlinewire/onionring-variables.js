// onionring.js is made up of four files - onionring-widget.js, onionring-index.js, onionring-variables.js (this one!), and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (蒜) house, last updated 2020-11-24

// === ONIONRING-VARIABLES ===
//this file contains the stuff you edit to set up your specific webring

//the full URLs of all the sites in the ring
var sites = [
'https://milkyway.moe/',
'https://ddnikki.moe',
'https://rhzartist.neocities.org/',
'https://sonnenboy.eu/',
'https://pastel-skies.nekoweb.org',
'https://astracelestine.nekoweb.org/',
'https://bang1338.nekoweb.org',
'https://lel.nekoweb.org',
'https://mechagic.pages.gay',
'https://xan.lol',
'https://beaus-silly-folder.nekoweb.org',
'https://mytreehouse.nekoweb.org',
'https://alexzeecomedy.com',
'https://stupied.neocities.org',
'https://s1nez.nekoweb.org',
'https://backtick.nekoweb.org',
'https://squircle.computer/',
'https://r3ckoning.nekoweb.org',
'https://riri.my/',
'https://machetebot.github.io',
'https://willascool.neocities.org',
'https://valycenegative.it',
'https://samsolarsystem.neocities.org',
'https://prigoana.com',
'https://www.virtualgirl.net',
'https://twentyphanday.nekoweb.org',
'https://cvnnbl.neocities.org',
'https://bundleofstyx.neocities.org',
'https://baccyflap.com',
'https://yvas.me',
'https://ytd.wtf',
'https://gr13f3r.com',
'https://bisq.neocities.org',
'https://nandraid.moe'
];

//the name of the ring
var ringName = 'OnlineWire';

/* the unique ID of the widget. two things to note:
 1) make sure there are no spaces in it - use dashes or underscores if you must
 2) remember to change 'webringid' in the widget code you give out and all instances of '#webringid' in the css file to match this value!*/
var ringID = 'onlinewire-webring';

//should the widget include a link to an index page?
var useIndex = true;
//the full URL of the index page. if you're not using one, you don't have to specify anything here
var indexPage = 'https://milkyway.moe/onlinewire/index.html';

//should the widget include a random button?
var useRandom = true;
