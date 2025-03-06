// posts.js - Dynamic Content Loader
document.addEventListener('DOMContentLoaded', function() {
    // Initial cleanup of placeholder brackets
    cleanPlaceholderBrackets();

    // Fetch content and populate
    fetchPosts()
        .then(posts => {
            const validPosts = Array.isArray(posts) ? posts : [];
            populateFeaturedPost(validPosts.find(post => post.index === 0)); // Post 0 is featured
            populateSidebar(validPosts);
            updateDynamicLinks(validPosts.find(post => post.index === 0)); // Post 0 for dynamic links
            updatePostImages(validPosts); // Update post images
        })
        .catch(error => {
            console.error('Content loading error:', error);
            populateFeaturedPost();
            populateSidebar();
            updateDynamicLinks(); // Fallback for dynamic links
            updatePostImages(); // Fallback for post images
        });
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
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('Using placeholder data due to fetch error:', error);
        return null;
    }
}

function populateFeaturedPost(postData) {
    const featuredPostPlaceholder = {
        header: "Loading latest post...",
        subheader: "Loading latest post...",
        postDate: "Loading...",
        tags: "Loading...",
        thumbnail: "featured-placeholder.jpg",
        alttext: "Loading latest post...",
        summary: "Loading latest post... Please be patient...",
        link: "#"
    };

    const data = postData || featuredPostPlaceholder;
    
    // Update featured post elements
    setElementContent('[data-placeholder="header"]', data.header);
    setElementContent('[data-placeholder="subheader"]', data.subheader);
    setElementContent('[data-placeholder="post-date"]', data.postDate);
    setElementContent('[data-placeholder="tags"]', data.tags);
    setElementContent('[data-placeholder="summary"]', data.summary);
    
    // Set image attributes
    const img = document.querySelector('[data-placeholder="thumbnail"]');
    if (img) {
        img.src = data.thumbnail;
        img.alt = data.alttext || '';
    }
}

function populateSidebar(posts = []) {
    const sidebarPlaceholder = {
        header: "No older posts available...",
        postDate: "...",
        link: "#"
    };

    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Find all <li> elements with IDs p1, p2, p3, etc.
    sidebar.querySelectorAll('li[id^="p"]').forEach(li => {
        const postId = li.id.replace('p', ''); // Extract the number from the ID
        const postIndex = parseInt(postId, 10); // Convert to integer
        const postData = posts.find(post => post.index === postIndex) || sidebarPlaceholder;

        // Update the sidebar item
        setElementContent('[data-placeholder="sidebar-header"]', postData.header, li);
        setElementContent('[data-placeholder="sidebar-date"]', postData.postDate, li);
        
        const link = li.querySelector('[data-placeholder="sidebar-link"]');
        if (link) {
            link.href = postData.link;

            // Disable the link if it's a placeholder
            if (postData === sidebarPlaceholder) {
                link.setAttribute('aria-disabled', 'true');
                link.classList.add('disabled-link');
                link.href = "#"; // Ensure the link doesn't go anywhere
            } else {
                link.removeAttribute('aria-disabled');
                link.classList.remove('disabled-link');
            }
        }
    });
}

function updateDynamicLinks(postData) {
    const placeholderLink = postData?.link || "#"; // Fallback to "#" if no data

    document.querySelectorAll('a.dynalink').forEach(link => {
        // Skip links with href="#"
        if (link.href === "#") return;

        // Replace placeholder hrefs
        if (link.href.includes('[') && link.href.includes(']')) {
            link.href = link.href
                .replace(/\[Link to most recent post\]/g, placeholderLink)
                .replace(/\[|\]/g, ''); // Clean any remaining brackets
        }
    });
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