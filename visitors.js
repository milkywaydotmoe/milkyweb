///
// Visitor Count by netfriend - https://netfriend.neocities.org/visitor-count/
// Released under the Unlicense - https://unlicense.org
///

///
// SETTINGS
///

// Visitor count source: "neocities" or "goatcounter"
const visitor_count_source = "goatcounter";

// Neocities username (for overall site hits)
const neocities_site_name = "";

// GoatCounter domain (e.g. "mywebsite.goatcounter.com")
const gc_domain_name = "milkywaymoe.goatcounter.com";

// GoatCounter page path:
// ""       → current page
// "TOTAL"  → entire site
// "/page"  → specific page
const gc_count_path = "TOTAL";

// CSS selector where the counter will be inserted
const visitor_count_selector = ".visitor-count";

// Path to digit images (must contain 0.png–9.png)
const digit_image_path = "/counternum/";

///
/// CODE
///
// Don't edit below this line unless you know what you're doing!
///

(function () {

  let stats_url;    // URL to fetch visitor data from
  let info_parser;  // Function to extract the count from returned JSON

  // -------------------------
  // NEOCITIES SETUP
  // -------------------------
  if (visitor_count_source.toLowerCase() === "neocities") {

    stats_url = `https://weirdscifi.ratiosemper.com/neocities.php?sitename=${neocities_site_name}`;

    // Parse Neocities API response
    info_parser = function (data) {
      if (data.result === "error") {
        throw new Error(
          `${visitor_count_source.toLowerCase()} visitor counter reported an error: ${data.message}`
        );
      }

      // Ensure the value is a number
      return parseInt(data.info.views, 10);
    };
  }

  // -------------------------
  // GOATCOUNTER SETUP
  // -------------------------
  if (visitor_count_source.toLowerCase() === "goatcounter") {

    const path = gc_count_path || window.location.pathname;
    stats_url = `https://milkywaymoe.goatcounter.com/counter/TOTAL.json`;

    // GoatCounter already returns a number
    info_parser = function (data) {
    // GoatCounter returns formatted strings like "1 601"
    const raw = data.count || data.count_unique || "0";
      // Remove non-digit characters (like spaces)
    const cleaned = raw.replace(/\D/g, "");
    return parseInt(cleaned, 10);
  };

  }

  // -------------------------
  // FETCH VISITOR DATA
  // -------------------------
  fetch(stats_url)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        throw new Error(
          `${visitor_count_source.toLowerCase()} visitor counter reported a 404 Not Found error. Please check the settings.`
        );
      }
    })
    .then(info_parser)

    // Log errors but don't break the page
    .catch(function (error) {
      console.error(
        "%c Visitor Count ",
        "background: #000; color: #fff; font-weight: bold",
        error
      );
      throw new Error("Failed to get visitor count. See previous errors.");
    })

    // -------------------------
    // RENDER DIGIT IMAGES
    // -------------------------
    .then(function (count) {

      // Safety check to avoid NaN
      if (!Number.isFinite(count)) {
        throw new Error("Visitor count is not a valid number.");
      }

      const elements = document.querySelectorAll(
        visitor_count_selector || ".visitor-count"
      );

      elements.forEach(function (item) {

        // Clear existing content
        item.innerHTML = "";

        // Optional inline layout styling
        item.style.display = "flex";
        item.style.justifyContent = "center";
        item.style.gap = "2px";

        // Convert number to digits and render images
        String(count).split("").forEach(function (digit) {
          const img = document.createElement("img");
          img.className = "visitor-digit";
          img.src = `${digit_image_path}${digit}.png`;
          img.alt = digit;
          item.appendChild(img);
        });
      });

    });

}());
