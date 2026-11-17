const firstMemoryAudio = "assets/audio1.m4a";

const memoryData = [
    { title: "Memory 01", text: "", photo: "assets/photo1.png", audio: firstMemoryAudio },
    { title: "Memory 02", text: "Okayyyy, so es photo mein tu mujhe Japanese or South Korean lagti hai... because of your hairstyle and the fluffy frock you’re wearing 💃✨👗", photo: "assets/photo2.png", audio: null },
    { title: "Memory 03", text: "Okay now I understand how much you love makeup 💄✨💋💅 It’s giving glow-up queen every single time.", photo: "assets/photo3.png", audio: null },
    { title: "Memory 04", text: "The scenery is so beautiful, it feels like a 90s movie moment 🌄✨ and you’re the main character of it all.", photo: "assets/photo4.png", audio: null },
    { title: "Memory 05", text: "This is like absolute starter pack to become you know who😹 😭💥 the tight jeans, the top with a knot and the pose says it all, it's so funnnyy", photo: "assets/photo5.png", audio: null },
    { title: "Memory 06", text: "Boss girl energy 😌💼✨ this one is pure confidence and power.", photo: "assets/photo6.png", audio: null },
    { title: "Memory 07", text: "Pakistani girl vibes, wow 😍✨ absolutely stunning and iconic.", photo: "assets/photo7.png", audio: null },
    { title: "Memory 08", text: "your love afterall, should be present with your digital footprint, i can not miss him 😍✨ ", photo: "assets/photo8.png", audio: null },
    { title: "Memory 09", text: "Congratulations, queen 🎉💖✨ you’ve always been the main character of your own story.", photo: "assets/photo9.png", audio: null },
    { title: "Memory 10", text: "😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈", photo: "assets/photo10.png", audio: null }
];

const book = document.getElementById('book');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Build pages dynamically with custom audio sliders
memoryData.forEach((data, index) => {
    const pageNum = index + 1;
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.setAttribute('data-page', pageNum);
    
    const hasAudio = !!data.audio;

    pageDiv.innerHTML = `
        <div class="page-half photo-half">
            <img src="${data.photo}" alt="Gunjan memory ${pageNum}" onerror="this.onerror=null; this.src='https://via.placeholder.com/350x350?text=Photo+${pageNum}+Missing'">
        </div>
        <div class="page-half audio-half">
            ${hasAudio ? `
                <div class="custom-audio-player" id="player-${index}">
                    <p class="audio-label">🎙️ Listen to my note:</p>
                    <div class="audio-controls-row">
                        <button class="play-pause-btn" id="playBtn-${index}">▶</button>
                        <input type="range" class="audio-slider" id="slider-${index}" value="0" max="100" step="0.1">
                    </div>
                    <div class="audio-time-info">
                        <span id="currentTime-${index}">0:00</span>
                        <span id="duration-${index}">0:00</span>
                    </div>
                    <audio id="audioElement-${index}" preload="metadata">
                        <source src="${data.audio}" type="audio/mp4">
                    </audio>
                </div>
            ` : ''}
            ${data.text ? `<p class="commentary">${data.text}</p>` : ''}
        </div>
    `;
    book.appendChild(pageDiv);

    if (!hasAudio) return;

    // Wire up audio player interactivity after inserting into DOM
    setTimeout(() => {
        const audioEl = document.getElementById(`audioElement-${index}`);
        const playBtn = document.getElementById(`playBtn-${index}`);
        const slider = document.getElementById(`slider-${index}`);
        const currentTimeSpan = document.getElementById(`currentTime-${index}`);
        const durationSpan = document.getElementById(`duration-${index}`);

        audioEl.volume = 0.8;

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        audioEl.addEventListener('loadedmetadata', () => {
            durationSpan.textContent = formatTime(audioEl.duration);
        });

        audioEl.addEventListener('error', () => {
            playBtn.textContent = '⚠';
            durationSpan.textContent = '0:00';
        });

        playBtn.addEventListener('click', () => {
            // Pause all other voice notes first
            memoryData.forEach((_, i) => {
                if (i !== index) {
                    const otherAudio = document.getElementById(`audioElement-${i}`);
                    const otherBtn = document.getElementById(`playBtn-${i}`);
                    if (otherAudio) {
                        otherAudio.pause();
                        otherBtn.textContent = '▶';
                    }
                }
            });

            if (audioEl.paused) {
                audioEl.play().catch(() => {});
                playBtn.textContent = '⏸';
            } else {
                audioEl.pause();
                playBtn.textContent = '▶';
            }
        });

        audioEl.addEventListener('timeupdate', () => {
            if (audioEl.duration) {
                const progress = (audioEl.currentTime / audioEl.duration) * 100;
                slider.value = progress;
                currentTimeSpan.textContent = formatTime(audioEl.currentTime);
            }
        });

        slider.addEventListener('input', () => {
            if (audioEl.duration) {
                const seekTime = (slider.value / 100) * audioEl.duration;
                audioEl.currentTime = seekTime;
            }
        });

        audioEl.addEventListener('ended', () => {
            playBtn.textContent = '▶';
            slider.value = 0;
            audioEl.currentTime = 0;
        });
    }, 0);
});

