///
// Visitor Count by netfriend - https://netfriend.neocities.org/visitor-count/
// Released under the Unlicense - https://unlicense.org
///

///
// SETTINGS
///

// Where you want your visitor count information to
// come from.
// The options are "neocities" and "goatcounter".

const visitor_count_source = "goatcounter";

// If you're using Neocities for your visitor count
// information, change this to your Neocities username.
// It will show the website's overall hit count.

const neocities_site_name = "";

// If you're using GoatCounter, change this to your
// GoatCounter domain name,
// e.g. "mywebsite.goatcounter.com"

const gc_domain_name = "milkywaymoe.goatcounter.com";

// For GoatCounter users, if you want to show the
// visitor count of a different page on your website,
// change this to the path of that page.
// e.g. to show the visitor count of
// https://example.com/links.html, change it to
// "/links.html".
// To show the visitor count of the entire website,
// change it to "TOTAL".
// If left blank, the script will default to the
// current page.

const gc_count_path = "/";

// Where you want the visitor number to be inserted.
// This uses a CSS selector and adds the number to the
// end of every matching element.
// By default, it will do this to every element with
// the class "visitor-count".

const visitor_count_selector = ".visitor-count";

///
// CODE
///
// Don't edit below this line unless you know what you're doing!
///

(function () {

let stats_url;
let info_parser;

if ( visitor_count_source.toLowerCase() === "neocities" ) {
  stats_url = `https://weirdscifi.ratiosemper.com/neocities.php?sitename=${neocities_site_name}`;
  info_parser = function (data) {
    if ( data.result === "error" ) {
      throw new Error(`${visitor_count_source.toLowerCase()} visitor counter reported an error: ${data.message}`);
    } else {
      return parseInt(data.info.views, 10);
    }
  }
}

if ( visitor_count_source.toLowerCase() === "goatcounter" ) {
  stats_url = `https://${gc_domain_name}/counter/${gc_count_path || window.location.pathname}.json`;
  info_parser = (data) => parseInt(data.count_unique.replace(/\D/g, ""), 10);
}

fetch(stats_url)
  .then(function (response) {
    console.log(response.status);
    if ( response.ok ) {
      return response.json();
    } else if ( response.status === 404 ) {
      throw new Error(`${visitor_count_source.toLowerCase()} visitor counter reported a 404 Not Found error. Please check the settings.`);
    }
  })
  .then(info_parser)
  .catch((error) => {
    console.error("%c Visitor Count ", "background: #000; color: #fff; font-weight: bold", `${error}`);
    throw new Error("Failed to get visitor count. See previous errors.")
  })
  .then(function (count) {
    const visitor_count_elements = document.querySelectorAll(visitor_count_selector || ".visitor-count");
    visitor_count_elements.forEach((item) => item.appendChild(document.createTextNode(count)));
  });
}());
