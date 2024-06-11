window.onload = function() {
    fetch("links.json")
        .then(response => response.json())
        .then(data => {
            const entries = data.links;
            const rowCountElement = document.querySelector("strong");
            rowCountElement.textContent = entries.length;

            const tableBody = document.getElementById("directory").querySelector("tbody");
            entries.forEach(entry => {
                const { Name: name, Link: link, Description: description, Category: category, ID: id } = entry;

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
            });

            // Add event listeners for sorting
            const headers = document.querySelectorAll("#directory th");
            headers.forEach((header, index) => {
                header.addEventListener("click", () => {
                    sortTable(index);
                });
            });

            // Add event listener for search input
            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", () => {
                searchTable();
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    function sortTable(columnIndex) {
        const tableBody = document.querySelector("#directory tbody");
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim().toLowerCase();
            const bValue = b.cells[columnIndex].textContent.trim().toLowerCase();
            return aValue.localeCompare(bValue);
        });
        tableBody.innerHTML = ""; // Clear table body
        rows.forEach(row => tableBody.appendChild(row)); // Re-append sorted rows
    }

    function searchTable() {
        const searchInput = document.getElementById("searchInput");
        const searchTerm = searchInput.value.trim().toLowerCase();
        const rows = document.querySelectorAll("#directory tbody tr");
        rows.forEach(row => {
            const name = row.querySelector(".url").textContent.trim().toLowerCase();
            const desc = row.querySelector(".desc").textContent.trim().toLowerCase();
            const category = row.querySelector(".cat").textContent.trim().toLowerCase();
            if (name.includes(searchTerm) || desc.includes(searchTerm) || category.includes(searchTerm)) {
                row.style.display = ""; // Show the row
            } else {
                row.style.display = "none"; // Hide the row
            }
        });
    }

    function createCell(content, link, category, isNameCell) {
        const cell = document.createElement("td");
        cell.className = isNameCell ? "url" : "cat";
        if (link && isNameCell) {
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
