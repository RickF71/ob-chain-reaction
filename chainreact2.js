const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 480,
    backgroundColor: '#ffffff',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

const BUCKET_SIZE = 30;
const DARK_SQ_COLOR = 0x668666;
const LIGHT_SQ_COLOR = 0x666686;

class Bucket extends Phaser.GameObjects.Graphics {
    constructor(scene, id, i, j, color, x, y) {
        super(scene);
        this.id = id;
        this.i = i;
        this.j = j;
        this.color = color;
        this.fullness = Phaser.Math.Between(0, 3);
        this.drawBucket();
        //this.setInteractive({ hitArea: new Phaser.Geom.Circle(0, 0, BUCKET_SIZE / 2), useHandCursor: true, hitAreaCallback: (pointer, hitArea) => hitAreaCallback(pointer, hitArea, this) });
        this.setInteractive({ useHandCursor: true })
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerup', function () { this.incrementFullness() }, this);

        // Set the bucket's position on the screen
        this.setPosition(x, y);
    }
    onPointerOver() {
        this.fillStyle(0xff0000);
        const floatedOver = document.getElementById('floatedOver');
        floatedOver.innerHTML = `Bucket ID: ${this.id}<br>Coordinates: (${this.i},${this.j})`;
    }
    onPointerOut() {
        floatedOver.innerHTML = `Nothing`;
    }    

    drawBucket() {
        const x = (this.i + 0.5) * BUCKET_SIZE;
        const y = (this.j + 0.5) * BUCKET_SIZE;
        const radius = BUCKET_SIZE * (this.fullness * 0.3);
        this.clear();
        // Create and add text object
        const text = this.scene.add
                .text(x * 2, y * 2, this.id + '\n' + this.i + ',' + this.j, { color: '#000000', fontSize: '10px' })
                .setDepth(1);
        //const text = this.scene.add.text(x*2, y*2, this.parentContainer.x + ','+ this.parentContainer.y, { color: '#000000', fontSize: '16px' });
        text.setOrigin(0.5, 0.5);
        this.fillStyle(this.color);
        this.fillCircle(x, y, radius);
        this.strokeCircle(x, y, BUCKET_SIZE / 2);
    }

    getNeighbors() {
        const neighbors = [];
        if (this.i > 0) {
            neighbors.push(gameBoard[this.i - 1][this.j]);
        }
        if (this.i < 7) {
            neighbors.push(gameBoard[this.i + 1][this.j]);
        }
        if (this.j > 0) {
            neighbors.push(gameBoard[this.i][this.j - 1]);
        }
        if (this.j < 7) {
            neighbors.push(gameBoard[this.i][this.j + 1]);
        }
        return neighbors;
    }

    incrementFullness() {
        console.log("Increment Fullness. (" + this.i + "," + this.j + ")")
        this.fullness++;
        if (this.fullness > 3) {
            this.fullness = 0;
            this.color = 0xffa500;
            this.getNeighbors().forEach(neighbor => neighbor.incrementFullness());
        }
        else {
            this.color = this.color === DARK_SQ_COLOR ? LIGHT_SQ_COLOR : DARK_SQ_COLOR;
        }
        this.drawBucket();

    }

    hitAreaCallback () { 
        return true; 
    }
}



function createBuckets(scene) {
    const buckets = [];
    for (let i = 0; i < 8; i++) {
        buckets[i] = [];
        for (let j = 0; j < 8; j++) {
            const id = `b${i}_${j}`;
            // Position each bucket independently using absolute screen coordinates
            const x = (i + 0.5) * BUCKET_SIZE;
            const y = (j + 0.5) * BUCKET_SIZE;
            const bucket = new Bucket(scene, id, i, j, (i + j) % 2 === 0 ? DARK_SQ_COLOR : LIGHT_SQ_COLOR, x, y);
            buckets[i][j] = bucket;
            scene.add.existing(bucket);
        }
    }
    return buckets;
}


function preload() { }

function create() {
    this.cameras.main.setBackgroundColor('#f0f0f0');
    this.scale.resize(BUCKET_SIZE * 8 * 2, BUCKET_SIZE * 8 * 2);
    gameBoard = createBuckets(this);
}

function hitAreaCallback(pointer, hitArea, bucket) {
    //console.log(typeof(hitArea))
    
    const localX = bucket.x;
    const localY = bucket.y;
    //console.log(`pointer: ${pointer.x},${pointer.y}` )
    //console.log(`hitArea: ${hitArea.x},${hitArea.y}` )
    //console.log(`bucket(${bucket.id}:${bucket.x},${bucket.y})` )
    //return true;
    return Phaser.Geom.Circle.Contains(hitArea, localX, localY);
}


