const GITHUB_API_URL = 'https://api.github.com/repos/milkywaydotmoe/milkyweb/events';
const NEKOWEB_API_URL = 'https://nekoweb.org/api/site/info/milkyway';

function updateCommitInfo(commit, timeSinceLastUpdate) {
    const commitHash = commit.sha.substring(0, 7); // Truncate to 7 characters
    let commitMessage = commit.message;

    // Truncate the commit message if it exceeds 128 characters
    if (commitMessage.length > 128) {
        commitMessage = commitMessage.substring(0, 64) + '...';
    }

    const commitAuthorName = commit.author.name;
    const commitAuthorEmail = commit.author.email;
    let commitAuthor = commitAuthorName;
    let commitEmail = commitAuthorEmail || 'N/A';
    const commitInfo = `<strong>Commit: </strong>${commitMessage}<br><strong>Hash: </strong>${commitHash}<br><strong>Author: </strong>${commitAuthor}<br><strong>Email: </strong>${commitEmail}<br><strong>Time Since Last Update: </strong>${timeSinceLastUpdate}`;
    document.getElementById('commit-info').innerHTML = commitInfo;
}

async function fetchGitHubRepoInfo() {
    try {
        const response = await fetch(GITHUB_API_URL);
        const data = await response.json();
        return data.updated_at;
    } catch (error) {
        console.error('Error fetching GitHub repo info:', error);
        return null;
    }
}

function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

async function fetchGitHubEvents() {
    try {
        const response = await fetch(GITHUB_API_URL);
        const events = await response.json();
        console.log(events); // Log the events to see its structure
        const pushEvent = events.find(event => event.type === 'PushEvent');
        
        if (pushEvent && pushEvent.payload && pushEvent.payload.commits.length > 0) {
            const latestCommit = pushEvent.payload.commits[0];
            const updatedAt = await fetchGitHubRepoInfo();
            const timeSinceLastUpdate = updatedAt ? timeSince(updatedAt) : 'N/A';
            updateCommitInfo(latestCommit, timeSinceLastUpdate);
        }
    } catch (error) {
        console.error('Error fetching GitHub events:', error);
    }
}

fetchGitHubEvents();

setInterval(fetchGitHubEvents, 6000);
