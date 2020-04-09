class WinScene extends Phaser.Scene {
    constructor() {
        super({key: "Win"});
    }
    
    create() {
        this.add.image(400, 300, 'background');
        this.add.image(400,80, 'logo').setScale(0.4);

        var startButtonText = this.add.text(400,400, "YOU WIN",{fontFamily: "Broadway", fontSize: '100px', color: '#770000'}).setOrigin(0.5,0.5);
        var startButton = this.add.image(400,555, 'button').setScale(0.25);
        var startButtonText = this.add.text(400,555, "Restart",{fontFamily: "Broadway"}).setOrigin(0.5,0.5);
        
        startButton.setInteractive().on('pointerdown', () => this.onClick());
    }  

    onClick() {
        this.scene.start('Game');
    }
}