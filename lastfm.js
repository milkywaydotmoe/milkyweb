// Set your Last.FM API key here
const apiKey = '26e670494b7620e9f19dce30768aa484'; // Replace with your Last.FM API key
const userName = 'milkywaydotmoe';
const apiEndpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${userName}&api_key=${apiKey}&format=json`;

// Default fallback image in case of missing or broken album art
const fallbackAlbumArt = 'https://file.garden/ZgvLyuxekygVJeux/other%20assets/mkt.png'; // URL for a default image (optional)

// Function to fetch and display Last.FM data
function fetchLastFmData() {
    fetch(apiEndpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const lastTrackInfo = document.getElementById('last-track-info');
            const recentTracks = document.getElementById('recent-tracks');

            if (data.recenttracks && data.recenttracks.track.length > 0) {
                const lastTrack = data.recenttracks.track[0];
                const trackName = lastTrack.name;
                const artistName = lastTrack.artist['#text'];
                const albumName = lastTrack.album['#text'] || 'Unknown Album';

                // Get the album art from the largest available size with fallback to smaller images
                let albumArtUrl =
                    lastTrack.image.find((img) => img.size === 'extralarge')['#text'] ||
                    lastTrack.image.find((img) => img.size === 'large')['#text'] ||
                    lastTrack.image.find((img) => img.size === 'medium')['#text'] ||
                    lastTrack.image.find((img) => img.size === 'small')['#text'] ||
                    fallbackAlbumArt; // Fallback image in case all are missing

                lastTrackInfo.innerHTML = `
                    <div class="track-container">
                        <div class="album-art">
                            <img src="${albumArtUrl}" alt="${trackName} album art" onerror="this.src='${fallbackAlbumArt}'" />
                        </div>
                        <div class="track-details">
                            <strong>Now Playing:</strong> <br>
                            <strong class="track-title">${trackName}</strong> <br>
                            <span class="track-subtext">${artistName} - ${albumName}</span>
                        </div>
                    </div>
                `;

                // Display the five most recent tracks excluding the first one (most recent)
                const recentTracksList = data.recenttracks.track.slice(1, 6); // Get the next five tracks
                const tracksHTML = recentTracksList
                    .map((track) => {
                        const name = track.name;
                        const artist = track.artist['#text'];
                        return `<li>${name} - ${artist}</li>`;
                    })
                    .join('');

                recentTracks.innerHTML = `
                    <strong>Recently Played:</strong>
                    <ul>${tracksHTML}</ul>
                `;
            } else {
                lastTrackInfo.innerText = 'No recent tracks found';
            }
        })
        .catch((err) => {
            console.error('Error fetching Last.FM data:', err);
            document.getElementById('last-track-info').innerText = 'Error fetching track data';
        });
}

// Fetch data initially
fetchLastFmData();