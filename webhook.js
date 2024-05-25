const GITHUB_API_URL = 'https://api.github.com/repos/milkywaydotmoe/milkyweb/events?timestamp=' + new Date().getTime();

function updateCommitInfo(event) {
    // Extract commit information from the event
    const commitHash = event.payload.commits[0].sha.substring(0, 6); // Truncate to 6 characters
    const commitMessage = event.payload.commits[0].message;
    const commitAuthorName = event.payload.commits[0].author.name;
    const commitAuthorEmail = event.payload.commits[0].author.email;
    let commitAuthor = commitAuthorName;
    let commitEmail = commitAuthorEmail || 'N/A';
    const commitInfo = `<strong>Commit: </strong>${commitMessage}<br><strong>Hash: </strong>${commitHash}<br><strong>Author: </strong>${commitAuthor}<br><strong>Email: </strong>${commitEmail}`;
    document.getElementById('commit-info').innerHTML = commitInfo;
}

async function fetchGitHubEvents(url) {
    try {
        const response = await fetch(url);
        const events = await response.json();
        
        // Assuming events is an array of GitHub events
        events.forEach(event => {
            if (event.type === 'PushEvent') {
                updateCommitInfo(event);
                // Stop processing events after finding a PushEvent
                return;
            }
        });

        // Check if the response has a 'Link' header and if it contains a 'rel="next"' link
        const linkHeader = response.headers.get('Link');
        if (linkHeader && linkHeader.includes('rel="next"')) {
            // Extract the URL for the next page
            const nextPageUrl = linkHeader.match(/<([^>]+)>;\s*rel="next"/)[1];
            // Fetch the next page recursively
            await fetchGitHubEvents(nextPageUrl);
        }
    } catch (error) {
        console.error('Error fetching GitHub events:', error);
    }
}



// Call the function to fetch GitHub events
fetchGitHubEvents(GITHUB_API_URL);

// Optionally, you could set an interval to periodically fetch events
setInterval(() => fetchGitHubEvents(GITHUB_API_URL), 6000); // Fetch events every 6 seconds
