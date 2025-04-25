// 1) fortune-style mood words
const moodWords = {
    morning: ['Awakening', 'Clarity', 'Radiance', 'Insight', 'Dawnlight'],
    afternoon: ['Flow', 'Revelation', 'Guidance', 'Serendipity', 'Focus'],
    evening: ['Mystic', 'Dreamtime', 'Eclipse', 'Twilight', 'Starlight']
};

// 2) element refs
const ring = document.getElementById('mood-ring');
const panel = document.getElementById('playlist-panel');
const moodDisplay = document.getElementById('mood-display');
const trackList = document.getElementById('track-list');

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
function msToTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

// 4) main generator
async function generatePlaylist() {
    // crystal-ball press effect
    ring.style.transform = 'scale(0.92)';
    setTimeout(() => ring.style.transform = '', 200);

    // pick fortune word
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

    // choose 20 random tracks
    const picks = shuffle(data).slice(0, 20);

    // render list
    trackList.innerHTML = picks.map(s => {
        const name = s.master_metadata_track_name;
        const artist = s.master_metadata_album_artist_name;
        const len = msToTime(+s.ms_played || 0);
        return `<li>
      <a href="#" tabindex="-1">${name} — ${artist}</a>
      <span class="length">${len}</span>
    </li>`;
    }).join('');

    // reveal panel
    panel.classList.add('visible');
}

// 5) wire click
ring.addEventListener('click', generatePlaylist);
