window.addEventListener('load', function() {
    // --- 1. تعريف عناصر الواجهة (UI Elements) ---
    const mainMenuScreen = document.getElementById('main-menu-screen');
    const difficultyScreen = document.getElementById('difficulty-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const gameCanvas = document.getElementById('game-canvas');
    
    const startBtn = document.getElementById('start-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const backBtns = document.querySelectorAll('.btn-back');
    const difficultyBtns = document.querySelectorAll('.btn-difficulty');
    
    const languageToggle = document.getElementById('language-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const langText = document.querySelector('.lang-text');

    // --- 2. إدارة الواجهة (UI Management: Language, Music, Navigation) ---
    const fullTranslations = {
        en: { gameTitle: "Super Runner", start: "Start", selectDifficulty: "Select Difficulty", easy: "Easy", normal: "Normal", hard: "Hard", settings: "Settings", language: "Language", music: "Music", back: "Back", },
        ar: { gameTitle: "العداء الخارق", start: "ابدأ", selectDifficulty: "اختر المستوى", easy: "سهل", normal: "عادي", hard: "صعب", settings: "الإعدادات", language: "اللغة", music: "الموسيقى", back: "رجوع", }
    };
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        langText.textContent = lang === 'ar' ? 'AR' : 'EN';
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.dataset.lang;
            if (fullTranslations[lang][key]) { el.textContent = fullTranslations[lang][key]; }
        });
        localStorage.setItem('gameLanguage', lang);
    }
    function toggleMusic(play) { 
        if (play) { backgroundMusic.play().catch(e => {}); } else { backgroundMusic.pause(); } 
        localStorage.setItem('musicEnabled', play); 
    }
    function showScreen(screenToShow) { 
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
        screenToShow.classList.add('active'); 
    }
    startBtn.addEventListener('click', () => showScreen(difficultyScreen));
    settingsBtn.addEventListener('click', () => showScreen(settingsScreen));
    backBtns.forEach(btn => btn.addEventListener('click', () => showScreen(mainMenuScreen)));
    languageToggle.addEventListener('change', e => setLanguage(e.target.checked ? 'en' : 'ar'));
    musicToggle.addEventListener('change', e => toggleMusic(e.target.checked));
    
    // --- 3. محرك اللعبة الرئيسي (Main Game Engine) ---
    const ctx = gameCanvas.getContext('2d');
    gameCanvas.width = 450;
    gameCanvas.height = 800;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this.width, this.height);
            this.player = new Player(this.width, this.height);
            this.obstacles = new ObstacleManager(this.width, this.height);
            this.input = new InputHandler();
            this.gameOver = false;
        }

        update(deltaTime) {
            if (this.gameOver) return;
            this.background.update(deltaTime);
            this.player.update(this.input, deltaTime);
            this.obstacles.update(deltaTime);
            this.checkCollisions();
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.obstacles.draw(context);
            if (this.gameOver) {
                context.textAlign = 'center';
                context.fillStyle = 'rgba(0,0,0,0.7)';
                context.fillRect(0, 0, this.width, this.height);
                context.font = '50px Changa';
                context.fillStyle = 'white';
                context.fillText('انتهت اللعبة', this.width * 0.5, this.height * 0.5 - 20);
                context.font = '25px Changa';
                context.fillText('اضغط على أي مستوى صعوبة للعب مرة أخرى', this.width * 0.5, this.height * 0.5 + 30);
            }
        }

        checkCollisions() {
            this.obstacles.obstacles.forEach(obstacle => {
                const collisionMarginX = 35;
                const collisionMarginY = 35;
                if (
                    this.player.x < obstacle.x + obstacle.width - collisionMarginX &&
                    this.player.x + this.player.width > obstacle.x + collisionMarginX &&
                    this.player.y < obstacle.y + obstacle.height - collisionMarginY &&
                    this.player.y + this.player.height > obstacle.y + collisionMarginY
                ) {
                    this.gameOver = true;
                    this.player.switchAnimation(this.player.animations.dying);
                }
            });
        }
    }

    let game;
    let lastTime = 0;

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) {
            requestAnimationFrame(animate);
        }
    }
    
    function startGame(difficulty) {
        console.log(`Starting game with difficulty: ${difficulty}`);
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        gameCanvas.style.display = 'block';
        game = new Game(gameCanvas.width, gameCanvas.height);
        lastTime = 0;
        animate(0);
    }

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (musicToggle.checked) { toggleMusic(true); }
            startGame(btn.dataset.difficulty);
        });
    });

    // --- 4. التحميل الأولي للإعدادات (Initial Settings Load) ---
    function initializeSettings() {
        const savedLang = localStorage.getItem('gameLanguage') || 'ar';
        languageToggle.checked = savedLang === 'en';
        setLanguage(savedLang);
        const musicEnabled = JSON.parse(localStorage.getItem('musicEnabled') !== 'false');
        musicToggle.checked = musicEnabled;
    }
    
    initializeSettings();
});