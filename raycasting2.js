function degrees(radians) {
    return radians * (180 / Math.PI);
}


// init canvas
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

const FPS = 60;
const CYCLE_DELAY = Math.floor(1000/FPS)
var oldCycleTime = 0;
var cycleCount = 0;
var fps_rate = 'calculating..';




// screen
const WIDTH = 600, HALF_WIDTH = 300;
const HEIGHT = 400, HALF_HEIGHT = 200;



// map
const MAP_SIZE = 32;
const MAP_SCALE = 64; // increasing this parameter makes the quality of the render better
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
const MAP_SPEED = (MAP_SCALE / 2) / 10;
var map = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]   
var showMap = false;   

// player 
var playerX = MAP_SCALE + 20;
var playerY = MAP_SCALE + 20;
var playerAngle =  Math.PI / 3;
var playerMoveX =  0;
var playerMoveY = 0;
var playerMoveAngle = 0;

// gun 
let gun = {
    'default': new Image(),
    'shot': [
        new Image(),
        new Image(),
        new Image(),
        new Image()
    ],
    'shot_count': 0,
    'animation': false
}
gun.default.src = 'assets/sprites/shotgun_0.png';
gun.shot[0].src = 'assets/sprites/shotgun_0.png';
gun.shot[1].src = 'assets/sprites/shotgun_1.png';
gun.shot[2].src = 'assets/sprites/shotgun_2.png';
gun.shot[3].src = 'assets/sprites/shotgun_2.png';



// enemies 
let deadImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
];
deadImages[0].src = 'assets/sprites/soldier_dead_0.png';
deadImages[1].src = 'assets/sprites/soldier_dead_1.png';
deadImages[2].src = 'assets/sprites/soldier_dead_2.png';
deadImages[3].src = 'assetes/sprites/soldier_dead_3.png';
deadImages[4].src = 'assets/sprites/soldier_dead_4.png';

let enemies = [
    {
        'default': new Image(),
        'dead_images': deadImages,
        'dead_count': 0,
        'isDead': false,
        'x': 500,  // x-coordinate on the map
        'y': 300,
        'scale': 1.0,
        'shift': 1
    },
    // Add more enemy objects here...
];

for (let i = 0; i < enemies.length; i++) {
    enemies[i].default.src = 'assets/sprites/soldier_1.png';
    enemies[i].default.onload = function() {
        let spriteHeight = 100; // replace with your desired height
        let scale = spriteHeight / enemies[i].default.height;
        let spriteWidth = enemies[i].default.width * scale;

        // Create a temporary canvas to draw the scaled image
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = spriteWidth;
        tempCanvas.height = spriteHeight;
        let tempContext = tempCanvas.getContext('2d');

        // Draw the image onto the temporary canvas
        tempContext.drawImage(enemies[i].default, 0, 0, spriteWidth, spriteHeight);

        // Export the temporary canvas to a new image
        let scaledImage = new Image();
        scaledImage.src = tempCanvas.toDataURL();

        // Now you can use scaledImage as a scaled version of your original image
        enemies[i].default = scaledImage;
    };
}
/*
// enemies
let sprites = [
    {'image': new Image(), 
    'x': 200,
    'y': 400,
    'shift': 0.4,
    'scale': 1.0,
    'type': 'soldier',
    'dead': false
}
    // ... rest of your sprites ...
];

sprites[0].image.src = 'images/sprites/enemy.png';

// Create a canvas for each sprite
let soldierSprite = [];
let soldier_death = [];
let soldier_death_count = 0;

// Load the spritesheet
let spritesheet = new Image();
spritesheet.src = 'images/sprites/enemy.png';

spritesheet.onload = function() {
    for (let frame = 1; frame < 5; frame++) {
        let spriteImage = new Image();
        spriteImage.src = spritesheet.src;
        spriteImage.sx = frame * 64;  // x-coordinate of the source rectangle
        spriteImage.sy = 5 * 64;  // y-coordinate of the source rectangle
        spriteImage.sWidth = 64;  // width of the source rectangle
        spriteImage.sHeight = 64;  // height of the source rectangle

        // Store the Image object as the sprite
        soldier_death.push(spriteImage);
    }

}

spritesheet.onload = function() {
    for (let frame = 1; frame < 5; frame++) {
        let spriteImage = new Image();
        spriteImage.src = spritesheet.src;
        spriteImage.sx = frame * 64;  // x-coordinate of the source rectangle
        spriteImage.sy = 5 * 64;  // y-coordinate of the source rectangle
        spriteImage.sWidth = 64;  // width of the source rectangle
        spriteImage.sHeight = 64;  // height of the source rectangle

        // Store the Image object as the sprite
        soldierSprite.push(spriteImage);
    }

}

*/




