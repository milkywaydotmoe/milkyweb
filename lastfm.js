var _0x7a6a=["\x37\x65\x61\x31\x62\x34\x65\x37\x38\x63\x66\x65\x66\x35\x36\x62\x37\x30\x37\x64\x64\x39\x65\x32\x38\x34\x35\x34\x31\x37\x39\x36","\x6D\x69\x6C\x6B\x79\x77\x61\x79\x64\x6F\x74\x6D\x6F\x65"];const API_KEY=_0x7a6a[0];const USERNAME=_0x7a6a[1];const POLLING_INTERVAL=5000

// Construct the URL to fetch recent tracks from Last.fm API
const recentScrobblesUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json`; // Semicolon added

// Function to fetch recent scrobbles from Last.fm
async function fetchRecentScrobbles() {
  try {
    console.log("Fetching recent scrobbles...");
    const response = await fetch(recentScrobblesUrl); // Send request to Last.fm API
    if (!response.ok) { // Check if response is successful
      throw new Error("Failed to fetch scrobbles"); // Throw error if not successful
    }
    const data = await response.json(); // Parse the response as JSON
    console.log("Fetched data:", data); // Log the fetched data for debugging
    updateTrackInfo(data); // Pass the data to the update function
  } catch (error) {
    console.error("Error fetching scrobbles:", error); // Log any error that occurs
  }
}

// Function to update the track info on the page based on fetched data
function updateTrackInfo(data) {
  const trackInfoContainer = document.getElementById('track-info-container');

  // Check if the container exists in the DOM
  if (!trackInfoContainer) {
    console.error("Element with ID 'track-info-container' not found");
    return; // Exit if the container is not found
  }

  // Check if the API returned valid recent tracks
  if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
    const lastTrack = data.recenttracks.track[0]; // Get the latest track

    // Extract the track, artist, and album names, handling missing values
    const trackName = lastTrack.name || 'Unknown Track';
    const artistName = lastTrack.artist['#text'] || 'Unknown Artist';
    const albumName = lastTrack.album['#text'] || 'Unknown Album';

    // Check if the track is loved and add the heart symbol if true
    const lovedSymbol = lastTrack["@attr"] && lastTrack["@attr"].liked === "1" ? '❤️' : '';

    // Get the album art for the current track (fall back to default if not found)
    const albumArtUrl = lastTrack.image ? lastTrack.image[3]["#text"] : 'default-album-art.jpg'; // Large size image

    // Get the next 5 recent tracks and create a list to display
    const recentTracksList = data.recenttracks.track.slice(1, 6);
    const tracksHTML = recentTracksList.map((track) => {
      const name = truncateText(track.name || 'Unknown Track', 20); // Truncate track name to 20 characters
      const artist = truncateText(track.artist['#text'] || 'Unknown Artist', 20); // Truncate artist name to 20 characters
      const loved = track["@attr"]?.liked === '1' ? '❤️' : ''; // Add heart symbol if loved
      return `<li>${name} - ${artist} ${loved}</li>`; // Return track details in list item format
    }).join(''); // Join the list items into a single string

    // Update the inner HTML of the container with the track and album information
    trackInfoContainer.innerHTML = `
      <div class="track-container">
        <div class="album-art">
          <img src="${albumArtUrl}" alt="${trackName} album art" onerror="this.onerror=null; this.src='${getRandomFallbackAlbumArt()}'" />
        </div>
        <div class="track-details">
          <strong>Now Playing:</strong> <br>
          <strong class="track-title rain" style="padding: 1px;">${trackName} ${lovedSymbol}</strong> <br>
          <span class="track-subtext">${artistName} - ${albumName}</span> <br><br>
          <strong>Recently Played:</strong>
          <ul>${tracksHTML}</ul>
        </div>
      </div>
    `;
  } else {
    // If no tracks are found, show a message in the container
    trackInfoContainer.innerText = 'No recent tracks found';
    console.log("No recent tracks found"); // Log the empty result for debugging
  }
}

// Function to handle text truncation (used for track and artist names)
function truncateText(text, length) {
  return text.length > length ? text.substring(0, length) + '...' : text; // Truncate text if it exceeds the specified length
}

// Function to handle fallback album art when the original is missing or fails to load
function getRandomFallbackAlbumArt() {
  return 'default-album-art.jpg'; // Return a default fallback image
}

// Start polling for updates by calling the fetch function initially and periodically
function startPolling() {
  console.log("Starting polling for updates...");
  fetchRecentScrobbles(); // Fetch the first batch of scrobbles
  setInterval(fetchRecentScrobbles, POLLING_INTERVAL); // Set interval to fetch new scrobbles periodically
}

// Call the polling function on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Document loaded, starting polling...");
  startPolling(); // Start polling once the document is loaded
});
