let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

let img = new Image(); 
img.src = "img/background.jpg";

let mars = new Image();
mars.src = "img/mars.png";
let marsWidth = 500;
let marsX = context.canvas.width + marsWidth;
let marsY = 250;
let backgroundX = 0;
let backgroundY = -1024;
let backgroundYTarget = -1024;

let truck = {image: new Image(),
             x: 50,
             y: 100,
             width: 200,
             height: 200};
truck["image"].src = "img/truck.png";

let mainSound = document.querySelector("audio#mainSound");
mainSound.controls = false;
mainSound.loop = true;


let introSound = document.querySelector("audio#introSound");
introSound.controls = false;
introSound.loop = true;

let tweetSound = document.querySelector("audio#tweet");
let explosionSound = document.querySelector("audio#explosion");



let musk = {image: new Image(), x: 0, y:0};
musk["image"].src = "img/musk.png";
musk["x"] = truck["x"];
musk["y"] = truck["y"] - 25;

let movingDown = false;
let movingUp = false;
let movingLeft = false;
let movingRight = false;

let transformScale = 1;

let twitter = new Image();
twitter.src = "img/twitter.png";
let Projectiles = [];

let SEC = new Image();
SEC.src = "img/SEC.png";
let bezzos = new Image();
bezzos.src = "img/bezzos.png";
let palin = new Image();
palin.src = "img/Palin.png";

let enemies = [SEC, bezzos, palin];

let Obstacles = [];

let explosionGif = [];

let spawnProbability = 0.005;

let explosionI = 0;
let explosioning = false;

let explosionX = 0;
let explosionY = 0;


let framecount = 0;
let framecountPointer = 0;
let easingMultiplier = .5;

let rotation = 0;

let pumpX = 0;

let onMenu = true;

let score = 0;

for(let i = 0; i<17; i++){
    explosionGif.push(new Image());
    explosionGif[i].src = "img/explosionPNG/explosion" + (i+1) + ".png";
}

let explosionGIFS = [];

document.addEventListener("load", event => {
    introSound.play();
});

document.addEventListener("keydown", event => {
  if (event.isComposing || event.key == "ArrowUp") {
    movingUp = true;
  }
  if (event.isComposing || event.key == "ArrowDown") {
    movingDown = true;
  }
  if (event.isComposing || event.key == "ArrowLeft") {
    movingLeft = true;
  }
  if (event.isComposing || event.key == "ArrowRight") {
    movingRight = true;
  }
  if (event.isComposing || event.code == "Space"){
//       console.log("Space");
      if(onMenu){
          onMenu=!onMenu;
      }
      else{
          Projectiles.push(new Projectile(twitter, truck["x"], truck["y"], 1, 1));
          tweetSound.cloneNode(true).play();
      }
      
  }
  
  //test
  if(event.isComposing || event.code == "KeyQ"){
      addObstacles();
  }
  
});
document.addEventListener("keyup", event => {
  if (event.isComposing || event.key == "ArrowUp") {
    movingUp = false;
  }
  if (event.isComposing || event.key == "ArrowDown") {
    movingDown = false;
  }
  if (event.isComposing || event.key == "ArrowLeft") {
    movingLeft = false;
  }
  if (event.isComposing || event.key == "ArrowRight") {
    movingRight = false;
  }

});

const updateTruckPos = () => {
    if(movingDown){
        if(truck["y"]+truck["height"]*.75 < context.canvas.height){
        truck["y"]+=10;
        backgroundYTarget-=2;  
        marsY-=1;    
        }    
    }
    if(movingUp){
        if(truck["y"]+truck["height"]*.25 >= 0){
            truck["y"]-=10;
            backgroundYTarget+=2;  
            marsY+=1;    
        }
    }
    if(movingLeft){
        if(!truck["x"]<= 0){
           truck["x"]-=10;
        }
    }
    if(movingRight){
        if(truck["x"] < context.canvas.width - truck["width"]){
            truck["x"]+=10;
        }
    }
    
    musk["x"] = truck["x"];
    musk["y"] = truck["y"]-25;
}

