var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game',
        scene: [BootScene, PreloaderScene, LoseScene, WinScene, GameScene],
        physics: {
            default: 'arcade'
        },
};

game = new Phaser.Game(config);