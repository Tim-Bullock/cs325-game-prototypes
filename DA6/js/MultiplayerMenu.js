

class MultiMenuScene extends Phaser.Scene {
    constructor() {
        super({key: "MultiplayerMenu"});
    }

    
    create() {
        // Draw The Background
        this.background = this.add.image(400, 300, 'background')
            .setScale(0.6);
        
        // Start the background music
        this.backgroundmusic = this.sound.add('music', {loop: true});
        this.backgroundmusic.play();
        
        // Variables to store castle selections and ready
        this.p1Castle = 0;
        this.p2Castle = 0;
        this.ready = false;

        // Draw the Player 1 Menu Rectangles and Castle Choices
        this.player1Menu = this.add.rectangle(50,50,325,450, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0);
        var p1Text = this.add.text(200, 80, "Player One")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5);
        var p1Inst = this.add.text(75, 150, "Select A Castle...)")
            .setFontFamily("Candara")
            .setFontSize(28)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0.5);

        this.p1castle1box = this.add.rectangle(75,175,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p1Castle = 1;
                this.scene.p1castle1box.setFillStyle(0xAA0000,1);
                this.scene.p1castle2box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle3box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle4box.setFillStyle(0xFFFFFF,1);
            });
        this.p1c1 = this.add.image(138, 238, 'castle1')
            .setScale(.2)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.p1castle2box = this.add.rectangle(225,175,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p1Castle = 2;
                this.scene.p1castle1box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle2box.setFillStyle(0xAA0000,1);
                this.scene.p1castle3box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle4box.setFillStyle(0xFFFFFF,1);
            });
        this.p1c2 = this.add.image(288, 238, 'castle2')
            .setScale(.15)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.p1castle3box = this.add.rectangle(75,325,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p1Castle = 3;
                this.scene.p1castle1box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle2box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle3box.setFillStyle(0xAA0000,1);
                this.scene.p1castle4box.setFillStyle(0xFFFFFF,1);
            });
        this.p1c3 = this.add.image(138, 388, 'castle3')
            .setScale(.2)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.p1castle4box = this.add.rectangle(225,325,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p1Castle = 4;
                this.scene.p1castle1box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle2box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle3box.setFillStyle(0xFFFFFF,1);
                this.scene.p1castle4box.setFillStyle(0xAA0000,1);
            });
        this.p1c4 = this.add.image(288, 388, 'castle4')
            .setScale(.2)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        // Draw the player 2 Menu Rectangles and Castle Choices
        this.player2Menu =  this.add.rectangle(425,50,325,450, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0);
        var p2Text = this.add.text(600, 80, "Player Two")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5);
        var p1Inst = this.add.text(450, 150, "Select A Castle...")
            .setFontFamily("Candara")
            .setFontSize(28)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0.5);


        this.p2castle1box = this.add.rectangle(450,175,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p2Castle = 1;
                this.scene.p2castle1box.setFillStyle(0xAA0000,1);
                this.scene.p2castle2box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle3box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle4box.setFillStyle(0xFFFFFF,1);
            });
        this.p2c1 = this.add.image(513, 238, 'castle1')
            .setScale(.2)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.p2castle2box = this.add.rectangle(600,175,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p2Castle = 2;
                this.scene.p2castle1box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle2box.setFillStyle(0xAA0000,1);
                this.scene.p2castle3box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle4box.setFillStyle(0xFFFFFF,1);
            });
        this.p2c2 = this.add.image(663, 238, 'castle2')
            .setScale(.15)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.p2castle3box = this.add.rectangle(450,325,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p2Castle = 3;
                this.scene.p2castle1box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle2box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle3box.setFillStyle(0xAA0000,1);
                this.scene.p2castle4box.setFillStyle(0xFFFFFF,1);
            });
        this.p2c3 = this.add.image(513, 388, 'castle3')
            .setScale(.2)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.p2castle4box = this.add.rectangle(600,325,125,125, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setInteractive().on('pointerdown', function () {
                this.scene.p2Castle = 4;
                this.scene.p2castle1box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle2box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle3box.setFillStyle(0xFFFFFF,1);
                this.scene.p2castle4box.setFillStyle(0xAA0000,1);
            });
        this.p1c4 = this.add.image(663, 388, 'castle4')
            .setScale(.2)
            .setOrigin(0.5, 0.5)
            .setDepth(1);


        // Draw Start Button
        this.startButton = this.add.image(400, 550, 'button1')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setInteractive().on('pointerdown', () => this.startGame())
            
        this.startText = this.add.text(400, 560, "Start Game\n")
            .setFontFamily("Candara")
            .setFontSize(26)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setAlpha(0)
            .setDepth(1);

        // Create Tween for Start Button Fade
        this.startButtonTween = this.tweens.add({
            paused: true,
            targets: [this.startButton, this.startText],
            alpha: 1,
            duration: 1000,
            delay: 0,
            ease: 'Power1'
        }, this);
    }

    update() {
        if ((this.p1Castle !=0)&&(this.p2Castle != 0)&&(this.ready == false)) {
            this.startButtonTween.play();
            this.ready = true;
        }
    }
    
    startGame() {
        this.firstPlayer = Phaser.Math.Between(1,2);
        this.scene.start('Game', {
            firstPlayer: this.firstPlayer,
            p1Castle: this.p1Castle,
            p2Castle: this.p2Castle
        });
    }
}
