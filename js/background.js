console.log("background.js loaded");

// فئة صغيرة لتمثيل أي عنصر متحرك في الخلفية
class WorldProp {
    constructor(image, x, y, speed, scale = 1) {
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.x = x;
        this.y = y;
        this.speed = speed;
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

// الفئة الرئيسية التي تبني وتدير العالم
class Background {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        // --- تحميل كل الأصول مرة واحدة ---
        this.backgroundImages = [
            'bg_desert_day.png', 'bg_desert_dusk.png', 'bg_castle.png', 'bg_autumn_forest.png', 'bg_pine_forest.png', 'bg_summer_forest.png'
        ].map(src => { const i = new Image(); i.src = 'assets/images/backgrounds/' + src; return i; });
        
        this.propImages = {};
        const propSources = [
            'prop_castle.png', 'prop_house_green.png', 'prop_house_red.png', 'prop_tower.png', 'prop_pyramid.png',
            'prop_tree_green.png', 'prop_tree_orange.png', 'prop_tree_dead.png', 'prop_tree_palm.png', 'prop_bush_green.png', 'prop_bush_orange.png', 'prop_cactus.png',
            'prop_cloud_1.png', 'prop_cloud_2.png', 'prop_sun.png', 'prop_moon.png'
        ];
        propSources.forEach(src => {
            const name = src.replace('.png', '');
            this.propImages[name] = new Image();
            this.propImages[name].src = 'assets/images/props/' + src;
        });

        // --- تعريف "وصفات" العوالم (Themes) ---
        this.themes = [
            { name: "Desert Day", base: this.backgroundImages[0], farProps: ['prop_pyramid'], nearProps: ['prop_tree_palm', 'prop_cactus'], skyProps: ['prop_sun', 'prop_cloud_1'] },
            { name: "Spooky Castle", base: this.backgroundImages[2], farProps: ['prop_castle', 'prop_tower'], nearProps: ['prop_tree_dead'], skyProps: ['prop_moon', 'prop_cloud_2'] },
            { name: "Autumn Forest", base: this.backgroundImages[3], farProps: ['prop_house_red'], nearProps: ['prop_tree_orange', 'prop_bush_orange'], skyProps: ['prop_cloud_1'] },
            { name: "Pine Forest", base: this.backgroundImages[4], farProps: ['prop_house_green'], nearProps: ['prop_tree_green', 'prop_bush_green'], skyProps: ['prop_cloud_1', 'prop_cloud_2'] }
        ];
        
        this.currentTheme = this.themes[0];
        this.layers = { sky: [], far: [], near: [] };
        this.timers = { sky: 0, far: 0, near: 0, theme: 0 };
        this.intervals = { sky: 6000, far: 10000, near: 1500, theme: 30000 };
    }

    update(deltaTime) {
        this.handleLayer(deltaTime, 'sky', 0.2, 0.4);
        this.handleLayer(deltaTime, 'far', 0.5, 0.8);
        this.handleLayer(deltaTime, 'near', 1.0, 1);
        
        this.timers.theme += deltaTime;
        if (this.timers.theme > this.intervals.theme) {
            this.timers.theme = 0;
            this.changeTheme();
        }
    }
    
    draw(context) {
        context.drawImage(this.currentTheme.base, 0, 0, this.gameWidth, this.gameHeight);
        Object.values(this.layers).forEach(layer => {
            layer.forEach(prop => prop.draw(context));
        });
        context.fillStyle = '#3a2d27';
        context.fillRect(0, this.gameHeight - 40, this.gameWidth, 40);
    }

    handleLayer(deltaTime, layerName, speedModifier, scale) {
        this.timers[layerName] += deltaTime;
        if (this.timers[layerName] > this.intervals[layerName]) {
            this.timers[layerName] = 0;
            const propList = this.currentTheme[`${layerName}Props`];
            if (propList && propList.length > 0) {
                const propName = propList[Math.floor(Math.random() * propList.length)];
                const image = this.propImages[propName];
                const yPos = (layerName === 'sky') ? Math.random() * 150 : this.gameHeight - image.height * scale - 20;
                this.layers[layerName].push(new WorldProp(image, this.gameWidth, yPos, 2 * speedModifier, scale));
            }
        }
        this.layers[layerName].forEach(prop => prop.update());
        this.layers[layerName] = this.layers[layerName].filter(prop => !prop.markedForDeletion);
    }
    
    changeTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];
        console.log("Theme changed to: " + this.currentTheme.name);
    }
}