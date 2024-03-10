
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const nextBtn = document.getElementById('next');
const previousBtn = document.getElementById('previous');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const likeBtn = document.getElementById('like');
const logoutButton = document.getElementById('logoutButton');

// Array of songs
const songs = [
    { title: "Why try", artist: "Ariana Grande", src: "../../static/media/audio/why_try.mp3" },
    { title: "Under the influence", artist: "C.Brown", src: "../../static/media/audio/UT-Influence.mp3" },
    { title: "Copines", artist: "Aya Nakamura", src: "../../static/media/audio/song.mp3" },
    { title: "Bejeweled", artist: "Taylor Swift", src: "../../static/media/audio/Bejeweled.mp3" },
    { title: "I dont do drugs", artist: "Doja Cat ft Ariana Grande", src: "../../static/media/audio/IDDD_doja.mp3" },
    { title: "Karma", artist: "Ice Spice ft Taylor Swift", src: "../../static/media/audio/karma.mp3" },
    { title: "Midnight Rain", artist: "Taylor Swift", src: "../../static/media/audio/midnight_rain.mp3" },
    { title: "Mine", artist: "Taylor Swift", src: "../../static/media/audio/mine.mp3" },
    { title: "She Knows", artist: "Ne_yo", src: "../../static/media/audio/she_knows_neyo.mp3" },
    { title: "Skinny Dippin'", artist: "Sabrina Carpenter", src: "../../static/media/audio/skinny_dippin.mp3" },
    { title: "Speak Now", artist: "Taylor Swift", src: "../../static/media/audio/speak_now.mp3" },
    { title: "State of Grace", artist: "Taylor Swift", src: "../../static/media/audio/state_of_grace.mp3" },
    { title: "Wishful Thinking", artist: "Gracie Abrams", src: "../../static/media/audio/wishful_thinking.mp3" },
    // Add more songs as needed
];

let currentSongIndex = 0;
let isPlaying = false;

// Function to play the current song
function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Function to pause the current song
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Function to toggle play/pause state
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Event listener for play/pause button
playBtn.addEventListener('click', togglePlayPause);

// Event listener for next button
nextBtn.addEventListener('click', playNextSong);

// Event listener for previous button
previousBtn.addEventListener('click', playPreviousSong);

// Function to play the next song
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSong(songs[currentSongIndex]);
}

// Function to play the previous song
function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSong(songs[currentSongIndex]);
}

// Function to update song information and play new song
function updateSong(song) {
    songTitle.innerText = song.title;
    artistName.innerText = song.artist;
    audio.src = song.src;

    // Check if the song should be played or paused based on the previous state
    if (isPlaying) {
        playSong();
    } else {
        pauseSong();
    }
}

// Update the progress bar on timeupdate event
audio.addEventListener('timeupdate', function() {
    const current = audio.currentTime;
    const total = audio.duration;
    if (!isNaN(total)) {
        const percentage = (current / total) * 100;
        progress.value = percentage;

        const currentMinutes = Math.floor(current / 60);
        const currentSeconds = Math.floor(current % 60);
        const formattedCurrentTime = `${currentMinutes.toString().padStart(2, "0")}:${currentSeconds.toString().padStart(2, "0")}`;

        const durationMinutes = Math.floor(total / 60);
        const durationSeconds = Math.floor(total % 60);
        const formattedDuration = `${durationMinutes.toString().padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;

        currentTime.innerText = formattedCurrentTime;
        duration.innerText = formattedDuration;
    }
});

// Event listener for progress bar change
progress.addEventListener('input', function () {
    const seekTime = audio.duration * (progress.value / 100);
    audio.currentTime = seekTime;
});

// Add like functionality
likeBtn.addEventListener('click', function() {
    const songId = currentSongIndex; // Assuming the song index in the songs array is used as the song ID
    fetch(`/api/like_song/${songId}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            console.log('Song liked successfully');
            // Add any additional UI updates upon successful like
            likeBtn.classList.add('liked');
        } else {
            console.error('Failed to like song');
            // Handle error scenario
        }
    })
    .catch(error => {
        console.error('Error occurred while liking song:', error);
    });
});

// Function to handle logout
async function logout() {
    const response = await fetch('/logout', {
        method: 'GET'
    });
    if (response.ok) {
        window.location.href = '/login'; // Redirect to login
    } else {
        console.error('Failed to logout');
        // Optionally, you can display the error message to the user
    }
}

// Attach event listener to the logout button
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

// Add recommendation functionality
function getRecommendedSongs() {
    fetch('/api/recommended_songs')
    .then(response => response.json())
    .then(data => {
        // Handle recommended songs data
        console.log('Recommended songs:', data);
    })
    .catch(error => {
        console.error('Error occurred while fetching recommended songs:', error);
    });
}

// Initialize the first song
updateSong(songs[currentSongIndex]);
