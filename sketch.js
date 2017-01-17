worldSetup = [];
var sizeBox     = 35,
    marioInput  = {
        speedValue  : 1,
        jumpValue   : 32,
        sizeValue   : 30
    }
var mario;
function preload() {
      imgBlock = loadImage("block.png");
      imgBlock2 = loadImage("block2.png");
      ghostFront = loadImage("ghostFront.png");
      ghostLeft = loadImage("ghostLeft.png");
      ghostRight = loadImage("ghostRight.png");
      img = loadImage("bild.jpg");
      sky = loadImage("sky.jpg");
      garbage = loadImage("water.jpg");
      garbage2 = loadImage("plasticWaste.jpg");
      start = loadImage("start.jpg");
      circle = loadImage("circle.png");
    }
var garbArray = [];
var timeSpeed = 100;
var worldClock = {
    day : 0,
    hou : 0,
    min : 0,
    sec :0
}
var startVar = false;
var gameover = false;
var blockHeight = 0;
var worldHeight = 700;
var worldWidth = 10500;
var lastPos={
  x:0,
  y:0
}
//============================END OF INPUT=======================================
//===============================================================================
function setup() {//=========Start SETUP=========================================
  createCanvas(worldWidth, 700);
  image(img, 0, 0, worldWidth, worldHeight );
  convertToArray(sizeBox,worldHeight,worldWidth);
  createCanvas(700, 700);
  frameRate(60);
  console.log("start");
// Setup Game Clock

    setInterval(function(){
      worldClock.sec += 1;
      blockHeight += 1.5;
      if(worldClock.sec === 60){worldClock.sec = 0;worldClock.min += 1;}
      if(worldClock.min === 60){worldClock.min = 0;worldClock.hou += 1;}
      if(worldClock.hou === 60){worldClock.hou = 0;worldClock.day += 1;}
  // garbage Production
      if(worldClock.sec%3 === 0){lastPos.x = mario.pos.x;lastPos.y = mario.pos.y;}
      if(worldClock.sec%8===0){garbArray.push(new Garbage(lastPos.x,lastPos.y));}
    },timeSpeed);
// Setting up Box constructor
  function Box(x,y){
    this.top = y*sizeBox;
    this.bottom = y*sizeBox+sizeBox;
    this.right = x*sizeBox+sizeBox;
    this.left = x*sizeBox;
  }
// Setting up array for boxes
  boxArr = [];
// creating the boxes and filling them into the BoxArr
  for(var x = 0; x < worldSetup[0].length ; x++){
    for(var y = 0; y < worldSetup.length ; y++){
      if(worldSetup[y][x]===false){
        (function(){ var box = new Box(x,y); boxArr.push(box);  })();
      }
    }
  }
  mario = new Mario() // create Mario from the constructor
}//=========END SETUP==========================================================
//=============================================================================
function draw(){//=========Start DRAW==========================================

// Setup FORCES----------------------------------------------------------
  gravity = createVector(0,1);
//WORLD BUILDING---------------------------------------------------------
   worldBuilding();
   blockRender();
   renderGarbage();
//MARIO BUILDING-----------------------------------------------
  mario.vel.mult(0); // throw velocity bck to zero
  //Move Mario------------------------------------------------------
  mario.acc.add(gravity); // add gravity to mario
  mario.vel.add(mario.acc); // add acceleration to velocity
  mario.acc.limit(10); // limit the velocity to 10
  mario.pos.add(mario.vel); // add the velocity to the position
// Question Collision-------------------------------------------------
  mario.collisionPointsSetup(); // establish the hit box through four points of mario
  mario.collide(); // check if there is a collision and correct the posiiton

// RENDER MARIO-----------------------------------------------------
  mario.display();
  blockRender();
//change acceleration based on the pressed key
  if(keyIsPressed===true && gameover === false){
    if(keyCode === RIGHT_ARROW){
      //console.log("right");
      mario.acc.add(createVector(marioInput.speedValue,0));
      mario.looks = false;
    }
    if(keyCode === LEFT_ARROW){
      //console.log("left");
      mario.acc.add(createVector(-marioInput.speedValue,0));
      mario.looks = true;
    }
  }
  showText(worldClock.hou+":"+worldClock.min+":"+worldClock.sec, mario.pos.x-300, 50, 20, "black");
  showText(Math.floor(blockHeight) + " tons Garbage", mario.pos.x+200, 680, 20, "black");
  for(var i = 0; i < 8 ; i++){
    showText(i*2+"m", mario.pos.x-300, 700-i*35, 15, "black");
  }
  if(startVar === false){
    rect(0-332,0,700,700);
    showText("Press Enter to Continue", -120, 450, 24, "white");
    showText("Better clean up your waste", -130, 190, 24, "white");
    gameover = true;
  }
  mario.amIdead();
} // Ende draw();==============================================================
//=============================================================================









