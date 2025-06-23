console.log("obstacles.js loaded");

// الفئة الأساسية لأي عائق
class Obstacle {
    constructor(image, gameWidth, gameHeight, type) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = image;
        this.width = image.width * 0.7; // تصغير حجم العائق قليلاً
        this.height = image.height * 0.7;
        this.x = this.gameWidth;
        this.type = type;

        // تحديد الموقع الرأسي بناءً على نوع العائق
        if (this.type === 'flying') {
            // اليقطين يظهر في منتصف الشاشة تقريبًا
            this.y = this.gameHeight * 0.5 - this.height;
        } else {
            // الصبار يظهر على الأرض
            this.y = this.gameHeight - this.height - 40; // 40 هو ارتفاع الأرضية
        }

        this.speed = 5; // سرعة حركة العائق
        this.markedForDeletion = false;
    }
    update() {
        this.x -= this.speed;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// مدير العقبات الذي ينشئها ويديرها
class ObstacleManager {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        // تحميل صور العقبات
        this.groundObstacleImages = [ 'prop_cactus_detailed.png' ];
        this.flyingObstacleImages = [ 'prop_pumpkin_ghost.png' ];
        
        // تحويل الأسماء إلى كائنات صور حقيقية
        this.groundObstaclesPool = this.groundObstacleImages.map(src => { const i = new Image(); i.src = 'assets/images/props/' + src; return i; });
        this.flyingObstaclesPool = this.flyingObstacleImages.map(src => { const i = new Image(); i.src = 'assets/images/props/' + src; return i; });

        this.obstacles = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 2500; // إضافة عائق كل 2.5 ثانية
    }

    update(deltaTime) {
        if (this.obstacleTimer > this.obstacleInterval) {
            this.addObstacle();
            this.obstacleTimer = 0;
            this.obstacleInterval = Math.random() * 2000 + 1500; // فاصل زمني عشوائي
        } else {
            this.obstacleTimer += deltaTime;
        }
        this.obstacles.forEach(obs => obs.update());
        this.obstacles = this.obstacles.filter(obs => !obs.markedForDeletion);
    }

    draw(context) {
        this.obstacles.forEach(obs => obs.draw(context));
    }

    // دالة ذكية لإضافة عائق بشكل عشوائي (طائر أو أرضي)
    addObstacle() {
        const obstacleType = Math.random() < 0.5 ? 'ground' : 'flying';
        
        if (obstacleType === 'ground') {
            const image = this.groundObstaclesPool[Math.floor(Math.random() * this.groundObstaclesPool.length)];
            this.obstacles.push(new Obstacle(image, this.gameWidth, this.gameHeight, 'ground'));
        } else {
            const image = this.flyingObstaclesPool[Math.floor(Math.random() * this.flyingObstaclesPool.length)];
            this.obstacles.push(new Obstacle(image, this.gameWidth, this.gameHeight, 'flying'));
        }
    }
}