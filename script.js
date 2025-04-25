// 1) mood words per slot
const moodWords = {
    morning: ['Energizer', 'Sunburst', 'Lively', 'Radiant', 'Motivated'],
    afternoon: ['Focus', 'Flow', 'Chill', 'Groove', 'Steady'],
    evening: ['Dreamy', 'Mellow', 'Calm', 'Soothing', 'Easy']
};

// 2) elements
const ring = document.getElementById('mood-ring');
const moodDisplay = document.getElementById('mood-display');
const trackList = document.getElementById('track-list');
const createButton = document.getElementById('create-playlist');

// 3) helpers
function getTimeOfDay() {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return 'morning';
    if (h >= 12 && h < 18) return 'afternoon';
    return 'evening';
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// 4) main
let currentTracks = [];  // store URIs for create flow

async function generatePlaylist() {
    ring.style.transform = 'scale(0.93)';
    setTimeout(() => ring.style.transform = '', 150);

    const slot = getTimeOfDay();
    const word = getRandom(moodWords[slot]);
    moodDisplay.textContent = `${word} Vibes`;

    // parse CSV
    const url = `Data/${slot}.csv`;
    const { data } = await new Promise(res => {
        Papa.parse(url, {
            download: true, header: true, skipEmptyLines: true,
            complete: res
        });
    });

    // pick and render
    const picks = shuffle(data).slice(0, 20);
    currentTracks = picks
        .map(s => s.spotify_track_uri)
        .filter(uri => uri && uri.startsWith('spotify:track:'));

    trackList.innerHTML = picks.map(s => {
        const name = s.master_metadata_track_name;
        const artist = s.master_metadata_album_artist_name;
        const uri = s.spotify_track_uri.replace('spotify:track:', 'https://open.spotify.com/track/');
        return `<li><a href="${uri}" target="_blank">${name} — ${artist}</a></li>`;
    }).join('');

    createButton.classList.remove('hidden');
}

// 5) Spotify playlist creation (skeleton)
async function createSpotifyPlaylist() {
    // You'll need to implement OAuth (implicit or code flow) to get a user token.
    // Then you can call:
    //
    // 1) GET https://api.spotify.com/v1/me to fetch user.id
    // 2) POST https://api.spotify.com/v1/users/{user.id}/playlists
    //    body: { name: `My Mood Ring ${new Date().toLocaleString()}`, public: false }
    // 3) POST https://api.spotify.com/v1/playlists/{playlist.id}/tracks
    //    body: { uris: currentTracks }
    //
    // Finally, window.open(playlist.external_urls.spotify)
    //
    alert('To fully create a Spotify playlist you’ll need to wire up OAuth + the Web API.');
}

// 6) event listeners
ring.addEventListener('click', generatePlaylist);
createButton.addEventListener('click', createSpotifyPlaylist);
