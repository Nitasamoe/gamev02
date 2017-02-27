var speedRise = 12;
var gameInput = {
  time : 1000,
  jumpHigh : 34,
  worldHeight : 700,
  worldWidth : 10500,
  garbageRaiseSpeed : 2,
  garbageLowerValue : 18,
  garbageDropTime : 1,
  garbageRaiseSpeedUsa : speedRise*1.8,
  garbageRaiseSpeedItaly : speedRise*1.2,
  garbageRaiseSpeedCanada : speedRise
}
//====================================================================
//====================================================================
//======================Code Begins here==============================
//======================No Changing from==============================
//======================Here On On====================================
//====================================================================
//====================================================================
var skinNum = 0; // used to store a variable that tells us which skin to use
var bubblesStates = {
  first : true,
  second : false,
  third: false
}
var highlight = 0; // is used to determine which country in Menu is currently highlighted
var worldSetup = [], // is used to store the Data which builds the world
  sizeBox     = 35, // size of the boxes. changing too much can result in big trouble
    marioInput  = {
      speedValue  : 1,
      jumpValue   : gameInput.jumpHigh,
      sizeValue   : 30
    },
    mario,
    garbArray = [],
    timeSpeed = gameInput.time,
    worldClockData = {
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
      imgBlock2 = loadImage("assets/block2.png");
      ghostLeftUSA = loadImage("assets/ghostLeftUSA.png");
      ghostLeftCan = loadImage("assets/ghostLeftCan.png");
      ghostLeftItal = loadImage("assets/ghostLeftItal.png");
      ghostRightUSA = loadImage("assets/ghostRightUSA.png");
      ghostRightCan = loadImage("assets/ghostRightCan.png");
      ghostRightItal = loadImage("assets/ghostRightItal.png");
      mullberg = loadImage("assets/Mullberg.png");
      img = loadImage("assets/bild.jpg");
      back1 = loadImage("assets/back1.png");
      back2 = loadImage("assets/back2.png");
      back3 = loadImage("assets/back3.png");
      back4 = loadImage("assets/back4.png");
      garbage2 = loadImage("assets/Mullberg.png");
      wasteIcon = loadImage("assets/bottle.png");
      speech = loadImage("assets/speech.png");
      speech2 = loadImage("assets/speech2.png");
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
      if(startVar === true){
        worldClockData.sec += 1;
        clock2 += 0.5;
         if(clock2 === gameInput.garbageDropTime-0.5){lastPos.x = mario.pos.x;lastPos.y = mario.pos.y;}
        clock3 += 0.5;
         if(clock3 === gameInput.garbageDropTime){garbArray.push(new Garbage(lastPos.x,lastPos.y)); clock3 = 0; clock2 = 0;}
        blockHeight += gameInput.garbageRaiseSpeed;
        if(worldClockData.sec === 60){worldClockData.sec = 0;worldClockData.min += 1;}
        if(worldClockData.min === 60){worldClockData.min = 0;worldClockData.hou += 1;}
        if(worldClockData.hou === 60){worldClockData.hou = 0;worldClockData.day += 1;}
      }
    },timeSpeed);
  }
  boxArr = [];// Setting up array for boxes
  fillArrayWithBoxes(); // creating the boxes and filling them into the BoxArr
  mario = new Mario()// create Mario from the constructor
}//=========END SETUP==========================================================
//=============================================================================


//=============================================================================
//=============================================================================
function draw(){//=========Start DRAW==========================================
// Setup FORCES----------------------------------------------------------
  gravity = createVector(0,1); // creates the Gravitationa Force
//WORLD BUILDING---------------------------------------------------------
   worldBuilding(); // builds the worldBuilding
   blockRender(); // renders the block with the input block
   instruction(); // renders the instructions at the beginning
   renderGarbage(); // renders the Garbage pieces that we drop
//MARIO BUILDING-----------------------------------------------
  mario.vel.mult(0); // throw velocity bck to zero
//Move Mario------------------------------------------------------
  mario.acc.add(gravity); // add gravity to mario
  mario.vel.add(mario.acc); // add acceleration to velocity
  mario.acc.limit(10); // limit the velocity to 10
  mario.pos.add(mario.vel); // add the velocity to the position
// Question Collision-------------------------------------------------
  mario.collisionPointsSetup(); // establish the hit box through four points of mario
  mario.collide(); // check if there is a collision and correct the position
// RENDER MARIO-----------------------------------------------------
  mario.display(); // displays Marios
  blockRender();// displas the rising garbage box
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
  // RENDER BLOCK THAT RISES===================================================
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
          gameInput.garbageRaiseSpeed = gameInput.garbageRaiseSpeedUsa;
        }
        if(highlight === 1){
          gameover = false;
          startVar = true;
          gameInput.garbageRaiseSpeed = gameInput.garbageRaiseSpeedItaly;
        }
        if(highlight === 2){
          gameover = false;
          startVar = true;
          gameInput.garbageRaiseSpeed = gameInput.garbageRaiseSpeedCanada;
        }
      }
}

