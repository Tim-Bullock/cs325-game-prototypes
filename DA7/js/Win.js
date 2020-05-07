class WinScene extends Phaser.Scene {
    constructor() {
        super({key: "Win"});
    }
    
    // Initialization Function - Get Data from Previous Scene
    init(data) {
        this.winner = data.winner;
    }
    
    create() {
        // Draw the Game background
        this.background = this.add.image(400, 300, 'background')
            .setScale(0.6);
            
        switch(this.winner) {
            case 1: 
                console.log("Player One Wins");
                this.turnText = this.add.text(400, 40, "Player One Wins!")
                    .setFontFamily("Candara")
                    .setFontSize(48)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5);
                break;
            case 2: 
                console.log("Player Two Wins");
                this.turnText = this.add.text(400,40, "Player Two Wins!")
                    .setFontFamily("Candara")
                    .setFontSize(48)
                    .setColor('#AA0000')
                    .setStroke('#FFFFFF', 2)
                    .setAlign('center')
                    .setOrigin(0.5,0.5);
                break;
            default: break;
        }
    }
    
}