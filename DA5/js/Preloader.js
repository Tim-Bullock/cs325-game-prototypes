class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({key: "Preloader"});
    }
    
    preload() {
        // Load the game logo and the loading screen background.
        this.background = this.add.image(400, 300, 'menu_background')
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
        this.load.image('power', 'assets/power.png');
        this.load.image('aim', 'assets/aim.png');
        this.load.image('explosion', 'assets/explosion.png');
    }
    
    onClick() {
        this.scene.start('MultiplayerMenu');
    }
}