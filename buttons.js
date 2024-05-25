document.addEventListener("DOMContentLoaded", function() {
  let currentPage = 1;
  let totalPages = 1;

  // Function to load content from external HTML file
  function loadPage(pageNumber) {
    fetch(`buttons/season${pageNumber}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Page not found');
        }
        return response.text();
      })
      .then(html => {
        document.getElementById('buttons').innerHTML = html;
        currentPage = pageNumber;
        updatePageNavigation();
      })
      .catch(error => console.error('Error loading page:', error));
  }

  // Function to update page navigation links
  function updatePageNavigation() {
    const currentPageElement = document.getElementById('currentPage');
    const prevPageLink = document.getElementById('prevPage');
    const nextPageLink = document.getElementById('nextPage');

    currentPageElement.textContent = currentPage;

    // Update previous and next page links
    if (currentPage === 1) {
      prevPageLink.removeAttribute('href');
      prevPageLink.classList.add('disabled');
    } else {
      prevPageLink.href = `buttons/season${currentPage - 1}.html`;
      prevPageLink.classList.remove('disabled');
    }

    if (currentPage === totalPages) {
      nextPageLink.removeAttribute('href');
      nextPageLink.classList.add('disabled');
    } else {
      nextPageLink.href = `buttons/season${currentPage + 1}.html`;
      nextPageLink.classList.remove('disabled');
    }
  }


  // Load initial page
  loadPage(currentPage);

  // Event listeners for previous and next page links
  document.getElementById('prevPage').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage > 1) {
      loadPage(currentPage - 1);
    }
  });

  document.getElementById('nextPage').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
  });

  // Get total number of pages asynchronously
  getTotalPages().then(total => {
    totalPages = total;
  });

  // Function to get total number of pages
  function getTotalPages() {
    let totalPages = 1;
    return new Promise((resolve, reject) => {
      const checkPageExists = () => {
        fetch(`buttons/season${totalPages + 1}.html`)
          .then(response => {
            if (!response.ok) {
              resolve(totalPages);
            } else {
              totalPages++;
              checkPageExists();
            }
          })
          .catch(() => {
            resolve(totalPages);
          });
      };
      checkPageExists();
    });
  }

});
