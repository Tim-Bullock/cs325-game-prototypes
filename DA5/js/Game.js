class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }
    
    init(data) {
        this.firstPlayer = data.firstPlayer;
        this.turn = this.firstPlayer;
        this.p1Castle = data.p1Castle;
        this.p2Castle = data.p2Castle;
    }
    
    create() {

        this.physics.world.gravity.y = 50;

        // Draw The Menu Background
        this.background = this.add.image(400, 300, 'menu_background')
            .setScale(0.6);
        switch(this.firstPlayer) {
            case 1: 
                this.turnText = this.add.text(400, 60, "Player One Goes First...")
                    .setFontFamily("Candara")
                    .setFontSize(48)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5);
                break;
            case 2: 
                this.turnText = this.add.text(400,60, "Player Two Goes First...")
                    .setFontFamily("Candara")
                    .setFontSize(48)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5);
                break;
            default: break;
        }
        
        this.attackButton = this.add.image(200, 500, 'button1')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setInteractive().on('pointerdown', () => this.attack(this.turn));
            
        this.attackText = this.add.text(200, 500, "Attack")
            .setFontFamily("Candara")
            .setFontSize(26)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setAlpha(1);
            
        this.p1AttackText = this.add.text(400, 550, "Only attacking is implemented so far and powerups\n block health, and different weapons will\n be implemented in next prototype")
            .setFontFamily("Candara")
            .setFontSize(14)
            .setColor('#000000')
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5);
            
            
        this.defendButton = this.add.image(600, 500, 'button2')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setInteractive().on('pointerdown', () => this.deffend(this.turn));
        this.defendText = this.add.text(600, 500, "Defend")
            .setFontFamily("Candara")
            .setFontSize(26)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setAlpha(1);
        
        this.turnFadeTween = this.tweens.add({
            paused: true,
            targets: [this.turnText, this.attackButton, this.defendButton, this.attackText, this.defendText],
            alpha: 0,
            duration: 1000,
            delay: 0,
            ease: 'Power1'
        }, this);
        
        
        this.p1AttackMenu = this.physics.add.staticGroup();
        this.p1AttackMenuBox = this.add.rectangle(50,50,250,500, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4);
        this.p1AttackMenu.add(this.p1AttackMenuBox);
        this.p1AttackText = this.add.text(175, 100, "Player One\nis Attacking")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5);
        this.p1AttackMenu.add(this.p1AttackText);
        this.p1AttackMenu.setVisible(false);
        
        this.p2AttackMenu = this.physics.add.staticGroup();
        this.p2AttackMenuBox = this.add.rectangle(500,50,250,500, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4);
        this.p2AttackMenu.add(this.p2AttackMenuBox);
        this.p2AttackText = this.add.text(625, 100, "Player Two\nis Attacking")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5);
        this.p2AttackMenu.add(this.p2AttackText);
        this.p2AttackMenu.setVisible(false);
        
        this.aimer = this.add.image(100, 300, 'aim')
            .setScale(0.1, 0.1)
            .setDepth(2)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.powerMeter = this.add.image(335, 300, 'power')
            .setAngle(-90)
            .setScale(.8, .8)
            .setDepth(2)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.powerMeterIndic = this.add.rectangle(350,500,57,10, 0x0000)
            .setDepth(3)
            .setOrigin(0.5,0.5)
            .setVisible(false);
        
        this.p1aimerHorizontalTween = this.tweens.add({
            paused: true,
            targets: this.aimer,
            x: 740,
            duration: 700,
            yoyo: true,
            repeat: -1,
            delay: 0,
            ease: 'circular'
        }, this);
        
        this.p2aimerHorizontalTween = this.tweens.add({
            paused: true,
            targets: this.aimer,
            x: 400,
            duration: 700,
            yoyo: true,
            repeat: -1,
            delay: 0,
            ease: 'circular'
        }, this);
        
        this.aimerVerticalTween = this.tweens.add({
            paused: true,
            targets: this.aimer,
            y: {from: 30, to: 570, start: 300},
            duration: 700,
            yoyo: true,
            repeat: -1,
            delay: 0,
            ease: 'circular'
        }, this);
        
        this.powerTween = this.tweens.add({
            paused: true,
            targets: this.powerMeterIndic,
            y: {from: 100, to: 500, start: 500},
            duration: 700,
            yoyo: true,
            repeat: -1,
            delay: 0,
            ease: 'power1'
        }, this);
        
        this.blastTween = this.tweens.add({
            paused: true,
            targets: this.blast,
            
            duration: 1000,
            delay: 0,
        }, this);
        
        this.platforms = this.physics.add.staticGroup();
        this.buildCastle(1, this.p1Castle);
        this.buildCastle(2, this.p2Castle);
        
        this.blast = this.add.sprite(0, 0, 'explosion').setActive(false).setVisible(false);
        this.physics.add.existing(this.blast);
        this.physics.add.overlap(this.p1CastleGroup, this.blast, this.castleHit, null, this.scene);
        this.physics.add.overlap(this.p2CastleGroup, this.blast, this.castleHit, null, this.scene);

    }
    
    attack(turn) {
        this.turnFadeTween.play();
        this.xCord = 0;
        this.yCord = 0;
        this.powerLevel = 0;
        this.inAttack = true;
        this.xSet = false;
        this.ySet = false;
        this.powerSet = false;
        
        if(turn == 1) {
            this.p1AttackMenu.setVisible(true);
            this.aimer.setX(400);
            this.aimer.setVisible(true);
            this.p1aimerHorizontalTween.play();
            
            
        } else {
            this.p2AttackMenu.setVisible(true);
            this.aimer.setX(60);
            this.aimer.setVisible(true);
            this.p2aimerHorizontalTween.play();
        }
        
        this.input.keyboard.on('keydown_ENTER', function(event) {
            if (this.turn ==1) {
                if (!(this.xset)) {
                    this.p1aimerHorizontalTween.pause();
                    this.xCord = this.aimer.x;
                    this.xset = true;
                    console.log("ENTER pressed: xCord");
                    console.log(this.xCord);
                    this.aimerVerticalTween.play();
                } else if (!(this.yset)) {
                    this.aimerVerticalTween.pause();
                    this.yCord = this.aimer.y;
                    this.yset = true;
                    console.log("ENTER pressed: yCord");
                    console.log(this.yCord);
                    this.powerMeter.setVisible(true);
                    this.powerMeterIndic.setVisible(true);
                    this.powerTween.play();
                } else if (!(this.powerSet)) {
                    this.powerTween.pause();
                    this.powerLevel = 100- 1/5*this.powerMeterIndic.y;
                    this.powerSet = true;
                    console.log("ENTER pressed: powerLevel");
                    console.log(this.powerLevel);
                    this.blast.setX(this.xCord).setY(this.yCord).setActive(true).setVisible(true);
                    this.aimer.setVisible(false);
                    this.powerMeter.setVisible(false);
                    this.powerMeterIndic.setVisible(false);
                    this.input.keyboard.removeAllListeners();
                        this.p1AttackMenu.setVisible(false);
                        this.turnText.setText("Player Two's Turn");
                        this.turnText.setVisible(true).setAlpha(1);
                        this.attackButton.setVisible(true).setAlpha(1);
                        this.defendButton.setVisible(true).setAlpha(1);
                        this.attackText.setVisible(true).setAlpha(1);
                        this.defendText.setVisible(true).setAlpha(1);
                        this.turn = 2;
                }
            } else {
                if (!(this.xset)) {
                    this.p2aimerHorizontalTween.pause();
                    this.xCord = this.aimer.x;
                    this.xset = true;
                    console.log("ENTER pressed: xCord");
                    console.log(this.xCord);
                    this.aimerVerticalTween.play();
                } else if (!(this.yset)) {
                    this.aimerVerticalTween.pause();
                    this.yCord = this.aimer.y;
                    this.yset = true;
                    console.log("ENTER pressed: yCord");
                    console.log(this.yCord);
                    this.powerMeter.setVisible(true);
                    this.powerMeterIndic.setVisible(true);
                    this.powerTween.play();
                } else if (!(this.powerSet)) {
                    this.powerTween.pause();
                    this.powerLevel = 100- 1/5*this.powerMeterIndic.y;
                    this.powerSet = true;
                    console.log("ENTER pressed: powerLevel");
                    console.log(this.powerLevel);
                    this.blast.setX(this.xCord).setY(this.yCord).setActive(true).setVisible(true);
                    this.aimer.setVisible(false);
                    this.powerMeter.setVisible(false);
                    this.powerMeterIndic.setVisible(false);

                    this.p2AttackMenu.setVisible(false).setAlpha(1);
                    this.turnText.setText("Player One's Turn").setAlpha(1);
                    this.turnText.setVisible(true).setAlpha(1);
                    this.attackButton.setVisible(true).setAlpha(1);
                    this.defendButton.setVisible(true).setAlpha(1);
                    this.attackText.setVisible(true).setAlpha(1);
                    this.defendText.setVisible(true).setAlpha(1);
                    this.turn = 1;
                }
            }
        }, this);
    }
    
    defend(turn) {
        this.turnFadeTween.play();
        if(turn == 1) {
            this.p1DefendMenu.setVisible(true);
        } else {
            this.p2DefendMenu.setVisible(true);
        }
    }
    
    buildCastle(turn, castle) {
        if (turn == 1) {
            switch(castle) {
                case 1:
                    console.log("P1 building Castle 1");
                    this.p1CastleGroup = this.physics.add.group();
                    this.p1Ground = this.add.rectangle(200,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.p1c1b1 = this.add.image(91,292, 'c1b1').setOrigin(0,1);
                    this.p1c1b2 = this.add.image(100,356, 'c1b2').setOrigin(0,1);
                    this.p1c1b3 = this.add.image(100,420, 'c1b3').setOrigin(0,1);
                    this.p1c1b4 = this.add.image(172,348, 'c1b4').setOrigin(0,1);
                    this.p1c1b5 = this.add.image(172,420, 'c1b5').setOrigin(0,1);
                    this.p1c1b6 = this.add.image(234,194, 'c1b6').setOrigin(0,1);
                    this.p1c1b7 = this.add.image(245,269, 'c1b7').setOrigin(0,1);
                    this.p1c1b8 = this.add.image(245,346, 'c1b8').setOrigin(0,1);
                    this.p1c1b9 = this.add.image(245,420, 'c1b9').setOrigin(0,1);
                    this.p1CastleGroup.add(this.p1c1b1, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b2, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b3, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b4, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b5, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b6, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b7, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b8, {key: 'block'});
                    this.p1CastleGroup.add(this.p1c1b9, {key: 'block'});
                    this.platforms.add(this.p1Ground);
                    
                    this.physics.add.collider(this.p1Ground, this.p1CastleGroup);
                    this.physics.add.collider(this.p1CastleGroup, this.p1CastleGroup); 
                    break;

                case 2: console.log("P1 building Castle 2"); break;
                case 3: console.log("P1 building Castle 3"); break;
                case 4: console.log("P1 building Castle 4"); break;
                default: break;
            }
        } else{
            switch(castle) {
                case 1: console.log("P2 building Castle 1");
                    this.p2CastleGroup = this.physics.add.group();
                    this.p2Ground = this.add.rectangle(600,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.p2c1b1 = this.add.image(491,292, 'c1b1').setOrigin(0,1);
                    this.p2c1b2 = this.add.image(500,356, 'c1b2').setOrigin(0,1);
                    this.p2c1b3 = this.add.image(500,420, 'c1b3').setOrigin(0,1);
                    this.p2c1b4 = this.add.image(572,348, 'c1b4').setOrigin(0,1);
                    this.p2c1b5 = this.add.image(572,420, 'c1b5').setOrigin(0,1);
                    this.p2c1b6 = this.add.image(634,194, 'c1b6').setOrigin(0,1);
                    this.p2c1b7 = this.add.image(645,269, 'c1b7').setOrigin(0,1);
                    this.p2c1b8 = this.add.image(645,346, 'c1b8').setOrigin(0,1);
                    this.p2c1b9 = this.add.image(645,420, 'c1b9').setOrigin(0,1);
                    this.p2CastleGroup.add(this.p2c1b1, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b2, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b3, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b4, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b5, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b6, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b7, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b8, {key: 'block'});
                    this.p2CastleGroup.add(this.p2c1b9, {key: 'block'});
                    this.platforms.add(this.p2Ground);
                    
                    this.physics.add.collider(this.p2Ground, this.p2CastleGroup);
                    this.physics.add.collider(this.p2CastleGroup, this.p2CastleGroup); 
                    break;
                case 2: console.log("P2 building Castle 2"); break;
                case 3: console.log("P2 building Castle 3"); break;
                case 4: console.log("P2 building Castle 4"); break;
                default: break;
            }
        }
    }

    castleHit(block, blast) {
        console.log("hit");
        blast.setVisible(false).setX(0).setY(0).setActive(false);
        block.destroy();
    }

    update() {
    
    }
}