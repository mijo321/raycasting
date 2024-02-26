
// init canvas
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

const FPS = 60;
const CYCLE_DELAY = Math.floor(1000/FPS)
var oldCycleTime = 0;
var cycleCount = 0;
var fps_rate = 'calculating..';


// screen
const WIDTH = 300, half_width = 150;
const HEIGHT = 200, half_height = 100;



// map
const MAP_SIZE = 16;
const MAP_SCALE = 10; // increasing this parameter makes the quality of the render better
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
const MAP_SPEED = (MAP_SCALE / 2) / 10;
var map = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]   

// player 
var playerX = MAP_SCALE + 20;
var playerY = MAP_SCALE + 20;
var playerAngle =  Math.PI / 3;
var playerMoveX =  0;
var playerMoveY = 0;
var playerMoveAngle = 0;

document.onkeydown = function(event){
    console.log(event.key)
    switch(event.key){
        case 'ArrowDown': playerMoveX = -1; playerMoveY = -1; break;
        case 'ArrowUp': playerMoveX = 1; playerMoveY = 1; break;
        case 'ArrowLeft': playerMoveAngle = 1; break;
        case 'ArrowRight': playerMoveAngle = -1; break;
    }
}

document.onkeyup = function(event){
    switch(event.key){
        case 'ArrowDown':
        case 'ArrowUp': playerMoveX = 0; playerMoveY = 0; break;
        case 'ArrowLeft':
        case 'ArrowRight': playerMoveAngle = 0; break;
    }
}








// camera 
const DOUBLE_PI = 2 * Math.PI;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const STEP_ANGLE = FOV / WIDTH;


// game loop
function gameLoop(){
    // calculate FPS

    cycleCount++;
    if (cycleCount >= 60) cycleCount = 0;
    var startTime = Date.now();
    var cycleTime = startTime - oldCycleTime;
    oldCycleTime = startTime;

    if (cycleCount % 60 == 1) fps_rate = Math.floor(1000 / cycleTime)

    // rezise canvas
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;
    
    // update screen
    context.fillStyle = 'black';
    context.fillRect(canvas.width / 2 - half_width, canvas.height / 2 - half_height, WIDTH, HEIGHT);

    // update player position
    var playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
    var playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;
    var mapTargetX = Math.floor(playerY / MAP_SCALE) * MAP_SIZE + Math.floor((playerX + playerOffsetX * playerMoveX) / MAP_SCALE);
    var mapTargetY = Math.floor((playerY + playerOffsetY * playerMoveY) / MAP_SCALE) * MAP_SIZE + Math.floor(playerX / MAP_SCALE);

    if (playerMoveX && map[mapTargetX] == 0) playerX += playerOffsetX * playerMoveX;
    if (playerMoveY && map[mapTargetY] == 0) playerY += playerOffsetY * playerMoveY;
    if (playerMoveAngle) playerAngle += 0.05 * playerMoveAngle;


    // calculate map & player offset
    var mapOffsetX = Math.floor(canvas.width / 2 - MAP_RANGE / 2);
    var mapOffsetY = Math.floor(canvas.height / 2 - MAP_RANGE / 2);
    var playerMapX = playerX + mapOffsetX;
    var playerMapY = playerY + mapOffsetY

    // draw 2D map
    for (var row = 0; row < MAP_SIZE; row++) {
        for ( var col = 0; col < MAP_SIZE; col++){
            var square = row *  MAP_SIZE + col;
            if (map[square] == 1){
                context.fillStyle = '#555';
                context.fillRect(
                    mapOffsetX + col * MAP_SCALE ,
                    mapOffsetY + row * MAP_SCALE, MAP_SCALE, MAP_SCALE 
                    );
            } else{
                context.fillStyle = '#aaa';
                context.fillRect(
                    mapOffsetX + col * MAP_SCALE ,  
                    mapOffsetY + row * MAP_SCALE, MAP_SCALE, MAP_SCALE
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
        var rayEndX, rayEndY, rayDirectionX, verticalDepth;
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
            if (map[targetSquare] != 0) break;
            rayEndX += rayDirectionX * MAP_SCALE;
        }
        
        // temp endX and endY targets
        var tempX = rayEndX; tempY = rayEndY
        
        
        /* draw ray    
        context.strokeStyle = 'green';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(rayEndX + mapOffsetX, rayEndY + mapOffsetY);
        context.stroke();
        */

       // horizontal line intersection
        var rayEndY, rayEndX, rayDirectionY, horizontalDepth;
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
            if (map[targetSquare] != 0) break;
           rayEndY += rayDirectionY * MAP_SCALE;
        }
        
        /* draw ray    
        context.strokeStyle = 'brown';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(rayEndX + mapOffsetX, rayEndY + mapOffsetY);
        context.stroke();
        */
        
        var endX = verticalDepth < horizontalDepth ? tempX : rayEndX;
        var endY = verticalDepth < horizontalDepth ? tempY : rayEndY;
        
       // draw ray    
        context.strokeStyle = 'yellow';
        context.lineWidth = '1';    
        context.beginPath();
        context.moveTo(playerMapX, playerMapY);
        context.lineTo(endX + mapOffsetX, endY + mapOffsetY);
        context.stroke();

        // update current angle 
        currentAngle -= STEP_ANGLE;

    }

    



       // infinite loop
        setTimeout(gameLoop, CYCLE_DELAY);



       // render FPS to screen
        context.fillStyle = 'black';
        context.font = '16px Monospace';
        context.fillText('FPS: ' + fps_rate, 10, 30)

}

window.onload = function() {gameLoop(); }
