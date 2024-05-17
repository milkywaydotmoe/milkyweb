// WebSocket endpoint and a set of fallback album art images
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

function getAlbumArt(lastTrack, callback) {
    const existingArt = getAlbumArtFromWebSocket(lastTrack);
    if (existingArt) {
        callback(existingArt);
        return;
    }

    const artistName = lastTrack.artist['name'];
    const albumName = lastTrack.album['#text'];

    // Start with Fanart.tv, then Discogs, CoverArtArchive, iTunes, and finally fallback
    fetchFromFanartTV(artistName, albumName, (imageUrl) => {
        if (imageUrl) {
            callback(imageUrl);
        } else {
            fetchFromDiscogs(artistName, albumName, (imageUrl) => {
                if (imageUrl) {
                    callback(imageUrl);
                } else {
                    fetchFromCoverArtArchive(artistName, albumName, (imageUrl) => {
                        if (imageUrl) {
                            callback(imageUrl);
                        } else {
                            fetchFromiTunes(artistName, albumName, (imageUrl) => {
                                if (imageUrl) {
                                    callback(imageUrl);
                                } else {
                                    // If all fail, use a random fallback
                                    callback(getRandomFallbackAlbumArt());
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// Fetch from Fanart.tv
function fetchFromFanartTV(artistName, albumName, callback) {
    const fanartTVEndpoint = `https://webservice.fanart.tv/v3/music/${encodeURIComponent(artistName)}/albums?api_key=YOUR_FANART_TV_API_KEY`;

    fetch(fanartTVEndpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from Fanart.tv: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const album = data.albums?.find((album) => album.name.toLowerCase() === albumName.toLowerCase());
            const imageUrl = album?.musicbanner || null;
            callback(imageUrl);
        })
        .catch((error) => {
            console.error("Error fetching from Fanart.tv:", error);
            callback(null); // Continue to the next step if failed
        });
}

// Fetch from Discogs
function fetchFromDiscogs(artistName, albumName, callback) {
    const discogsEndpoint = `https://api.discogs.com/database/search?artist=${encodeURIComponent(artistName)}&release_title=${encodeURIComponent(albumName)}&key=YOUR_DISCOGS_CONSUMER_KEY&secret=YOUR_DISCOGS_CONSUMER_SECRET`;

    fetch(discogsEndpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from Discogs: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const release = data.results?.find((r) => r.type === 'album');
            const imageUrl = release?.cover_image || null;
            callback(imageUrl);
        })
        .catch((error) => {
            console.error("Error fetching from Discogs:", error);
            callback(null); // Continue to the next step if failed
        });
}

// Fetch from Cover Art Archive
function fetchFromCoverArtArchive(artistName, albumName, callback) {
    const musicBrainzEndpoint = `https://musicbrainz.org/ws/2/release-group/?query=artist:${encodeURIComponent(artistName)} AND release:${encodeURIComponent(albumName)}&fmt=json`;

    fetch(musicBrainzEndpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from MusicBrainz: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const releaseGroups = data.release_groups;
            if (releaseGroups && releaseGroups.length > 0) {
                const firstGroup = releaseGroups[0];
                const coverArtEndpoint = `https://coverartarchive.org/release-group/${firstGroup.id}`;
                return fetch(coverArtEndpoint);
            } else {
                throw new Error("No release groups found");
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from Cover Art Archive: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const imageUrl = data.images?.[0]?.image || null;
            callback(imageUrl);
        })
        .catch((error) => {
            console.error("Error fetching from Cover Art Archive:", error);
            callback(null); // Continue to the next step if failed
        });
}

// Fetch from iTunes Album Art Database
function fetchFromiTunes(artistName, albumName, callback) {
    const itunesEndpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName + " " + albumName)}&entity=album`;

    fetch(itunesEndpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from iTunes: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const album = data.results?.find((album) => album.collectionName.toLowerCase() === albumName.toLowerCase());
            const imageUrl = album?.artworkUrl100?.replace('100x100', '600x600') || null;
            callback(imageUrl);
        })
        .catch((error) => {
            console.error("Error fetching from iTunes:", error);
            callback(null); // If all fails, use fallback
        });
}

// Utility function to get album art from WebSocket data
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

// WebSocket setup
let ws;
let reconnectInterval;
let isConnected = false;
let lastDataHash = ''; // To track the last received data

function connectWebSocket() {
    ws = new WebSocket(serverEndpoint);

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        isConnected = true;

        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }

        // Request the latest data immediately after connecting
        requestUpdate();

        // Set a periodic message to request the latest data every 10 seconds
        setInterval(requestUpdate, 10000); // 10-second interval
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

        // Attempt to reconnect every 10 seconds
        if (!reconnectInterval) {
            reconnectInterval = setInterval(connectWebSocket, 10000);
        }
    };
}

function requestUpdate() {
    if (isConnected) {
        console.log("Requesting update from WebSocket");
        ws.send('REQUEST_UPDATE'); // Send a request for new data
    }
}

function processWebSocketMessage(data) {
    try {
        const parsedData = JSON.parse(data);
        const dataHash = JSON.stringify(parsedData);

        if (dataHash !== lastDataHash) {
            updateTrackInfo(parsedData); // Refresh display with new data
            lastDataHash = dataHash; // Store the hash of the current data
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

        const lovedSymbol = lastTrack.loved === '1' ? '❤️' : ''; // Check if the track is loved

        getAlbumArt(lastTrack, (albumArtUrl) => {
            const recentTracksList = data.recenttracks.track.slice(1, 6); // Get the next five tracks
            const tracksHTML = recentTracksList.map((track) => {
                const name = track.name || 'Unknown Track';
                const artist = track.artist['name'] || 'Unknown Artist';
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
        });
    } else {
        trackInfoContainer.innerText = 'No recent tracks found';
    }
}

// Start the WebSocket connection
connectWebSocket();
