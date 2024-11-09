function toggleMute() {
    const video = document.getElementById('heroVideo');
    const muteIcon = document.querySelector('.mute-icon');
    const unmuteIcon = document.querySelector('.unmute-icon');
    
    if (video.muted) {
        video.muted = false;
        muteIcon.classList.add('hidden');
        unmuteIcon.classList.remove('hidden');
    } else {
        video.muted = true;
        muteIcon.classList.remove('hidden');
        unmuteIcon.classList.add('hidden');
    }
}