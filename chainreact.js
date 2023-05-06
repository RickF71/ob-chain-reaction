// written in PhaserJS 3.55
// Name of this app: Chain Reaction
// Define the size of the grid squares as a constant
const BUCKET_SIZE = 60;

// Define colors for squares
const DARK_SQ_COLOR = '#666666';
const LIGHT_SQ_COLOR = '#222222';


// Initialize the Phaser game object
var config = {
    type: Phaser.AUTO,
    width: BUCKET_SIZE * 8,
    height: BUCKET_SIZE * 9,
    backgroundColor: '#444444',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

// Define the Bucket class
class Bucket extends Phaser.GameObjects.Graphics {

    constructor(id, i, j, scene) {
        super(scene);
        this.id = id;
        this.i = i;
        this.j = j;
        this.color = '#8888ff';
        this.fullness = Math.floor(Math.random() * 4);
        this.scene = scene;
        this.setInteractive();
        this.on('pointerover', () => {
            this.color = 'red';
            this.redraw();
        });
        this.on('pointerout', () => {
            this.color = 'green';
            this.redraw();
        });
        this.on('pointerdown', () => {
            this.incrementFullness();
        });
        this.setPosition(i * BUCKET_SIZE, j * BUCKET_SIZE)
        this.redraw();
        console.log(this)
    }

    redraw() {
        this.clear();
        var radius = this.getRadius();
        this.lineStyle(2, 'orange', 1);
        this.fillStyle(this.color, 1);
        this.fillCircle(0.0, radius);
        this.strokeCircle(0, 0, radius);
        // Add text to the circle
        this.text = this.scene.add.text(
            0,
            0,
            'WHY IS THIS TEXT NOT SHOWING',
            {
                fontFamily: 'Arial',
                fontSize: 10 - 4 + this.fullness * 3,
                color: 'white',
            }
        );
        this.text.setOrigin(0.5);
        this.textTopRight = this.scene.add.text(
            this.x - BUCKET_SIZE / 2,
            this.y + BUCKET_SIZE / 2,
            '',
            {
                fontFamily: 'Arial',
                fontSize: 8,
                color: 'white',
            }
        );
        this.textTopRight.setOrigin(0, 1);
        this.textTopRight.setVisible(true);

    }

    getRadius() {
        var f = this.fullness;
        var newrad = 0;

        if (f == 1) {
            newrad = BUCKET_SIZE / 2 * 0.3;
        } else if (f == 2) {
            newrad = BUCKET_SIZE / 2 * 0.6;
        } else if (f == 3) {
            newrad = BUCKET_SIZE / 2 * 0.9;
        } else {
            newrad = 0;
        }

        return newrad;
    }

    incrementFullness() {
        this.fullness += 1;
        if (this.fullness === 3) {
            this.fullness = 0;
            this.color = 'orange';
        }
        if (this.fullness === 1) {
            this.color = 'red';
        } else {
            this.color = 'green';
        }
        this.redraw();
    }

    decrementFullness() {
        if (this.fullness === 0) {
            return false;
        }
        this.fullness -= 1;
        if (this.fullness === 0) {
            this.color = 'blue';
        } else if (this.fullness === 1) {
            this.color = 'red';
        }
        this.redraw();
    }


    getNeighbors() {
        return [
            { i: this.i - 1, j: this.j },
            { i: this.i + 1, j: this.j },
            { i: this.i, j: this.j - 1 },
            { i: this.i, j: this.j + 1 },
        ];
    }


    setPosition2(x, y) {
        super.setPosition(x + game.canvas.offsetLeft, y + game.canvas.offsetTop);
    }

    handlePointerDown(pointer) {
        console.log(this.i + "," + this.j);
        this.incrementFullness();
    }

}

// Load any assets needed
function preload() { }

// var buckets = new Array(8);

function createBuckets(scene) {
    var buckets = new Array(8);
    for (var i = 0; i < 8; i++) {
        buckets[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            var bucket = new Bucket('B' + i + '' + j, i, j, scene);
            // bucket.x = i * BUCKET_SIZE
            // bucket.y = j * BUCKET_SIZE
            buckets[i][j] = bucket
            scene.add(bucket)
            //this.redraw
            console.log(`Created a bucket ${i * BUCKET_SIZE},${j * BUCKET_SIZE}.  Canvas offset@ ${game.canvas.offsetLeft},${game.canvas.offsetTop}`);
            console.log(buckets[i][j])
        }
    }

    return buckets;
}

// Create the game objects
function create() {
    // Set the background color of the game
    this.cameras.main.setBackgroundColor('#444444');

    // Render the screen
    this.game.renderer.resize(BUCKET_SIZE * 8, BUCKET_SIZE * 8);

    // Create the 2D array of buckets
    createBuckets(game.scene);

    // Add a div to display the value
    var valueDiv = document.createElement('div');
    valueDiv.id = 'valueDiv';
    valueDiv.style.position = 'absolute';
    valueDiv.style.top = '10px';
    valueDiv.style.left = '10px';
    document.body.appendChild(valueDiv);
}


