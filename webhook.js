// Replace 'YOUR_USERNAME' and 'YOUR_REPOSITORY' with your GitHub username and repository name
const GITHUB_API_URL = 'https://api.github.com/repos/milkywaydotmoe/milkyweb/events';

function updateCommitInfo(event) {
    // Extract commit information from the event
    const commitHash = event.payload.commits[0].sha.substring(0, 7); // Truncate to 7 characters
    const commitMessage = event.payload.commits[0].message;
    const commitAuthorName = event.payload.commits[0].author.name;
    const commitAuthorEmail = event.payload.commits[0].author.email;
    let commitAuthor = commitAuthorName;
    let commitEmail = commitAuthorEmail || 'N/A';
    const commitInfo = `<strong>Commit: </strong>${commitMessage}<br><strong>Hash: </strong>${commitHash}<br><strong>Author: </strong>${commitAuthor}<br><strong>Email: </strong>${commitEmail}`;
    document.getElementById('commit-info').innerHTML = commitInfo;
}

async function fetchGitHubEvents() {
    try {
        const response = await fetch(GITHUB_API_URL);
        const events = await response.json();
        
        // Assuming events is an array of GitHub events
        events.forEach(event => {
            if (event.type === 'PushEvent') {
                updateCommitInfo(event);
                // Stop processing events after finding a PushEvent
                return;
            }
        });
    } catch (error) {
        console.error('Error fetching GitHub events:', error);
    }
}

// Call the function to fetch GitHub events
fetchGitHubEvents();

// Optionally, you could set an interval to periodically fetch events
setInterval(fetchGitHubEvents, 60000); // Fetch events every 6 seconds
