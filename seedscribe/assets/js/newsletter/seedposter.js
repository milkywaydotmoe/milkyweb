// seedposter.js - A Client-side Dynamic Semi-CMS for static sites, written by MiLKY
// Written for the Seedscribe website.

document.addEventListener('DOMContentLoaded', function () {
    // Initial cleanup of placeholder brackets
    cleanPlaceholderBrackets();

    // Show loading placeholder immediately
    const loadingPlaceholder = {
        header: "Loading latest post...",
        subheader: "Loading latest post...",
        postDate: "Loading...",
        tags: "Loading...",
        thumbnail: "loading-placeholder.jpg", // Use a loading spinner or placeholder image
        alttext: "Loading latest post...",
        summary: "Loading latest post... Please be patient...",
        link: "#"
    };
    populateFeaturedPost(loadingPlaceholder);

    // Flag to track if data was successfully fetched
    let dataFetched = false;

    // Set a timeout for the featured post
    let featuredPostTimeout = setTimeout(() => {
        // Only proceed with the fallback if data was not fetched within 10 seconds
        if (!dataFetched) {
            const fallbackPlaceholder = {
                header: "No featured post available",
                subheader: "Please check back later...",
                postDate: "N/A",
                tags: "none",
                thumbnail: "fallback-placeholder.jpg",
                alttext: "No featured post available",
                summary: "We're currently updating our content. Please check back soon!",
                link: "#"
            };
            populateFeaturedPost(fallbackPlaceholder);
            populateSidebar([]); // Pass an empty array to show error state in the sidebar
        }
    }, 10000); // 10 seconds

    // Fetch content and populate with retry mechanism
    const maxRetries = 3; // Maximum number of retries
    const retryDelay = 2000; // Delay between retries in milliseconds
    let retryCount = 0;

    const fetchWithRetry = async () => {
        try {
            const posts = await fetchPosts();
            dataFetched = true; // Mark data as fetched
            clearTimeout(featuredPostTimeout); // Clear the timeout as data is now loaded

            const validPosts = Array.isArray(posts) ? posts : [];
            populateFeaturedPost(validPosts.find(post => post.index === 0)); // Post 0 is featured
            populateSidebar(validPosts);
            updatePostImages(validPosts); // Update post images
        } catch (error) {
            retryCount++;
            if (retryCount < maxRetries) {
                console.warn(`Fetch failed. Retrying (${retryCount}/${maxRetries})...`);
                setTimeout(fetchWithRetry, retryDelay); // Retry after a delay
            } else {
                console.error('Content loading error:', error);
                clearTimeout(featuredPostTimeout); // Clear the timeout

                // Only show the error placeholder if 10 seconds have passed and data was not fetched
                if (!dataFetched) {
                    const errorMessage = getErrorMessage(error);
                    const errorPlaceholder = {
                        header: "Sorry, we couldn't load the content.",
                        subheader: "Please check back later...",
                        postDate: "N/A",
                        tags: "none",
                        thumbnail: "images/placeholders/error_tbn.png",
                        alttext: "Error loading content",
                        summary: errorMessage,
                        link: "#"
                    };
                    populateFeaturedPost(errorPlaceholder);
                    populateSidebar([]); // Pass an empty array to show error state in the sidebar
                }
            }
        }
    };

    fetchWithRetry(); // Start the fetch process
});

function cleanPlaceholderBrackets() {
    // Clean text placeholders
    document.querySelectorAll('[data-placeholder]').forEach(el => {
        el.textContent = el.textContent.replace(/\[|\]/g, '');
    });

    // Clean href placeholders
    document.querySelectorAll('a.dynalink').forEach(link => {
        if (link.href.includes('[') && link.href.includes(']')) {
            link.href = link.href.replace(/\[|\]/g, '');
        }
    });
}

async function fetchPosts() {
    try {
        const response = await fetch('/assets/js/newsletter/posts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('Fetch error:', error);
        throw error; // Re-throw the error for handling in the retry mechanism
    }
}


function getErrorMessage(error) {
    if (error.message.includes('404')) {
        return "Oops! We couldn’t find the page you were looking for. Please check the link and try again. If the issue persists, please report it using the contact details below.";
    } else if (error.message.includes('network timeout')) {
        return "It looks like there was a delay in loading the content. Please check your internet connection and try again. If the issue continues, feel free to report it using the contact details below.";
    } else if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        return "Sorry, we were unable to load some content due to a connection issue. Please try again later. If the issue persists, please report it using the contact details below.";
    } else {
        return "Something went wrong while loading the content. Please try again later, and we apologize for the inconvenience. If this keeps happening, please report it using the contact details below.";
    }
}

