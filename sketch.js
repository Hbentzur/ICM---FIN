var Noman;
var Flags;
var monster;
var Trees;

var points = 0;

var flagsamount = 8;

var camera;

var thresh = 70;
var cellsize = 30;

function preload() {
    myFont = loadFont('BIG JOHN.otf');
}

function setup() {

    // camera
    var w = windowWidth;
    var h = windowHeight;

    camera = createCapture(VIDEO);
    createCanvas(w, h);
    camera.size(w, h);
    camera.hide();

    // Flags
    Flags = new Group();
    
    // Trees
    Trees = new Group();

    // Monster
    monster = new Monster();


    // Flags
    for (var i = 0; i < flagsamount; i++) {
        var f = createSprite(random(100, w), random(h, h + 1000), 3, 3);
        f.addAnimation("Graphic/Flag/flag_0.png", "Graphic/Flag/flag_1.png", "Graphic/Flag/flag_2.png");
        f.maxSpeed = 3;
        f.scale = 0.5;
        Flags.add(f);
    }

    // Trees
    for (var i = 0; i < 5; i++) {
        var t = createSprite(random(100, w), random(h, h + 1000), 3, 3);
        t.addAnimation("Graphic/Tree/Tree.png", "Graphic/Tree/Tree_1.png");
        t.maxSpeed = 3;
        t.scale = 0.8;
        Trees.add(t);
    }


    // Noman walking sequence animation
    Noman =
        createSprite(random (0, width / 2), 0, 60, 60);
    Noman.addAnimation("Graphic/Walk/Walk_1.png", "Graphic/Walk/Walk_2.png", "Graphic/Walk/Walk_3.png");
    Noman.maxSpeed = 2;

}

function draw() {

    var w = windowWidth;
    var h = windowHeight;
    
    createCanvas(w, h);

    background(255, 255, 255, 120);

    // Treshold
    camera.loadPixels();
    for (var y = 0; y < h; y += cellsize) {
        for (var x = 0; x < w; x += cellsize) {
            var off = ((y * w) + x) * 4;
            camera.pixels[off],
                camera.pixels[off + 1],
                camera.pixels[off + 2];

            if (camera.pixels[off + 1] < thresh) {
                fill(0);
                ellipse(x, y, 10, 10);
            }


            // Noman walking on white pix
            if ((Noman.position.x >= x) && (Noman.position.x <= x + cellsize) &&
                (Noman.position.y >= y) && (Noman.position.y <= y + cellsize)) {
                if (camera.pixels[off + 1] < thresh) {
                    Noman.position.x += -1;
                    Noman.position.y += -0.5;
                    Noman.maxSpeed = 0;
                    Noman.attractionPoint(0, Noman.position.x, Noman.position.y);
                } else {
                    Noman.maxSpeed = 3;
                }
            }


        }
    }

    // Flags
    for (var i = 0; i < Flags.length; i++) {
        // Flags moving up
        Flags[i].attractionPoint(0.2, Flags[i].position.x, 0);

        // Noman attraction point
        Noman.attractionPoint(2, Flags[i].position.x, Flags[i].position.y);

        // Noman mirror
        if (Noman.position.x < windowWidth / 2) {
            Noman.mirrorX(-1);
        } else {
            Noman.mirrorX(1);
        }

        // Remove Flags
        if (Flags[i].position.y <= 30) {
            Flags[i].remove();
        }

        // Add Flags
        if (Flags.length <= 3) {
            for (var i = 0; i < flagsamount; i++) {
                var f = createSprite(random(100, w), random(h, h + 1000), 3, 3);
                f.addAnimation("Graphic/Flag/flag_0.png", "Graphic/Flag/flag_1.png", "Graphic/Flag/flag_2.png");
                f.maxSpeed = 3;
                f.scale = 0.5;
                Flags.add(f);
            }
        }
    }

    // Trees
    for (var i = 0; i < Trees.length; i++) {

        // Trees moving up
        Trees[i].attractionPoint(0.2, Trees[i].position.x, 0);

        // Remove Trees
        if (Trees[i].position.y <= 0) {
            Trees[i].remove();
        }

        // Add Trees
        if (Trees.length <= 3) {
            for (var i = 0; i < 5; i++) {
                var t = createSprite(random(100, w), random(h, h + 1000), 3, 3);
                t.addAnimation("Graphic/Tree/Tree.png", "Graphic/Tree/Tree_1.png");
                t.maxSpeed = 3;
                t.scale = 0.8;
                Trees.add(t);
            }
        }
    }

    // Points
    Flags.overlap(Noman, GetPoint);

    ellipseMode(CENTER);
    fill(228, 48, 48);
    noStroke();
    ellipse(72, 62, 40);

    if (Flags.length > 0) {

        textSize(20);
        textAlign(CENTER);
        fill(255);
        textFont(myFont);
        text(points, 70, 70);

        push();
        textSize(10);
        textAlign(CENTER);
        fill(228, 48, 48);
        textFont(myFont);
        text("Flags", 70, 100);
        pop();
    }

    function GetPoint(Noman, Flags) {
        Noman.remove();
        points += 1;
    }

    //Monster
    monster.move();
    monster.show();

    drawSprites();

}


class Monster {
    constructor() {
        this.monsterx = 0;
        this.monstery = 0;
    }

    move() {

        if (Noman.position.y > 100) {
            this.monsterx = Noman.position.x + random(sin(8, 30));
            this.monstery = frameCount % Noman.position.y + random(sin(8, 30));
        }


    }

    show() {
        textSize(25);
        textStyle(BOLD);
        textFont(myFont);
        fill(100, 100, 100);
        text("MONSTER", this.monsterx, this.monstery);

    }

}