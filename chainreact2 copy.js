
const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 480,
    backgroundColor: '#ffffff',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const BUCKET_SIZE = 60;
const DARK_SQ_COLOR = 0x668666;
const LIGHT_SQ_COLOR = 0x666686;

var waves = []
var crashes = 0

class Bucket extends Phaser.GameObjects.Graphics {
    constructor(scene, id, i, j, color, x, y) {
        super(scene);
        this.scene = scene;
        this.id = id;
        this.i = i;
        this.j = j;
        this.color = color;
        this.fullness = Phaser.Math.Between(0, 3);
        this.drawBucket();
        this.setInteractive({
            hitArea: new Phaser.Geom.Circle(0, 0, BUCKET_SIZE / 2),
            useHandCursor: true,
            hitAreaCallback: this.hitAreaCallback.bind(this)
        });
        // this.setInteractive({ useHandCursor: true })
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
        const floatedOver = document.getElementById('floatedOver');
        floatedOver.innerHTML = `Nothing`;
    }

    drawBucket() {
        const x = (this.i + 0.5) * BUCKET_SIZE;
        const y = (this.j + 0.5) * BUCKET_SIZE;
        const radius = BUCKET_SIZE * (this.fullness * 0.16);
        this.clear();
        // Create and add text object
        const text = this.scene.add
            .text(x, y, this.id, { color: '#000000', fontSize: '10px' })
            .setDepth(1);
        //const text = this.scene.add.text(x*2, y*2, this.parentContainer.x + ','+ this.parentContainer.y, { color: '#000000', fontSize: '16px' });
        text.setOrigin(0.5, 0.5);
        this.fillStyle(this.color);
        this.fillCircle(0, 0, radius);
        this.strokeCircle(0, 0, BUCKET_SIZE / 2);
    }

    bOverflow() {
        this.fullness = 0;
        //this.color = 0xffa500;
        this.drawBucket();
        this.makeWave(this.i,     1, 1, this.j * 12 + 1);
        this.makeWave(this.i,    -1, 1, (this.j - 1) * 12 + 11);
        this.makeWave(this.j + 8, 1, 1, this.i * 12 + 1);
        this.makeWave(this.j + 8, -1, 1, (this.i - 1) * 12 + 11);
    }

    makeWave(line, direction, volume, pos) {
        // check the waves WHEE!!
        // above
        let wave = [line, direction, volume, pos]
        waves.push(wave);
        //console.log("Wave Created. (" + line + "," + direction + "," + volume + "," + pos + "")
    }

    incrementFullness() {
        console.log("Increment Fullness. (" + this.i + "," + this.j + ")")
        this.fullness++;
        this.drawBucket();
    }
    // HitAreaCallback(hitArea, x, y, gameObject)
    hitAreaCallback(circle, nx, ny, gameObject) {
        return Phaser.Geom.Circle.Contains(circle, nx, ny);
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

var gameBoard = []

function preload() { }

function create() {
    this.cameras.main.setBackgroundColor('#f0f0f0')
    this.scale.resize(BUCKET_SIZE * 8, BUCKET_SIZE * 9)
    gameBoard = createBuckets(this)
    //barrier.await()
}

// stupid timer, just for testing make it run slow
let updcount = 0
function update() {
    const floatedOver = document.getElementById('waves');
    floatedOver.innerHTML = `Waves Active ${waves.length}`;
    const crashed = document.getElementById('crashed');
    crashed.innerHTML = `Crashed ${crashes}`;
    if (true || ++updcount > 10) {
        updcount = 0
        // Start actual code now
        // check all buckets for overflow
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const bucket = gameBoard[i][j];
                if (bucket.fullness >= 4) {
                    //console.log("Bucket Overflow. (" + i + "," + j + ")")
                    bucket.bOverflow();
                }
            }
        }
        //  place the waves
        for (let nbr = 0; nbr < waves.length; nbr++) {
            let wave = waves[nbr]
            line = wave[0]
            direction = wave[1]
            volume = wave[2]
            pos = wave[3]
            //console.log(line + " " + direction + " " + volume + " " + pos)
            pos = pos + direction
            if (pos % 12 == 0 && pos !=96) {
                // Bucket, setting down wave into bucket
                if (line < 8) {
                    i = line
                    j = pos / 12
                } else {
                    i = pos / 12
                    j = line-8
                }
                //console.log(`Wave >>> Bucket (${i},${j})`)
                let bucket = gameBoard[i][j]
                if (bucket.fullness == 0) {
                    // no nothing, it's empty here except possible waves, so keep going
                } else {
                    //console.log(bucket)
                    if (bucket) {bucket.incrementFullness()} else {console.log("incrementFullness failed")}
                    waves.splice(nbr, 1);
                    nbr--
                }
            }
            if (pos >= 96 || pos < 0) {
                // Wave has left the board
                crashes++
                waves.splice(nbr, 1)
            }


            //update changees
            wave[3] = pos
        }

        // Process all the waves
        for (let i = 0; i < waves.length; i++) {
            let wave = waves[i];
            let line = wave[0];
            let direction = wave[1];
            let volume = wave[2];
            let pos = wave[3];
            let x, y
            if (line < 8) {
                x = (-5) + (line * BUCKET_SIZE) + 30;
                y = (-4) + BUCKET_SIZE / 2 + pos * BUCKET_SIZE / 12
                if (direction == 1) {
                    newchar = "v"
                } else {
                    newchar = "^"
                }
                const text = this.add
                    .text(x, y, newchar, { color: '#000000', fontSize: '10px' })
                    .setDepth(1);
            } else {
                x = (20) + pos * BUCKET_SIZE / 12
                y = (20) + (line) * BUCKET_SIZE - (BUCKET_SIZE * 8);
                if (direction == 1) {
                    newchar = ">"
                } else {
                    newchar = "<"
                }
                const text = this.add
                    .text(x, y, newchar, { color: '#000000', fontSize: '10px' })
                    .setDepth(1);
            }
        }

    }
}


