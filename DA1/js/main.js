
//Create Game Configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//Game variables
var game = new Phaser.Game(config);
var map;
var tileset;
var background
var asteroid_layer;
var controls;
var rocket;
var cursors;
var astronaut;
var music;

//Load Game Assets
function preload() {
    this.load.image('rocket', 'assets/sprites/rocket.png');
    this.load.image('astronaut', 'assets/sprites/astronaut.png');
    this.load.image('background', 'assets/seamless_space.png')
    this.load.image('tileset_img', 'assets/tilemaps/asteroid_tileset.png');
    this.load.tilemapTiledJSON('map_dat', 'assets/tilemaps/space_map.json');
}

function create() {
    // Load Background
    background = this.add.tileSprite(2560, 2560, 5120, 5120, 'background');
    
    //Load Tile Map
    map = this.add.tilemap('map_dat');
    tileset = map.addTilesetImage('Asteroids Tileset', 'tileset_img');
    asteroid_layer = map.createStaticLayer('Asteroid Layer 1', tileset);
    
    // Load rocket
    rocket = this.add.sprite(250, 250, 'rocket');
    rocket.setScale(0.5,0.5);
    
    // Set collisions and physics
    map.setCollisionBetween(0, 63); 
    this.physics.add.existing(rocket);
    this.physics.add.collider(rocket, asteroid_layer);
    rocket.body.setAllowDrag(true);
    rocket.body.setDrag(400);
    
    //Load astronaut
    astronaut = this.add.sprite(Phaser.Math.Between(400,4800), Phaser.Math.Between(400,4800), 'astronaut');
    astronaut.setScale(0.05,0.05);
    
    //Set camera properties
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(rocket);
    
    //Set controls
    cursors = this.input.keyboard.createCursorKeys();
}


function update() {
    // Stop rotation
    rocket.body.angularVelocity = 0;

    // Set movement
    if (cursors.left.isDown){
        rocket.body.setAngularVelocity(-200);
    }
    else if (cursors.right.isDown){
        rocket.body.setAngularVelocity(200);
    }
    else if (cursors.up.isDown){
        this.physics.velocityFromAngle(rocket.angle, 400, rocket.body.velocity);
    }
    
    // Move background
    background.tilePositionX = rocket.body.x*0.1;
    background.tilePositionY = rocket.body.y*0.1;
}
