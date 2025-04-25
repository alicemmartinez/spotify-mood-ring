// Replace this with your Spotify API token
const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN';

// Moods associated with each month
const moods = {
    "January": {
        mood: "Happy and Energetic",
        artists: ["Artist1", "Artist2"],
        playlist: ["Song1", "Song2", "Song3"],
        moodArt: "path_to_artwork.jpg"
    },
    "February": {
        mood: "Calm and Relaxed",
        artists: ["Artist3", "Artist4"],
        playlist: ["Song4", "Song5", "Song6"],
        moodArt: "path_to_artwork2.jpg"
    },
    // Add more months here...
};

// Handle mood ring click
document.getElementById('mood-ring').addEventListener('click', function () {
    const randomMonth = getRandomMonth();
    displayMood(randomMonth);
});

// Function to get a random month (you can add your own logic for monthly selection)
function getRandomMonth() {
    const months = Object.keys(moods);
    const randomIndex = Math.floor(Math.random() * months.length);
    return months[randomIndex];
}

// Function to display mood, description, and playlist
function displayMood(month) {
    const moodData = moods[month];

    // Display mood description
    document.getElementById('description-text').innerText = moodData.mood;

    // Display mood artwork
    const artDiv = document.getElementById('mood-art');
    artDiv.innerHTML = `<img src="${moodData.moodArt}" alt="Mood Artwork">`;

    // Display playlist
    const playlistItems = document.getElementById('playlist-items');
    playlistItems.innerHTML = ''; // Clear any existing items
    moodData.playlist.forEach(song => {
        const li = document.createElement('li');
        li.innerText = song;
        playlistItems.appendChild(li);
    });

    // You can fetch actual Spotify data here if needed, using their API
    // Example: fetchSpotifyData(month);
}

// Example of fetching Spotify data (you need a valid access token)
function fetchSpotifyData(month) {
    fetch(`https://api.spotify.com/v1/me/top/artists`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Process the data and update the page as needed
        })
        .catch(err => console.log(err));
}
