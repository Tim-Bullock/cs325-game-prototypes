class BootScene extends Phaser.Scene {
    constructor() {
        super({key: "Boot"});
    }
    
    preload() {
        // Load assets required for the Preloader Scene
        this.load.image('background', 'assets/background_image.jpg');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('button', 'assets/button.png');
    }
    
    create() {
        // Start the Preloader Screen
        this.scene.start('Preloader');

    }  
}