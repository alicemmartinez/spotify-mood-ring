// 1) Mood-word lists
const moodWords = {
    morning: ['Energetic', 'Upbeat', 'Vibrant', 'Lively', 'Motivated'],
    afternoon: ['Focused', 'Productive', 'Chill', 'Steady', 'Flowing'],
    evening: ['Relaxed', 'Calm', 'Mellow', 'Soothing', 'Laid-back']
};

// 2) Element refs
const ring = document.getElementById('mood-ring'),
    popup = document.getElementById('playlist-popup'),
    moodDisp = document.getElementById('mood-display'),
    trackList = document.getElementById('track-list');

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

// 4) Main routine
async function generatePlaylist() {
    // a) pop animation
    ring.style.transform = 'scale(0.93)';
    setTimeout(() => ring.style.transform = '', 150);

    // b) pick time slot + mood word
    const slot = getTimeOfDay();
    const word = getRandom(moodWords[slot]);
    moodDisp.textContent = `${word} Vibes`;

    // c) load the appropriate CSV
    const url = `Data/${slot}.csv`;
    const { data } = await new Promise(res => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: res
        });
    });

    // d) shuffle & slice 20 songs
    const picks = shuffle(data).slice(0, 20);

    // e) render
    trackList.innerHTML = picks.map(s => {
        const name = s.master_metadata_track_name,
            artist = s.master_metadata_album_artist_name,
            uri = s.spotify_track_uri || '',
            href = uri.startsWith('spotify:track:')
                ? uri.replace('spotify:track:', 'https://open.spotify.com/track/')
                : '#';
        return `<li>
      <a href="${href}" target="_blank">${name} — ${artist}</a>
    </li>`;
    }).join('');

    // f) reveal popup
    popup.classList.add('visible');
}

// 5) Wire the click
ring.addEventListener('click', generatePlaylist);
