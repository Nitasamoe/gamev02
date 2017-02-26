# About

Wasteland(name to define) is a university project develop during the Creative Coding course at [Politecnico di Milano.](http://www.polimi.it)
The aim is to create a [p5-based](http://p5js.org) app around the theme of “out of scale”.

# Project idea

The idea it is to create a simple __game to raise awareness__ around the topic of __production of waste__.

The goal of the game is that the user, through the experience of the game, __understand__ that in order __to face the overproduction of waste people need to cooperate__, the impact of the individual does not bring a big change, thus it is relevant to spread the word and make all the people conscious of the state of art.

We implement the possibility for the user of choosing the country in order to give him/her a reference and make comparison.

## Why A Game?

Is easier to get attention from the user and keeps him engaged. As a result the learned behaviors from inside of the game will be translated to everyday life.
Moreover it is based on a gametype that everybody knows. A simple Sidescroller Jump´n Run. So it is very intuitive to play and the mechanisms are easily understood. That is also the reason why the game graphics are kept in a retro style. 

## What is it about?
	
The player as a ghost, an abstract being, runs through a dystopian world and tries to reach the end. Under him there is a rising block of garbage that threatens his existence.  Depending on the country he is in the rising speed is different. The more he gets to the city he harder it gets for him to get ahed. Ever few meters he also drops garbage. Only by picking the garbage up, he can lower the rising garbage and continue his journey. 

## End of Game

It is not possible to finish the game in the intended way. The player just simply cannot win the game. He cannot reach the end. The game is configured to always let the player loose until he realizes that he cannot change the world alone. He needs help.
It should show the action of people in a short term and the amount of waste produced.



# Challenges 

The main challenge was the translation of the __awareness__ on the topic into coding.
We got inspiration from a game, [The Best Amendment](http://www.molleindustria.org/the-best-amendment/), around the topic of gun.
This game would like to raise awareness on the topic and in order to do so, use a final message to __switch the gaming exeperience into a moment of reflection__.
We combine this using negative emotion, such as frustration, as a trigger for consideration on our topic and as a provocation to action.  

A second challenge was how to __recreate “feeling” of the experience “picking the trash”__ in the game. We described that experience as something you know that you should (and must) do but it doesn’t give you a direct pleasure.
We then convert this into the action of leaving behind the player a plastic bottle in order to create a fake constraint in the level that bring the user to always go back, but whishing to go forward. 
We decide to use the __bottle as a common object__ that we daily deal with, as it is possible, unfortunately, to see in Politcnico rooms after class. 

# Difficulties 

To build the world instead of create each single box we create a _function_ that beside some background layer read a _bitmap file_ and fill with a box the black square. This feature gave us the possibility to easily change the shape of a level without touching directly the code.

```javascript
function convertToArray(boxSize,height,width){
  for(var j = 0 ; j < height/boxSize ; j++){
    worldSetup.push([])
    for(var i = 0 ; i < width/boxSize ; i++ ){
      worldSetup[j].push(1020===get(i*boxSize+boxSize/2,j*boxSize+boxSize/2).reduce(function(start, el){return start+el},0));
    }
  }
}
```

The _physic of the protagonist_ try to emulate the physic gravity in SuperMario game based app.

```javascript
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
```


We add countries simply by give to certain _variables_ a different series of values increasing or decreasing the speed of the garbage.

```javascript
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
```

Graphic adjustment


# Authors

* Tobias Schnider [@Nitasamoe](https://github.com/Nitasamoe) 
* [Lydia Renner](www.lydia-renner.com) [@LydiaFritzi](https://github.com/LydiaFritzi)
* Andrea Taverna [@AnderTave](https://github.com/AnderTave)




> Leave this world a little better than you found it.
> - Baden-Powell's Last Message (1941)
