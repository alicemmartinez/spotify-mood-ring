// 1) Mood buckets with aligned words + shades
const moods = {
    morning: {
        // bright, energizing vibes
        words: ['Energized', 'Sunny', 'Upbeat', 'Optimistic', 'Vibrant'],
        colors: ['#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300']
    },
    afternoon: {
        // steady, productive flow
        words: ['Focused', 'Motivated', 'Inspired', 'Flowing', 'Creative'],
        colors: ['#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#388e3c']
    },
    evening: {
        // winding-down feels
        words: ['Chill', 'Mellow', 'Cozy', 'Dreamy', 'Serene'],
        colors: ['#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5']
    }
};


// refs
const scene = document.getElementById('scene');
const ring = document.getElementById('mood-ring');
const moodDisp = document.getElementById('mood-display');
const trackList = document.getElementById('track-list');

// helpers
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
    const sec = Math.floor(ms / 1000),
        m = String(Math.floor(sec / 60)).padStart(2, '0'),
        s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

// main
async function generatePlaylist() {
    scene.classList.add('active');

    // 1. pick a mood type and index
    const types = Object.keys(moods);
    const slot = getRandom(types);
    const idx = Math.floor(Math.random() * moods[slot].words.length);

    // 2. pick matching word + shade
    const word = moods[slot].words[idx];
    const color = moods[slot].colors[idx];

    // 3. update ring + header
    moodDisp.textContent = `${word} Vibes`;
    ring.style.background = `radial-gradient(circle at 30% 30%, #fff, ${color} 80%)`;

    // 4. load CSV for that mood
    const { data } = await new Promise(res =>
        Papa.parse(`Data/${slot}.csv`, {
            download: true, header: true, skipEmptyLines: true,
            complete: res
        })
    );

    // 5. shuffle & take 20, then render
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

// 6. wire the click
ring.addEventListener('click', generatePlaylist);
