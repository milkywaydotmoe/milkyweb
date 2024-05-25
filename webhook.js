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

        // Check if there are more pages and fetch them if needed
        const nextPageUrl = response.headers.get('Link').split(',').find(link => link.includes('rel="next"'));
        if (nextPageUrl) {
            await fetchGitHubEvents(nextPageUrl.split(';')[0].slice(1, -1));
        }
    } catch (error) {
        console.error('Error fetching GitHub events:', error);
    }
}

// Call the function to fetch GitHub events
fetchGitHubEvents(GITHUB_API_URL);

// Optionally, you could set an interval to periodically fetch events
setInterval(() => fetchGitHubEvents(GITHUB_API_URL), 6000); // Fetch events every 6 seconds
