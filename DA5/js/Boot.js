class BootScene extends Phaser.Scene {
    constructor() {
        super({key: "Boot"});
    }
    
    preload() {
        // Load assets required for the Preloader Scene
        this.load.image('menu_background', 'assets/menu_background.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('button1', 'assets/button1.png');
        this.load.image('button2', 'assets/button2.png');
    }
    
    create() {
        // Start the Preloader Screen
        this.scene.start('Preloader');

    }  
}