// handle input
document.onkeydown = function(event){
    console.log(event.key)
    switch(event.key){
        case 'ArrowDown': playerMoveX = -1; playerMoveY = -1; break;
        case 'ArrowUp': playerMoveX = 1; playerMoveY = 1; break;
        case 'ArrowLeft': playerMoveAngle = 1; break;
        case 'ArrowRight': playerMoveAngle = -1; break;
        case 'Shift': showMap = true; break;
        case 'Enter': gun['animation'] = true; break;
    }
}
document.onkeyup = function(event){
    switch(event.key){
        case 'ArrowDown':
        case 'ArrowUp': playerMoveX = 0; playerMoveY = 0; break;
        case 'ArrowLeft':
        case 'ArrowRight': playerMoveAngle = 0; break;
        case 'Shift': showMap = false; break;
    }
}



// camera 
const DOUBLE_PI = 2 * Math.PI;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const STEP_ANGLE = FOV / WIDTH;
let CENTRAL_RAY = Math.floor(WIDTH / 2) - 1;




// graphics
const WALLS = [];

// load wall textures
for (var fileName  = 0; fileName < 5; fileName++) {
    var image = document.createElement('img');
    if (fileName === 0 || fileName === 1 || fileName === 2) {image.src = 'assets/walls/' + fileName + '.png';}
    else{image.src = 'assets/walls/' + fileName + '.jpeg';}
    WALLS.push(image);
}