const drawProjectiles = () => {
    for(let i = 0; i<Projectiles.length; i++){
        context.drawImage(Projectiles[i].image, Projectiles[i].x, Projectiles[i].y, 50,50);
    }
}

const updateProjectiles = () => {
//     console.log(Projectiles.length);
    for (let i = 0; i<Projectiles.length; i++){
        Projectiles[i].x+=10;
//         console.log(Projectiles[i].x);
        if(Projectiles[i].x > context.canvas.width){
            Projectiles.splice(i,1);
        }
    }
    drawProjectiles();
}

const addObstacles = (y) => {
    let selected = Math.floor(Math.random()*enemies.length);
    console.log(selected);
    Obstacles.push(new Obstacle(enemies[selected], context.canvas.width, y, 1, 10));
//     console.log("Obstacle Added");
}

const destroyObstacles = () => {
    for (let i = 0; i < Obstacles.length; i++){
        if(Obstacles[i].isDead){
            Obstacles.splice(i,1);
        }
    }
}

const destroyProjectiles = () => {
    for (let i = 0; i<Projectiles.length; i++){
        if(Projectiles[i].isDead){
            Projectiles.splice(i,1);
        }
    }
}

const collisionDetection = () => {
    let width = 100;
    let height = 100;
    for (let i = 0; i<Projectiles.length; i++){
        for(let j = 0; j<Obstacles.length; j++){
            if(Obstacles[j].x >= Projectiles[i].x && Obstacles[j].x <= Projectiles[i].x + width){
                if(Obstacles[j].y>=Projectiles[i].y && Obstacles[j].y <= Projectiles[i].y+height){
                   explosionGIFS.push(new Gif(explosionGif, Obstacles[j].x-50, Obstacles[j].y-150, .25));   
                   Obstacles[j].isDead = true;
                   Projectiles[i].isDead = true; 
                   explosionSound.cloneNode(true).play();
                   score +=5; 
                }
            }
        }
    }
}

const drawObstacles = () => {
    for (let i = 0; i<Obstacles.length; i++){
        context.drawImage(Obstacles[i].image, Obstacles[i].x, Obstacles[i].y, 50,50);
        Obstacles[i].x -= Obstacles[i].velocity;
    }
}


const checkExplosions = () => {
    for (let i = 0; i<explosionGIFS.length; i++){
        explosionGIFS[i].itterateI();
        if(explosionGIFS[i].dead){
            //TODO
        }
        else{
            context.drawImage(explosionGIFS[i].drawFrame(), explosionGIFS[i].x, explosionGIFS[i].y);
        }
        
    }
}

const randomSpawn = () => {
    let tempRandom = Math.random();
    let lowerBound = tempRandom-spawnProbability;
    let upperBound = tempRandom+spawnProbability;
    
    tempRandom = Math.random();
    if(tempRandom<upperBound && tempRandom>lowerBound){
        addObstacles(Math.random()*context.canvas.height);
    }
}

const backgroundDraw = () => {
    let NOWidth = Math.ceil(context.canvas.width/1024)+1;
    let NOHeight = Math.ceil(context.canvas.height/1024)+1;
    for (let i = 0; i<= NOWidth+1; i++){
        for(let j = 0; j<=NOHeight+1; j++){
          context.drawImage(img, 1024*i+backgroundX-1024, 1024*j+backgroundY-1024);  
        }
    }
    
    
}

const backgroundItterate = () => {
    backgroundX-=10;
    if(backgroundX<=-1024){
      backgroundX=0;
    }
}

const easeBackground = () => {
//TODO
 backgroundY = backgroundYTarget;
}