function blockRender(){
  // RENDER BLOCK THAT RISES=====================================================
  fill(180,20,20,100);
  image(garbage2,mario.pos.x-350,worldHeight-blockHeight,700,700);
}
// Establish the function for creating the four points of our HitBox
function createCollisionPoints(pos,size){
    var arr = [];
    arr.push({pos:createVector(pos.x+size/2,pos.y),name:"right"})
    arr.push({pos:createVector(pos.x,pos.y-size/2),name:"top"})
    arr.push({pos:createVector(pos.x-size/2,pos.y),name:"left"})
    arr.push({pos:createVector(pos.x,pos.y+size/2),name:"bottom"})
    return arr;
}
function collision(boxArr,posArr){
  var boxes = boxArr;
  var hitPoints = posArr;
  var where = [];
   for(var i=0; i< boxes.length; i++){ // go through all the boxes
          // loop through all the ColPoints of mario
          for(var j =0; j < hitPoints.length; j++){
                if(hitPoints[j].pos.y > boxes[i].top && hitPoints[j].pos.y < boxes[i].bottom){
                  if(hitPoints[j].pos.x > boxes[i].left && hitPoints[j].pos.x < boxes[i].right){
                    (function(){ where.push({name:hitPoints[j].name,box:boxes[i]});})()
                  }
                }
          }// End of for loop thourgh hit points
  } // End of For Loop through boxes
  establishAntiForce(where);
}
function establishAntiForce(boxes){
  var boxes = boxes;
  for(var i=0; i<boxes.length;i++){
    if(boxes[i].name === "bottom"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.y = boxes[i].box.top-mario.size/2;
       mario.inAir = false;
    }
    if(boxes[i].name === "top"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.y = boxes[i].box.bottom+mario.size/2;
    }
    if(boxes[i].name === "left"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.x = boxes[i].box.right+mario.size/2;
    }
    if(boxes[i].name === "right"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.x = boxes[i].box.left-mario.size/2;
    }
  }
}
// gliding On or OFF
function keyReleased(){
  //mario.acc.mult(0);
}
function keyPressed(){
  //Control jump
      if(keyCode === UP_ARROW && mario.inAir === false && gameover === false){
        mario.acc.add(createVector(0,-marioInput.jumpValue));
        mario.inAir = true;
      }
  // control startScreen
      if(keyCode === ENTER){
        gameover = false;
        startVar = true;
      }
}
function worldBuilding(){
// build background image
  image(sky,0-mario.pos.x,0, worldWidth, worldHeight);
// translate the world view
  translate(-mario.pos.x+ width/2,0);
// Setup black squares ------------------------------------------
  for(var x = 0; x < worldSetup[0].length ; x++){
    for(var y = 0; y < worldSetup.length ; y++){
      if(worldSetup[y][x]===false){
        // Start Punkt links Oben
        (function(){
            image(imgBlock2,x*sizeBox,y*sizeBox,sizeBox,sizeBox);
        })()
      }
    }
  }
}
function amIdead(){
  if(mario.pos.y > worldHeight-blockHeight){
    textSize(80);
    fill(0,0,0)
    text("Game Over:", mario.pos.x-250, mario.pos.y);
    showText("One cannot change all the world,", mario.pos.x-250, mario.pos.y+50,20,"black");
    showText("all together can change the only one we have.", mario.pos.x-250, mario.pos.y+100,20,"black");
    gameover = true;
  }
}
function renderGarbage(){
  for(var i = 0 ; i<garbArray.length ; i++){
      garbArray[i].display();
      if(p5.Vector.dist(mario.pos, garbArray[i].pos)<10){garbArray.splice(i,1);blockHeight-=2}
  }
}
function marioDisplay(){
  if(mario.acc.x === 0){
    image(ghostFront,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  } else
  if(mario.looks === true){
    image(ghostLeft,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  } else
  if(mario.looks === false){
    image(ghostRight,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  }
}
function convertToArray(boxSize,height,width){
  for(var j = 0 ; j < height/boxSize ; j++){
    worldSetup.push([])
    for(var i = 0 ; i < width/boxSize ; i++ ){
      worldSetup[j].push(1020===get(i*boxSize+boxSize/2,j*boxSize+boxSize/2).reduce(function(start, el){return start+el},0));
    }
  }
}
  function showText(cont, x, y , size, color){
    textSize(size);
    fill(color);
    text(cont, x, y);
  }
// Establish constructor for mario
    function Mario(){
      this.pos    = createVector(sizeBox/2,sizeBox/2);
      this.size   = marioInput.sizeValue;
      this.inAir  = false;
      this.vel    = createVector(0,0);
      this.acc    = createVector(0,0);
      this.display= marioDisplay;
      this.collide= function(){var colP = this.colPoints; collision(boxArr, colP)};
      this.colPoints; // arr of the four points of the hit box
      // method to establish the four Points of hitBox
      this.collisionPointsSetup = function(){this.colPoints = createCollisionPoints(this.pos,this.size);};
      this.amIdead = amIdead;
      this.looks = true;
    }
// Establish Garbage constructor
    function Garbage(x,y){
      this.pos    = createVector(x,y);
      this.size   = 10;
      this.vel    = createVector(0,0);
      this.acc    = createVector(0,0);
      this.display= function(){ ellipse(this.pos.x, this.pos.y, this.size) };
      this.collide= function(){var colP = this.colPoints; collision(boxArr, colP)};
      this.colPoints; // arr of the four points of the hit box
      // method to establish the four Points of hitBox
      this.collisionPointsSetup = function(){this.colPoints = createCollisionPoints(this.pos,this.size);};
      this.exist = true;
    }