const pages = document.querySelectorAll('.page');
let currentPage = 0;

function updateBook() {
    // Pause all voice notes when flipping pages
    memoryData.forEach((_, i) => {
        const audioEl = document.getElementById(`audioElement-${i}`);
        const playBtn = document.getElementById(`playBtn-${i}`);
        if (audioEl) {
            audioEl.pause();
            if (playBtn) playBtn.textContent = '▶';
        }
    });

    pages.forEach((page, index) => {
        if (index === currentPage) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;
}

nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        updateBook();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateBook();
    }
});

// Keyboard arrow navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
        currentPage++;
        updateBook();
    } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        currentPage--;
        updateBook();
    }
});

// Falling Birthday Vibes Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

const symbols = ['🐶', '🌙', '☀️', '⭐', '✨', '💖', '💄', '🩷', '👗', '💃', '🎀', '🫧', '💋', '🧴', '🕶️', '🎵', '🌸', '🦋', '🩹', '💎'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -30;
        this.size = Math.random() * 18 + 16;
        this.speedY = Math.random() * 4.6 + 4.1;
        this.speedX = (Math.random() - 0.5) * 3.2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 3;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.color = ['#ff4d8d', '#b34dff', '#ffb703', '#ff7eb6', '#ff5fa2', '#7c4dff', '#f7b2d7'][Math.floor(Math.random() * 7)];
        this.opacity = Math.random() * 0.85 + 0.25;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.04) * 0.7;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height + 30) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
    }
}

const particlesArray = [];
for (let i = 0; i < 55; i++) {
    particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Background Music Control with Slider
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const bgSlider = document.getElementById('bgSlider');
const bgCurrent = document.getElementById('bgCurrent');
const bgDuration = document.getElementById('bgDuration');
let isBgPlaying = false;

bgMusic.loop = true;
bgMusic.volume = 0.6;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

bgMusic.addEventListener('loadedmetadata', () => {
    bgDuration.textContent = formatTime(bgMusic.duration);
});

musicToggle.addEventListener('click', () => {
    if (!isBgPlaying) {
        bgMusic.play().then(() => {
            musicToggle.textContent = '⏸ Pause';
            isBgPlaying = true;
        }).catch(() => {});
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🎵 Play your fav music';
        isBgPlaying = false;
    }
});

bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration) {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        bgSlider.value = progress;
        bgCurrent.textContent = formatTime(bgMusic.currentTime);
    }
});

bgSlider.addEventListener('input', () => {
    if (bgMusic.duration) {
        const seekTime = (bgSlider.value / 100) * bgMusic.duration;
        bgMusic.currentTime = seekTime;
    }
});

bgMusic.addEventListener('ended', () => {
    musicToggle.textContent = '🎵 Play your fav music';
    isBgPlaying = false;
    bgSlider.value = 0;
    bgMusic.currentTime = 0;
});