class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }

    catCollide() {
        this.backgroundmusic.stop();
        this.scene.start('Lose');
    }
    
    create() {
        var laundromatMap = this.add.tilemap('laundromatMap');
        var floorTileset = laundromatMap.addTilesetImage('FloorTileset', 'floor');
        var washerTileset = laundromatMap.addTilesetImage('WasherTileSheet2', 'washer');
        var floorLayer = laundromatMap.createStaticLayer('Floor Layer', floorTileset, 0, 0);
        var machineLayer = laundromatMap.createStaticLayer('Machine Layer', washerTileset, 0, 0);

        this.player = this.add.sprite(500, 250, 'playerSpritesheet').setScale(1.5);
        this.anims.create({
            key: 'playerAnimation',
            frames: this.anims.generateFrameNumbers('playerSpritesheet'),
            frameRate: 20,
            repeat: 1,
        });

        var storefront = this.add.image(0,4800,'storefront').setOrigin(0,0).setScale(1.3);

        //Set camera properties
        this.cameras.main.setBounds(0, 0, laundromatMap.widthInPixels, laundromatMap.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.75);

        this.backgroundmusic = this.sound.add('music', {loop: true});
        this.backgroundmusic.play();

        this.player.setFrame(11);
        
        this.physics.add.existing(this.player);
        this.player.body.setSize(50,100);
        //this.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, machineLayer);
        machineLayer.setCollisionByProperty({collides:true});

        //Set controls
        this.cursors = this.input.keyboard.createCursorKeys();


        this.catGroup = this.physics.add.group();
        this.cat1 = this.add.sprite(100,896, 'catSpritesheet' ).setScale(0.5);
        this.cat2 = this.add.sprite(100,1408, 'catSpritesheet' ).setScale(0.5);
        this.cat3 = this.add.sprite(100,1920, 'catSpritesheet' ).setScale(0.5);
        this.cat4 = this.add.sprite(1436,1920, 'catSpritesheet' ).setScale(-0.5,0.5);
        this.cat5 = this.add.sprite(300,2432, 'catSpritesheet' ).setScale(0.5);
        this.cat6 = this.add.sprite(1436,2994, 'catSpritesheet' ).setScale(-0.5,0.5);
        this.cat7 = this.add.sprite(1436,2506, 'catSpritesheet' ).setScale(-0.5,0.5);
        this.cat8 = this.add.sprite(100,2994, 'catSpritesheet' ).setScale(0.5);
        this.cat9 = this.add.sprite(400,3506, 'catSpritesheet' ).setScale(0.5);
        this.catGroup.add(this.cat1);
        this.catGroup.add(this.cat2);
        this.catGroup.add(this.cat3);
        this.catGroup.add(this.cat4);
        this.catGroup.add(this.cat5);
        this.catGroup.add(this.cat6);
        this.catGroup.add(this.cat7);
        this.catGroup.add(this.cat8);
        this.catGroup.add(this.cat9);
        this.cat1.body.setSize(70,70);
        this.cat2.body.setSize(70,70);
        this.cat3.body.setSize(70,70);
        this.cat4.body.setSize(70,70);
        this.cat5.body.setSize(70,70);
        this.cat6.body.setSize(70,70);
        this.cat7.body.setSize(70,70);
        this.cat8.body.setSize(70,70);
        this.cat9.body.setSize(70,70);
        

        this.physics.add.collider(this.player, this.catGroup, this.catCollide, null, this);
        
        this.catGroup.getChildren().forEach(function(cat) {
            cat.body.setVelocityX(Phaser.Math.Between(300,500));
        }, this);
    }  


    update() {
        this.player.body.setVelocity(0,0);

        // Set movement
        if (this.cursors.left.isDown){
            this.player.setScale(-1.5,1.5);
            this.player.body.setVelocityX(-360);
            if (!this.player.anims.isPlaying) {
                this.player.play('playerAnimation');
            }
        }
        else if (this.cursors.right.isDown){
            this.player.setScale(1.5,1.5);
            this.player.body.setVelocityX(360);
            if (!this.player.anims.isPlaying) {
                this.player.play('playerAnimation');
            }
        }
        if (this.cursors.up.isDown){
            this.player.body.setVelocityY(-360);
            if (!this.player.anims.isPlaying) {
                this.player.play('playerAnimation');
            }
        } else if (this.cursors.down.isDown){
            this.player.body.setVelocityY(360);
            if (!this.player.anims.isPlaying) {
                this.player.play('playerAnimation');
            }
        }

        if (this.player.y >= 5500) {
            this.backgroundmusic.stop();
            this.scene.start('Win');
        }
        
        
        this.catGroup.getChildren().forEach(function(cat) {
            if (cat.x > 1516) {
                cat.body.setVelocityX(0);
                cat.setScale(-0.5,.5);
                cat.setX=(1510);
                cat.body.setVelocityX(-1*Phaser.Math.Between(300,500));
            }
            else if (cat.x < 20) {
                cat.body.setVelocityX(0);
                cat.setScale(0.5,.5);
                cat.setX=(26);
                cat.body.setVelocityX(Phaser.Math.Between(300,500));
            }
        }, this);
    }
    
   
                


}