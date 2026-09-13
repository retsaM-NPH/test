// --- 1. LOGIC GATEKEEPER & AUDIO ---
const gatekeeper = document.getElementById('gatekeeper');
const audio = document.getElementById('bg-audio');
const disk = document.getElementById('disk');
const playBtn = document.getElementById('play-btn');
let isPlaying = false;

function checkAnswer(isCorrect) {
    if(isCorrect) {
        document.getElementById('error-msg').style.opacity = '0';
        gatekeeper.style.transform = 'scale(1.5)';
        gatekeeper.style.filter = 'blur(10px)';
        gatekeeper.style.opacity = '0';
        gatekeeper.style.pointerEvents = 'none';
        
        document.body.classList.add('unlocked');
        togglePlay();
    } else {
        document.getElementById('error-msg').style.opacity = '1';
        document.querySelector('.quiz-card').animate([
            { transform: 'translateX(0px)' }, { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' }, { transform: 'translateX(0px)' }
        ], { duration: 300 });
    }
}

function togglePlay() {
    if (audio.paused) {
        audio.play(); disk.style.animationPlayState = 'running';
        playBtn.classList.replace('fa-play', 'fa-pause'); isPlaying = true;
    } else {
        audio.pause(); disk.style.animationPlayState = 'paused';
        playBtn.classList.replace('fa-pause', 'fa-play'); isPlaying = false;
    }
}

function nextTrack() { 
    audio.currentTime = 0; 
    if(!isPlaying) togglePlay(); 
}

// --- 2. LOGIC BOTTOM SHEET (THÀNH VIÊN) ---
function openMember(name, desc, imgSrc) {
    document.getElementById('sheet-name').innerText = name;
    document.getElementById('sheet-desc').innerText = desc;
    document.getElementById('sheet-img').src = imgSrc;
    document.body.classList.add('sheet-open');
}

function closeMember() {
    document.body.classList.remove('sheet-open');
}

// --- 3. KHỞI TẠO DOM CHO SÁCH 3D & OBSERVER API ---
document.addEventListener('DOMContentLoaded', function() {
    
    // Cấu hình Sách lật 3D (StPageFlip)
    const flipbookElement = document.getElementById('flipbook');
    if(flipbookElement) {
        const pageFlip = new St.PageFlip(flipbookElement, {
            width: 400,
            height: 550,
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false
        });
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));
    }

    // Cấu hình hệ thống theo dõi cuộn trang (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 }); 

    document.querySelectorAll('.observer-item').forEach((el) => {
        observer.observe(el);
    });
});
