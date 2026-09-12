gsap.registerPlugin(ScrollTrigger);

// 1. KÍCH HOẠT ÂM NHẠC & UI (Buộc người dùng tương tác lần đầu để chạy)
const audio = document.getElementById('bg-music');
const audioUI = document.getElementById('audio-ui');
const vinyl = document.getElementById('vinyl');
let isPlaying = false;

document.body.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play();
        isPlaying = true;
        audioUI.style.opacity = 1;
        vinyl.style.animationPlayState = 'running';
    }
}, { once: true });

// 2. HIỆU ỨNG CHUYỂN CẢNH (GSAP TIMELINE)
// Cuộn ngang thư viện phim (Chương 2)
const filmStrip = document.querySelector('.film-strip');
gsap.to(filmStrip, {
    x: () => -(filmStrip.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
        trigger: "#scene-film",
        pin: true,
        scrub: 1,
        end: () => "+=" + filmStrip.scrollWidth
    }
});

// Chữ hiện ra từ từ ở hồi kết (Chương 3)
const fadeTexts = gsap.utils.toArray('.fade-text');
fadeTexts.forEach((text, i) => {
    gsap.to(text, {
        scrollTrigger: {
            trigger: "#scene-time",
            start: "top 50%", // Khi chương 3 vào giữa màn hình
            onEnter: () => startWindEffect() // Kích hoạt gió thổi
        },
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: i * 0.8, // Các câu xuất hiện nối tiếp nhau
        ease: "power2.out"
    });
});

// 3. ĐỘNG CƠ VẬT LÝ CHO GIÓ THỔI & THỜI GIAN TRÔI (CANVAS API)
const canvas = document.getElementById('wind-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let windActive = false;

class WindParticle {
    constructor() {
        this.x = -50; // Bắt đầu từ rìa trái
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 + 2; // Tốc độ gió ngang
        this.speedY = (Math.random() - 0.5) * 2; // Chuyển động lượn sóng
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.x += this.speedX;
        // Quỹ đạo hình sin tạo cảm giác gió cuốn lá rơi
        this.y += Math.sin(this.x / 50) * 1 + this.speedY; 
        
        // Vẽ hạt
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function startWindEffect() {
    if (windActive) return;
    windActive = true;
    canvas.style.opacity = 1; // Hiện lớp Canvas lên
    
    // Liên tục sinh ra hạt mới
    setInterval(() => {
        if (particles.length < 100) particles.push(new WindParticle());
    }, 100);
    
    animateWind();
}

function animateWind() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        // Xóa hạt nếu bay khỏi màn hình bên phải
        if (particles[i].x > canvas.width + 50) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateWind);
}

// Cập nhật lại Canvas khi xoay màn hình
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
