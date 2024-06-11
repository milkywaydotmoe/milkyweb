window.onload = function() {
    fetch("links.txt")
        .then(response => response.text())
        .then(data => {
            console.log("Data fetched:", data); // Log the raw data
            const entries = parseEntries(data);
            console.log("Parsed entries:", entries); // Log parsed entries
            const tableBody = document.getElementById("directory").querySelector("tbody");
            let rowCount = 0;

            // Determine the highest ID
            const highestId = Math.max(...entries.map(profile => parseInt(profile.ID)));
            console.log("Highest ID:", highestId);

            // Initialize an array with null values up to the highest ID
            const profilesArray = new Array(highestId).fill(null);

            // Populate the array with the entries based on their ID
            entries.forEach(profile => {
                if (profile.ID) {
                    const id = parseInt(profile.ID) - 1; // Convert ID to zero-based index
                    profilesArray[id] = profile;
                }
            });

            // Process each profile in the array
            profilesArray.forEach(profile => {
                if (profile) {
                    console.log("Processing profile:", profile);
                    const { Name: name, Link: link, Description: description, Category: category, ID: id } = profile;

                    const row = document.createElement("tr");
                    row.className = category;
                    row.id = id;

                    const nameCell = createCell(name, link, category, true);
                    const descCell = createDescriptionCell(description, category);
                    const categoryCell = createCell(category, "", category, false);

                    row.appendChild(nameCell);
                    row.appendChild(descCell);
                    row.appendChild(categoryCell);

                    tableBody.appendChild(row);

                    rowCount++;
                }
            });

            // Update the number of links in the header
            const linkCountElement = document.querySelector("strong");
            linkCountElement.textContent = rowCount;
        })
        .catch(error => console.error("Error fetching data:", error));

    function parseEntries(data) {
        const entries = data.trim().split("\n\n"); // Split by double newlines
        console.log("Entries after split:", entries); // Log split entries
        return entries.map(entry => parseEntry(entry)).filter(profile => profile.ID);
    }

    function parseEntry(entry) {
        const lines = entry.split("\n");
        console.log("Lines for entry:", lines); // Log lines of each entry
        const profile = {};
        lines.forEach(line => {
            const [key, value] = line.split(": ");
            if (key && value) {
                profile[key.trim()] = value.trim();
            }
        });
        console.log("Parsed profile:", profile); // Log parsed profile
        return profile;
    }

    function createCell(content, link, category, isNameCell) {
        const cell = document.createElement("td");
        cell.className = isNameCell ? "url" : "cat";
        if (link) {
            const linkElement = document.createElement("a");
            linkElement.href = link;
            linkElement.target = "_blank";
            linkElement.textContent = content;
            cell.appendChild(linkElement);
        } else {
            cell.textContent = content;
        }
        if (category && !isNameCell) {
            cell.dataset.attr = category;
        }
        return cell;
    }

    function createDescriptionCell(description, category) {
        const cell = document.createElement("td");
        cell.className = "desc";

        const descDiv = document.createElement("div");
        descDiv.className = "desc";
        descDiv.textContent = description;
        cell.appendChild(descDiv);

        const tagsDiv = document.createElement("div");
        tagsDiv.className = "itemTags";
        tagsDiv.innerHTML = `<strong>Tags: </strong>`;
        category.split(', ').forEach(tag => {
            const tagLink = document.createElement("a");
            tagLink.href = 'index.html#';
            tagLink.className = 'myTags';
            tagLink.dataset.tagId = tag;
            tagLink.textContent = tag;
            tagsDiv.appendChild(tagLink);
            tagsDiv.appendChild(document.createTextNode(" "));
        });
        cell.appendChild(tagsDiv);

        return cell;
    }
};
