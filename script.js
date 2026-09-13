document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================================
       1. HỆ THỐNG DATA & AUDIO PLAYER (Danh sách nhạc ngẫu nhiên)
    ========================================================= */
    const playlist = [
        { name: "Thanh Xuân - Da LAB", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "Tình Bạn Diệu Kỳ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { name: "Tháng Năm Rực Rỡ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ];
    let currentSongIndex = 0;
    
    const audio = document.getElementById('bg-audio');
    const disk = document.getElementById('disk');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const songNameDisplay = document.getElementById('current-song-name');
    let isPlaying = false;

    function loadSong(index) {
        audio.src = playlist[index].src;
        songNameDisplay.innerText = playlist[index].name;
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            disk.style.animationPlayState = 'running';
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        } else {
            audio.pause();
            disk.style.animationPlayState = 'paused';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        }
    }

    playBtn.addEventListener('click', togglePlay);
    
    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if(isPlaying) audio.play();
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if(isPlaying) audio.play();
    });

    // Tự động qua bài
    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    /* =========================================================
       2. GATEKEEPER (Cổng bảo mật & Kích hoạt trải nghiệm)
    ========================================================= */
    const gatekeeper = document.getElementById('gatekeeper');
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const errorMsg = document.getElementById('error-msg');

    quizBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                // Mở khóa đúng
                errorMsg.classList.remove('show');
                document.body.classList.add('unlocked');
                
                // Mở bài hát đầu tiên
                loadSong(0);
                togglePlay();
                
                // Sinh hiệu ứng môi trường
                generateEnvironment();

            } else {
                // Sai đáp án
                errorMsg.classList.add('show');
                const card = document.querySelector('.quiz-card');
                // Hiệu ứng rung lắc (CSS Web Animations API - Tối ưu hơn CSS thuần)
                card.animate([
                    { transform: 'translateX(0px)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0px)' }
                ], { duration: 300, easing: 'ease-in-out' });
            }
        });
    });

    /* =========================================================
       3. ENVIRONMENT GENERATOR (Tạo Lá rơi & Tia nắng)
    ========================================================= */
    function generateEnvironment() {
        // Tạo 5 tia nắng
        const sunbeamsContainer = document.getElementById('sunbeams-container');
        for (let i = 0; i < 5; i++) {
            let beam = document.createElement('div');
            beam.classList.add('sunbeam');
            // Random kích thước, vị trí và tốc độ
            beam.style.left = `${Math.random() * 100}vw`;
            beam.style.width = `${Math.random() * 100 + 50}px`;
            beam.style.height = `${Math.random() * 50 + 50}vh`;
            beam.style.animationDuration = `${Math.random() * 5 + 8}s`;
            beam.style.animationDelay = `${Math.random() * 2}s`;
            sunbeamsContainer.appendChild(beam);
        }

        // Tạo 30 chiếc lá rơi
        const leavesContainer = document.getElementById('falling-leaves-container');
        for (let i = 0; i < 30; i++) {
            let leaf = document.createElement('div');
            leaf.classList.add('leaf');
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 6}s, ${Math.random() * 2 + 2}s`; 
            leaf.style.animationDelay = `${Math.random() * 5}s, 0s`;
            
            // Random kích thước lá
            let scale = Math.random() * 0.5 + 0.5;
            leaf.style.transform = `scale(${scale})`;
            leavesContainer.appendChild(leaf);
        }
    }

    /* =========================================================
       4. SÁCH KỶ NIỆM 3D (StPageFlip Initialization)
    ========================================================= */
    const flipbookEl = document.getElementById('flipbook');
    if (flipbookEl) {
        const pageFlip = new St.PageFlip(flipbookEl, {
            width: 450, 
            height: 600,
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.3,
            showCover: true,
            mobileScrollSupport: false,
            usePortrait: true // Cho phép hiển thị trang đơn trên Mobile
        });
        
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));
    }

    /* =========================================================
       5. SVG SCROLL ANIMATION (Vẽ cành cây theo nhịp cuộn)
    ========================================================= */
    const branchPath = document.querySelector('.branch-path');
    
    if (branchPath) {
        // CSS set dasharray = 2000. Ta bắt đầu với dashoffset = 2000 (Ẩn hoàn toàn)
        const pathLength = 2000; 
        branchPath.style.strokeDashoffset = pathLength;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Tính toán % cuộn trang hiện tại so với khối Timeline
                    const timelineSection = document.querySelector('.section-timeline');
                    const rect = timelineSection.getBoundingClientRect();
                    
                    // Khoảng cách từ đỉnh viewport đến đỉnh section
                    const scrollPosition = window.innerHeight - rect.top;
                    const totalHeight = rect.height + window.innerHeight;
                    
                    let scrollPercentage = scrollPosition / totalHeight;
                    
                    // Giới hạn giá trị từ 0 đến 1
                    if (scrollPercentage < 0) scrollPercentage = 0;
                    if (scrollPercentage > 1) scrollPercentage = 1;
                    
                    // Vẽ SVG dần dần
                    const drawLength = pathLength * scrollPercentage;
                    branchPath.style.strokeDashoffset = pathLength - drawLength;
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* =========================================================
       6. HỆ THỐNG TƯƠNG TÁC (Thả tim & Cảm xúc)
    ========================================================= */
    const reactBtns = document.querySelectorAll('.react-btn');
    
    reactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const counterSpan = this.querySelector('.counter');
            let currentCount = parseInt(counterSpan.innerText);
            
            // Toggle trạng thái active
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                counterSpan.innerText = currentCount - 1;
            } else {
                this.classList.add('active');
                counterSpan.innerText = currentCount + 1;
                
                // Hiệu ứng hạt nảy lên khi bấm (Micro-interaction)
                this.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.2)' },
                    { transform: 'scale(1)' }
                ], { duration: 300 });
            }
        });
    });

});
