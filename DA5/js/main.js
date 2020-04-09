var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game',
        scene: [BootScene, PreloaderScene, MultiMenuScene, LoseScene, WinScene, GameScene],
        physics: {
            default: 'arcade',
            arcade: {debug: false},
            debug: true,
            gravity: {y: 50}
        },
};

game = new Phaser.Game(config);