/* ICM Final */


// Game
var playMode = true;
var Fin;
var points = 0;
var Monsterframe = 1200;
var alpha = 0;

// Camera
var camera;
var thresh = 230;
var cellsize = 10;

// Crop
var topy = 235;
var bottomy = 560;
var leftx = 340;
var rightx = 1170;

// Animation
var Noman;
var Flags;
var Monster;
var Monstereat;
var Trees;
var flagsamount = 8;

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


    // Noman
    Noman =
        createSprite(random(80, width / 2), 0, 10, 10);
    Noman.addAnimation("Graphic/Walk/Walk_1.png", "Graphic/Walk/Walk_2.png", "Graphic/Walk/Walk_3.png");
    Noman.maxSpeed = 2;

    // Monster
    Monster =
        createSprite(0, -50, 10, 10);
    Monster.addAnimation("Graphic/Monster/Monster_0.png", "Graphic/Monster/Monster_1.png", "Graphic/Monster/Monster_2.png");
    Monster.maxSpeed = 2;
    Monster.scale = 0.8;

    // Monster eat
    Monstereat =
        createSprite(Monster.position.x, Monster.position.y, 10, 10);
    Monster.addAnimation("Graphic/Monster_Eat/Eat0.png",
        "Graphic/Monster_Eat/Eat1.png",
        "Graphic/Monster_Eat/Eat0.png",
        "Graphic/Monster_Eat/Eat1.png",
        "Graphic/Monster_Eat/Eat0.png",
        "Graphic/Monster_Eat/Eat1.png",
        "Graphic/Monster_Eat/Eat2.png",
        "Graphic/Monster_Eat/Eat3.png",
        "Graphic/Monster_Eat/Eat4.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
        "Graphic/Monster_Eat/Eat5.png",
        "Graphic/Monster_Eat/Eat6.png",
    );
    Monster.maxSpeed = 2;
    Monster.scale = 0.8;


}

function draw() {

    var w = windowWidth;
    var h = windowHeight;

    createCanvas(w, h);

    if (playMode) {
        background(255);

        // Treshold
        camera.loadPixels();
        for (var y = topy; y < bottomy; y += cellsize) {
            for (var x = leftx; x < rightx; x += cellsize) {
                var off = ((y * w) + x) * 4;
                camera.pixels[off],
                    camera.pixels[off + 1],
                    camera.pixels[off + 2];

                // Mapping the pix to the crop of the cam
                var newX = map(x, leftx, rightx, 0, w);
                var newY = map(y, topy, bottomy, 0, h);

                // Gray ellipse
                if (camera.pixels[off + 1] < thresh) {
                    fill(150, 150, 150, 70);
                    noStroke();
                    ellipse(newX, newY, 12, 12);
                }

                // Noman walking & stopping
                if ((Noman.position.x >= newX) && (Noman.position.x <= newX + cellsize) &&
                    (Noman.position.y >= newY) && (Noman.position.y <= newY + cellsize)) {
                    if (camera.pixels[off + 1] < thresh) {
                        console.log("NomanStopping");
                        Noman.maxSpeed = 0;
                        Noman.attractionPoint(0, Noman.position.x, Noman.position.y);
                    } else {
                        Noman.maxSpeed = 3;
                    }
                }

                // Monster walking & slowing down
                if (frameCount > Monsterframe) {
                    Monster.attractionPoint(1, Noman.position.x, Noman.position.y);
                    if ((Monster.position.x >= newX) && (Monster.position.x <= newX + cellsize) &&
                        (Monster.position.y >= newY) && (Monster.position.y <= newY + cellsize)) {
                        if (camera.pixels[off + 1] < thresh) {
                            console.log("MonsterStopping");
                            Monster.maxSpeed = 0.5;
                            Monster.attractionPoint(0, Monster.position.x, Monster.position.y);
                        } else {
                            Monster.maxSpeed = 2;
                            Monster.velocity.x = 0.5;
                            Monster.velocity.y = 0.5;
                        }
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
            if (Noman.position.x <= Flags[i].position.x) {
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
            //
            //            textSize(80);
            //            textAlign(CENTER);
            //            fill(228, 48, 48);
            //            textFont(myFont);
            //            text("Yes! +1", width / 2, height - 100);
            //            
            //            alpha++;

        }

        Noman.overlap(Monster, Fin);

        drawSprites();
    }

    // Monster is coming
    if (frameCount > (Monsterframe - 250) && frameCount < Monsterframe) {
        textSize(80);
        textAlign(CENTER);
        fill(228, 48, 48);
        textFont(myFont);
        text("Beware of the monster", width / 2, height - 100);

    }

    // Game goal
    if (frameCount > 1 && frameCount < 100) {
        textSize(80);
        textAlign(CENTER);
        fill(228, 48, 48);
        textFont(myFont);
        text("Grab all the flags", width / 2, height - 100);

    }



}

function Fin() {
    var playMode = false;
    background(255);

    for (var i = 0; i < Trees.length; i++) {
        Trees[i].maxSpeed = 0;
    }

    for (var i = 0; i < Flags.length; i++) {
        Flags[i].maxSpeed = 0;
    }

    textSize(80);
    textAlign(CENTER);
    fill(228, 48, 48);
    textFont(myFont);
    text("oh no", width / 2, height - 100);



}
