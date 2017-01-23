var gameInput = {
  time : 1000,
  jumpHigh : 32,
  worldHeight : 700,
  worldWidth : 10500,
  garbageRaiseSpeed : 2,
  garbageLowerValue : 5,
  garbageDropTime : 2,
  garbageRaiseSpeedChina : 30,
  garbageRaiseSpeedItaly : 15,
  garbageRaiseSpeedGermany : 1
}
//====================================================================
//====================================================================
//======================Code Begins here==============================
//======================No Changing from==============================
//======================Here On On====================================
//====================================================================
//====================================================================
//====================================================================
//====================================================================
//====================================================================
var highlight = 0;
var worldSetup = [],
  sizeBox     = 35,
    marioInput  = {
      speedValue  : 1,
      jumpValue   : gameInput.jumpHigh,
      sizeValue   : 30
    },
    mario,
    garbArray = [],
    timeSpeed = gameInput.time,
    worldClock = {
      day : 0,
      hou : 0,
      min : 0,
      sec :0
    },
    startVar = false,
    gameover = false,
    blockHeight = 0,
    worldHeight = gameInput.worldHeight,
    worldWidth = gameInput.worldWidth,
    lastPos = {
      x:0,
      y:0
    }
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
      wasteIcon = loadImage("bottle.png");
    }
//============================END OF INPUT=======================================
//===============================================================================
function setup() {//=========Start SETUP=========================================
// Sets up the image and runs the function to create the world
  createCanvas(worldWidth, 700);
  image(img, 0, 0, worldWidth, worldHeight );
  convertToArray(sizeBox,worldHeight,worldWidth);
// Sets up the final Canvas for the Game
  createCanvas(700, 700);
  frameRate(60);
// Setup Game Clock
  worldClock();
  function worldClock(){
    var clock2 = 0;
    var clock3 = 0;
    setInterval(function(){
      worldClock.sec += 1;
      clock2 += 0.5;
       if(clock2 === gameInput.garbageDropTime-0.5){lastPos.x = mario.pos.x;lastPos.y = mario.pos.y;}
      clock3 += 0.5;
       if(clock3 === gameInput.garbageDropTime){garbArray.push(new Garbage(lastPos.x,lastPos.y)); clock3 = 0; clock2 = 0;}
      blockHeight += gameInput.garbageRaiseSpeed;
      if(worldClock.sec === 60){worldClock.sec = 0;worldClock.min += 1;}
      if(worldClock.min === 60){worldClock.min = 0;worldClock.hou += 1;}
      if(worldClock.hou === 60){worldClock.hou = 0;worldClock.day += 1;}
    },timeSpeed);
  }
// Setting up array for boxes
  boxArr = [];
// creating the boxes and filling them into the BoxArr
fillArrayWithBoxes();
// create Mario from the constructor
  mario = new Mario()
}//=========END SETUP==========================================================
//=============================================================================


//=============================================================================
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
//change acceleration based on the pressed key. goes left or right.
  movement();
// Turn on the HUD to see Data of Game
  turnOnHUD();
  startScreen();
// Check if the box has reached mario, if yes GAMEOVER
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
// gliding ON or OFF
function keyReleased(){
  //mario.acc.mult(0);
}
function keyPressed(){
  //Control jump
      if(keyCode === UP_ARROW && mario.inAir === false && gameover === false){
        mario.acc.add(createVector(0,-marioInput.jumpValue));
        mario.inAir = true;
        }
        if(keyCode === DOWN_ARROW){
          highlight +=1;
          if(highlight === 3){
            highlight = 0;
            }
        }
        if(keyCode === UP_ARROW){
          highlight -=1;
          if(highlight === -1){
            highlight = 2;
            }
        }
  // control startScreen
      if(keyCode === ENTER){
        if(highlight === 0){
          gameover = false;
          startVar = true;
          gameInput.garbageRaiseSpeed = gameInput.garbageRaiseSpeedChina;
        }
        if(highlight === 1){
          gameover = false;
          startVar = true;
          gameInput.garbageRaiseSpeed = gameInput.garbageRaiseSpeedItaly;
        }
        if(highlight === 2){
          gameover = false;
          startVar = true;
          gameInput.garbageRaiseSpeed = gameInput.garbageRaiseSpeedGermany;
        }
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
    showText("One cannot change all the world,", mario.pos.x-250, mario.pos.y+50,20,"white");
    showText("all together can change the only one we have.", mario.pos.x-250, mario.pos.y+100,20,"white");
    gameover = true;
  }
}
function renderGarbage(){
  for(var i = 0 ; i<garbArray.length ; i++){
      garbArray[i].display();
      if(p5.Vector.dist(mario.pos, garbArray[i].pos)<10){garbArray.splice(i,1);blockHeight-=gameInput.garbageLowerValue}
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
  function fillArrayWithBoxes(){
    for(var x = 0; x < worldSetup[0].length ; x++){
      for(var y = 0; y < worldSetup.length ; y++){
        if(worldSetup[y][x]===false){
          (function(){ var box = new Box(x,y); boxArr.push(box);  })();
        }
      }
    }
  }
  function movement(){
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
  }
  function turnOnHUD(){
    showText(worldClock.hou+":"+worldClock.min+":"+worldClock.sec, mario.pos.x-300, 50, 20, "white");
    showText(Math.floor(blockHeight) + " tons Garbage", mario.pos.x+200, 680, 20, "white");
    for(var i = 0; i < 8 ; i++){
      showText(i*2+"kg", mario.pos.x-300, 700-i*35, 15, "white");
    }
  }
  function startScreen(){
    if(startVar === false){
      rect(0-332,0,700,700);
      showText("Press Enter to Continue", -120, 450, 24, "black");
        if(highlight === 0){
          showText("China", -160, 190, 24, "red");
        } else { showText("China", -160, 190, 24, "black"); }

        if(highlight === 1){
          showText("Italy", -160, 220, 24, "red");
        } else { showText("Italy", -160, 220, 24, "black"); }

        if(highlight === 2){
          showText("Austria", -160, 250, 24, "red");
        } else { showText("Austria", -160, 250, 24, "black"); }
      gameover = true;
    }
  }




//======================================================================================================
// ============= CONTRUCTORS ===========================================================================
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
      this.display= function(){ //ellipse(this.pos.x, this.pos.y, this.size);
                                image(wasteIcon,this.pos.x, this.pos.y, 30, 22)};
      this.collide= function(){var colP = this.colPoints; collision(boxArr, colP)};
      this.colPoints; // arr of the four points of the hit box
      // method to establish the four Points of hitBox
      this.collisionPointsSetup = function(){this.colPoints = createCollisionPoints(this.pos,this.size);};
      this.exist = true;
    }
// Setting up Box constructor
    function Box(x,y){
      this.top = y*sizeBox;
      this.bottom = y*sizeBox+sizeBox;
      this.right = x*sizeBox+sizeBox;
      this.left = x*sizeBox;
    }