// game loop
function gameLoop(){
    // calculate FPS
    
    let zbuffer = []
    cycleCount++;
    if (cycleCount >= 60) cycleCount = 0;
    var startTime = Date.now();
    var cycleTime = startTime - oldCycleTime;
    oldCycleTime = startTime;

    if (cycleCount % 60 == 1) fps_rate = Math.floor(1000 / cycleTime)

    // rezise canvas
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;
    
    // update player position
    var playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
    var playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;
    var mapTargetX = Math.floor(playerY / MAP_SCALE) * MAP_SIZE + Math.floor((playerX + playerOffsetX * playerMoveX * 10) / MAP_SCALE);
    var mapTargetY = Math.floor((playerY + playerOffsetY * playerMoveY * 10) / MAP_SCALE) * MAP_SIZE + Math.floor(playerX / MAP_SCALE);

    if (playerMoveX && map[mapTargetX] == 0) playerX += playerOffsetX * playerMoveX;
    if (playerMoveY && map[mapTargetY] == 0) playerY += playerOffsetY * playerMoveY;
    if (playerMoveAngle) playerAngle += 0.05 * playerMoveAngle;


    // calculate map & player offset
    var mapOffsetX = Math.floor(canvas.width / 2) - HALF_WIDTH;
    var mapOffsetY = Math.floor(canvas.height / 2) - HALF_HEIGHT;
    var playerMapX = (playerX / MAP_SCALE) * 10 + mapOffsetX;
    var playerMapY = (playerY / MAP_SCALE) * 10 + mapOffsetY;
    

    // draw background
    var img = WALLS[0];
    context.drawImage(img, canvas.width / 2 - HALF_WIDTH, canvas.height / 2 - HALF_HEIGHT,  WIDTH, HEIGHT);
    


    //raycasting
    var currentAngle = playerAngle + HALF_FOV;
    var rayStartX = Math.floor(playerX / MAP_SCALE) * MAP_SCALE;
    var rayStartY = Math.floor(playerY / MAP_SCALE) * MAP_SCALE;


    // loop over casted rays
    for (var ray = 0 ; ray < WIDTH; ray++){

        // get current angle COS & SIN
        var currentSin = Math.sin(currentAngle); currentSin = currentSin ? currentSin : 0.000000000001;
        var currentCos = Math.cos(currentAngle); currentCos = currentCos ? currentCos : 0.000000000001;
        
        // vertical line intersection
        var rayEndX, rayEndY, rayDirectionX, verticalDepth, textureEndY, textureY;
        if (currentSin > 0) {rayEndX = rayStartX + MAP_SCALE; rayDirectionX = 1}
        else {rayEndX = rayStartX; rayDirectionX = -1}
        for (var offset = 0; offset < MAP_RANGE; offset += MAP_SCALE){
            verticalDepth = (rayEndX - playerX) / currentSin;
            rayEndY = playerY + verticalDepth * currentCos;
            var mapTargetX = Math.floor(rayEndX / MAP_SCALE);
            var mapTargetY = Math.floor(rayEndY / MAP_SCALE);
            if (currentSin <= 0) mapTargetX += rayDirectionX;
            var targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
            if (targetSquare < 0 || targetSquare > map.length - 1) break;
            if (map[targetSquare] != 0) {textureY = map[targetSquare] == 3 ? 2 : map[targetSquare]; break;}
            rayEndX += rayDirectionX * MAP_SCALE;
        }
        textureEndY = rayEndY;
        
        /* draw ray    
        context.strokeStyle = 'green';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(rayEndX + mapOffsetX, rayEndY + mapOffsetY);
        context.stroke();
        */

       // horizontal line intersection
        var rayEndY, rayEndX, rayDirectionY, horizontalDepth, textureEndX, textureX;
        if (currentCos > 0) {rayEndY = rayStartY + MAP_SCALE; rayDirectionY = 1}
        else {rayEndY = rayStartY; rayDirectionY = -1}
        for (var offset = 0; offset < MAP_RANGE; offset += MAP_SCALE){
            horizontalDepth = (rayEndY - playerY) / currentCos;
            rayEndX = playerX + horizontalDepth * currentSin;
            var mapTargetY = Math.floor(rayEndY / MAP_SCALE);
            var mapTargetX = Math.floor(rayEndX / MAP_SCALE);
            if (currentCos <= 0) mapTargetY += rayDirectionY;
           var targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
            if (targetSquare < 0 || targetSquare > map.length - 1) break;
            if (map[targetSquare] != 0) {textureX = map[targetSquare]; break;}
           rayEndY += rayDirectionY * MAP_SCALE;
        }
        textureEndX = rayEndX;


        /* draw ray    
        context.strokeStyle = 'brown';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(rayEndX + mapOffsetX, rayEndY + mapOffsetY);
        context.stroke();
        */
        
        /*
        var endX = verticalDepth < horizontalDepth ? tempX : rayEndX;
        var endY = verticalDepth < horizontalDepth ? tempY : rayEndY;
        
        
        // draw ray    
        context.strokeStyle = 'yellow';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(endX + mapOffsetX, endY + mapOffsetY);
        context.stroke();
        */
        
        // calculate 3d projection 
        var depth = verticalDepth < horizontalDepth ? verticalDepth : horizontalDepth;
        var textureImage = verticalDepth < horizontalDepth ? textureY : textureX;
        var textureOffset = verticalDepth < horizontalDepth ? textureEndY : textureEndX;
        textureOffset = Math.floor(textureOffset - Math.floor(textureOffset / MAP_SCALE) * MAP_SCALE)
        depth *= Math.cos(playerAngle - currentAngle)
        var wallHeight = Math.min(Math.floor(MAP_SCALE * 500 / (depth + 0.00000001)), 5000);
        //context.fillStyle = verticalDepth < horizontalDepth ? '#aaa' : '#555';
        //context.fillRect(mapOffsetX + ray, mapOffsetY + (HALF_HEIGHT - wallHeight / 2), 1, wallHeight);

        
        // render textures 
        context.drawImage(
            WALLS[textureImage],
            textureOffset,                  // source image x offset
            0,                  // source image y offset
            1,                 // source image width
            64,                 // source image height
            mapOffsetX + ray,         // target image x offset
            mapOffsetY + (HALF_HEIGHT - Math.floor(wallHeight / 2)),         // target image y offset
            1,                  // target image width
            wallHeight,                 // target image height
        );
        
        


        // update current angle 
        currentAngle -= STEP_ANGLE;

    }




    // render enemies
    for (let enemy of enemies) {
        var enemyX = enemy['x'] - playerX;
        var enemyY = enemy['y'] - playerY;  
        let enemyDistance = Math.sqrt(enemyX * enemyX + enemyY * enemyY);
        let enemy2playerAngle = Math.atan2(enemyX, enemyY);
        let player2enemyAngle = enemy2playerAngle - playerAngle;
        if (enemyX < 0) player2enemyAngle += DOUBLE_PI;
        if (enemyX > 0 && degrees(player2enemyAngle) <= -180) player2enemyAngle += DOUBLE_PI;
        if (enemyX < 0 && degrees(player2enemyAngle) >= 180) player2enemyAngle -= DOUBLE_PI;
        let shiftRays = player2enemyAngle / STEP_ANGLE;        
        let enemy_ray = CENTRAL_RAY - shiftRays;
        let enemy_height;
        if (enemy['isDead'] === true) {
            enemy_height = Math.min(enemy['scale'] * MAP_SCALE * 300 / (enemyDistance + 0.0001), 400);
        } else {
            enemy_height = enemy['scale'] * MAP_SCALE * 300 / (enemyDistance + 0.0001);
        }
        if (!enemy['isDead']) {
            if (Math.abs(shiftRays) < 300 && enemyDistance < 500 && gun['animation']) {
                enemy['image'] = enemy.dead_images[Math.floor(enemy.dead_count / 8)];
                enemy.dead_count += 1;
                if (enemy.dead_count >= 16) {
                    enemy['isDead'] = true;
                    enemy.dead_count = 0;
                }
            }
        } else {
            enemy['image'] = enemy.dead_images[enemy.dead_images.length - 1];
        }
        
        if (gun['shot_count'] > 16 && [enemy.dead_images[0], enemy.dead_images[1], enemy.dead_images[2], enemy.dead_images[3], enemy.dead_images[4]].includes(enemy['image'])) {
            try {
                console.log("dead")
                enemy['image'] = enemy.dead_images[Math.floor(enemy.dead_count / 8) + 2];
            } catch (e) {
                // pass
            }
            enemy.dead_count += 1;
            if (enemy.dead_count >= 32) {
                enemy['isDead'] = true;
                enemy.dead_count = 0;
            }
        }
        if (!enemy['isDead'] && enemyDistance <= 10) {
            playerX -= playerOffsetX;
            playerY -= playerOffsetY;
        }
        if (!enemy['isDead']) {
            enemy['image'] = enemy.default;
        }

        let multi = enemy_height / enemy.default;
        let enemyWidth = enemy.width * multi;
        let spriteImage = enemy['image']
        zbuffer.push({
            'image': spriteImage,
            'x': enemy_ray - Math.floor(enemy_height / 2),
            'y': 300 - enemy_height * enemy['shift'],
            'distance': enemyDistance
        });

        var enemyMapX = (( enemy_ray - Math.floor(enemy_height / 2)) / MAP_SCALE) * 10 + mapOffsetX;
        var enemyMapY = (( 300 - enemy_height * enemy['shift']) / MAP_SCALE) * 10 + mapOffsetY;
        
        var enemyTextX = enemy_ray - Math.floor(enemy_height / 2);
        var enemyTextY = 300 - enemy_height * enemy['shift'];
        
        
    }

    // Sort and render sprites
    zbuffer.sort((a, b) => b.distance - a.distance);
    for (let item of zbuffer) {
        // Assuming item.image is an Image object with sx, sy, sWidth, and sHeight properties
        if (item && item.image) {
            context.drawImage(item.image, item.x, item.y);
        }
    }



    // render gun
    
    if (gun['animation']) {
        gun['animation'] = true;
        context.drawImage(gun['shot'][Math.floor(gun['shot_count'] / 5)], HALF_WIDTH + 50, HEIGHT - 150, 200, 200);
        gun['shot_count'] += 1;
        if (gun['shot_count'] >= 20) {
            gun['shot_count'] = 0; 
            gun['animation'] = false;
        }
    }
    else{
        context.drawImage(gun['default'], HALF_WIDTH + 50, HEIGHT - 150, 200, 200);
    }


    // draw map on left shift press
    if (showMap) {
         // draw 2D map
        for (var row = 0; row < MAP_SIZE; row++) {
            for ( var col = 0; col < MAP_SIZE; col++){
                var square = row *  MAP_SIZE + col;
                if (map[square] == 1){
                    context.fillStyle = '#555';
                    context.fillRect(
                        mapOffsetX + col * 10,
                        mapOffsetY + row * 10, 10, 10 
                        );
                } else{
                    context.fillStyle = '#aaa';
                    context.fillRect(
                        mapOffsetX + col * 10,  
                        mapOffsetY + row * 10, 10, 10
                        );
                }
            }
        }
    
        // draw player on 2D map
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(playerMapX, playerMapY, 2, 0, DOUBLE_PI);
        context.fill();
        context.strokeStyle = 'blue';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(playerMapX + Math.sin(playerAngle) * 5, playerMapY + Math.cos(playerAngle) * 5);
        context.stroke();

        // draw enemy on 2D map
        context.beginPath();
        context.arc(enemyMapX, enemyMapY, 2, 0, DOUBLE_PI);
        context.fill();
        context.strokeStyle = 'red';
        context.lineWidth = '1';
        context.stroke();
    

    }

    // fix wall layout
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, mapOffsetY)
    context.fillRect(0, mapOffsetY + 400, canvas.width, canvas.width - mapOffsetY + 400) // puts white boxes on top and bottom of the screen to fix the textures going outside the canvas


    // infinite loop
    setTimeout(gameLoop, CYCLE_DELAY);

    // render FPS to screen
    context.fillStyle = 'black';
    context.font = '16px Monospace';
    context.fillText('FPS: ' + fps_rate, 10, 20)
    context.fillText('X' + playerX, 10, 30)
    context.fillText('Y' + playerY, 10, 42)
    context.fillText('Enemy X' + enemyTextX, 200, 30)
    context.fillText('Enemy Y' + enemyTextY, 200, 42)



    
}

window.onload = function() {gameLoop(); }