function populateFeaturedPost(postData) {
    const loadingPlaceholder = {
        header: "Loading latest post...",
        subheader: "Loading latest post...",
        postDate: "Loading...",
        tags: "Loading...",
        thumbnail: "featured-placeholder.jpg", // Default placeholder image
        alttext: "Loading latest post...",
        summary: "Loading latest post... Please be patient...",
        link: "#"
    };

    // Use either the loaded post data or the loading placeholder
    const data = postData || loadingPlaceholder;
    
    // Update featured post header
    const headerLink = document.querySelector('.feathead');
    if (headerLink) {
        // Clear any existing content in the container
        headerLink.innerHTML = '';

        // Create a new <h3> element
        const hcont = document.createElement('h3');

        // Create a new <a> element
        const htext = document.createElement('a');
        htext.href = data.link;
        htext.textContent = data.header;
        htext.classList.add('dynalink');

        // Append the <a> element to the <h3> element
        hcont.appendChild(htext);

        // Append the <h3> element to the container
        headerLink.appendChild(hcont);
    } else {
        console.error("Could not inject header!");
    }

    setElementContent('[data-placeholder="subheader"]', data.subheader);
    setElementContent('[data-placeholder="post-date"]', data.postDate);
    setElementContent('[data-placeholder="tags"]', data.tags);
    setElementContent('[data-placeholder="summary"]', data.summary);
    
    // Inject the thumbnail image into the div with class "thumbcont"
    const thumbContainer = document.querySelector('.thumbcont');
    if (thumbContainer) {
        // Clear any existing content in the container
        thumbContainer.innerHTML = '';

        // Create a new <a> element
        const tnlink = document.createElement('a');
        tnlink.href = data.link;
        tnlink.classList.add('image', 'featured', 'dynalink');

        // Create a new <img> element
        const tnimg = document.createElement('img');
        tnimg.src = data.thumbnail;
        tnimg.alt = data.alttext || '';
        tnimg.classList.add('image', 'featured'); // Add the classes 'image' and 'featured'

        // Append the <img> element to the <a> element
        tnlink.appendChild(tnimg);

        // Append the <a> element to the container
        thumbContainer.appendChild(tnlink);
    } else {
        console.error("Could not inject thumbnail!");
    }

    // Inject the thumbnail image into the div with class "thumbcont"
    const btnContainer = document.querySelector('.cont-reading');
    if (btnContainer) {
        // Clear any existing content in the container
        btnContainer.innerHTML = '';

        // Create a new a element
        const a = document.createElement('a');
        a.href = data.link;
        a.textContent = "Continue reading";
        a.classList.add('button', 'dynalink');

        // Append the a element to the container
        btnContainer.appendChild(a);
    } else {
        console.error("Could not inject button!");
    }
}

function populateSidebar(posts = []) {
    const sidebarPlaceholder = {
        header: "No older posts available...",
        postDate: "...",
        link: "#"
    };

    // Find all <li> elements with the class "side-posts" and IDs like p1, p2, etc.
    document.querySelectorAll('li.side-posts[id^="p"]').forEach((li) => {
        // Extract the index from the ID (e.g., "p1" -> 1)
        const index = parseInt(li.id.replace('p', ''), 10); // Convert to integer

        // Skip p0 (reserved for the featured article)
        if (index === 0) return;

        // Adjust the index to match the posts array (p1 -> posts[1], p2 -> posts[2], etc.)
        const postData = posts[index] || sidebarPlaceholder;

        // Clear any existing content in the <li>
        li.innerHTML = '';

        // Create the <article> element
        const article = document.createElement('article');
        article.classList.add('box', 'post-summary');

        // Create the <h3> element
        const h3 = document.createElement('h3');

        // Create the <a> element for the header link
        const headerLink = document.createElement('a');
        headerLink.href = postData.link;
        headerLink.textContent = postData.header;
        headerLink.classList.add('dynalink');

        // Append the <a> to the <h3>
        h3.appendChild(headerLink);

        // Create the <ul> for the meta information
        const ul = document.createElement('ul');
        ul.classList.add('meta');

        // Create the <i> element for the calendar icon
        const icon = document.createElement('i');
        icon.classList.add('nf', 'nf-md-calendar_edit');

        // Create the <li> element for the date
        const dateLi = document.createElement('li');
        dateLi.textContent = postData.postDate;

        // Append the icon and date to the <ul>
        ul.appendChild(icon);
        ul.appendChild(dateLi);

        // Append the <h3> and <ul> to the <article>
        article.appendChild(h3);
        article.appendChild(ul);

        // Append the <article> to the <li>
        li.appendChild(article);
    });
}

function updateContinueReading(postData) {
    const placeholderLink = postData?.link || "#"; // Fallback to "#" if no data

    // Find the container where the dynamic link should be injected
    const linkContainer = document.querySelector('.cont-reading'); // Replace with your container's class or ID
    if (!linkContainer) {
        console.error("Button not found!");
        return;
    }

    // Clear any existing content in the container
    linkContainer.innerHTML = '';

    // Create a new <a> element
    const link = document.createElement('a');
    link.href = placeholderLink;
    link.textContent = "Continue reading"; // Customize the link text
    link.classList.add('button dynalink'); // Add any necessary classes

    // Append the <a> element to the container
    linkContainer.appendChild(link);
}

function updatePostImages(posts = []) {
    const imagePlaceholder = {
        thumbnail: "placeholder.jpg",
        alttext: "Placeholder image"
    };

    const imagePosts = document.querySelectorAll('img.imgposts');
    imagePosts.forEach((img, index) => {
        const postData = posts.find(post => post.index === index) || imagePlaceholder;

        img.src = postData.thumbnail;
        img.alt = postData.alttext || '';
    });
}

// Helper function to safely set content
function setElementContent(selector, content, parent = document) {
    const element = parent.querySelector(selector);
    if (element) element.textContent = content;
}
