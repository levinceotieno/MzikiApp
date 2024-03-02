//Get elements
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const nextBtn = document.getElementById('next');
const previousBtn = document.getElementById('previous');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');

// Array of songs
const songs = [
    { title: "Why try", artist: "Ariana Grande", src: "../../static/media/audio/why_try.mp3" },
    { title: "Under the influence", artist: "C.Brown", src: "../../static/media/audio/UT_Influence.mp3" },
    { title: "Pochine", artist: "Ana", src: "../../static/media/audio/song.mp3" },
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

// Initialize the first song
updateSong(songs[currentSongIndex]);

