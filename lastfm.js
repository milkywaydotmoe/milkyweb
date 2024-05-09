const serverEndpoint = 'wss://scrobbled.tepiloxtl.net/ws/get_recent_tracks/milkywaydotmoe'; // WebSocket endpoint
const fallbackAlbumArt = 'https://file.garden/ZgvLyuxekygVJeux/other%20assets/mkt.png';

let ws;
let reconnectInterval;
let isConnected = false;

function connectWebSocket() {
    ws = new WebSocket(serverEndpoint);

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        isConnected = true;

        if (reconnectInterval) {
            clearInterval(reconnectInterval); // Clear reconnection attempts
            reconnectInterval = null;
        }
    };

    ws.onmessage = (event) => {
        console.log('Data received from WebSocket:', event.data);
        try {
            const data = JSON.parse(event.data);
            updateTrackInfo(data); // Refresh display with new data
        } catch (error) {
            console.error('Error parsing WebSocket data:', error);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.warn('WebSocket connection closed');
        isConnected = false;

        if (!reconnectInterval) {
            // Try to reconnect every 10 seconds
            reconnectInterval = setInterval(connectWebSocket, 10000);
        }
    };
}

function updateTrackInfo(data) {
    const trackInfoContainer = document.getElementById('track-info-container');
    
    if (!trackInfoContainer) {
        console.error("Element with ID 'track-info-container' not found");
        return;
    }

    if (data.recenttracks && data.recenttracks.track.length > 0) {
        const lastTrack = data.recenttracks.track[0];
        const trackName = lastTrack.name;
        const artistName = lastTrack.artist['#text'];
        const albumName = lastTrack.album['#text'] || 'Unknown Album';

        const albumArtUrl =
            lastTrack.image.find((img) => img.size === 'extralarge')['#text'] ||
            lastTrack.image.find((img) => img.size === 'large')['#text'] ||
            lastTrack.image.find((img) => img.size === 'medium')['#text'] ||
            lastTrack.image.find((img) => img.size === 'small')['#text'] ||
            fallbackAlbumArt;

        const recentTracksList = data.recenttracks.track.slice(1, 6); // Get the next five tracks
        const tracksHTML = recentTracksList
            .map((track) => {
                const name = track.name;
                const artist = track.artist['#text'];
                return `<li>${name} - ${artist}</li>`;
            })
            .join('');

        trackInfoContainer.innerHTML = `
            <div class="track-container">
                <div class="album-art">
                    <img src="${albumArtUrl}" alt="${trackName} album art" onerror="this.src='${fallbackAlbumArt}'" />
                </div>
                <div class="track-details">
                    <strong>Now Playing:</strong> <br>
                    <strong class="track-title">${trackName}</strong> <br>
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

// Initial connection to WebSocket server
connectWebSocket();
