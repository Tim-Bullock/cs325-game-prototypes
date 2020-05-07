class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }
    
    // Initialization Function - Get Data from Previous Scene
    init(data) {
        this.firstPlayer = data.firstPlayer;
        this.turn = this.firstPlayer;
        this.p1Castle = data.p1Castle;
        this.p2Castle = data.p2Castle;
    }
    
    // Create Function - Instantiate and create Game Elements
    create() {
        /********* BASIC GAME ELEMENTS AND CASTLES *********/
        // Draw the Game background
        this.background = this.add.image(400, 300, 'background')
            .setScale(0.6);
            
        // Draw the Game Platforms and chosen Castles
        this.platforms = this.physics.add.staticGroup();
        this.buildCastle(1, this.p1Castle);
        this.buildCastle(2, this.p2Castle);
        this.dispBlockHealth();
        
        //Variables For Game information (power-ups remaining, etc.)
        this.p1AccuracyPowLeft = 2;
        this.p1SneakPowLeft = 1;
        this.p1Weapon = 1;
        this.p1TurnsUntilFire = 0;
        this.p1TurnsUntilTreb = 0;
        this.p2AccuracyPowLeft = 2;
        this.p2SneakPowLeft = 1;
        this.p2Weapon = 1;
        this.p2TurnsUntilFire = 0;
        this.p2TurnsUntilTreb = 0;
        
        this.blocksRemaining = 1;
        this.p1BronzePowLeft = 2;
        this.p1SilverPowLeft = 2;
        this.p1GoldPowLeft = 1;
        this.p1DefendPow = 0;
        
        this.p2BronzePowLeft = 2;
        this.p2SilverPowLeft = 2;
        this.p2GoldPowLeft = 1;
        this.p2DefendPow = 0;
        
        /********* TURN MENU - SELECT WHICH OPERATION ATTACK OR DEFEND *********/
        // Indicate which player is going first
        switch(this.firstPlayer) {
            case 1: 
                console.log("Player One Going First");
                this.turnText = this.add.text(400, 40, "Player One Goes First...")
                    .setFontFamily("Candara")
                    .setFontSize(48)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5);
                break;
            case 2: 
                console.log("Player Two Going First");
                this.turnText = this.add.text(400,40, "Player Two Goes First...")
                    .setFontFamily("Candara")
                    .setFontSize(48)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5);
                break;
            default: break;
        }
        
        // Draw the button for attacking
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
            
        // Draw the button for Defending                
        this.defendButton = this.add.image(600, 500, 'button2')
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setInteractive().on('pointerdown', () => this.defend(this.turn));
        this.defendText = this.add.text(600, 500, "Defend")
            .setFontFamily("Candara")
            .setFontSize(26)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setAlpha(1);
            
        this.p1CastleIndicText = this.add.text(50, 80, "Player One's Castle:\nBlocks Remaining: " + this.p1CastleBlocksRemaining)
            .setFontFamily("Candara")
            .setFontSize(20)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 1)
            .setAlign('center')
            .setAlpha(1);
            
        this.p2CastleIndicText = this.add.text(500, 80, "Player Two's Castle:\nBlocks Remaining: " + this.p2CastleBlocksRemaining)
            .setFontFamily("Candara")
            .setFontSize(20)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 1)
            .setAlign('center')
            .setAlpha(1);
        
        // Tween for Fading In/Out Turn Menu UI elements
        this.turnFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.turnText, this.attackButton, this.defendButton, this.attackText, this.defendText],
            alpha: 0,
            duration: 1000,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.turnFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.turnText, this.attackButton, this.defendButton, this.attackText, this.defendText],
            alpha: 100,
            duration: 1000,
            delay: 0,
            ease: 'Power1'
        }, this);

        
        /********* ATTACK MENUS - SELECT WEAPON, POWERUP, AND AIM *********/
        
        // Draw Player 1 Attack Menu
        this.p1AttackMenuBox = this.add.rectangle(50,50,250,520, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4)
            .setAlpha(0);
        this.p1AttackText = this.add.text(175, 100, "Player One\nis Attacking")
            .setFontFamily("Candara")
            .setFontSize(40)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5)
            .setAlpha(0);
        this.p1AttackInstr = this.add.text(60, 150, "Press Enter to set aim and power.\nIf you want to use a power-up or\nspecial weapon, select one first.\nWeapons:\n\n\n\n\n\n\n\n\n\n\n\n\nPower-Ups:")
            .setFontFamily("Candara")
            .setFontSize(16)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setDepth(5)
            .setAlpha(0);
            
        // Attack Weapons
        this.p1RegCanBox = this.add.rectangle(60,230,50,50, 0xAA0000)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P1 Choosing Regular Cannon");
                this.scene.p1Weapon = 1;
                this.scene.p1RegCanBox.setFillStyle(0xAA0000,1);
                if ((this.scene.p1FireCanBox.fillColor == 0xAA0000)&&(this.scene.p1aimerHorizontalTween.timeScale != 0.5)) {
                    this.scene.p1aimerHorizontalTween.timeScale = 1;
                    this.scene.aimerVerticalTween.timeScale = 1;
                    this.scene.powerTween.timeScale = 1;
                }
                if (this.scene.p1TurnsUntilFire == 0) {
                    this.scene.p1FireCanBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.scene.p1TurnsUntilTreb == 0) {
                    this.scene.p1TrebBox.setFillStyle(0xFFFFFF,1);
                }
            });
        this.p1RegCanText = this.add.text(118, 228, "Regular Cannon\nDamage: Up to 100\nAimer Speed: Regular\nCan Use: Every Turn")
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1RegCanPic = this.add.image(85,255, 'reg_cannon')
            .setScale(.12)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p1FireCanBox = this.add.rectangle(60,290,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P1 Choosing Fire Cannon");
                this.scene.p1Weapon = 2;
                this.scene.p1aimerHorizontalTween.timeScale = 2.5;
                this.scene.aimerVerticalTween.timeScale = 2.5;
                this.scene.powerTween.timeScale = 2.5;
                this.scene.p1RegCanBox.setFillStyle(0xFFFFFF,1);
                this.scene.p1FireCanBox.setFillStyle(0xAA0000,1);
                if (this.scene.p1TurnsUntilTreb == 0) {
                    this.scene.p1TrebBox.setFillStyle(0xFFFFFF,1);
                }
            });
        this.p1FireCanText = this.add.text(118, 288, "Fire Cannon\nDamage: Up to 200\nAimer Speed: Very Fast\nCan Use: Every 3 Turns")
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);  
        this.p1FireCanPic = this.add.image(85,315, 'fire_cannon')
            .setScale(.02)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p1TrebBox = this.add.rectangle(60,350,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P1 Choosing Trebuchet");
                this.scene.p1Weapon = 3;
                this.scene.p1RegCanBox.setFillStyle(0xFFFFFF,1);
                if ((this.scene.p1FireCanBox.fillColor == 0xAA0000)&&(this.scene.p1aimerHorizontalTween.timeScale != 0.5)) {
                    this.scene.p1aimerHorizontalTween.timeScale = 1;
                    this.scene.aimerVerticalTween.timeScale = 1;
                    this.scene.powerTween.timeScale = 1;
                }
                if (this.scene.p1TurnsUntilFire == 0) {
                    this.scene.p1FireCanBox.setFillStyle(0xFFFFFF,1);
                }
                this.scene.p1TrebBox.setFillStyle(0xAA0000,1);
            });
        this.p1TrebText = this.add.text(118,348, "Trebuchet\nDamage: Up to 50, 2 Shots Per Turn\nAimer Speed: Regular\nCan Use: Every 3 Turns")
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1TrebPic = this.add.image(85,375, 'trebuchet')
            .setScale(.1)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        // Attack Power-ups
        this.p1AccuracyBox = this.add.rectangle(60,450,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                this.p1AccuracyBox.disableInteractive();
                this.p1SneakBox.setInteractive();
                console.log("P1 Clicking Accuracy Potion");
                if (this.p1SneakBox.fillColor == 0xAA0000) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(200, 430, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(200, 430, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P1 Using Accuracy Potion");
                        this.p1AccuracyBox.setFillStyle(0xAAAAAA,1);
                        this.p1AccuracyBox.disableInteractive();
                        this.p1aimerHorizontalTween.timeScale = 0.3;
                        this.aimerVerticalTween.timeScale = 0.3;
                        this.powerTween.timeScale = 0.3;
                        this.p1AccuracyPowLeft -= 1;
                        if (this.p1AccuracyPowLeft == 0) {
                            this.p1AccuracyText.setText("No More Uses Left");
                        } else {
                            this.p1AccuracyText.setText("Wait Until Next Turn to Use Again!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p1AccuracyBox.setFillStyle(0xAA0000,1);
                if (this.p1SneakBox.fillColor !== 0xAAAAAA){
                    this.p1SneakBox.setFillStyle(0xFFFFFF,1);
                }
            },this);
        this.p1AccuracyText = this.add.text(118,448, "Accuracy Potion\nEffect: Slow Down the Aimer\nUses Per Game: " + this.p1AccuracyPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1AccuracyPic = this.add.image(85,475, 'accuracy_potion')
            .setScale(.15)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);    
            
        this.p1SneakBox = this.add.rectangle(60,510,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                this.p1AccuracyBox.setInteractive();
                this.p1SneakBox.disableInteractive();
                console.log("P1 Clicking Sneak Attack");
                if (this.p1AccuracyBox.fillColor == 0xAA0000) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(200, 430, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(200, 430, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P1 Using Sneak Attack Potion");
                        this.p1SneakBox.setFillStyle(0xAAAAAA,1);
                        this.p1SneakBox.disableInteractive();
                        if (this.p1aimerHorizontalTween.isPlaying()) {
                            this.p1aimerHorizontalTween.stop();
                        }
                        if (this.aimerVerticalTween.isPlaying()) {
                            this.aimerVerticalTween.stop();
                        }
                        if (this.powerTween.isPlaying()) {
                            this.powerTween.stop();
                        }
                        this.p1SneakPowLeft -= 1;
                        if (this.p1SneakPowLeft == 0) {
                            this.p1SneakText.setText("No More Uses Left");
                        } else {
                            this.p1SneakText.setText("Wait Until Next Turn to Use Again!");
                        }
                        
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                        // Determine and remove block of least health
                        var leastHealth = 200;
                        var destroyBlock
                        this.p2CastleGroup.children.iterate(function(block) {
                            if (block.blockHealth < leastHealth) {
                                leastHealth = block.blockHealth;
                                destroyBlock = block;
                            }
                        }, this);
                        this.blast1 = this.add.sprite(destroyBlock.x+30, destroyBlock.y-30, 'explosion')
                            .setDepth(3)
                            .setOrigin(0.5,0.5)
                            .setSize(5,5); 
                        this.blast1.play("blastAnim");
                        
                        // Then Remove The Block
                        this.p2CastleBlocksRemaining -= 1;
                        this.p2CastleIndicText.setText("Player Twos's Castle:\nBlocks Remaining: " + this.p2CastleBlocksRemaining);
                        if(this.p2CastleBlocksRemaining == 0) {
                            this.start('Game', {
                                winner: 1,
                            });
                        }
                        this.time.addEvent({
                            delay: 2500,
                            callback: ()=>{
                                this.blast1.destroy();
                                this.dispBlockHealth();
                            },
                            loop: false
                        });
                        this.time.addEvent({
                            delay: 1000,
                            callback: ()=>{
                                destroyBlock.destroy();
                            },
                            loop: false
                        });
                        
                        // Then remove Player Ones's UI Elements
                        this.aimer.setVisible(false);
                        this.powerMeter.setVisible(false);
                        this.powerMeterIndic.setVisible(false);   
                        this.p1AttackMenuFadeOutTween.play();
                        // Reset Menu Options
                        if (this.p1AccuracyPowLeft > 0) {
                            this.p1AccuracyBox.setFillStyle(0xFFFFFF,1);
                            this.p1AccuracyBox.setInteractive();
                            this.p1AccuracyText.setText( "Accuracy Potion\nEffect: Slow Down the Aimer\nUses Per Game: " + this.p1AccuracyPowLeft)
                        }
                        if (this.p1SneakPowLeft > 0) {
                            this.p1SneakBox.setFillStyle(0xFFFFFF,1);
                            this.p1SneakBox.setInteractive();
                            this.p1SneakText.setText( "Sneak Attack\nEffect: Automatically Destroy the\nLowest Health Block\nUses Per Game: " + this.p1SneakPowLeft)
                        }
                        this.p1Weapon = 1;
                        this.p1RegCanBox.setFillStyle(0xAA0000,1);
                        this.p1FireCanBox.setFillStyle(0xFFFFFF,1);
                        this.p1TrebBox.setFillStyle(0xFFFFFF,1);
                        this.p1aimerHorizontalTween.timeScale = 1;
                        this.aimerVerticalTween.timeScale = 1;
                        this.powerTween.timeScale = 1;
                        
                        // Remove the listener for the keyboard
                        this.input.keyboard.removeAllListeners();
                        
                        // And set the turn Menu for player 2
                        console.log("Player Two's Turn");
                        this.turnText.setText("Player Two's Turn");
                        this.turnFadeInTween.play();
                        this.turn = 2;
                        
                        // End of P1's Attack Turn
                        
                    }, this);
                if (this.p1AccuracyBox.fillColor !== 0xAAAAAA){
                    this.p1AccuracyBox.setFillStyle(0xFFFFFF,1);
                }
                this.p1SneakBox.setFillStyle(0xAA0000,1);
            }, this);
            
        this.p1SneakText = this.add.text(118,508, "Sneak Attack\nEffect: Automatically Destroy the\nLowest Health Block\nUses Per Game: " + this.p1SneakPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1SneakPic = this.add.image(85,535, 'sneak_attack')
            .setScale(.15)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6); 
        
        
        // Draw the Player 2 Attack Menu
        this.p2AttackMenuBox = this.add.rectangle(500,50,250,520, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4)
            .setAlpha(0);
        this.p2AttackText = this.add.text(625, 100, "Player Two\nis Attacking")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5)
            .setAlpha(0);
        this.p2AttackInstr = this.add.text(510, 150, "Press Enter to set aim and power.\nIf you want to use a power-up or\nspecial weapon, select one first.\nWeapons:\n\n\n\n\n\n\n\n\n\n\n\n\nPower-Ups:")
            .setFontFamily("Candara")
            .setFontSize(16)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setDepth(5)
            .setAlpha(0);
            
        // Attack Weapons
        this.p2RegCanBox = this.add.rectangle(510,230,50,50, 0xAA0000)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Choosing Regular Cannon");
                this.scene.p2Weapon = 1;
                this.scene.p2RegCanBox.setFillStyle(0xAA0000,1);
                if ((this.scene.p2FireCanBox.fillColor == 0xAA0000)&&(this.scene.p2aimerHorizontalTween.timeScale != 0.5)) {
                    this.scene.p2aimerHorizontalTween.timeScale = 1;
                    this.scene.aimerVerticalTween.timeScale = 1;
                    this.scene.powerTween.timeScale = 1;
                }
                if (this.scene.p2TurnsUntilFire == 0) {
                    this.scene.p2FireCanBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.scene.p2TurnsUntilTreb == 0) {
                    this.scene.p2TrebBox.setFillStyle(0xFFFFFF,1);
                }
            });
        this.p2RegCanText = this.add.text(568, 228, "Regular Cannon\nDamage: Up to 100\nAimer Speed: Regular\nCan Use: Every Turn")
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2RegCanPic = this.add.image(535,255, 'reg_cannon')
            .setScale(.12)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p2FireCanBox = this.add.rectangle(510,290,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Choosing Fire Cannon");
                this.scene.p2Weapon = 2;
                this.scene.p2aimerHorizontalTween.timeScale = 2.5;
                this.scene.aimerVerticalTween.timeScale = 2.5;
                this.scene.powerTween.timeScale = 2.5;
                this.scene.p2RegCanBox.setFillStyle(0xFFFFFF,1);
                this.scene.p2FireCanBox.setFillStyle(0xAA0000,1);
                if (this.scene.p2TurnsUntilTreb == 0) {
                    this.scene.p2TrebBox.setFillStyle(0xFFFFFF,1);
                }
            });
        this.p2FireCanText = this.add.text(568, 288, "Fire Cannon\nDamage: Up to 200\nAimer Speed: Very Fast\nCan Use: Every 3 Turns")
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);  
        this.p2FireCanPic = this.add.image(535,315, 'fire_cannon')
            .setScale(.02)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p2TrebBox = this.add.rectangle(510,350,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Choosing Trebuchet");
                this.scene.p2Weapon = 3;
                this.scene.p2RegCanBox.setFillStyle(0xFFFFFF,1);
                if ((this.scene.p2FireCanBox.fillColor == 0xAA0000)&&(this.scene.p2aimerHorizontalTween.timeScale != 0.5)) {
                    this.scene.p2aimerHorizontalTween.timeScale = 1;
                    this.scene.aimerVerticalTween.timeScale = 1;
                    this.scene.powerTween.timeScale = 1;
                }
                if (this.scene.p2TurnsUntilFire == 0) {
                    this.scene.p2FireCanBox.setFillStyle(0xFFFFFF,1);
                }
                this.scene.p2TrebBox.setFillStyle(0xAA0000,1);
            });
        this.p2TrebText = this.add.text(568,348, "Trebuchet\nDamage: Up to 50, 2 Shots Per Turn\nAimer Speed: Regular\nCan Use: Every 3 Turns")
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2TrebPic = this.add.image(535,375, 'trebuchet')
            .setScale(.1)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
            
        // Attack Power-ups
        this.p2AccuracyBox = this.add.rectangle(510,450,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Clicking Accuracy Potion");
                this.p1AccuracyBox.disableInteractive();
                this.p1SneakBox.setInteractive();
                if (this.p2SneakBox.fillColor == 0xAA0000) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(650, 430, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(650, 430, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P2 Using Accuracy Potion");
                        this.p2AccuracyBox.setFillStyle(0xAAAAAA,1);
                        this.p2AccuracyBox.disableInteractive();
                        this.p2aimerHorizontalTween.timeScale = 0.3;
                        this.aimerVerticalTween.timeScale = 0.3;
                        this.powerTween.timeScale = 0.3;
                        this.p2AccuracyPowLeft -= 1;
                        if (this.p2AccuracyPowLeft == 0) {
                            this.p2AccuracyText.setText("No More Uses Left");
                        } else {
                            this.p2AccuracyText.setText("Wait Until Next Turn to Use Again!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p2AccuracyBox.setFillStyle(0xAA0000,1);
                if (this.p2SneakBox.fillColor !== 0xAAAAAA){
                    this.p2SneakBox.setFillStyle(0xFFFFFF,1);
                }
            },this);
        this.p2AccuracyText = this.add.text(568,448, "Accuracy Potion\nEffect: Slow Down the Aimer\nUses Per Game: " + this.p2AccuracyPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2AccuracyPic = this.add.image(535,475, 'accuracy_potion')
            .setScale(.15)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);   

        this.p2SneakBox = this.add.rectangle(510,510,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Clicking Sneak Attack");
                this.p1AccuracyBox.setInteractive();
                this.p1SneakBox.disableInteractive();
                if (this.p2AccuracyBox.fillColor == 0xAA0000) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(650, 430, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(650, 430, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P2 Using Sneak Attack Potion");
                        this.p2SneakBox.setFillStyle(0xAAAAAA,1);
                        this.p2SneakBox.disableInteractive();
                        if (this.p2aimerHorizontalTween.isPlaying()) {
                            this.p2aimerHorizontalTween.stop();
                        }
                        if (this.aimerVerticalTween.isPlaying()) {
                            this.aimerVerticalTween.stop();
                        }
                        if (this.powerTween.isPlaying()) {
                            this.powerTween.stop();
                        }
                        this.p2SneakPowLeft -= 1;
                        if (this.p2SneakPowLeft == 0) {
                            this.p2SneakText.setText("No More Uses Left");
                        } else {
                            this.p2SneakText.setText("Wait Until Next Turn to Use Again!");
                        }
                        
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                        // Determine and remove block of least health
                        var leastHealth = 200;
                        var destroyBlock
                        this.p1CastleGroup.children.iterate(function(block) {
                            if (block.blockHealth < leastHealth) {
                                leastHealth = block.blockHealth;
                                destroyBlock = block;
                            }
                        }, this);
                        this.blast2 = this.add.sprite(destroyBlock.x+30, destroyBlock.y-30, 'explosion')
                            .setDepth(3)
                            .setOrigin(0.5,0.5)
                            .setSize(5,5); 
                        this.blast2.play("blastAnim");
                        
                        // Then Remove The Block
                        this.p1CastleBlocksRemaining -= 1;
                        this.p1CastleIndicText.setText("Player One's Castle:\nBlocks Remaining: " + this.p2CastleBlocksRemaining);
                        if(this.p1CastleBlocksRemaining == 0) {
                            this.start('Game', {
                                winner: 2,
                            });
                        }
                        this.time.addEvent({
                            delay: 2500,
                            callback: ()=>{
                                this.blast2.destroy();
                                this.dispBlockHealth();
                            },
                            loop: false
                        });
                        this.time.addEvent({
                            delay: 1000,
                            callback: ()=>{
                                destroyBlock.destroy();
                            },
                            loop: false
                        });
                        
                        // Then remove Player Ones's UI Elements
                        this.aimer.setVisible(false);
                        this.powerMeter.setVisible(false);
                        this.powerMeterIndic.setVisible(false);   
                        this.p2AttackMenuFadeOutTween.play();
                        // Reset Menu Options
                        if (this.p2AccuracyPowLeft > 0) {
                            this.p2AccuracyBox.setFillStyle(0xFFFFFF,1);
                            this.p2AccuracyBox.setInteractive();
                            this.p2AccuracyText.setText( "Accuracy Potion\nEffect: Slow Down the Aimer\nUses Per Game: " + this.p1AccuracyPowLeft)
                        }
                        if (this.p2SneakPowLeft > 0) {
                            this.p2SneakBox.setFillStyle(0xFFFFFF,1);
                            this.p2SneakBox.setInteractive();
                            this.p2SneakText.setText( "Sneak Attack\nEffect: Automatically Destroy the\nLowest Health Block\nUses Per Game: " + this.p1SneakPowLeft)
                        }
                        this.p2Weapon = 1;
                        this.p2RegCanBox.setFillStyle(0xAA0000,1);
                        this.p2FireCanBox.setFillStyle(0xFFFFFF,1);
                        this.p2TrebBox.setFillStyle(0xFFFFFF,1);
                        this.p2aimerHorizontalTween.timeScale = 1;
                        this.aimerVerticalTween.timeScale = 1;
                        this.powerTween.timeScale = 1;
                        
                        // Remove the listener for the keyboard
                        this.input.keyboard.removeAllListeners();
                        
                        // And set the turn Menu for player 2
                        console.log("Player Two's Turn");
                        this.turnText.setText("Player Two's Turn");
                        this.turnFadeInTween.play();
                        this.turn = 1;
                        
                        // End of P1's Attack Turn
                        
                    }, this);
                if (this.p2AccuracyBox.fillColor !== 0xAAAAAA){
                    this.p2AccuracyBox.setFillStyle(0xFFFFFF,1);
                }
                this.p2SneakBox.setFillStyle(0xAA0000,1);
            }, this);
            
        this.p2SneakText = this.add.text(568,508, "Sneak Attack\nEffect: Automatically Destroy the\nLowest Health Block\nUses Per Game: " + this.p1SneakPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2SneakPic = this.add.image(535,535, 'sneak_attack')
            .setScale(.15)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);             
            
        
        
        // Tweens for Attack Menus
        this.p1AttackMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p1AttackMenuBox, this.p1AttackText, this.p1AttackInstr, this.p1RegCanBox, this.p1RegCanText, this.p1RegCanPic, 
                      this.p1FireCanBox, this.p1FireCanText, this.p1FireCanPic, this.p1TrebBox, this.p1TrebText, this.p1TrebPic,
                      this.p1AccuracyBox, this.p1AccuracyText, this.p1AccuracyPic, this.p1SneakBox, this.p1SneakText, this.p1SneakPic],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p1AttackMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p1AttackMenuBox, this.p1AttackText, this.p1AttackInstr, this.p1RegCanBox, this.p1RegCanText, this.p1RegCanPic, 
                      this.p1FireCanBox, this.p1FireCanText, this.p1FireCanPic, this.p1TrebBox, this.p1TrebText, this.p1TrebPic,
                      this.p1AccuracyBox, this.p1AccuracyText, this.p1AccuracyPic, this.p1SneakBox, this.p1SneakText, this.p1SneakPic],
            alpha: 100,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2AttackMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p2AttackMenuBox, this.p2AttackText, this.p2AttackInstr, this.p2RegCanBox, this.p2RegCanText, this.p2RegCanPic, 
                      this.p2FireCanBox, this.p2FireCanText, this.p2FireCanPic, this.p2TrebBox, this.p2TrebText, this.p2TrebPic,
                      this.p2AccuracyBox, this.p2AccuracyText, this.p2AccuracyPic, this.p2SneakBox, this.p2SneakText, this.p2SneakPic],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2AttackMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p2AttackMenuBox, this.p2AttackText, this.p2AttackInstr, this.p2RegCanBox, this.p2RegCanText, this.p2RegCanPic, 
                      this.p2FireCanBox, this.p2FireCanText, this.p2FireCanPic, this.p2TrebBox, this.p2TrebText, this.p2TrebPic,
                      this.p2AccuracyBox, this.p2AccuracyText, this.p2AccuracyPic, this.p2SneakBox, this.p2SneakText, this.p2SneakPic],
            alpha: 100,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        
        /********* DEFEND MENU - SELECT A BLOCK TO RESTORE *********/
        // Draw Player 1 Defend Menu
        this.p1DefendMenuBox = this.add.rectangle(500,50,250,500, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4)
            .setAlpha(0);
        this.p1DefendText = this.add.text(625, 100, "Player One\nis Defending")
            .setFontFamily("Candara")
            .setFontSize(44)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5)
            .setAlpha(0);
        this.p1DefendInstr = this.add.text(510, 150, "Click a Castle Block to restore to\nfull health or select a power-up\nbelow.\nPower-Ups:")
            .setFontFamily("Candara")
            .setFontSize(16)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setDepth(5)
            .setAlpha(0);
            
        // Defend Power-ups 
        this.p1BronzeBox = this.add.rectangle(510,230,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5) 
            .setInteractive().on('pointerdown', function () {
                console.log("P1 Clicking Bronze Shield");
                this.p1BronzeBox.disableInteractive();
                this.p1SilverBox.setInteractive();
                this.p1GoldBox.setInteractive();
                if ((this.p1SilverBox.fillColor == 0xAA0000)||(this.p1GoldBox.fillColor == 0xAA0000)) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(650, 210, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(650, 210, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P1 Using Bronze Shield");
                        this.p1BronzeBox.disableInteractive();
                        this.p1SilverBox.disableInteractive();
                        this.p1GoldBox.disableInteractive();
                        this.p1BronzePowLeft -= 1;
                        this.p1BronzeBox.setFillStyle(0xAAAAAA,1);
                        this.p1SilverBox.setFillStyle(0xAAAAAA,1);
                        this.p1GoldBox.setFillStyle(0xAAAAAA,1);
                        this.p1DefendPow = 1;
                        this.blocksRemaining = 3;
                        if (this.p1BronzePowLeft == 0) {
                            this.p1BronzeText.setText("No More Uses Left");
                        } else {
                            this.p1BronzeText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        if (this.p1SilverPowLeft == 0) {
                            this.p1SilverText.setText("No More Uses Left");
                        } else {
                            this.p1SilverText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                         if (this.p1GoldPowLeft == 0) {
                            this.p1GoldText.setText("No More Uses Left");
                        } else {
                            this.p1GoldText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p1BronzeBox.setFillStyle(0xAA0000,1);
                if (this.p1SilverBox.fillColor !== 0xAAAAAA){
                    this.p1SilverBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.p1GoldBox.fillColor !== 0xAAAAAA){
                    this.p1GoldBox.setFillStyle(0xFFFFFF,1);
                }
            }, this);
        this.p1BronzeText = this.add.text(568, 228, "Bronze Castle Shield\nEffect: Add 30 to 3 Castle Blocks\nUses Per Game: " + this.p1BronzePowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1BronzePic = this.add.image(535,255, 'bronze')
            .setScale(.1)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p1SilverBox = this.add.rectangle(510,290,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P1 Clicking Silver Shield");
                this.p1BronzeBox.setInteractive();
                this.p1SilverBox.disableInteractive();
                this.p1GoldBox.setInteractive();
                if ((this.p1BronzeBox.fillColor == 0xAA0000)||(this.p1GoldBox.fillColor == 0xAA0000)) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(650, 210, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(650, 210, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P1 Using Silver Shield");
                        this.p1BronzeBox.disableInteractive();
                        this.p1SilverBox.disableInteractive();
                        this.p1GoldBox.disableInteractive();
                        this.p1SilverPowLeft -= 1;
                        this.p1BronzeBox.setFillStyle(0xAAAAAA,1);
                        this.p1SilverBox.setFillStyle(0xAAAAAA,1);
                        this.p1GoldBox.setFillStyle(0xAAAAAA,1);
                        this.p1DefendPow = 2;
                        this.blocksRemaining = 2;
                        if (this.p1BronzePowLeft == 0) {
                            this.p1BronzeText.setText("No More Uses Left");
                        } else {
                            this.p1BronzeText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        if (this.p1SilverPowLeft == 0) {
                            this.p1SilverText.setText("No More Uses Left");
                        } else {
                            this.p1SilverText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                         if (this.p1GoldPowLeft == 0) {
                            this.p1GoldText.setText("No More Uses Left");
                        } else {
                            this.p1GoldText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p1SilverBox.setFillStyle(0xAA0000,1);
                if (this.p1BronzeBox.fillColor !== 0xAAAAAA){
                    this.p1BronzeBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.p1GoldBox.fillColor !== 0xAAAAAA){
                    this.p1GoldBox.setFillStyle(0xFFFFFF,1);
                }
                
            }, this);
        this.p1SilverText = this.add.text(568, 288, "Silver Castle Shield\nEffect: Add 50 to 2 Castle Blocks\nUses Per Game: " + this.p1SilverPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1SilverPic = this.add.image(535,315, 'silver')
            .setScale(.04)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p1GoldBox = this.add.rectangle(510,350,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P1 Clicking Gold Shield");
                this.p1BronzeBox.setInteractive();
                this.p1SilverBox.setInteractive();
                this.p1GoldBox.disableInteractive();
                if ((this.p1BronzeBox.fillColor == 0xAA0000)||(this.p1SilverBox.fillColor == 0xAA0000)) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(650, 210, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(650, 210, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P1 Using Gold Shield");
                        this.p1BronzeBox.disableInteractive();
                        this.p1SilverBox.disableInteractive();
                        this.p1GoldBox.disableInteractive();
                        this.p1SilverPowLeft -= 1;
                        this.p1BronzeBox.setFillStyle(0xAAAAAA,1);
                        this.p1SilverBox.setFillStyle(0xAAAAAA,1);
                        this.p1GoldBox.setFillStyle(0xAAAAAA,1);
                        this.p1DefendPow = 3;
                        this.blocksRemaining = 2;
                        if (this.p1BronzePowLeft == 0) {
                            this.p1BronzeText.setText("No More Uses Left");
                        } else {
                            this.p1BronzeText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        if (this.p1SilverPowLeft == 0) {
                            this.p1SilverText.setText("No More Uses Left");
                        } else {
                            this.p1SilverText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                         if (this.p1GoldPowLeft == 0) {
                            this.p1GoldText.setText("No More Uses Left");
                        } else {
                            this.p1GoldText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p1GoldBox.setFillStyle(0xAA0000,1);
                if (this.p1BronzeBox.fillColor !== 0xAAAAAA){
                    this.p1BronzeBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.p1SilverBox.fillColor !== 0xAAAAAA){
                    this.p1SilverBox.setFillStyle(0xFFFFFF,1);
                }
            }, this);
        this.p1GoldText = this.add.text(568, 348, "Gold Castle Shield\nEffect: Completely Heal 2 Castle\nBlocks\nUses Per Game: " + this.p1GoldPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p1GoldPic = this.add.image(535,375, 'gold')
            .setScale(.02)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
           
        
            
        // Draw the Player 2 Defend Menu
        this.p2DefendMenuBox = this.add.rectangle(50,50,250,500, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4)
            .setAlpha(0);
        this.p2DefendText = this.add.text(175, 100, "Player Two\nis Defending")
            .setFontFamily("Candara")
            .setFontSize(44)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5)
            .setAlpha(0);
        this.p2DefendInstr = this.add.text(60, 150, "Click a Castle Block to restore to\nfull health or select a power-up\nbelow.\nPower-Ups:")
            .setFontFamily("Candara")
            .setFontSize(16)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setDepth(5)
            .setAlpha(0);
            
        // Defend Power-ups 
        this.p2BronzeBox = this.add.rectangle(60,230,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5) 
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Clicking Bronze Shield");
                this.p2BronzeBox.disableInteractive();
                this.p2SilverBox.setInteractive();
                this.p2GoldBox.setInteractive();
                if ((this.p2SilverBox.fillColor == 0xAA0000)||(this.p2GoldBox.fillColor == 0xAA0000)) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(200, 210, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(200, 210, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P2 Using Bronze Shield");
                        this.p2BronzeBox.disableInteractive();
                        this.p2SilverBox.disableInteractive();
                        this.p2GoldBox.disableInteractive();
                        this.p2BronzePowLeft -= 1;
                        this.p2BronzeBox.setFillStyle(0xAAAAAA,1);
                        this.p2SilverBox.setFillStyle(0xAAAAAA,1);
                        this.p2GoldBox.setFillStyle(0xAAAAAA,1);
                        this.p2DefendPow = 1;
                        this.blocksRemaining = 3;
                        if (this.p2BronzePowLeft == 0) {
                            this.p2BronzeText.setText("No More Uses Left");
                        } else {
                            this.p2BronzeText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        if (this.p2SilverPowLeft == 0) {
                            this.p2SilverText.setText("No More Uses Left");
                        } else {
                            this.p2SilverText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                         if (this.p2GoldPowLeft == 0) {
                            this.p2GoldText.setText("No More Uses Left");
                        } else {
                            this.p2GoldText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p2BronzeBox.setFillStyle(0xAA0000,1);
                if (this.p2SilverBox.fillColor !== 0xAAAAAA){
                    this.p2SilverBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.p2GoldBox.fillColor !== 0xAAAAAA){
                    this.p2GoldBox.setFillStyle(0xFFFFFF,1);
                }
            }, this);
        this.p2BronzeText = this.add.text(118, 228, "Bronze Castle Shield\nEffect: Add 30 to 3 Castle Blocks\nUses Per Game: " + this.p2BronzePowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2BronzePic = this.add.image(85,255, 'bronze')
            .setScale(.1)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
            
        this.p2SilverBox = this.add.rectangle(60,290,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Clicking Silver Shield");
                this.p2BronzeBox.setInteractive();
                this.p2SilverBox.disableInteractive();
                this.p2GoldBox.setInteractive();
                if ((this.p2BronzeBox.fillColor == 0xAA0000)||(this.p2GoldBox.fillColor == 0xAA0000)) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(200, 210, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(200, 210, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P1 Using Silver Shield");
                        this.p2BronzeBox.disableInteractive();
                        this.p2SilverBox.disableInteractive();
                        this.p2GoldBox.disableInteractive();
                        this.p2SilverPowLeft -= 1;
                        this.p2BronzeBox.setFillStyle(0xAAAAAA,1);
                        this.p2SilverBox.setFillStyle(0xAAAAAA,1);
                        this.p2GoldBox.setFillStyle(0xAAAAAA,1);
                        this.p2DefendPow = 2;
                        this.blocksRemaining = 2;
                        if (this.p2BronzePowLeft == 0) {
                            this.p2BronzeText.setText("No More Uses Left");
                        } else {
                            this.p2BronzeText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        if (this.p2SilverPowLeft == 0) {
                            this.p2SilverText.setText("No More Uses Left");
                        } else {
                            this.p2SilverText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                         if (this.p2GoldPowLeft == 0) {
                            this.p2GoldText.setText("No More Uses Left");
                        } else {
                            this.p2GoldText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p2SilverBox.setFillStyle(0xAA0000,1);
                if (this.p2BronzeBox.fillColor !== 0xAAAAAA){
                    this.p2BronzeBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.p2GoldBox.fillColor !== 0xAAAAAA){
                    this.p2GoldBox.setFillStyle(0xFFFFFF,1);
                }
                
            }, this);
        this.p2SilverText = this.add.text(118, 288, "Silver Castle Shield\nEffect: Add 50 to 2 Castle Blocks\nUses Per Game: " + this.p2SilverPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2SilverPic = this.add.image(85,315, 'silver')
            .setScale(.04)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
         
         this.p2GoldBox = this.add.rectangle(60,350,50,50, 0xFFFFFF)
            .setStrokeStyle(3,0xAA0000)
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(5)
            .setInteractive().on('pointerdown', function () {
                console.log("P2 Clicking Gold Shield");
                this.p2BronzeBox.setInteractive();
                this.p2SilverBox.setInteractive();
                this.p2GoldBox.disableInteractive();
                if ((this.p2BronzeBox.fillColor == 0xAA0000)||(this.p2SilverBox.fillColor == 0xAA0000)) {
                    this.usePowerButton.destroy();
                    this.usePowerText.destroy();
                }
                this.usePowerText = this.add.text(650, 210, "Use Power!")
                    .setFontFamily("Candara")
                    .setFontSize(12)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5)
                    .setDepth(7);
                this.usePowerButton = this.add.image(650, 210, 'button1')
                    .setScale(0.15)
                    .setDepth(6)
                    .setOrigin(0.5, 0.5)
                    .setInteractive().on('pointerdown', function () {
                        console.log("P2 Using Gold Shield");
                        this.p2BronzeBox.disableInteractive();
                        this.p2SilverBox.disableInteractive();
                        this.p2GoldBox.disableInteractive();
                        this.p2SilverPowLeft -= 1;
                        this.p2BronzeBox.setFillStyle(0xAAAAAA,1);
                        this.p2SilverBox.setFillStyle(0xAAAAAA,1);
                        this.p2GoldBox.setFillStyle(0xAAAAAA,1);
                        this.p2DefendPow = 3;
                        this.blocksRemaining = 2;
                        if (this.p2BronzePowLeft == 0) {
                            this.p2BronzeText.setText("No More Uses Left");
                        } else {
                            this.p2BronzeText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        if (this.p2SilverPowLeft == 0) {
                            this.p2SilverText.setText("No More Uses Left");
                        } else {
                            this.p2SilverText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                         if (this.p2GoldPowLeft == 0) {
                            this.p2GoldText.setText("No More Uses Left");
                        } else {
                            this.p2GoldText.setText("Wait Until Next Turn to Use\nAnother Power-Up!");
                        }
                        this.usePowerButton.destroy();
                        this.usePowerText.destroy();
                    }, this);
                this.p2GoldBox.setFillStyle(0xAA0000,1);
                if (this.p2BronzeBox.fillColor !== 0xAAAAAA){
                    this.p2BronzeBox.setFillStyle(0xFFFFFF,1);
                }
                if (this.p2SilverBox.fillColor !== 0xAAAAAA){
                    this.p2SilverBox.setFillStyle(0xFFFFFF,1);
                }
            }, this);
        this.p2GoldText = this.add.text(118, 348, "Gold Castle Shield\nEffect: Completely Heal 2 Castle\nBlocks\nUses Per Game: " + this.p2GoldPowLeft)
            .setFontFamily("Candara")
            .setFontSize(12)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0)
            .setAlpha(0)
            .setDepth(6);
        this.p2GoldPic = this.add.image(85,375, 'gold')
            .setScale(.02)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(6);
        
        
        // Tweens for Defend Menus
        this.p1DefendMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p1DefendMenuBox, this.p1DefendText, this.p1DefendInstr, this.p1BronzeBox, this.p1BronzeText, this.p1BronzePic,
                      this.p1SilverBox, this.p1SilverText, this.p1SilverPic, this.p1GoldBox, this.p1GoldText, this.p1GoldPic],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p1DefendMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p1DefendMenuBox, this.p1DefendText, this.p1DefendInstr, this.p1BronzeBox, this.p1BronzeText, this.p1BronzePic,
                      this.p1SilverBox, this.p1SilverText, this.p1SilverPic, this.p1GoldBox, this.p1GoldText, this.p1GoldPic],
            alpha: 100,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2DefendMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p2DefendMenuBox, this.p2DefendText, this.p2DefendInstr, this.p2BronzeBox, this.p2BronzeText, this.p2BronzePic,
                      this.p2SilverBox, this.p2SilverText, this.p2SilverPic, this.p2GoldBox, this.p2GoldText, this.p2GoldPic],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2DefendMenuFadeInTween = this.tweens.add({
            paused: true,
            targets:  [this.p2DefendMenuBox, this.p2DefendText, this.p2DefendInstr, this.p2BronzeBox, this.p2BronzeText, this.p2BronzePic,
                      this.p2SilverBox, this.p2SilverText, this.p2SilverPic, this.p2GoldBox, this.p2GoldText, this.p2GoldPic],
            alpha: 100,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        
        
        
        /********* OTHER GAME UI ELEMENTS *********/
        // Draw the Various Game UI Elements
        this.aimer = this.add.image(100, 300, 'aim')
            .setScale(0.1, 0.1)
            .setDepth(2)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.powerMeter = this.add.image(350, 300, 'power')
            .setAngle(-90)
            .setScale(.8, .8)
            .setDepth(2)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.powerMeterIndic = this.add.rectangle(350,500,57,10, 0x0000)
            .setDepth(3)
            .setOrigin(0.5,0.5)
            .setVisible(false);

        // Tweens and animations for moving the various Game Elements such as Power Indicator
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
        this.anims.create({
            key: "blastAnim",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComeplete: true
        });
    }
    
    
    /********* ATTACK TURN *********/
    // Attack Turn Function - Operate an attack turn of the player indicated by "turn"
    attack(turn) {
        // Fade away the turn menu's elements
        this.removeBlockHealth();
        if (this.repeat != true) {
            this.turnFadeOutTween.play();
        }
        
        // Basic variables for storing the turn information
        this.xCord = 0;
        this.yCord = 0;
        this.powerLevel = 0;
        this.xSet = false;
        this.ySet = false;
        this.powerSet = false;
        this.hit = false;
        
        // If it is player 1's turn, then show player 1's attack menu and the aimer
        if(turn == 1) {
            console.log("Player One is Attacking");
            if (this.repeat != true) {
                this.p1AttackMenuFadeInTween.play();
            }
            this.aimer.setX(400);
            this.aimer.setY(300);
            this.aimer.setVisible(true);
            this.p1aimerHorizontalTween.play();
        // Otherwise do the same thing for player 2
        } else {
            console.log("Player Two is Attacking");
            if (this.repeat != true) {
                this.p2AttackMenuFadeInTween.play();
            }
            this.aimer.setX(60);
            this.aimer.setY(300);
            this.aimer.setVisible(true);
            this.p2aimerHorizontalTween.play();
        }
        
        // When the Enter Button is pressed ...
        this.input.keyboard.on('keydown_ENTER', function(event) {
            // If it is Player 1's Turn
            if (this.turn ==1) {
                // If it is the first press (to select x coordinate)
                if (!(this.xSet)) {
                    this.p1aimerHorizontalTween.stop();
                    // Stop User From Selecting another weapon
                    this.p1RegCanBox.setFillStyle(0xAAAAAA, 1);
                    this.p1FireCanBox.setFillStyle(0xAAAAAA, 1);
                    this.p1TrebBox.setFillStyle(0xAAAAAA, 1);
                    this.p1RegCanBox.disableInteractive();
                    this.p1FireCanBox.disableInteractive();
                    this.p1TrebBox.disableInteractive();
                    switch(this.p1Weapon) {
                        case 1:  // Regular Cannon
                            if (this.p1TurnsUntilTreb > 0) {
                                this.p1TurnsUntilTreb -= 1;
                            }
                            if (this.p1TurnsUntilFire > 0) {
                                this.p1TurnsUntilFire -=1;
                            }
                            
                            this.p1RegCanText.setText("Regular Cannon Locked In!");
                            this.p1FireCanText.setText("Regular Cannon Locked In!");
                            this.p1TrebText.setText("Regular Cannon Locked In!");
                            break;
                        case 2: // Fire Cannon
                            this.p1TurnsUntilFire = 2;
                            if (this.p1TurnsUntilTreb > 0) {
                                this.p1TurnsUntilTreb -= 1;
                            }
                            this.p1RegCanText.setText("Fire Cannon Locked In!");
                            this.p1FireCanText.setText("Fire Cannon Locked In!");
                            this.p1TrebText.setText("Fire Cannon Locked In!");
                            break;
                        case 3: // Trebuchet
                            this.p1TurnsUntilTreb = 2;
                            if (this.p1TurnsUntilFire > 0) {
                                this.p1TurnsUntilFire -=1;
                            }
                            this.p1RegCanText.setText("Trebuchet Locked In!");
                            this.p1FireCanText.setText("Trebuchet Locked In!");
                            this.p1TrebText.setText("Trebuchet Locked In!");
                            break;
                        default:
                            break;
                    }
                    
                    // Get Cordinates
                    this.xCord = this.aimer.x;
                    this.xSet = true;
                    console.log("P1 pressed enter - xCord:");
                    console.log(this.xCord);
                    this.aimerVerticalTween.play();
                // If it is the second press (to select the y coordinate)
                } else if (!(this.ySet)) {
                    this.aimerVerticalTween.stop();
                    this.yCord = this.aimer.y;
                    this.ySet = true;
                    console.log("P1 pressed enter - yCord:");
                    console.log(this.yCord);
                    this.powerMeter.setX(350).setVisible(true);
                    this.powerMeterIndic.setX(350).setVisible(true);
                    this.powerTween.play();
                // If it is the third press (to select the power level)
                } else if (!(this.powerSet)) {
                    this.powerTween.stop();
                    console.log("P1's Weapon: " + this.p1Weapon); 
                    switch(this.p1Weapon) {
                        case 1:  // Regular Cannon
                            this.powerLevel = 100- 1/5*this.powerMeterIndic.y;
                            break;
                        case 2: // Fire Cannon
                            this.powerLevel = 200- 1/5*this.powerMeterIndic.y;
                            break;
                        case 3: // Trebuchet
                            this.powerLevel = 50- 1/10*this.powerMeterIndic.y;
                            break;
                        default:
                            this.powerLevel = 0;
                            break;
                    }
                    this.powerSet = true;
                    console.log("P1 pressed enter - powerLevel:");
                    console.log(this.powerLevel);
                    
                    // Now that all the Shot Parameters have been set, shoot
                    console.log("P1 Shooting P2's Castle");
                    this.blast1 = this.add.sprite(this.xCord, this.yCord, 'explosion')
                        .setDepth(3)
                        .setOrigin(0.5,0.5)
                        .setSize(5,5); 
                    this.physics.add.existing(this.blast1);
                    this.blast1.body.setOffset(30,30);
                    this.blast1.body.allowGravity = false;
                    this.physics.add.overlap(this.p2CastleGroup, this.blast1, this.castleHit1, null, this.scene);

                    // Check for miss (overlap event has not occurred)
                    this.time.addEvent({
                        delay: 100,
                        callback: ()=>{
                            if (this.hit == false) {
                                console.log("Miss!");
                                this.blast1.setVisible(false);
                                this.blast1.destroy();
                                this.dispBlockHealth();
                            }
                        },
                        loop: false
                    });

                    // Then remove Player One's UI Elements
                    this.aimer.setVisible(false);
                    this.powerMeter.setVisible(false);
                    this.powerMeterIndic.setVisible(false);   
                    
                    // Remove the listener for the keyboard
                    this.input.keyboard.removeAllListeners(); 
                    
                    // If the Weapon is Trebuchet, repeat shot
                    if ((this.p1Weapon == 3)&&(this.repeat != true)) {
                        console.log("Player Ones's Second Trebuchet Shot");
                        this.repeat = true;
                        this.time.addEvent({
                            delay: 2500,
                            callback: ()=>{
                                this.removeBlockHealth();
                                this.attack(this.turn);
                            },
                            loop: false
                        });
                    
                    // Otherwise Stop the Turn and go to player Two's Turn
                    } else {
                    
                        this.p1AttackMenuFadeOutTween.play();
                        // Reset Power Menu Options
                        if (this.p1AccuracyPowLeft > 0) {
                            this.p1AccuracyBox.setFillStyle(0xFFFFFF,1);
                            this.p1AccuracyBox.setInteractive();
                            this.p1AccuracyText.setText( "Accuracy Potion\nEffect: Slow Down the Aimer\nUses Per Game: " + this.p1AccuracyPowLeft)
                        }
                        if (this.p1SneakPowLeft > 0) {
                            this.p1SneakBox.setFillStyle(0xFFFFFF,1);
                            this.p1SneakBox.setInteractive();
                            this.p1SneakText.setText( "Sneak Attack\nEffect: Automatically Destroy the\nLowest Health Block\nUses Per Game: " + this.p1SneakPowLeft)
                        }
                        // Reset Weapon Menu Options
                        this.p1Weapon = 1;
                        this.p1RegCanBox.setFillStyle(0xAA0000,1);
                        this.p1RegCanBox.setInteractive();
                        this.p1RegCanText.setText("Regular Cannon\nDamage: Up to 100\nAimer Speed: Regular\nCan Use: Every Turn");
                        if (this.p1TurnsUntilFire == 0) {
                            this.p1FireCanBox.setFillStyle(0xFFFFFF,1);
                            this.p1FireCanBox.setInteractive();
                            this.p1FireCanText.setText("Fire Cannon\nDamage: Up to 200\nAimer Speed: Very Fast\nCan Use: Every 3 Turns");
                        } else {
                            this.p1FireCanText.setText("Fire Cannon\nDamage: Up to 200\nAimer Speed: Very Fast\nCan Use in: " + this.p1TurnsUntilFire +" Turns");
                            this.p1FireCanBox.setFillStyle(0xAAAAAA,1);
                        }
                        if (this.p1TurnsUntilTreb == 0) {
                            this.p1TrebBox.setFillStyle(0xFFFFFF,1);
                            this.p1TrebBox.setInteractive();
                            this.p1TrebText.setText("Trebuchet\nDamage: Up to 50, 2 Shots Per Turn\nAimer Speed: Regular\nCan Use: Every 3 Turns");
                        } else {
                            this.p1TrebText.setText("Trebuchet\nDamage: Up to 50, 2 Shots Per Turn\nAimer Speed: Regular\nCan Use in: " + this.p1TurnsUntilTreb +" Turns");
                            this.p1TrebBox.setFillStyle(0xAAAAAA,1);
                        }
                        
                        // Reset Any Powers
                        this.p1aimerHorizontalTween.timeScale = 1;
                        this.aimerVerticalTween.timeScale = 1;
                        this.powerTween.timeScale = 1;
                        if(this.usePowerButton != null) {
                            this.usePowerButton.destroy();
                        }
                        if(this.usePowerText!= null) {
                            this.usePowerText.destroy();
                        }
                        // And set the turn Menu for player 2
                        console.log("Player Two's Turn");
                        this.turnText.setText("Player Two's Turn");
                        this.turnFadeInTween.play();
                        this.turn = 2;
                        this.repeat = false;
                    }
                    // End of P1's Attack Turn
                }
                
            // If it is Player 2's Turn
            } else {
                // If it is the first press (to select x coordinate)
                if (!(this.xSet)) {
                    this.p2aimerHorizontalTween.stop();
                    // Stop User From Selecting another weapon
                    this.p2RegCanBox.setFillStyle(0xAAAAAA, 1);
                    this.p2FireCanBox.setFillStyle(0xAAAAAA, 1);
                    this.p2TrebBox.setFillStyle(0xAAAAAA, 1);
                    this.p2RegCanBox.disableInteractive();
                    this.p2FireCanBox.disableInteractive();
                    this.p2TrebBox.disableInteractive();
                    switch(this.p2Weapon) {
                        case 1:  // Regular Cannon
                            if (this.p2TurnsUntilTreb > 0) {
                                this.p2TurnsUntilTreb -= 1;
                            }
                            if (this.p1TurnsUntilFire > 0) {
                                this.p1TurnsUntilFire -=1;
                            }
                            
                            this.p2RegCanText.setText("Regular Cannon Locked In!");
                            this.p2FireCanText.setText("Regular Cannon Locked In!");
                            this.p2TrebText.setText("Regular Cannon Locked In!");
                            break;
                        case 2: // Fire Cannon
                            this.p2TurnsUntilFire = 2;
                            if (this.p2TurnsUntilTreb > 0) {
                                this.p2TurnsUntilTreb -= 1;
                            }
                            this.p2RegCanText.setText("Fire Cannon Locked In!");
                            this.p2FireCanText.setText("Fire Cannon Locked In!");
                            this.p2TrebText.setText("Fire Cannon Locked In!");
                            break;
                        case 3: // Trebuchet
                            this.p2TurnsUntilTreb = 2;
                            if (this.p2TurnsUntilFire > 0) {
                                this.p2TurnsUntilFire -=1;
                            }
                            this.p2RegCanText.setText("Trebuchet Locked In!");
                            this.p2FireCanText.setText("Trebuchet Locked In!");
                            this.p2TrebText.setText("Trebuchet Locked In!");
                            break;
                        default:
                            break;
                    }
                    
                    // Get Cordinates
                    this.xCord = this.aimer.x;
                    this.xSet = true;
                    console.log("P2 pressed enter - xCord:");
                    console.log(this.xCord);
                    this.aimerVerticalTween.play();
                // If it is the second press (to select the y coordinate)
                } else if (!(this.ySet)) {
                    this.aimerVerticalTween.stop();
                    this.yCord = this.aimer.y;
                    this.ySet = true;
                    console.log("P2 pressed enter - yCord:");
                    console.log(this.yCord);
                    this.powerMeter.setX(450).setVisible(true);
                    this.powerMeterIndic.setX(450).setVisible(true);
                    this.powerTween.play();
                // If it is the third press (to select the power level)
                } else if (!(this.powerSet)) {
                    this.powerTween.stop();
                    switch(this.p2Weapon) {
                        case 1:  // Regular Cannon
                            this.powerLevel = 100- 1/5*this.powerMeterIndic.y;
                            break;
                        case 2: // Fire Cannon
                            this.powerLevel = 200- 1/5*this.powerMeterIndic.y;
                            break;
                        case 3: // Trebuchet
                            this.powerLevel = 50- 1/10*this.powerMeterIndic.y;
                            break;
                        default:
                            this.powerLevel = 0;
                            break;
                    }
                    this.powerSet = true;
                    console.log("P2 pressed enter - powerLevel:");
                    console.log(this.powerLevel);
                    
                    // Now that all the Shot Parameters have been set, shoot
                    console.log("P2 Shooting P1's Castle");
                    this.blast2 = this.add.sprite(this.xCord, this.yCord, 'explosion')
                        .setDepth(3)
                        .setOrigin(0.5,0.5)
                        .setSize(5,5);
                    this.physics.add.existing(this.blast2);
                    this.blast2.body.setOffset(30,30);
                    this.blast2.body.allowGravity = false;
                    this.physics.add.overlap(this.p1CastleGroup, this.blast2, this.castleHit2, null, this.scene);
                    
                    // Check for miss (overlap event has not occurred)
                    this.time.addEvent({
                        delay: 100,
                        callback: ()=>{
                            if (this.hit == false) {
                                console.log("Miss!");
                                this.blast2.setVisible(false);
                                this.blast2.destroy();
                                this.dispBlockHealth();
                            }
                        },
                        loop: false
                    });
                    
                    // Then remove Player Two's UI Elements
                    this.aimer.setVisible(false);
                    this.powerMeter.setVisible(false);
                    this.powerMeterIndic.setVisible(false);

                    // Remove the listener for the keyboard
                    this.input.keyboard.removeAllListeners();
                    
                    // If the Weapon is Trebuchet, repeat shot
                    if ((this.p2Weapon == 3)&&(this.repeat != true)) {
                        console.log("Player Ones's Second Trebuchet Shot");
                        this.repeat = true;
                        this.time.addEvent({
                            delay: 2500,
                            callback: ()=>{
                                this.removeBlockHealth();
                                this.attack(this.turn);
                            },
                            loop: false
                        });
                    // Otherwise Stop the Turn and go to player One's Turn
                    } else {
                    
                        this.p2AttackMenuFadeOutTween.play();
                        // Reset Power Menu Options
                        if (this.p2AccuracyPowLeft > 0) {
                            this.p2AccuracyBox.setFillStyle(0xFFFFFF,1);
                            this.p2AccuracyBox.setInteractive();
                            this.p2AccuracyText.setText( "Accuracy Potion\nEffect: Slow Down the Aimer\nUses Per Game: " + this.p2AccuracyPowLeft)
                        }
                        if (this.p2SneakPowLeft > 0) {
                            this.p2SneakBox.setFillStyle(0xFFFFFF,1);
                            this.p2SneakBox.setInteractive();
                            this.p2SneakText.setText( "Sneak Attack\nEffect: Automatically Destroy the\nLowest Health Block\nUses Per Game: " + this.p2SneakPowLeft)
                        }
                        // Reset Weapon Menu Options
                        this.p2Weapon = 1;
                        this.p2RegCanBox.setFillStyle(0xAA0000,1);
                        this.p2RegCanBox.setInteractive();
                        this.p2RegCanText.setText("Regular Cannon\nDamage: Up to 100\nAimer Speed: Regular\nCan Use: Every Turn");
                        if (this.p2TurnsUntilFire == 0) {
                            this.p2FireCanBox.setFillStyle(0xFFFFFF,1);
                            this.p2FireCanBox.setInteractive();
                            this.p2FireCanText.setText("Fire Cannon\nDamage: Up to 200\nAimer Speed: Very Fast\nCan Use: Every 3 Turns");
                        } else {
                            this.p2FireCanText.setText("Fire Cannon\nDamage: Up to 200\nAimer Speed: Very Fast\nCan Use in: " + this.p2TurnsUntilFire +" Turns");
                            this.p2FireCanBox.setFillStyle(0xAAAAAA,1);
                        }
                        if (this.p2TurnsUntilTreb == 0) {
                            this.p2TrebBox.setFillStyle(0xFFFFFF,1);
                            this.p2TrebBox.setInteractive();
                            this.p2TrebText.setText("Trebuchet\nDamage: Up to 50, 2 Shots Per Turn\nAimer Speed: Regular\nCan Use: Every 3 Turns");
                        } else {
                            this.p2TrebText.setText("Trebuchet\nDamage: Up to 50, 2 Shots Per Turn\nAimer Speed: Regular\nCan Use in: " + this.p2TurnsUntilTreb +" Turns");
                            this.p2TrebBox.setFillStyle(0xAAAAAA,1);
                        }
                        
                        // Reset Any Powers
                        this.p2aimerHorizontalTween.timeScale = 1;
                        this.aimerVerticalTween.timeScale = 1;
                        this.powerTween.timeScale = 1;
                        if(this.usePowerButton != null) {
                            this.usePowerButton.destroy();
                        }
                        if(this.usePowerText!= null) {
                            this.usePowerText.destroy();
                        }
                        // And set the turn Menu for player 1
                        console.log("Player One's Turn");
                        this.turnText.setText("Player One's Turn");
                        this.turnFadeInTween.play();
                        this.turn = 1;
                        this.repeat = false;
                    }
                    // End of P2's Attack Turn
                }
            }
        }, this);
    }
    
    /********* DEFEND TURN *********/
    defend(turn) {
        this.turnFadeOutTween.play();
        // If it is player one's turn
        if(turn == 1) {
            // Indicate that the player is defending
            console.log("Player One is Defending");
            // Show the defend menu
            this.p1DefendMenuFadeInTween.play();
            // Make each of Player One's Castle blocks clickable
            this.p1CastleGroup.children.iterate( function(block) {
                block.setInteractive().on('pointerdown', function(object) {
                    // When a block is clicked
                    console.log("Player One Restoring Block:");
                    console.log(block.blockId);
                    this.blocksRemaining -=1;
                    // Restore the health
                    switch(this.p1DefendPow) {
                        case 1: // Using Bronze Power
                            block.blockHealth += 30;
                            break;
                        case 2: // Using Silver Power
                            block.blockHealth += 50;
                            break;
                        case 3: // Using Gold Power
                            block.blockHealth = 100;
                            break;
                        default: // Using No Power
                            block.blockHealth = 100;
                            break;                            
                    }
                    // And redraw the health indicators
                    this.removeBlockHealth();
                    this.dispBlockHealth();
                    
                    if (this.blocksRemaining == 0) {
                        // Disable clickability on each castle block
                        this.p1CastleGroup.children.iterate( function(block) {
                            block.removeAllListeners();
                        }, this);
                        // Remove the defend menu
                        this.p1DefendMenuFadeOutTween.play();
                        // And set the turn Menu for player 2
                        console.log("Player Two's Turn"); 
                        this.turnText.setText("Player Two's Turn");
                        this.turnFadeInTween.play();
                        this.turn = 2;
                        // Reset Powers
                        this.p1DefendPow = 0;
                        this.blocksRemaining = 1;
                        
                        //Restore Defend Menu Elements
                        if (this.p1BronzePowLeft > 0) {
                            this.p1BronzeBox.setFillStyle(0xFFFFFF,1);
                            this.p1BronzeBox.setInteractive();
                            this.p1BronzeText.setText( "Bronze Castle Shield\nEffect: Add 30 to 3 Castle Blocks\nUses Remaining: " + this.p1BronzePowLeft)
                        }
                        if (this.p1SilverPowLeft > 0) {
                            this.p1SilverBox.setFillStyle(0xFFFFFF,1);
                            this.p1SilverBox.setInteractive();
                            this.p1SilverText.setText( "Silver Castle Shield\nEffect: Add 50 to 2 Castle Blocks\nUses Remaining: " + this.p1SilverPowLeft)
                        }
                        if (this.p1GoldPowLeft > 0) {
                            this.p1GoldBox.setFillStyle(0xFFFFFF,1);
                            this.p1GoldBox.setInteractive();
                            this.p1GoldText.setText( "Gold Castle Shield\nEffect: Completely Heal 2 Castle\nBlocks\nUses Remaining: " + this.p1GoldPowLeft)
                        }
                        if(this.usePowerButton != null) {
                            this.usePowerButton.destroy();
                        }
                        if(this.usePowerText!= null) {
                            this.usePowerText.destroy();
                        }
                    }      
                }, this);
            }, this);
            
        // Otherwise if it is player 2's turn
        } else {
            // Indicate that the player is defending
            console.log("Player Two is Defending");
            // Show the defend menu
            this.p2DefendMenuFadeInTween.play();
            // Make each of Player One's Castle blocks clickable
            this.p2CastleGroup.children.iterate( function(block) {
                block.setInteractive().on('pointerdown', function(object) {
                    // When a block is clicked
                    console.log("Player Two Restoring Block:");
                    console.log(block.blockId);
                    this.blocksRemaining -=1;
                    // Restore the health
                    switch(this.p2DefendPow) {
                        case 1: // Using Bronze Power
                            block.blockHealth += 30;
                            break;
                        case 2: // Using Silver Power
                            block.blockHealth += 50;
                            break;
                        case 3: // Using Gold Power
                            block.blockHealth = 100;
                            break;
                        default: // Using No Power
                            block.blockHealth = 100;
                            break;                            
                    }
                    // And redraw the health indicators
                    this.removeBlockHealth();
                    this.dispBlockHealth();
                    
                    if (this.blocksRemaining == 0) {
                        // Disable clickability on each castle block
                        this.p2CastleGroup.children.iterate( function(block) {
                            block.removeAllListeners();
                        }, this);
                        // Remove the defend menu
                        this.p2DefendMenuFadeOutTween.play();
                        // And set the turn Menu for player 2
                        console.log("Player One's Turn"); 
                        this.turnText.setText("Player One's Turn");
                        this.turnFadeInTween.play();
                        this.turn = 1;
                        // Reset Powers
                        this.p2DefendPow = 0;
                        this.blocksRemaining = 1;
                        
                        //Restore Defend Menu Elements
                        if (this.p2BronzePowLeft > 0) {
                            this.p2BronzeBox.setFillStyle(0xFFFFFF,1);
                            this.p2BronzeBox.setInteractive();
                            this.p2BronzeText.setText( "Bronze Castle Shield\nEffect: Add 30 to 3 Castle Blocks\nUses Remaining: " + this.p1BronzePowLeft)
                        }
                        if (this.p2SilverPowLeft > 0) {
                            this.p2SilverBox.setFillStyle(0xFFFFFF,1);
                            this.p2SilverBox.setInteractive();
                            this.p2SilverText.setText( "Silver Castle Shield\nEffect: Add 50 to 2 Castle Blocks\nUses Remaining: " + this.p1SilverPowLeft)
                        }
                        if (this.p2GoldPowLeft > 0) {
                            this.p2GoldBox.setFillStyle(0xFFFFFF,1);
                            this.p2GoldBox.setInteractive();
                            this.p2GoldText.setText( "Gold Castle Shield\nEffect: Completely Heal 2 Castle\nBlocks\nUses Remaining: " + this.p1GoldPowLeft)
                        }
                        if(this.usePowerButton != null) {
                            this.usePowerButton.destroy();
                        }
                        if(this.usePowerText!= null) {
                            this.usePowerText.destroy();
                        }
                    }
                }, this);
            }, this);
        }
    }
    
    /********* OTHER HELPER FUNCTIONS *********/
    // Method to build the selected castle for each player
    buildCastle(turn, castle) {
        if (turn == 1) {
            switch(castle) {
                case 1:
                    // Indicate which Castle is being built
                    console.log("P1 building Castle 1");
                    // Variables to store the information of the castle
                    this.p1CastleBlocksRemaining = 9;
                    this.p1CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p1b1 = this.add.image(91,292, 'c1b1').setOrigin(0,1);
                    this.p1b2 = this.add.image(100,356, 'c1b2').setOrigin(0,1);
                    this.p1b3 = this.add.image(100,420, 'c1b3').setOrigin(0,1);
                    this.p1b4 = this.add.image(172,348, 'c1b4').setOrigin(0,1);
                    this.p1b5 = this.add.image(172,420, 'c1b5').setOrigin(0,1);
                    this.p1b6 = this.add.image(234,194, 'c1b6').setOrigin(0,1);
                    this.p1b7 = this.add.image(245,269, 'c1b7').setOrigin(0,1);
                    this.p1b8 = this.add.image(245,346, 'c1b8').setOrigin(0,1);
                    this.p1b9 = this.add.image(245,420, 'c1b9').setOrigin(0,1);
                    
                    // Assign ID Numbers to each block
                    this.p1b1.blockId = 1;
                    this.p1b2.blockId = 2;
                    this.p1b3.blockId = 3;
                    this.p1b4.blockId = 4;
                    this.p1b5.blockId = 5;
                    this.p1b6.blockId = 6;
                    this.p1b7.blockId = 7;
                    this.p1b8.blockId = 8;
                    this.p1b9.blockId = 9;
                    
                    // Assign health to each block
                    this.p1b1.blockHealth = 100;
                    this.p1b2.blockHealth = 100;
                    this.p1b3.blockHealth = 100;
                    this.p1b4.blockHealth = 100;
                    this.p1b5.blockHealth = 100;
                    this.p1b6.blockHealth = 100;
                    this.p1b7.blockHealth = 100;
                    this.p1b8.blockHealth = 100;
                    this.p1b9.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p1CastleGroup.add(this.p1b1, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b2, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b3, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b4, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b5, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b6, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b7, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b8, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b9, {key: 'block'});
                    
                    // Create the ground platform
                    this.p1Ground = this.add.rectangle(200,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p1Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p1Ground, this.p1CastleGroup);
                    this.physics.add.collider(this.p1CastleGroup, this.p1CastleGroup); 
                    break;

                case 2: 
                    // Indicate which Castle is being built
                    console.log("P1 building Castle 2"); 
                     // Variables to store the information of the castle
                    this.p1CastleBlocksRemaining = 12;
                    this.p1CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p1b1 = this.add.image(42,350, 'c2b1').setOrigin(0,1);
                    this.p1b2 = this.add.image(49,420, 'c2b2').setOrigin(0,1);
                    this.p1b3 = this.add.image(114,194, 'c2b3').setOrigin(0,1);
                    this.p1b4 = this.add.image(121,270, 'c2b4').setOrigin(0,1);
                    this.p1b5 = this.add.image(122,346, 'c2b5').setOrigin(0,1);
                    this.p1b6 = this.add.image(122,420, 'c2b6').setOrigin(0,1);
                    this.p1b7 = this.add.image(194,194, 'c2b7').setOrigin(0,1);
                    this.p1b8 = this.add.image(194,270, 'c2b8').setOrigin(0,1);
                    this.p1b9 = this.add.image(194,346, 'c2b9').setOrigin(0,1);
                    this.p1b10 = this.add.image(194,420, 'c2b10').setOrigin(0,1);
                    this.p1b11 = this.add.image(267,340, 'c2b11').setOrigin(0,1);
                    this.p1b12 = this.add.image(266,420, 'c2b12').setOrigin(0,1);
                    
                    
                    // Assign ID Numbers to each block
                    this.p1b1.blockId = 1;
                    this.p1b2.blockId = 2;
                    this.p1b3.blockId = 3;
                    this.p1b4.blockId = 4;
                    this.p1b5.blockId = 5;
                    this.p1b6.blockId = 6;
                    this.p1b7.blockId = 7;
                    this.p1b8.blockId = 8;
                    this.p1b9.blockId = 9;
                    this.p1b10.blockId = 10;
                    this.p1b11.blockId = 11;
                    this.p1b12.blockId = 12;
                    
                    // Assign health to each block
                    this.p1b1.blockHealth = 100;
                    this.p1b2.blockHealth = 100;
                    this.p1b3.blockHealth = 100;
                    this.p1b4.blockHealth = 100;
                    this.p1b5.blockHealth = 100;
                    this.p1b6.blockHealth = 100;
                    this.p1b7.blockHealth = 100;
                    this.p1b8.blockHealth = 100;
                    this.p1b9.blockHealth = 100;
                    this.p1b10.blockHealth = 100;
                    this.p1b11.blockHealth = 100;
                    this.p1b12.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p1CastleGroup.add(this.p1b1, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b2, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b3, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b4, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b5, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b6, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b7, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b8, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b9, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b10, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b11, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b12, {key: 'block'});
                    
                    // Create the ground platform
                    this.p1Ground = this.add.rectangle(200,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p1Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p1Ground, this.p1CastleGroup);
                    this.physics.add.collider(this.p1CastleGroup, this.p1CastleGroup);
                    break;
                    
                case 3:
                    // Indicate which Castle is being built
                    console.log("P1 building Castle 3");
                    // Variables to store the information of the castle
                    this.p1CastleBlocksRemaining = 10;
                    this.p1CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p1b1 = this.add.image(41,292, 'c3b1').setOrigin(0,1);
                    this.p1b2 = this.add.image(50,356, 'c3b2').setOrigin(0,1);
                    this.p1b3 = this.add.image(50,420, 'c3b3').setOrigin(0,1);
                    this.p1b4 = this.add.image(122,348, 'c3b4').setOrigin(0,1);
                    this.p1b5 = this.add.image(122,420, 'c3b5').setOrigin(0,1);
                    this.p1b6 = this.add.image(194,348, 'c3b6').setOrigin(0,1);
                    this.p1b7 = this.add.image(194,420, 'c3b7').setOrigin(0,1);
                    this.p1b8 = this.add.image(257,292, 'c3b8').setOrigin(0,1);
                    this.p1b9 = this.add.image(266,356, 'c3b9').setOrigin(0,1);
                    this.p1b10 = this.add.image(266,420,'c3b10').setOrigin(0,1);
                    
                    // Assign ID Numbers to each block
                    this.p1b1.blockId = 1;
                    this.p1b2.blockId = 2;
                    this.p1b3.blockId = 3;
                    this.p1b4.blockId = 4;
                    this.p1b5.blockId = 5;
                    this.p1b6.blockId = 6;
                    this.p1b7.blockId = 7;
                    this.p1b8.blockId = 8;
                    this.p1b9.blockId = 9;
                    this.p1b10.blockId = 10;
                    
                    // Assign health to each block
                    this.p1b1.blockHealth = 100;
                    this.p1b2.blockHealth = 100;
                    this.p1b3.blockHealth = 100;
                    this.p1b4.blockHealth = 100;
                    this.p1b5.blockHealth = 100;
                    this.p1b6.blockHealth = 100;
                    this.p1b7.blockHealth = 100;
                    this.p1b8.blockHealth = 100;
                    this.p1b9.blockHealth = 100;
                    this.p1b10.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p1CastleGroup.add(this.p1b1, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b2, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b3, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b4, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b5, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b6, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b7, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b8, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b9, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b10, {key: 'block'});
                    
                    // Create the ground platform
                    this.p1Ground = this.add.rectangle(200,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p1Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p1Ground, this.p1CastleGroup);
                    this.physics.add.collider(this.p1CastleGroup, this.p1CastleGroup); 
                    break;
                
                case 4:
                    // Indicate which Castle is being built
                    console.log("P1 building Castle 4");
                    // Variables to store the information of the castle
                    this.p1CastleBlocksRemaining = 10;
                    this.p1CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p1b1 = this.add.image(91,268, 'c4b1').setOrigin(0,1);
                    this.p1b2 = this.add.image(97,344, 'c4b2').setOrigin(0,1);
                    this.p1b3 = this.add.image(97,420, 'c4b3').setOrigin(0,1);
                    this.p1b4 = this.add.image(162,201, 'c4b4').setOrigin(0,1);
                    this.p1b5 = this.add.image(172,274, 'c4b5').setOrigin(0,1);
                    this.p1b6 = this.add.image(172,347, 'c4b6').setOrigin(0,1);
                    this.p1b7 = this.add.image(172,420, 'c4b7').setOrigin(0,1);
                    this.p1b8 = this.add.image(245,268, 'c4b8').setOrigin(0,1);
                    this.p1b9 = this.add.image(245,344, 'c4b9').setOrigin(0,1);
                    this.p1b10 = this.add.image(245,420, 'c4b10').setOrigin(0,1);
                    
                    // Assign ID Numbers to each block
                    this.p1b1.blockId = 1;
                    this.p1b2.blockId = 2;
                    this.p1b3.blockId = 3;
                    this.p1b4.blockId = 4;
                    this.p1b5.blockId = 5;
                    this.p1b6.blockId = 6;
                    this.p1b7.blockId = 7;
                    this.p1b8.blockId = 8;
                    this.p1b9.blockId = 9;
                    this.p1b10.blockId = 10;
                    
                    // Assign health to each block
                    this.p1b1.blockHealth = 100;
                    this.p1b2.blockHealth = 100;
                    this.p1b3.blockHealth = 100;
                    this.p1b4.blockHealth = 100;
                    this.p1b5.blockHealth = 100;
                    this.p1b6.blockHealth = 100;
                    this.p1b7.blockHealth = 100;
                    this.p1b8.blockHealth = 100;
                    this.p1b9.blockHealth = 100;
                    this.p1b10.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p1CastleGroup.add(this.p1b1, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b2, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b3, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b4, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b5, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b6, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b7, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b8, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b9, {key: 'block'});
                    this.p1CastleGroup.add(this.p1b10, {key: 'block'});
                    
                    // Create the ground platform
                    this.p1Ground = this.add.rectangle(200,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p1Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p1Ground, this.p1CastleGroup);
                    this.physics.add.collider(this.p1CastleGroup, this.p1CastleGroup); 
                    break;

                default: break;
            }
        } else{
            switch(castle) {
                case 1:
                    // Indicate which Castle is being built
                    console.log("P2 building Castle 1");
                    // Variables to store the information of the castle
                    this.p2CastleBlocksRemaining = 9;
                    this.p2CastleGroup = this.physics.add.group();
                    
                    // Add each block to its appropriate position
                    this.p2b1 = this.add.sprite(491,292, 'c1b1').setOrigin(0,1);
                    this.p2b2 = this.add.sprite(500,356, 'c1b2').setOrigin(0,1);
                    this.p2b3 = this.add.sprite(500,420, 'c1b3').setOrigin(0,1);
                    this.p2b4 = this.add.sprite(572,348, 'c1b4').setOrigin(0,1);
                    this.p2b5 = this.add.sprite(572,420, 'c1b5').setOrigin(0,1);
                    this.p2b6 = this.add.sprite(634,194, 'c1b6').setOrigin(0,1);
                    this.p2b7 = this.add.sprite(645,269, 'c1b7').setOrigin(0,1);
                    this.p2b8 = this.add.sprite(645,346, 'c1b8').setOrigin(0,1);
                    this.p2b9 = this.add.sprite(645,420, 'c1b9').setOrigin(0,1);
                    
                    
                    // Assign ID Numbers to each block
                    this.p2b1.blockId = 1;
                    this.p2b2.blockId = 2;
                    this.p2b3.blockId = 3;
                    this.p2b4.blockId = 4;
                    this.p2b5.blockId = 5;
                    this.p2b6.blockId = 6;
                    this.p2b7.blockId = 7;
                    this.p2b8.blockId = 8;
                    this.p2b9.blockId = 9;
                    
                    // Assign health to each block
                    this.p2b1.blockHealth = 100;
                    this.p2b2.blockHealth = 100;
                    this.p2b3.blockHealth = 100;
                    this.p2b4.blockHealth = 100;
                    this.p2b5.blockHealth = 100;
                    this.p2b6.blockHealth = 100;
                    this.p2b7.blockHealth = 100;
                    this.p2b8.blockHealth = 100;
                    this.p2b9.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p2CastleGroup.add(this.p2b1, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b2, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b3, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b4, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b5, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b6, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b7, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b8, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b9, {key: 'block'});
                    
                    // Create the ground platform
                    this.p2Ground = this.add.rectangle(600,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p2Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p2Ground, this.p2CastleGroup);
                    this.physics.add.collider(this.p2CastleGroup, this.p2CastleGroup); 
                    break;
                    
                case 2:
                    // Indicate which Castle is being built
                     console.log("P2 building Castle 2"); 
                    // Variables to store the information of the castle
                    this.p2CastleBlocksRemaining = 12;
                    this.p2CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p2b1 = this.add.image(442,350, 'c2b1').setOrigin(0,1);
                    this.p2b2 = this.add.image(449,420, 'c2b2').setOrigin(0,1);
                    this.p2b3 = this.add.image(514,194, 'c2b3').setOrigin(0,1);
                    this.p2b4 = this.add.image(521,270, 'c2b4').setOrigin(0,1);
                    this.p2b5 = this.add.image(522,346, 'c2b5').setOrigin(0,1);
                    this.p2b6 = this.add.image(522,420, 'c2b6').setOrigin(0,1);
                    this.p2b7 = this.add.image(594,194, 'c2b7').setOrigin(0,1);
                    this.p2b8 = this.add.image(594,270, 'c2b8').setOrigin(0,1);
                    this.p2b9 = this.add.image(594,346, 'c2b9').setOrigin(0,1);
                    this.p2b10 = this.add.image(594,420, 'c2b10').setOrigin(0,1);
                    this.p2b11 = this.add.image(667,340, 'c2b11').setOrigin(0,1);
                    this.p2b12 = this.add.image(666,420, 'c2b12').setOrigin(0,1);
                    
                    
                    // Assign ID Numbers to each block
                    this.p2b1.blockId = 1;
                    this.p2b2.blockId = 2;
                    this.p2b3.blockId = 3;
                    this.p2b4.blockId = 4;
                    this.p2b5.blockId = 5;
                    this.p2b6.blockId = 6;
                    this.p2b7.blockId = 7;
                    this.p2b8.blockId = 8;
                    this.p2b9.blockId = 9;
                    this.p2b10.blockId = 10;
                    this.p2b11.blockId = 11;
                    this.p2b12.blockId = 12;
                    
                    // Assign health to each block
                    this.p2b1.blockHealth = 100;
                    this.p2b2.blockHealth = 100;
                    this.p2b3.blockHealth = 100;
                    this.p2b4.blockHealth = 100;
                    this.p2b5.blockHealth = 100;
                    this.p2b6.blockHealth = 100;
                    this.p2b7.blockHealth = 100;
                    this.p2b8.blockHealth = 100;
                    this.p2b9.blockHealth = 100;
                    this.p2b10.blockHealth = 100;
                    this.p2b11.blockHealth = 100;
                    this.p2b12.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p2CastleGroup.add(this.p2b1, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b2, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b3, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b4, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b5, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b6, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b7, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b8, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b9, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b10, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b11, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b12, {key: 'block'});
                    
                    // Create the ground platform
                    this.p2Ground = this.add.rectangle(600,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p2Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p2Ground, this.p2CastleGroup);
                    this.physics.add.collider(this.p2CastleGroup, this.p2CastleGroup);
                    break;
                    
                case 3:
                    // Indicate which Castle is being built
                    console.log("P2 building Castle 3");
                    // Variables to store the information of the castle
                    this.p2CastleBlocksRemaining = 10;
                    this.p2CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p2b1 = this.add.image(441,292, 'c3b1').setOrigin(0,1);
                    this.p2b2 = this.add.image(450,356, 'c3b2').setOrigin(0,1);
                    this.p2b3 = this.add.image(450,420, 'c3b3').setOrigin(0,1);
                    this.p2b4 = this.add.image(522,348, 'c3b4').setOrigin(0,1);
                    this.p2b5 = this.add.image(522,420, 'c3b5').setOrigin(0,1);
                    this.p2b6 = this.add.image(594,348, 'c3b6').setOrigin(0,1);
                    this.p2b7 = this.add.image(594,420, 'c3b7').setOrigin(0,1);
                    this.p2b8 = this.add.image(657,292, 'c3b8').setOrigin(0,1);
                    this.p2b9 = this.add.image(666,356, 'c3b9').setOrigin(0,1);
                    this.p2b10 = this.add.image(666,420,'c3b10').setOrigin(0,1);
                    
                    // Assign ID Numbers to each block
                    this.p2b1.blockId = 1;
                    this.p2b2.blockId = 2;
                    this.p2b3.blockId = 3;
                    this.p2b4.blockId = 4;
                    this.p2b5.blockId = 5;
                    this.p2b6.blockId = 6;
                    this.p2b7.blockId = 7;
                    this.p2b8.blockId = 8;
                    this.p2b9.blockId = 9;
                    this.p2b10.blockId = 10;
                    
                    // Assign health to each block
                    this.p2b1.blockHealth = 100;
                    this.p2b2.blockHealth = 100;
                    this.p2b3.blockHealth = 100;
                    this.p2b4.blockHealth = 100;
                    this.p2b5.blockHealth = 100;
                    this.p2b6.blockHealth = 100;
                    this.p2b7.blockHealth = 100;
                    this.p2b8.blockHealth = 100;
                    this.p2b9.blockHealth = 100;
                    this.p2b10.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p2CastleGroup.add(this.p2b1, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b2, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b3, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b4, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b5, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b6, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b7, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b8, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b9, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b10, {key: 'block'});
                    
                    // Create the ground platform
                    this.p2Ground = this.add.rectangle(600,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p2Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p2Ground, this.p2CastleGroup);
                    this.physics.add.collider(this.p2CastleGroup, this.p2CastleGroup); 
                    break;
                
                case 4:
                    // Indicate which Castle is being built
                    console.log("P2 building Castle 4");
                    // Variables to store the information of the castle
                    this.p2CastleBlocksRemaining = 10;
                    this.p2CastleGroup = this.physics.add.group();
                    
                    
                    // Add each block to its appropriate position
                    this.p2b1 = this.add.image(491,268, 'c4b1').setOrigin(0,1);
                    this.p2b2 = this.add.image(497,344, 'c4b2').setOrigin(0,1);
                    this.p2b3 = this.add.image(497,420, 'c4b3').setOrigin(0,1);
                    this.p2b4 = this.add.image(562,201, 'c4b4').setOrigin(0,1);
                    this.p2b5 = this.add.image(572,274, 'c4b5').setOrigin(0,1);
                    this.p2b6 = this.add.image(572,347, 'c4b6').setOrigin(0,1);
                    this.p2b7 = this.add.image(572,420, 'c4b7').setOrigin(0,1);
                    this.p2b8 = this.add.image(645,268, 'c4b8').setOrigin(0,1);
                    this.p2b9 = this.add.image(645,344, 'c4b9').setOrigin(0,1);
                    this.p2b10 = this.add.image(645,420, 'c4b10').setOrigin(0,1);
                    
                    // Assign ID Numbers to each block
                    this.p2b1.blockId = 1;
                    this.p2b2.blockId = 2;
                    this.p2b3.blockId = 3;
                    this.p2b4.blockId = 4;
                    this.p2b5.blockId = 5;
                    this.p2b6.blockId = 6;
                    this.p2b7.blockId = 7;
                    this.p2b8.blockId = 8;
                    this.p2b9.blockId = 9;
                    this.p2b10.blockId = 10;
                    
                    // Assign health to each block
                    this.p2b1.blockHealth = 100;
                    this.p2b2.blockHealth = 100;
                    this.p2b3.blockHealth = 100;
                    this.p2b4.blockHealth = 100;
                    this.p2b5.blockHealth = 100;
                    this.p2b6.blockHealth = 100;
                    this.p2b7.blockHealth = 100;
                    this.p2b8.blockHealth = 100;
                    this.p2b9.blockHealth = 100;
                    this.p2b10.blockHealth = 100;
                    
                    // Add each block to the Castle Group
                    this.p2CastleGroup.add(this.p2b1, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b2, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b3, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b4, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b5, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b6, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b7, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b8, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b9, {key: 'block'});
                    this.p2CastleGroup.add(this.p2b10, {key: 'block'});
                    
                    // Create the ground platform
                    this.p2Ground = this.add.rectangle(600,421,300,20, 0x17871B).setOrigin(0.5,0);
                    this.platforms.add(this.p2Ground);
                    
                    // Add appropriate colliders
                    this.physics.add.collider(this.p2Ground, this.p2CastleGroup);
                    this.physics.add.collider(this.p2CastleGroup, this.p2CastleGroup); 
                    break;

                default: break;
            }
        }
    }

    
    dispBlockHealth() {
        this.healthStatusText = this.physics.add.staticGroup();
        this.healthStatusBars = this.physics.add.staticGroup();
        
        this.p2CastleGroup.children.iterate(function(block) {
            var text = this.add.text(block.x+block.width/2, block.y-block.height/2, block.blockHealth)
                .setAlign('center')
                .setColor('#000000')
                .setFontSize(24)
                .setStroke('#FFFFFF', 2)
                .setDepth(2)
                .setFontFamily("Candara")
                .setOrigin(0.5,0.5);
                
            var healthBar = this.add.image(block.x+block.width/2, block.y-block.height/2, 'health')
                .setDepth(1)
                .setOrigin(0.5, 0.5)
                .setCrop(0,0,52*block.blockHealth/100, 15);
                
            this.healthStatusText.add(text);
            this.healthStatusBars.add(healthBar);
        }, this);
        
        this.p1CastleGroup.children.iterate(function(block) {
            var text = this.add.text(block.x+block.width/2, block.y-block.height/2, block.blockHealth)
                .setAlign('center')
                .setColor('#000000')
                .setFontSize(24)
                .setStroke('#FFFFFF', 2)
                .setDepth(2)
                .setFontFamily("Candara")
                .setOrigin(0.5,0.5);
                
            var healthBar = this.add.image(block.x+block.width/2, block.y-block.height/2, 'health')
                .setDepth(1)
                .setOrigin(0.5, 0.5)
                .setCrop(0,0,52*block.blockHealth/100, 15);
                
            this.healthStatusText.add(text);
            this.healthStatusBars.add(healthBar);
        }, this);
    }
    
    removeBlockHealth() {
        this.healthStatusText.clear(true,true);
        this.healthStatusBars.clear(true,true);
    }
    
    castleHit1(blast, block) {
        this.scene.hit = true;
        blast.body.setEnable(false);
        blast.play("blastAnim");
        console.log("Hit by Player One!")
        console.log("Player Two's Castle Block:");
        console.log(block.blockId);
        console.log("Block Health:");
        var ogBlockHealth = block.blockHealth;
        console.log(ogBlockHealth);
        block.blockHealth -= Math.round(this.scene.powerLevel);
        console.log("New Block Health:");
        console.log(block.blockHealth);
        if (block.blockHealth <=0) {
            this.scene.p2CastleBlocksRemaining -= 1;
            this.scene.p2CastleIndicText.setText("Player Two's Castle:\nBlocks Remaining: " + this.scene.p2CastleBlocksRemaining);
            if(this.scene.p2CastleBlocksRemaining == 0) {
                this.scene.start('W', {
                    winner: 1,
                });
            }
            block.destroy();
            this.scene.time.addEvent({
                delay: 2000,
                callback: ()=>{
                    blast.destroy();
                    this.scene.dispBlockHealth();
                },
                loop: false
            });
        } else {
            this.scene.time.addEvent({
                delay: 1250,
                callback: ()=>{
                    blast.destroy();
                    this.scene.dispBlockHealth();
                },
                loop: false
            });
        }
    }
    
    castleHit2(blast, block) {
        this.scene.hit = true;
        blast.body.setEnable(false);
        blast.play("blastAnim");
        console.log("Hit by Player Two!")
        console.log("Player One's Castle Block:");
        console.log(block.blockId);
        console.log("Block Health:");
        var ogBlockHealth = block.blockHealth;
        console.log(ogBlockHealth);
        block.blockHealth -= Math.round(this.scene.powerLevel);
        console.log("New Block Health:");
        console.log(block.blockHealth);
        if (block.blockHealth <=0) {
            this.scene.p1CastleBlocksRemaining -= 1;
            this.scene.p1CastleIndicText.setText("Player One's Castle:\nBlocks Remaining: " + this.scene.p1CastleBlocksRemaining);
            if(this.scene.p1CastleBlocksRemaining == 0) {
                this.scene.start('Game', {
                    winner: 2,
                });
            }
            block.destroy();
            this.scene.time.addEvent({
                delay: 2000,
                callback: ()=>{
                    blast.destroy();
                    this.scene.dispBlockHealth();
                },
                loop: false
            });
        } else {
            this.scene.time.addEvent({
                delay: 1250,
                callback: ()=>{
                    blast.destroy();
                    this.scene.dispBlockHealth();
                },
                loop: false
            });
        }
    }
}