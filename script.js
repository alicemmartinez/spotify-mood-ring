// 1) Define your moods as objects with parallel word+color arrays
const moods = {
    morning: {
        words: ['Awakening', 'Clarity', 'Radiance', 'Insight', 'Dawnlight'],
        colors: ['#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300']
    },
    afternoon: {
        words: ['Flow', 'Revelation', 'Guidance', 'Serendipity', 'Focus'],
        colors: ['#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#388e3c']
    },
    evening: {
        words: ['Mystic', 'Dreamtime', 'Eclipse', 'Twilight', 'Starlight'],
        colors: ['#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5']
    }
};

// 2) Helper to pick a random element
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 3) In your generatePlaylist, replace the slot logic with:
async function generatePlaylist() {
    // animate ring + show panel
    scene.classList.add('active');

    // pick a random mood type first
    const types = Object.keys(moods);           // ['morning','afternoon','evening']
    const slot = getRandom(types);             // e.g. 'evening'

    // pick a random index within that mood
    const { words, colors } = moods[slot];
    const i = Math.floor(Math.random() * words.length);
    const word = words[i];                     // e.g. 'Eclipse'
    const color = colors[i];                    // matching shade

    // update UI
    moodDisplay.textContent = `${word} Vibes`;
    ring.style.background = `
    radial-gradient(
      circle at 30% 30%,
      #fff,
      ${color} 80%
    )`;

    // then load your CSV exactly as before using `slot` for the filename
    const { data } = await new Promise(res => {
        Papa.parse(`Data/${slot}.csv`, {
            download: true, header: true, skipEmptyLines: true,
            complete: res
        });
    });

    // pick & render 20 tracks
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

// 4) Don’t forget to wire up the click
ring.addEventListener('click', generatePlaylist);
