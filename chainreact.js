// written in PhaserJS
// Define the size of the grid squares as a constant
const BUCKET_SIZE = 60;

// Define colors for squares
const DARK_SQ_COLOR = '#666666';
const LIGHT_SQ_COLOR = '#222222';


// Initialize the Phaser game object
var config = {
    type: Phaser.AUTO,
    width: 60 * 8,
    height: 60 * 8,
    backgroundColor: '#444444',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

// Define the Bucket class
class Bucket {
    constructor(id, i, j, scene) {
        this.id = id;
        this.i = i;
        this.j = j;
        this.color = '#888888';
        this.fullness = Math.floor(Math.random() * 4);
        this.scene = scene;
        this.graphics = scene.add.graphics();
    }

    set color(color) {
        this._color = color;
    }

    get color() {
        return this._color;
    }

    set fullness(f) {
        this._fullness = f;      
    }

    get fullness() {
        return this._fullness;
    }
    set radius(r) {
        console.log("OB_WARN: Cannot set radius, it is a function of fullness...")
    } 
    get radius() {
        var f= this.fullness
        var newrad = 0;

        if (f==1) { newrad=BUCKET_SIZE/2 * 0.3 }
        else if (f==2) { newrad=BUCKET_SIZE/2 *.6 }
        else if (f==3) { newrad=BUCKET_SIZE/2 *.9 }
        else { newrad = 0 }
  
        //console.log("Got radius? "+f+"(" + newrad + ")")
        return newrad;
    }
    draw(graphics, rad, x, y) {
        //console.log("Start Draw")
        this.graphics = graphics;
        if (this.graphics) {
            this.graphics.lineStyle(2, 'black', 1);
            this.graphics.fillStyle(this.color, 1);
            this.graphics.fillCircle(x, y, this.radius);
            this.graphics.strokeCircle(x, y, this.radius);
            // Add text to the circle
            this.text = this.graphics.scene.add.text(x, y, `${this.fullness}`, {
                fontFamily: 'Arial',
                fontSize: 10-4+this.fullness*3,
                color: 'white',
            });
            this.text.setOrigin(0.5);
            this.textTopRight = this.graphics.scene.add.text(x-BUCKET_SIZE/2, y+BUCKET_SIZE/2 , `(${this.i},${this.j})`, {
                fontFamily: 'Arial',
                fontSize: 8,
                color: 'white',
            });
            this.textTopRight.setOrigin(0, 1);
            this.textTopRight.setVisible(true);
        }
        //console.log("End Draw")
    }

    incrementFullness() {
        this.fullness += 1;
        if (this.fullness === 3) {
            this.fullness = 0;
            this.color = 'gray';
            return true;
        }
        if (this.fullness === 1) {
            this.color = 'red';
        } else {
            this.color = 'green';
        }
        return false;
    }

    decrementFullness() {
        if (this.fullness === 0) {
            return false;
        }
        this.fullness -= 1;
        if (this.fullness === 0) {
            this.color = 'gray';
        } else if (this.fullness === 1) {
            this.color = 'red';
        }
        return true;
    }

    getNeighbors() {
        return [
            { i: this.i - 1, j: this.j },
            { i: this.i + 1, j: this.j },
            { i: this.i, j: this.j - 1 },
            { i: this.i, j: this.j + 1 },
        ];
    }

    setupGraphics() {
        if (this.graphics) {
            var x = BUCKET_SIZE * this.i + BUCKET_SIZE / 2;
            var y = BUCKET_SIZE * this.j + BUCKET_SIZE / 2;
            this.graphics = this.scene.add.graphics();
            this.graphics.setInteractive();
            
            // Add pointerover and pointerout events to change the color
            this.graphics.on('pointerover', () => {
                this.color = 'red';
                this.draw(this.graphics, BUCKET_SIZE / 2, x, y);
            });
            this.graphics.on('pointerout', () => {
                this.color = 'green';
                this.draw(this.graphics, BUCKET_SIZE / 2, x, y);
            });
            this.graphics.on('pointerdown', () => {
                this.incrementFullness();
                this.draw(this.graphics, BUCKET_SIZE / 2, x, y);
            });
            this.draw(this.graphics, BUCKET_SIZE / 2, x, y);
        } else {
            console.log("graphics undefined")
        }
    }

    handlePointerDown(pointer) {
        console.log(this.i + "," + this.j);
        this.incrementFullness();
    }

}

// Load any assets needed
function preload() { }

var buckets = new Array(8);

// Create the game objects
function create() {
    overflow = 0;
    // Create a 2D array of squares
    for (var i = 0; i < 8; i++) {
        buckets[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            buckets[i][j] = new Bucket(i.toString() + '_' + j.toString(), i, j, this);
            buckets[i][j].setupGraphics()
            console.log('Created a bucket')
        }
    }

    // Set the background color of the game
    this.cameras.main.setBackgroundColor('#444444');

    // Render the screen
    this.game.renderer.resize(BUCKET_SIZE * 8, BUCKET_SIZE * 8);

    // Add a div to display the  value
    var valueDiv = document.createElement('div');
    valueDiv.setAttribute('id', 'valueDiv');
    valueDiv.style.position = 'absolute';
    valueDiv.style.top = '10px';
    valueDiv.style.left = '10px';
    valueDiv.style.color = 'white';
    document.body.appendChild(valueDiv);
}


