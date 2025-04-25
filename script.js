// 1) Fortune-teller mood words
const moodWords = {
    morning: ['Awakening', 'Clarity', 'Radiance', 'Insight', 'Dawnlight'],
    afternoon: ['Flow', 'Revelation', 'Guidance', 'Serendipity', 'Focus'],
    evening: ['Mystic', 'Dreamtime', 'Eclipse', 'Twilight', 'Starlight']
};

// 2) Element refs
const scene = document.getElementById('scene');
const ring = document.getElementById('mood-ring');
const panel = document.getElementById('playlist-panel');
const moodDisplay = document.getElementById('mood-display');
const trackList = document.getElementById('track-list');

// 3) Helpers
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
function msToTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

// 4) Main generate routine
async function generatePlaylist() {
    // 1. animate ring + show panel
    scene.classList.add('active');

    // 2. pick a mood slot and word
    const slot = getTimeOfDay();
    const word = getRandom(moodWords[slot]);
    moodDisplay.textContent = `${word} Vibes`;

    // 3. set ring color class
    ring.classList.remove('morning', 'afternoon', 'evening');
    ring.classList.add(slot);

    // 4. load CSV
    const url = `Data/${slot}.csv`;
    const { data } = await new Promise(res => {
        Papa.parse(url, {
            download: true, header: true, skipEmptyLines: true,
            complete: res
        });
    });

    // 5. choose 20 random tracks
    const picks = shuffle(data).slice(0, 20);

    // 6. render list using a normal hyphen
    trackList.innerHTML = picks.map(s => {
        let name = s.master_metadata_track_name.replace(/\uFFFD/g, '');
        let artist = s.master_metadata_album_artist_name.replace(/\uFFFD/g, '');
        let uri = s.spotify_track_uri.startsWith('spotify:track:')
            ? s.spotify_track_uri.replace('spotify:track:', 'https://open.spotify.com/track/')
            : '#';
        let len = msToTime(+s.ms_played || 0);
        return `<li>
          <a href="${uri}" target="_blank">${name} - ${artist}</a>
          <span class="length">${len}</span>
        </li>`;
    }).join('');
}

// 5) Wire it up
ring.addEventListener('click', generatePlaylist);