const rotateBackground = () => {
    context.translate(context.canvas.width*.5, context.canvas.height*.5);
    context.rotate((Math.PI / 180) * rotation);
    context.translate(-context.canvas.width*.5, -context.canvas.height*.5);

    rotation+=.1;
}
const undoRotation = () => {
    context.translate(context.canvas.width*.5, context.canvas.height*.5);
    context.rotate(-1* (Math.PI / 180) * rotation);
    context.translate(-context.canvas.width*.5, -context.canvas.height*.5);

}

const adjustCanvas = () =>{
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    
}

const pumpText = () =>{
    context.translate(context.canvas.width*.5, context.canvas.height*.5);
    context.scale(.35*(Math.cos(pumpX)+2),.35*(Math.cos(pumpX)+2));
    context.translate(-context.canvas.width*.5, -context.canvas.height*.5);
    pumpX+=0.05;
}

const undoPumpText = () =>{
    context.scale(-.35*(Math.cos(pumpX)+2),-.35*(Math.cos(pumpX))+2);

}

const menuDraw = () => {
    adjustCanvas();
    rotateBackground();
    backgroundDraw();
    undoRotation();
    context.font = "64px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.textAlign="center"; 
    context.textBaseline = "middle";
    context.fillText("Elon Musk Simulator 2020", context.canvas.width*.5, context.canvas.height*.25);
  
    context.font = "20px Comic Sans MS";
    context.fillText("Controls: Arrows to move, \"Space\" to shoot.", context.canvas.width*.5, context.canvas.height*.9);
    context.font = "64px Comic Sans MS";
    pumpText();
    context.fillText("Press \"Space\" to begin.", context.canvas.width*.5, context.canvas.height*.75);
    undoPumpText();

    if(onMenu)
    window.requestAnimationFrame(menuDraw);
    else{
        introSound.pause();
        mainSound.play();
        mainDraw();
    }

}

const drawMars = () => {
        if(marsX+marsWidth <=0){
            marsX = context.canvas.width;
        }
        context.drawImage(mars, marsX, marsY, marsWidth,500);
        marsX--;
}

const showScore = () => {
    context.font = "20px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.textAlign="left"; 
    context.textBaseline = "top";
    context.fillText("Score: " + score, context.canvas.width-150, context.canvas.height*.05);
}

const mainDraw = () => {
    framecount++;
   
    adjustCanvas();

    
    
    updateTruckPos();
    
//     context.scale(transformScale,transformScale);
   backgroundDraw();
   backgroundItterate();
   easeBackground(); 
   showScore(); 
    
//     transformScale-=.001;
//     context.translate(-canvas.width / 4, -canvas.height / 4);

//     context.scale(1/transformScale,1/transformScale);
    drawMars();
    context.drawImage(musk["image"], musk["x"], musk["y"], 100,100);
    context.drawImage(truck["image"],truck["x"],truck["y"],truck["width"],truck["height"]);
    
    collisionDetection();
    updateProjectiles();
    checkExplosions();
    
    drawObstacles();
    
    if(explosionI==explosionGif.length){
        explosionI=0;
    }
    
   randomSpawn();
    

    
    window.requestAnimationFrame(mainDraw);
    destroyObstacles();
    destroyProjectiles();
    
}
menuDraw();
// mainDraw();


class Projectile{
    constructor(image, x, y, velocity, power){
    this.image = image;
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.power = power;
    this.isDead = false;    
    }
}

class Obstacle{
    constructor(image, x, y, velocity, health){
        this.image = image;
        this.x = x;
        this.y = y; 
        this.velocity = velocity;
        this.health = health;
        this.isDead = false;
    }
}

class Gif{
    constructor(images, x, y, speed){
        this.images = images;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.i = 0;
        this.animating = false;
        this.dead = false;
    }
    itterateI(){
        this.i+=this.speed;
        if(Math.floor(this.i)>this.images.length-1){
            this.dead=true;
        }
    }
    drawFrame(){
        return this.images[Math.floor(this.i)];
    }
}