function worldBuilding(){
// build background image
  image(back4,0-mario.pos.x,0, worldWidth+500, worldHeight);
  image(back3,0-mario.pos.x*1.07,0, worldWidth+500, worldHeight);
  image(back2,0-mario.pos.x*1.05,0, worldWidth+500, worldHeight);
  image(back1,0-mario.pos.x,0, worldWidth, worldHeight);
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
    fill("black");
    rect(mario.pos.x-350,0,800,800);
    // textSize(80);
    // fill("yellow");
    showText("Game Over",mario.pos.x-160, 300, 80,"yellow" );
    showText("One cannot change all the world,", mario.pos.x-200, 450, 40,"yellow");
    showText("all together can change the only one we have.", mario.pos.x-250, 480, 40,"yellow");
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
    image(chooseSkin(skinNum).right,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  } else
  if(mario.looks === true){
    image(chooseSkin(skinNum).left,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  } else
  if(mario.looks === false){
    image(chooseSkin(skinNum).right,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
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
  textFont("VT323");
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
  if(mario.pos.x > 300){
      showText(worldClockData.hou+":"+worldClockData.min+":"+worldClockData.sec, mario.pos.x-300, 50, 32, "white");
      showText(Math.floor(blockHeight/speedRise*98) + " tons Garbage", mario.pos.x+180, 680, 30, "white");
      /*for(var i = 0; i < 8 ; i++){
        showText(i*2+"kg", mario.pos.x-300, 700-i*35, 18, "white");
      }*/
    }
}

function startScreen(){
  if(startVar === false){
    fill("black");
    rect(0-340,0,800,800);
    showText("Wasteland", -110, 110, 100, "white");

    showText("Use arrows to select your difficulty", -140, 250, 30, "white");
    showText("What if the whole world would act like ...", -120, 275, 20, "white");

    showText("Press Enter to Continue", 0, 600, 40, "white");
      if(highlight === 0){
        skinNum = 0;
        showText("...USA - one American produces 2kg/day", -70, 310, 20, "yellow");
      } else { showText("...USA", -70, 310, 20, "white"); }

      if(highlight === 1){
        skinNum = 1;
        showText("...Italy - one Italian produces 1,3kg/day", -70, 340, 20, "yellow");
      } else { showText("...Italy", -70, 340, 20, "white"); }

      if(highlight === 2){
        skinNum = 2;
        showText("...Canada - one Canadian produces 1,1kg/day", -70, 370, 20, "yellow");
      } else { showText("...Canada", -70, 370, 20, "white"); }
    gameover = true;
  }
}

function instruction(){
  var h = 100;
  var color = "yellow";
  fill(20,20,20);
  rect(0-350,0,350,700);
  showText("use the arrows to move", -270, h+25, 24, color);
  showText("and collect the bottles", -270, h+50, 24, color);
  showText("in order to prevent", -270, h+75, 24, color);
  showText("the garbage to kill you", -270, h+100, 24, color);
  showText("Ah...", -270, h+480, 24, color);
  showText("in case you are wondering...", -270, h+505, 24, color);
  showText("this is the garbage", -270, h+530, 24, color);

  if(mario.pos.x> 500 && bubblesStates.first === true){
      image(speech, mario.pos.x-355 , 250 , 594/2, 180/2);
      showText("did you forget something?", mario.pos.x-325, 285, 24, "black");
      setTimeout(function(){
          bubblesStates.first = false;
          bubblesStates.second = true;
      },2000)
  }
  if(bubblesStates.second === true){
      image(speech2, mario.pos.x-355 , 170 , 991/2, 153/2);
      showText("only by picking up your trash you will stay alive", mario.pos.x-340, 200, 24, "black");
      setTimeout(function(){
          bubblesStates.second = false;
          setTimeout(function(){
              bubblesStates.third = true;
          },1000)
      },3000)

  }
  if(bubblesStates.third === true){
      image(speech, mario.pos.x-375 , 90 , 991/2, 153/2);
      showText("hurry up, time is running out!", mario.pos.x-340, 120, 24, "black");
      setTimeout(function(){
          bubblesStates.third = false;
      },2000)
  }
}// End of Instructions Function

function chooseSkin(number){
    var skin = {}
    switch(number){
      case 0: {skin.right = ghostRightUSA;skin.left = ghostLeftUSA;skin.name = "USA";}break;
      case 1: {skin.right = ghostRightItal;skin.left = ghostLeftItal;skin.name = "Ita";}break;
      case 2: {skin.right = ghostRightCan;skin.left = ghostLeftCan;skin.name = "Can";}break;
    }
    return skin;
  }
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
//======================================================================================================
// ============= CONTRUCTORS ===========================================================================
// Establish constructor for mario
    function Mario(){
      this.pos    = createVector(sizeBox/2+50,sizeBox/2);
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
                                image(wasteIcon,this.pos.x, this.pos.y, 15, 20)};
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
