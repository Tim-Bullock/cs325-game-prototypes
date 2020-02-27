class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({key: "Preloader"});
    }
    
    preload() {
        this.logo = this.add.image(400, 300, 'background');
        this.background = this.add.image(400,80, 'logo').setScale(0.4);
        
        var loadingText = this.add.text(400, 580, "Loading...", {fontFamily: "Broadway"}).setOrigin(0.5,0.5);
        
        var startButton = this.add.image(700,555, 'button').setScale(0.25).setVisible(false);
        var startButtonText = this.add.text(700,555, "Start!",{fontFamily: "Broadway"}).setOrigin(0.5,0.5).setVisible(false);
        
        startButton.setInteractive().on('pointerdown', () => this.onClick());

        var instructionText = this.add.text(460, 480, "Someone has brought all their cats\nto the Laundromat! Escape before\n they claw and tear your laundry!");
    
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0xFFFFFF, 0.2);
        progressBox.fillRect(245, 545, 310, 20);


        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x660000, 1);
            progressBar.fillRect(250, 550, 300 * value, 10);
        });

        this.load.on('complete', function() {
            loadingText.setText('Loading Complete!')
            startButton.setVisible(true);
            startButtonText.setVisible(true);
        });


        // Load Game Assets
        this.load.tilemapTiledJSON('laundromatMap', 'assets/laundromat_tilemap.json');
        this.load.audio('music', 'assets/background_cartoon_music.mp3');
        this.load.audio('winningTune', 'assets/winning_tune.mp3');
        this.load.audio('catMeow', 'assets/cat_meow.mp3');
        this.load.image('floor', 'assets/floor.png');
        this.load.image('washer', 'assets/washer_tileset_image.png');
        this.load.image('storefront', 'assets/storefront.png');
        this.load.spritesheet('playerSpritesheet', 'assets/spritesheet.png', {frameWidth: 142, frameHeight: 212});
        this.load.spritesheet('catSpritesheet', 'assets/cat_spritesheet.png', {frameWidth: 512, frameHeight: 256});
    }

    onClick() {
        this.scene.start('Game');
    }
    
    create() {
        
    }
}