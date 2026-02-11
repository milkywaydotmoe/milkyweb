// Bang1338's TODO: Add function that update these value 
let minBnrPage = 1; 
let maxBnrPage = 2; 

document.addEventListener("DOMContentLoaded", function() {
  let currentPage = 1;
  let totalPages = 2;

  // Function to load content from external HTML file
  function loadPage(pageNumber) {
    fetch(`banners/page${pageNumber}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Page not found');
        }
        return response.text();
      })
      .then(html => {
        document.getElementById('banners').innerHTML = html;
        currentPage = pageNumber;
        updatePageNavigation();
        preloadAdjacentPages(pageNumber);
      })
      .catch(error => console.error('Error loading page:', error));
  }

  // Function to update page navigation links
  function updatePageNavigation() {
    const currentPageElement = document.getElementById('currentbnPage');
    const prevPageLink = document.getElementById('prevbnPage');
    const nextPageLink = document.getElementById('nextbnPage');

    currentPageElement.textContent = currentPage;

    prevPageLink.classList.toggle('disabled', currentPage === 1);
    nextPageLink.classList.toggle('disabled', currentPage === totalPages);

    prevPageLink.href = currentPage > 1 ? `#${currentPage - 1}` : '#';
    nextPageLink.href = currentPage < totalPages ? `#${currentPage + 1}` : '#';
  }

  // Preload adjacent pages
  function preloadAdjacentPages(pageNumber) {
    if (pageNumber > 1) {
      fetch(`banners/page${currentPage - 1}.html`).catch(() => {});
    }
    if (pageNumber < totalPages) {
      fetch(`banners/page${currentPage + 1}.html`).catch(() => {});
    }
  }

  // Debounce function to limit the rate of calls
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Load initial page
  loadPage(currentPage);

  // Event listeners for previous and next page links
  // Bang1338: If currentPage = 1 and press prevPage, 
  //           snap back to last page and vice versa
  document.getElementById('prevbnPage').addEventListener('click', debounce(function(event) {
    event.preventDefault();
    if (currentPage > 1) {
      loadPage(currentPage - 1);
    }
    if (currentPage == 1) {
      loadPage(maxBnrPage); // 4 (maybe and hopefully)
    }
  }, 200));

  document.getElementById('nextbnPage').addEventListener('click', debounce(function(event) {
    event.preventDefault();
    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
    if (currentPage == maxBnrPage) {
      loadPage(minBnrPage); // 1
    }
  }, 200));

  // Get total number of pages asynchronously
  getTotalPages().then(total => {
    totalPages = total;
    updatePageNavigation();
  });

  // Function to get total number of pages
  function getTotalPages() {
    return new Promise((resolve, reject) => {
      const checkPageExists = async () => {
        let pageChecks = [];
        let page = 1;
        while (true) {
          const response = await fetch(`banners/page${page}.html`);
          if (!response.ok) break;
          pageChecks.push(Promise.resolve(page));
          page++;
        }
        resolve(pageChecks.length);
      };
      checkPageExists();
    });
  }

  // Milky: automatically flips to the next page every 10 seconds (unless the user hovers over a button)
  // Bang1338: imma place TNT
  let tnt;
  function startTNT() {
    // console.log("TNT has been planted");
    tnt = setInterval(() => {
      const nextPageBnr = document.getElementById('nextbnPage');
      nextPageBnr.click();
      // console.log("kaBOOM!!!!!!!!!!");
    }, 10000)
  };
  
  let isMouseHover = false
  let bannerElement = document.querySelector('#banners');
  bannerElement.addEventListener("mouseleave", function (event) {
    isMouseHover = false
    startTNT();
    // console.log("TNT started again");
  }, false);
  bannerElement.addEventListener("mouseover", function (event) {
    isMouseHover = true
    clearInterval(tnt);
    // console.log("TNT defused");
  }, false);
  startTNT(); // start that thing
});