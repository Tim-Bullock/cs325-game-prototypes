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
        this.p1AttackMenuBox = this.add.rectangle(50,50,250,500, 0xBBBBBB)
            .setStrokeStyle(3,0xFFFFFF)
            .setOrigin(0,0)
            .setDepth(4)
            .setAlpha(0);
        this.p1AttackText = this.add.text(175, 100, "Player One\nis Attacking")
            .setFontFamily("Candara")
            .setFontSize(48)
            .setColor('#AA0000')
            .setStroke('#FFFFFF', 2)
            .setAlign('center')
            .setOrigin(0.5,0.5)
            .setDepth(5)
            .setAlpha(0);
        this.p1AttackInstr = this.add.text(60, 250, "Player One:\nPress Space to set\naim and power.\n(Atack Powerups\nand Additional\nWeapons Coming\nSoon!).")
            .setFontFamily("Candara")
            .setFontSize(28)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0.5)
            .setDepth(5)
            .setAlpha(0);
        
        // Draw the Player 2 Attack Menu
        this.p2AttackMenuBox = this.add.rectangle(500,50,250,500, 0xBBBBBB)
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
        this.p2AttackInstr = this.add.text(510, 250, "Player Two:\nPress Space to set\naim and power.\n(Atack Powerups\nand Additional\nWeapons Coming\nSoon!).")
            .setFontFamily("Candara")
            .setFontSize(28)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0.5)
            .setDepth(5)
            .setAlpha(0);
            
        
        // Tweens for Attack Menus
        this.p1AttackMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p1AttackMenuBox, this.p1AttackText, this.p1AttackInstr],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p1AttackMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p1AttackMenuBox, this.p1AttackText, this.p1AttackInstr],
            alpha: 100,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2AttackMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p2AttackMenuBox, this.p2AttackText, this.p2AttackInstr],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2AttackMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p2AttackMenuBox, this.p2AttackText, this.p2AttackInstr],
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
        this.p1DefendInstr = this.add.text(510, 250, "Player One:\nClick a Castle Block\nto restore to full\nhealth. (Defense\nPowerups Coming\nSoon!).")
            .setFontFamily("Candara")
            .setFontSize(28)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0.5)
            .setDepth(5)
            .setAlpha(0);
        
            
        // Draw the Player 2 Attack Menu
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
        this.p2DefendInstr = this.add.text(60, 250, "Player Two:\nClick a castle block\nto restore to full\nhealth. (Defense\nPowerups Coming\nSoon!).")
            .setFontFamily("Candara")
            .setFontSize(28)
            .setColor('#FFFFFF')
            .setAlign('left')
            .setOrigin(0,0.5)
            .setDepth(5)
            .setAlpha(0);
         
        
        
        // Tweens for Defend Menus
        this.p1DefendMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p1DefendMenuBox, this.p1DefendText, this.p1DefendInstr],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p1DefendMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p1DefendMenuBox, this.p1DefendText, this.p1DefendInstr],
            alpha: 100,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2DefendMenuFadeOutTween = this.tweens.add({
            paused: true,
            targets: [this.p2DefendMenuBox, this.p2DefendText, this.p2DefendInstr],
            alpha: 0,
            duration: 250,
            delay: 0,
            ease: 'Power1'
        }, this);
        this.p2DefendMenuFadeInTween = this.tweens.add({
            paused: true,
            targets: [this.p2DefendMenuBox, this.p2DefendText, this.p2DefendInstr],
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
        this.turnFadeOutTween.play();
        this.removeBlockHealth();
        
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
            this.p1AttackMenuFadeInTween.play();
            this.aimer.setX(400);
            this.aimer.setVisible(true);
            this.p1aimerHorizontalTween.play();
        // Otherwise do the same thing for player 2
        } else {
            console.log("Player Two is Attacking");
            this.p2AttackMenuFadeInTween.play();
            this.aimer.setX(60);
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
                    this.powerLevel = 100- 1/5*this.powerMeterIndic.y;
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
                    this.physics.add.overlap(this.p2CastleGroup, this.blast1, this.castleHit1, null, this.scene);

                    // Check for miss (overlap event has not occurred)
                    this.time.addEvent({
                        delay: 100,
                        callback: ()=>{
                            if (this.hit == false) {
                                console.log("Miss!");
                                this.blast1.destroy();
                                this.dispBlockHealth();
                            }
                        },
                        loop: false
                    });

                    // Then remove Player Ones's UI Elements
                    this.aimer.setVisible(false);
                    this.powerMeter.setVisible(false);
                    this.powerMeterIndic.setVisible(false);   
                    this.p1AttackMenuFadeOutTween.play();
                    
                    // Remove the listener for the keyboard
                    this.input.keyboard.removeAllListeners(); 
                    
                    // And set the turn Menu for player 2
                    console.log("Player Two's Turn");
                    this.turnText.setText("Player Two's Turn");
                    this.turnFadeInTween.play();
                    this.turn = 2;
                    
                    // End of P1's Attack Turn
                }
                
            // If it is Player 2's Turn
            } else {
                // If it is the first press (to select x coordinate)
                if (!(this.xSet)) {
                    this.p2aimerHorizontalTween.stop();
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
                    this.powerLevel = 100- 1/5*this.powerMeterIndic.y;
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
                    this.physics.add.overlap(this.p1CastleGroup, this.blast2, this.castleHit2, null, this.scene);
                    
                    // Check for miss (overlap event has not occurred)
                    this.time.addEvent({
                        delay: 100,
                        callback: ()=>{
                            if (this.hit == false) {
                                console.log("Miss!");
                                this.blast1.destroy();
                                this.dispBlockHealth();
                            }
                        },
                        loop: false
                    });
                    
                    // Then remove Player Two's UI Elements
                    this.aimer.setVisible(false);
                    this.powerMeter.setVisible(false);
                    this.powerMeterIndic.setVisible(false);
                    this.p2AttackMenuFadeOutTween.play();
                    
                    // Remove the listener for the keyboard
                    this.input.keyboard.removeAllListeners();
                    
                    // And set the turn Menu for player 2
                    console.log("Player One's Turn"); 
                    this.turnText.setText("Player One's Turn");
                    this.turnFadeInTween.play();
                    this.turn = 1;
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
                    // Restore the health
                    block.blockHealth = 100;
                    // And redraw the health indicators
                    this.removeBlockHealth();
                    this.dispBlockHealth();
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
                    // Restore the health
                    block.blockHealth = 100;
                    // And redraw the health indicators
                    this.removeBlockHealth();
                    this.dispBlockHealth();
                    // Disable clickability on each castle block
                    this.p2CastleGroup.children.iterate( function(block) {
                        block.removeAllListeners();
                    }, this);
                    // Remove the defend menu
                    this.p2DefendMenuFadeOutTween.play();
                    
                    // And set the turn Menu for player 1
                    console.log("Player One's Turn"); 
                    this.turnText.setText("Player One's Turn");
                    this.turnFadeInTween.play();
                    this.turn = 1;
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