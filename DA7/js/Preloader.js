class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({key: "Preloader"});
    }
    
    preload() {
        // Load the game logo and the loading screen background.
        this.background = this.add.image(400, 300, 'background')
            .setScale(0.6);
        this.logo = this.add.image(400,300, 'logo').setScale(0.4);
        
        // Create a loading bar and text
        this.loadingText = this.add.text(400, 560, "Loading...")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5);

        this.progressBox = this.add.rectangle(400,500,400,20, 0xBBBBBB)
            .setStrokeStyle(2,0xFFFFFF);
        this.progressBar = this.add.graphics();
        
        // Update the progress bar based on the loading of assets
        this.load.on('progress', function (value) {
            this.scene.progressBar.clear();
            this.scene.progressBar.fillStyle(0xAA0000, 1);
            this.scene.progressBar.fillRect(201, 491, 398 * value, 18);
        });

        // Once the loading is complete, go to the main menu
        this.fadeTween = this.tweens.add({
            paused: true,
            targets: [this.progressBar, this.progressBox, this.loadingText],
            alpha: 0,
            duration: 2000,
            delay: 1000,
            ease: 'Power1'
        }, this);

        // Add Menu Buttons
        this.startMultiButton = this.add.image(400, 350, 'button1')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setInteractive().on('pointerdown', () => this.onClick());
        
        this.multiText = this.add.text(400, 350, "Start Multiplayer Game")
            .setFontFamily("Candara")
            .setFontSize(26)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setAlpha(0);

        this.startSingleButton = this.add.image(400, 450, 'button2')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setAlpha(0);

        this.singleText = this.add.text(400, 450, "Start Singleplayer Game\n(coming soon)")
            .setFontFamily("Candara")
            .setFontSize(26)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setAlpha(0);

        // Tweens for starting menu
        this.logoTween = this.tweens.add({
            paused: true,
            targets: this.logo,
            y: 150,
            duration: 2000,
            delay: 1000,
            ease: 'Power1'
        }, this);

        this.buttonTween = this.tweens.add({
            paused: true,
            targets: [this.startMultiButton, this.multiText, this.startSingleButton, this.singleText],
            alpha: 1,
            duration: 1000,
            delay: 2400,
            ease: 'Power1'
        }, this);
        
        // Once the assets are finished loading, show the start menu
        this.load.on('complete', function() {
            this.scene.loadingText.setText('Loading Complete!')
            this.scene.fadeTween.play();
            this.scene.logoTween.play();
            this.scene.buttonTween.play();
        });
        
        // Load Game Assets
        this.load.image('castle1', 'assets/castle1.png');
        this.load.image('castle2', 'assets/castle2.png');
        this.load.image('castle3', 'assets/castle3.png');
        this.load.image('castle4', 'assets/castle4.png');
        this.load.image('c1b1', 'assets/castle1/c1b1.png');
        this.load.image('c1b2', 'assets/castle1/c1b2.png'); 
        this.load.image('c1b3', 'assets/castle1/c1b3.png');
        this.load.image('c1b4', 'assets/castle1/c1b4.png');
        this.load.image('c1b5', 'assets/castle1/c1b5.png');
        this.load.image('c1b6', 'assets/castle1/c1b6.png');
        this.load.image('c1b7', 'assets/castle1/c1b7.png');
        this.load.image('c1b8', 'assets/castle1/c1b8.png');
        this.load.image('c1b9', 'assets/castle1/c1b9.png');
        this.load.image('c2b1', 'assets/castle2/c2b1.png');
        this.load.image('c2b2', 'assets/castle2/c2b2.png'); 
        this.load.image('c2b3', 'assets/castle2/c2b3.png');
        this.load.image('c2b4', 'assets/castle2/c2b4.png');
        this.load.image('c2b5', 'assets/castle2/c2b5.png');
        this.load.image('c2b6', 'assets/castle2/c2b6.png');
        this.load.image('c2b7', 'assets/castle2/c2b7.png');
        this.load.image('c2b8', 'assets/castle2/c2b8.png');
        this.load.image('c2b9', 'assets/castle2/c2b9.png');
        this.load.image('c2b10', 'assets/castle2/c2b10.png');
        this.load.image('c2b11', 'assets/castle2/c2b11.png');
        this.load.image('c2b12', 'assets/castle2/c2b12.png');
        this.load.image('c3b1', 'assets/castle3/c3b1.png');
        this.load.image('c3b2', 'assets/castle3/c3b2.png'); 
        this.load.image('c3b3', 'assets/castle3/c3b3.png');
        this.load.image('c3b4', 'assets/castle3/c3b4.png');
        this.load.image('c3b5', 'assets/castle3/c3b5.png');
        this.load.image('c3b6', 'assets/castle3/c3b6.png');
        this.load.image('c3b7', 'assets/castle3/c3b7.png');
        this.load.image('c3b8', 'assets/castle3/c3b8.png');
        this.load.image('c3b9', 'assets/castle3/c3b9.png');
        this.load.image('c3b10', 'assets/castle3/c3b10.png');
        this.load.image('c4b1', 'assets/castle4/c4b1.png');
        this.load.image('c4b2', 'assets/castle4/c4b2.png'); 
        this.load.image('c4b3', 'assets/castle4/c4b3.png');
        this.load.image('c4b4', 'assets/castle4/c4b4.png');
        this.load.image('c4b5', 'assets/castle4/c4b5.png');
        this.load.image('c4b6', 'assets/castle4/c4b6.png');
        this.load.image('c4b7', 'assets/castle4/c4b7.png');
        this.load.image('c4b8', 'assets/castle4/c4b8.png');
        this.load.image('c4b9', 'assets/castle4/c4b9.png');
        this.load.image('c4b10', 'assets/castle4/c4b10.png');
        this.load.image('health', 'assets/health1.png');
        this.load.image('power', 'assets/power.png');
        this.load.image('aim', 'assets/aim.png');
        this.load.spritesheet('explosion', 'assets/explosion2.png',{frameWidth: 64, frameHeight: 64});
        this.load.audio('music', 'assets/background_music.mp3');
        this.load.image('accuracy_potion', 'assets/accuracy_potion.png');
        this.load.image('fire_cannon', 'assets/fire_cannon.png');
        this.load.image('reg_cannon', 'assets/reg_cannon.png');
        this.load.image('sneak_attack', 'assets/sneak_attack.png');
        this.load.image('trebuchet', 'assets/trebuchet.png');
        this.load.image('bronze', 'assets/bronze.png');
        this.load.image('silver', 'assets/silver.png');
        this.load.image('gold', 'assets/gold.png');
    }
    
    onClick() {
        this.scene.start('MultiplayerMenu');
    }
}