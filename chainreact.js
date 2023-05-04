// Define the size of the grid squares as a constant
const SQUARE_SIZE = 60;
const SQ_BG_COLOR = '#999999';

// Initialize the Phaser game object
var config = {
    type: Phaser.AUTO,
    width: 60*8,
    height: 60*8,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

// Define the square class
class Square extends Phaser.GameObjects.Rectangle {
    i=0;
    j=0;


    constructor(scene, i, j) {
        super(scene, i * SQUARE_SIZE + SQUARE_SIZE/2, j * SQUARE_SIZE + SQUARE_SIZE/2, SQUARE_SIZE, SQUARE_SIZE, SQ_BG_COLOR);
        this.fullness = 0;
        this.text = scene.add.text(i * SQUARE_SIZE + 10, j * SQUARE_SIZE + 10, this.fullness.toString() + "("+i+","+j+")", { color: '#ffffff', fontSize:'12px' });
        this.text.setDepth(1);
        this.backgroundColor = '#00FF00'; // green color
        this.setInteractive({ useHandCursor: true })
                .on('pointerup', () => {
                    this.incrementFullness();
                });
        this.i = i;
        this.j = j;
        scene.add.existing(this);
    }

    incrementFullness() {
        this.fullness++;
        if (this.fullness >= 5) {
            // IncrementFullness for surrounding 4 items
            this.fullness = 0;
            //squares[i][j].incrementFullness();
            squares[this.i-1][this.j].incrementFullness();
            squares[this.i+1][this.j].incrementFullness();
            squares[this.i][this.j-1].incrementFullness();
            squares[this.i][this.j+1].incrementFullness();
            
        }
        this.text.setText(this.fullness.toString());
    }
}

// Load any assets needed
function preload() {}

var squares = new Array(8);

// Create the game objects
function create() {
    // Create a 2D array of squares
    //var squares = new Array(8);
    for (var i = 0; i < 8; i++) {
        squares[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            squares[i][j] = new Square(this, i, j);
        }
    }

    this.cameras.main.setBackgroundColor(this.backgroundColor);
    
    // Render the screen
    this.game.renderer.resize(SQUARE_SIZE * 8, SQUARE_SIZE * 8);

    // Add a div to display the square value
    var squareValueDiv = document.createElement('div');
    squareValueDiv.setAttribute('id', 'square-value');
    squareValueDiv.innerText = '0';
    document.body.appendChild(squareValueDiv);
}
