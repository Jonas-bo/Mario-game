console.log("player.js loaded");

class Player {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 120;
        this.height = 120;
        this.x = 50;
        // نضبط ارتفاع الأرضية ليكون 40 بكسل
        this.groundY = gameHeight - 40;
        this.y = this.groundY - this.height;
        this.vy = 0; // السرعة الرأسية
        this.weight = 0.8; // قوة الجاذبية
        
        this.animations = { running: [], jumping: [], dying: [] };
        this.loadAnimations();
        
        this.currentAnimation = this.animations.running;
        this.frame = 0;
        this.frameTimer = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
    }

    loadAnimations() {
        // هذا الجزء لا يتغير
        for (let i = 1; i <= 12; i++) { const img = new Image(); img.src = `assets/images/player/running/run_${i}.png`; this.animations.running.push(img); }
        for (let i = 1; i <= 6; i++) { const img = new Image(); img.src = `assets/images/player/jumping/jump_${i}.png`; this.animations.jumping.push(img); }
        for (let i = 1; i <= 15; i++) { const img = new Image(); img.src = `assets/images/player/dying/die_${i}.png`; this.animations.dying.push(img); }
    }

    draw(context){
        if (this.currentAnimation[this.frame]) {
            context.drawImage(this.currentAnimation[this.frame], this.x, this.y, this.width, this.height);
        }
    }

    update(input, deltaTime){
        // --- التحكم بالقفز ---
        // إذا تم النقر واللاعب على الأرض، اقفز!
        if (input.tapped && this.onGround()){
            this.vy = -22; // قوة القفزة (رقم سالب للذهاب للأعلى). يمكنك تغيير هذا الرقم لزيادة أو تقليل ارتفاع القفزة.
        }
        
        // --- تطبيق الجاذبية ---
        this.y += this.vy;
        if (!this.onGround()){
            this.vy += this.weight;
            this.switchAnimation(this.animations.jumping);
        } else {
            this.vy = 0;
            // التأكد من أن اللاعب يقف تمامًا على الخط الصحيح للأرضية
            this.y = this.groundY - this.height;
            this.switchAnimation(this.animations.running);
        }

        // --- تحديث إطار الحركة ---
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.frame++;
            if (this.frame >= this.currentAnimation.length) {
                this.frame = 0;
            }
        }
    }

    onGround(){
        // يعتبر اللاعب على الأرض إذا كان عند أو أسفل خط الأرضية
        return this.y >= this.groundY - this.height;
    }

    switchAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frame = 0;
        }
    }
}