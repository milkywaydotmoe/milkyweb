window.onload = function () {
  fetch("data.txt")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data.txt: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(text => {
      // Parse and clean lines: trim whitespace, remove empty lines
      const lines = text
        .trim()
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

      const container = document.getElementById("profiles-container");

      let profileCount = 0;
      let row;

      // Helper to create a new row and reset counter
      function createNewRow() {
        if (row) {
          // Add a line break after each row (as in original)
          row.appendChild(document.createElement("br"));
        }
        row = document.createElement("div");
        row.classList.add("row");
        container.appendChild(row);
        profileCount = 0;
      }

      lines.forEach(line => {
        // Start a new row every 6 profiles, and at the beginning
        if (profileCount === 0 || profileCount === 6) {
          createNewRow();
        }

        try {
          const { name, image, site } = JSON.parse(line);

          // Create profile card container
          const profileCard = document.createElement("div");
          profileCard.classList.add("profile");

          // Image element
          const img = document.createElement("img");
          img.src = image;
          img.alt = name;

          // Overlay (title)
          const overlay = document.createElement("div");
          overlay.classList.add("overlay");
          overlay.textContent = name;

          // Assemble the card
          profileCard.appendChild(img);
          profileCard.appendChild(overlay);

          // Add click handler to navigate to site
          profileCard.addEventListener("click", () => {
            window.location.href = site;
          });

          // Append to current row
          row.appendChild(profileCard);

          profileCount++;

        } catch (error) {
          console.error(`Skipping invalid JSON line: "${line.substring(0, 80)}..."`, error);
        }
      });

      // Final line break if needed (original added one after *every* profile group)
      if (row) {
        row.appendChild(document.createElement("br"));
      }
    })
    .catch(error => {
      console.error("Error fetching or processing data:", error);
    });
};