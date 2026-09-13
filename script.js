/**
 * THANH XUÂN VƯỜN TRƯỜNG - KỶ NIỆM 2026
 * Core Engine & Interactive Physics
 */
'use strict'; // Kích hoạt chế độ kiểm tra lỗi nghiêm ngặt của JS

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. HỆ THỐNG ÂM NHẠC (Playlist & Audio Player)
    ========================================================= */
    const playlist = [
        { title: "Thanh Xuân - Da LAB", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Tình Bạn Diệu Kỳ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "Tháng Năm Rực Rỡ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ];
    let currentTrackIndex = 0;
    
    const audioEl = document.getElementById('bg-audio');
    const trackTitleEl = document.getElementById('track-title');
    const btnPlay = document.getElementById('btn-play');
    const vinylDisk = document.querySelector('.vinyl-disk');
    
    // Khởi tạo bài hát đầu tiên vào bộ nhớ tạm
    const loadTrack = (index) => {
        audioEl.src = playlist[index].src;
        trackTitleEl.textContent = playlist[index].title;
    };
    loadTrack(currentTrackIndex);

    const togglePlay = () => {
        if (audioEl.paused) {
            audioEl.play().catch(e => console.warn("Trình duyệt chặn Audio:", e));
            vinylDisk.style.animationPlayState = 'running';
            btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioEl.pause();
            vinylDisk.style.animationPlayState = 'paused';
            btnPlay.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    const nextTrack = () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (!audioEl.paused) audioEl.play();
    };

    // Điều khiển Audio qua Event Delegation (Gắn 1 lần vào thanh Nav)
    const audioController = document.querySelector('.music-controller');
    audioController.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        if (btn.id === 'btn-play') togglePlay();
        if (btn.id === 'btn-next') nextTrack();
        if (btn.id === 'btn-prev') {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            if (!audioEl.paused) audioEl.play();
        }
    });

    audioEl.addEventListener('ended', nextTrack); // Tự động qua bài

    /* =========================================================
       2. BỘ PHÁT SINH MÔI TRƯỜNG VẬT LÝ (Procedural Environment)
    ========================================================= */
    const generateEnvironment = () => {
        // Dùng DocumentFragment để chống Reflow màn hình (Cực kỳ tối ưu)
        const fragmentSunbeams = document.createDocumentFragment();
        const fragmentLeaves = document.createDocumentFragment();

        // Bơm 5 tia nắng ngẫu nhiên
        for (let i = 0; i < 5; i++) {
            const beam = document.createElement('div');
            beam.className = 'sunbeam';
            beam.style.left = `${Math.random() * 100}vw`;
            beam.style.width = `${Math.random() * 80 + 40}px`;
            beam.style.height = `${Math.random() * 50 + 50}vh`;
            beam.style.animationDuration = `${Math.random() * 6 + 10}s`;
            beam.style.animationDelay = `${Math.random() * 3}s`;
            fragmentSunbeams.appendChild(beam);
        }

        // Bơm 30 chiếc lá rơi ngẫu nhiên
        for (let i = 0; i < 30; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 7}s, ${Math.random() * 2 + 2}s`; 
            leaf.style.animationDelay = `${Math.random() * 5}s, 0s`;
            leaf.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            fragmentLeaves.appendChild(leaf);
        }

        document.getElementById('sunbeams-container').appendChild(fragmentSunbeams);
        document.getElementById('falling-leaves-container').appendChild(fragmentLeaves);
    };

    /* =========================================================
       3. CỔNG BẢO MẬT & MỞ KHÓA TRẢI NGHIỆM (Gatekeeper)
    ========================================================= */
    const gatekeeper = document.getElementById('gatekeeper');
    const quizError = document.getElementById('quiz-error');

    gatekeeper.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-btn');
        if (!btn) return; // Nếu bấm ra ngoài nút thì bỏ qua

        const isCorrect = btn.getAttribute('data-correct') === 'true';

        if (isCorrect) {
            // Hiệu ứng mở khóa thành công
            quizError.classList.remove('show');
            gatekeeper.classList.add('unlocked-fade'); // Kích hoạt CSS chuyển cảnh mờ dần
            document.body.classList.add('unlocked');   // Mở khóa cuộn dọc
            
            // Kích hoạt hệ sinh thái
            togglePlay();
            generateEnvironment();
            initScrollEngines(); // Đánh thức GSAP & Flipbook

            // Xóa hộp thoại khỏi DOM sau khi mờ hẳn (Giải phóng RAM)
            setTimeout(() => gatekeeper.remove(), 1500);

        } else {
            // Hiệu ứng sai
            quizError.classList.add('show');
            const wrapper = gatekeeper.querySelector('.quiz-wrapper');
            // Dùng Web Animations API mượt hơn CSS Keyframes
            wrapper.animate([
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-12px)' },
                { transform: 'translateX(12px)' },
                { transform: 'translateX(0px)' }
            ], { duration: 400, easing: 'cubic-bezier(.36,-0.04,.15,1.64)' });
        }
    });

    /* =========================================================
       4. TƯƠNG TÁC THÀNH VIÊN (Micro-interactions)
    ========================================================= */
    // Dùng Event Delegation (Chỉ gắn 1 Listener cho cả 100 thành viên)
    const membersSection = document.querySelector('.section-members');
    
    membersSection.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;

        const countSpan = actionBtn.querySelector('.count');
        let currentVal = parseInt(countSpan.textContent);

        if (actionBtn.classList.contains('active')) {
            actionBtn.classList.remove('active');
            countSpan.textContent = currentVal - 1;
        } else {
            actionBtn.classList.add('active');
            countSpan.textContent = currentVal + 1;
            
            // Hiệu ứng hạt nảy (Pop)
            actionBtn.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.2)' },
                { transform: 'scale(1)' }
            ], { duration: 300, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
        }
    });

    /* =========================================================
       5. ĐỘNG CƠ GSAP & FLIPBOOK (Chỉ khởi động khi đã mở khóa)
    ========================================================= */
    function initScrollEngines() {
        
        // --- A. FLIPBOOK ENGINE ---
        const flipbookEl = document.getElementById('flipbook-engine');
        if (flipbookEl) {
            const pageFlip = new St.PageFlip(flipbookEl, {
                width: 480, height: 650, // Tỷ lệ chuẩn sách
                size: "stretch", minWidth: 315, maxWidth: 1000, minHeight: 420, maxHeight: 1350,
                maxShadowOpacity: 0.4, showCover: true, mobileScrollSupport: false,
                usePortrait: true // Cho phép hiển thị 1 trang trên điện thoại dọc
            });
            pageFlip.loadFromHTML(document.querySelectorAll('.page'));
        }

        // --- B. GSAP PARALLAX (Bối cảnh 3D) ---
        gsap.registerPlugin(ScrollTrigger);

        // Cuộn lớp nền chậm lại
        gsap.to('.parallax-bg', {
            yPercent: 20, ease: "none",
            scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
        });

        // Cuộn lớp hoa lá phía trước nhanh hơn & hơi xoay
        gsap.to('.parallax-fore', {
            yPercent: -25, rotation: -8, ease: "none",
            scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
        });

        // --- C. GSAP TIMELINE SVG DRAW (Vẽ cành cây) ---
        const branchPath = document.querySelector('.branch-path');
        if (branchPath) {
            // Tự động đo độ dài thực tế của nét vẽ SVG
            const pathLength = branchPath.getTotalLength();
            
            // Khởi tạo trạng thái ban đầu: Giấu nét vẽ đi
            gsap.set(branchPath, { 
                strokeDasharray: pathLength, 
                strokeDashoffset: pathLength 
            });

            // Gắn hoạt ảnh nét vẽ đồng bộ với thao tác cuộn màn hình
            gsap.to(branchPath, {
                strokeDashoffset: 0, // Vẽ đến đâu hiện đến đó
                ease: "none",
                scrollTrigger: {
                    trigger: ".section-timeline", // Bắt đầu vẽ khi thấy khối Timeline
                    start: "top 60%", // Kích hoạt khi khối lên đến 60% màn hình
                    end: "bottom 80%", // Kết thúc vẽ khi xuống cuối khối
                    scrub: 1 // Tạo độ trễ mượt 1 giây khi vuốt (Cinematic effect)
                }
            });
        }
    }
});
