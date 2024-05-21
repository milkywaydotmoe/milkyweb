const serverEndpoint = 'wss://scrobbled.tepiloxtl.net/ws/get_recent_tracks/milkywaydotmoe'; // WebSocket endpoint
const fallbackAlbumArt = [
    'https://example.com/fallback1.png',
    'https://example.com/fallback2.png',
    'https://example.com/fallback3.png',
    'https://example.com/fallback4.png',
    'https://example.com/fallback5.png',
    'https://example.com/fallback6.png'
];

function getRandomFallbackAlbumArt() {
    const randomIndex = Math.floor(Math.random() * fallbackAlbumArt.length);
    return fallbackAlbumArt[randomIndex];
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    }
    return text;
}

function getAlbumArtFromWebSocket(lastTrack) {
    const priority = ['extralarge', 'large', 'medium', 'small'];
    for (const size of priority) {
        const img = lastTrack.image.find((img) => img.size === size);
        if (img && img['#text']) {
            return img['#text'];
        }
    }
    return null; // If no image is found
}

let ws;
let reconnectInterval;
let isConnected = false;
let lastDataHash = '';

function connectWebSocket() {
    ws = new WebSocket(serverEndpoint);

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        isConnected = true;

        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }

        requestUpdate();
        setInterval(requestUpdate, 10000);
    };

    ws.onmessage = (event) => {
        console.log('Data received from WebSocket:', event.data);
        processWebSocketMessage(event.data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.warn('WebSocket connection closed');
        isConnected = false;

        if (!reconnectInterval) {
            reconnectInterval = setInterval(connectWebSocket, 10000);
        }
    };
}

function requestUpdate() {
    if (isConnected) {
        console.log("Requesting update from WebSocket");
        ws.send('REQUEST_UPDATE');
    }
}

function processWebSocketMessage(data) {
    try {
        const parsedData = JSON.parse(data);
        const dataHash = JSON.stringify(parsedData);

        if (dataHash !== lastDataHash) {
            updateTrackInfo(parsedData);
            lastDataHash = dataHash;
        }
    } catch (error) {
        console.error("Error parsing WebSocket data:", error);
    }
}

function updateTrackInfo(data) {
    const trackInfoContainer = document.getElementById('track-info-container');

    if (!trackInfoContainer) {
        console.error("Element with ID 'track-info-container' not found");
        return;
    }

    if (data.recenttracks && data.recenttracks.track.length > 0) {
        const lastTrack = data.recenttracks.track[0];
        const trackName = lastTrack.name || 'Unknown Track';
        const artistName = lastTrack.artist['name'] || 'Unknown Artist';
        const albumName = lastTrack.album['#text'] || 'Unknown Album';

        const lovedSymbol = lastTrack.loved === '1' ? '❤️' : '';

        const albumArtUrl = getAlbumArtFromWebSocket(lastTrack) || getRandomFallbackAlbumArt();

        const recentTracksList = data.recenttracks.track.slice(1, 6);
        const tracksHTML = recentTracksList.map((track) => {
            const name = truncateText(track.name || 'Unknown Track', 20);
            const artist = truncateText(track.artist['name'] || 'Unknown Artist', 20);
            const loved = track.loved === '1' ? '❤️' : '';
            return `<li>${name} - ${artist} ${loved}</li>`;
        }).join('');

        trackInfoContainer.innerHTML = `
            <div class="track-container">
                <div class="album-art">
                    <img src="${albumArtUrl}" alt="${trackName} album art" onerror="this.src='${getRandomFallbackAlbumArt()}'" />
                </div>
                <div class="track-details">
                    <strong>Now Playing:</strong> <br>
                    <strong class="track-title">${trackName} ${lovedSymbol}</strong> <br>
                    <span class="track-subtext">${artistName} - ${albumName}</span> <br><br>
                    <strong>Recently Played:</strong>
                    <ul>${tracksHTML}</ul>
                </div>
            </div>
        `;
    } else {
        trackInfoContainer.innerText = 'No recent tracks found';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
});
