'use strict'; 

document.addEventListener('DOMContentLoaded', () => {

    const playlist = [
        { title: "Thanh Xuân - Da LAB", src: "nhac-1.mp3" }, // Đã đổi sang local
        { title: "Tình Bạn Diệu Kỳ", src: "nhac-2.mp3" }
    ];
    let currentTrackIndex = 0;
    
    const audioEl = document.getElementById('bg-audio');
    const trackTitleEl = document.getElementById('track-title');
    const btnPlay = document.getElementById('btn-play');
    const vinylDisk = document.querySelector('.vinyl-disk');
    
    const loadTrack = (index) => {
        audioEl.src = playlist[index].src;
        trackTitleEl.textContent = playlist[index].title;
    };
    loadTrack(currentTrackIndex);

    const togglePlay = () => {
        if (audioEl.paused) {
            audioEl.play().catch(e => console.warn("Lỗi Audio:", e));
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

    document.querySelector('.music-controller').addEventListener('click', (e) => {
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

    audioEl.addEventListener('ended', nextTrack);

    /* --- Bơm Môi trường (Gió, Nắng) --- */
    const generateEnvironment = () => {
        const fragSun = document.createDocumentFragment();
        const fragLeaf = document.createDocumentFragment();

        for (let i = 0; i < 5; i++) {
            const beam = document.createElement('div');
            beam.className = 'sunbeam';
            beam.style.left = `${Math.random() * 100}vw`;
            beam.style.width = `${Math.random() * 80 + 40}px`;
            beam.style.animationDuration = `${Math.random() * 6 + 10}s`;
            fragSun.appendChild(beam);
        }

        for (let i = 0; i < 30; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 7}s, ${Math.random() * 2 + 2}s`; 
            leaf.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            fragLeaf.appendChild(leaf);
        }

        document.getElementById('sunbeams-container').appendChild(fragSun);
        document.getElementById('falling-leaves-container').appendChild(fragLeaf);
    };

    /* --- Mở Cổng Bảo Mật --- */
    const gatekeeper = document.getElementById('gatekeeper');
    gatekeeper.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-btn');
        if (!btn) return;

        if (btn.getAttribute('data-correct') === 'true') {
            document.getElementById('quiz-error').classList.remove('show');
            gatekeeper.classList.add('unlocked-fade');
            document.body.classList.add('unlocked');
            
            togglePlay();
            generateEnvironment();
            initScrollEngines();

            setTimeout(() => gatekeeper.remove(), 1500);
        } else {
            document.getElementById('quiz-error').classList.add('show');
            gatekeeper.querySelector('.quiz-wrapper').animate([
                { transform: 'translateX(0px)' }, { transform: 'translateX(-12px)' },
                { transform: 'translateX(12px)' }, { transform: 'translateX(0px)' }
            ], { duration: 400 });
        }
    });

    /* --- Tương tác thả tim --- */
    document.querySelector('.section-members').addEventListener('click', (e) => {
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
            actionBtn.animate([
                { transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }
            ], { duration: 300 });
        }
    });

    /* --- Động cơ lõi (Scroll, GSAP, Flipbook) --- */
    function initScrollEngines() {
        // 1. Khởi tạo Flipbook (Bọc Try-Catch chống sập)
        try {
            const flipbookEl = document.getElementById('flipbook-engine');
            if (flipbookEl) {
                // Hiển thị lại các trang (do CSS đã ẩn đi lúc chờ load)
                document.querySelectorAll('.page').forEach(p => p.style.display = 'block');
                
                const pageFlip = new St.PageFlip(flipbookEl, {
                    width: 480, height: 650,
                    size: "stretch", minWidth: 315, maxWidth: 1000, minHeight: 420, maxHeight: 1350,
                    maxShadowOpacity: 0.4, showCover: true, mobileScrollSupport: false
                });
                pageFlip.loadFromHTML(document.querySelectorAll('.page'));
            }
        } catch (error) {
            console.error("Lỗi khởi tạo Sách:", error);
        }

        // 2. Khởi tạo Parallax & SVG
        try {
            gsap.registerPlugin(ScrollTrigger);

            gsap.to('.parallax-bg', {
                yPercent: 20, ease: "none",
                scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
            });

            gsap.to('.parallax-fore', {
                yPercent: -25, rotation: -8, ease: "none",
                scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
            });

            const branchPath = document.querySelector('.branch-path');
            if (branchPath) {
                const pathLength = branchPath.getTotalLength();
                gsap.set(branchPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

                gsap.to(branchPath, {
                    strokeDashoffset: 0, ease: "none",
                    scrollTrigger: {
                        trigger: ".section-timeline", start: "top 60%", end: "bottom 80%", scrub: 1
                    }
                });
            }
        } catch (err) {
            console.error("Lỗi GSAP:", err);
        }
    }
});
