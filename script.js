// script.js

// 1) Mood words & color palettes
const moodWords = {
    morning: ['Awakening', 'Clarity', 'Radiance', 'Insight', 'Dawnlight'],
    afternoon: ['Flow', 'Revelation', 'Guidance', 'Serendipity', 'Focus'],
    evening: ['Mystic', 'Dreamtime', 'Eclipse', 'Twilight', 'Starlight']
};

const moodColors = {
    morning: ['#ffe082', '#ffd54f'],
    afternoon: ['#a5d6a7', '#81c784'],
    evening: ['#90caf9', '#64b5f6']
};

// 2) Refs
const scene = document.getElementById('scene');
const ring = document.getElementById('mood-ring');
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

// 4) Build playlist
async function generatePlaylist() {
    scene.classList.add('active');

    // pick slot, word, and color
    const slot = getTimeOfDay();
    const word = getRandom(moodWords[slot]);
    moodDisplay.textContent = `${word} Vibes`;

    const color = getRandom(moodColors[slot]);
    ring.style.background = `radial-gradient(circle at 30% 30%, #fff, ${color} 80%)`;

    // load CSV
    const { data } = await new Promise(res => {
        Papa.parse(`Data/${slot}.csv`, {
            download: true, header: true, skipEmptyLines: true,
            complete: res
        });
    });

    // pick and render 20 tracks
    const picks = shuffle(data).slice(0, 20);
    trackList.innerHTML = picks.map(s => {
        const name = s.master_metadata_track_name.replace(/\uFFFD/g, '');
        const artist = s.master_metadata_album_artist_name.replace(/\uFFFD/g, '');
        const uri = s.spotify_track_uri.startsWith('spotify:track:')
            ? s.spotify_track_uri.replace('spotify:track:', 'https://open.spotify.com/track/')
            : '#';
        const len = msToTime(+s.ms_played || 0);
        return `<li>
      <a href="${uri}" target="_blank">${name} - ${artist}</a>
      <span class="length">${len}</span>
    </li>`;
    }).join('');
}

ring.addEventListener('click', generatePlaylist);
