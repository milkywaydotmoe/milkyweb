const GITHUB_API_URL = 'https://api.github.com/repos/milkywaydotmoe/milkyweb/events';

function updateCommitInfo(commit) {
    const commitHash = commit.sha.substring(0, 7); // Truncate to 7 characters
    const commitMessage = commit.message;
    const commitAuthorName = commit.author.name;
    const commitAuthorEmail = commit.author.email;
    let commitAuthor = commitAuthorName;
    let commitEmail = commitAuthorEmail || 'N/A';
    const commitInfo = `<strong>Commit: </strong>${commitMessage}<br><strong>Hash: </strong>${commitHash}<br><strong>Author: </strong>${commitAuthor}<br><strong>Email: </strong>${commitEmail}`;
    document.getElementById('commit-info').innerHTML = commitInfo;
}

async function fetchGitHubEvents() {
    try {
        const response = await fetch(GITHUB_API_URL);
        const events = await response.json();
        
        // Find the most recent PushEvent
        const pushEvent = events.find(event => event.type === 'PushEvent');
        
        if (pushEvent && pushEvent.payload && pushEvent.payload.commits.length > 0) {
            // Get the latest commit from the most recent PushEvent
            const latestCommit = pushEvent.payload.commits[0];
            updateCommitInfo(latestCommit);
        }
    } catch (error) {
        console.error('Error fetching GitHub events:', error);
    }
}

// Call the function to fetch GitHub events
fetchGitHubEvents();

// Optionally, you could set an interval to periodically fetch events
setInterval(fetchGitHubEvents, 60000); // Fetch events every 60 seconds
