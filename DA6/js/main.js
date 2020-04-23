var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: {y: 50}
            },
        },
        scene: [BootScene, PreloaderScene, MultiMenuScene, WinScene, GameScene]
};

game = new Phaser.Game(config);