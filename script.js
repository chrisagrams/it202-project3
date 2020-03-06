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

const load = () => {
    introSound.play();
}
window.onLoad = load();

let tweetSound = document.querySelector("audio#tweet");
let explosionSound = document.querySelector("audio#explosion");

let sirenShort = document.querySelector("audio#sirenShort");

let sirenLong = document.querySelector("audio#sirenLong");

let coinSound = document.querySelector("audio#coinSound");

let musk = {image: new Image(), x: 0, y:0};
musk["image"].src = "img/musk.png";
musk["x"] = truck["x"];
musk["y"] = truck["y"] - 25;
musk["height"] = 50;
musk["width"] = 100;

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

let muskHead = new Image();
muskHead.src = "img/musk3.png"

let enemies = [SEC, bezzos, palin];

let Obstacles = [];
let Benefits = [];

let explosionGif = [];

let glowGif = [];

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

let itterateRate = 10;
let previousScore = 0;

let pulse = 0;
let pulsing = false;

let lives = 3;

let gameover = false;

for(let i = 0; i<17; i++){
    explosionGif.push(new Image());
    explosionGif[i].src = "img/explosionPNG/explosion" + (i+1) + ".png";
}

for(let i = 0; i<40; i++){
    glowGif.push(new Image());
    glowGif[i].src = "img/glowFrames/glow" + (i+1) + ".png";
}

let explosionGIFS = [];

let glowGIFS = [];

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
    Obstacles.push(new Obstacle(enemies[selected], context.canvas.width, y, itterateRate*.25, 1));
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

const destroyBenefits = () => {
    for (let i = 0; i<Benefits.length; i++){
        if(Benefits[i].isDead){
            Benefits.splice(i,1);
            glowGIFS.splice(i,1);
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

const drawBenefits = () => {
    for (let i = 0; i<Benefits.length; i++){
        let selected = Benefits[i];
        context.drawImage(Benefits[i].image, Benefits[i].x, Benefits[i].y, 50,50);
        Benefits[i].x -= Benefits[i].velocity;
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

const checkGlow = () => {
    for(let i = 0; i<glowGIFS.length; i++){
        console.log("LENGTH: " + glowGIFS.length)
        glowGIFS[i].itterateI();
        if(glowGIFS[i].dead){
            
        }
        else{
            console.log("DRAWING");
            context.drawImage(glowGIFS[i].drawFrame(), glowGIFS[i].x, glowGIFS[i].y,100,100);
            console.log(glowGIFS[i].x + " " + glowGIFS[i].y);
            glowGIFS[i].x--;
        }
    }
}

const randomSpawn = () => {
    let tempRandom = Math.random();
    let lowerBound = tempRandom-spawnProbability;
    let upperBound = tempRandom+spawnProbability;
    
    tempRandom = Math.random();
    if(tempRandom<upperBound && tempRandom>lowerBound){
        let randomHeight = Math.random()*context.canvas.height;
        console.log(randomHeight);
        if (randomHeight>context.canvas.height-truck["height"]-musk["height"]){
            console.log("Out of bounds");
        }
        else{
            addObstacles(randomHeight);
        }
    }
}

const randomSpawnBenefit = () => {
    let tempRandom = Math.random();
    let lowerBound = tempRandom-spawnProbability*.1;
    let upperBound = tempRandom+spawnProbability*.1;
    
    tempRandom = Math.random();
    if(tempRandom<upperBound && tempRandom>lowerBound){
        let randomHeight = Math.random()*context.canvas.height;
        console.log(randomHeight);
        if (randomHeight>context.canvas.height-truck["height"]-musk["height"]){
            console.log("Out of bounds");
        }
        else{
            addBenefit(randomHeight);
        }
    }
}

const addBenefit = (y) => {
        Benefits.push(new BenefitObject(muskHead, context.canvas.width, y, 1,"health",false));
        glowGIFS.push(new Gif(glowGif, context.canvas.width-27, y-50, .25,true))
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
    backgroundX-=itterateRate;
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
        pumpX = 0;
        mainDraw();
    }

}

const drawMars = () => {
        if(marsX+marsWidth <=0){
            marsX = context.canvas.width;
        }
        context.drawImage(mars, marsX, marsY, marsWidth,500);
        marsX-=itterateRate*.1;
}

const showScore = () => {
    context.font = "20px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.textAlign="left"; 
    context.textBaseline = "top";
    context.fillText("Score: " + score, context.canvas.width-150, context.canvas.height*.05);
}

const itterateLevel = () =>{
    if(score%100 == 0 && score-100==previousScore){
        pumpX=0;
        itterateRate+=2;
        previousScore=score;
    }
    showLevel();
}

const showLevel = () =>{
    context.font = "60px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.textAlign="center"; 
    context.textBaseline = "middle";
    if(pumpX<=Math.PI){
    context.translate(context.canvas.width*.5, context.canvas.height*.5);
    context.scale(1*(Math.sin(pumpX)),1*(Math.sin(pumpX)));
    context.translate(-context.canvas.width*.5, -context.canvas.height*.5);
    context.fillText("Level " + Math.floor(score/100), context.canvas.width*.5, context.canvas.height*.5);
    context.scale(-1*(Math.sin(pumpX)),-1*(Math.sin(pumpX)));
    pumpX+=0.02;
        
    }    
}

const drawGrad = () => {
    if(pulse>= Math.PI){
       pulse = 0;
    }
    let grd = context.createRadialGradient(context.canvas.width*.5, context.canvas.height*.5, 0, context.canvas.width*.5, context.canvas.height*.5, context.canvas.width*.75);
    grd.addColorStop(0, "transparent");
    grd.addColorStop(1, 'rgba(255, 0, 0, ' + Math.sin(pulse) +')');

    context.fillStyle = grd;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    pulse+=.1;
 
}

const drawLives = () =>{
    context.font = "20px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.textAlign="left"; 
    context.textBaseline = "top";
    let x = 50;
    context.fillText("Elons left: ", x, context.canvas.height*.05);
    x+= 10;
    for (let i = 0; i<lives; i++){
        context.drawImage(muskHead, x+100, context.canvas.height*.05 - 25, 50,50);
        x+=50;
    }
}

const obstacleCollisionDetection = () => {
    for(let i = 0; i<Obstacles.length; i++){
        if(Obstacles[i].x <= 0 || (Obstacles[i].x >= musk["x"] && Obstacles[i].x <= truck["x"] +truck["width"]
                                  && Obstacles[i].y>=truck["y"] && Obstacles[i].y <= truck["y"]+truck["height"])
          ){
            Obstacles[i].isDead = true;
            explosionGIFS.push(new Gif(explosionGif, Obstacles[i].x-50, Obstacles[i].y-150, .25,false));   
            explosionSound.cloneNode(true).play();
            lives--;
            pulsing = true;
            sirenShort.cloneNode(true).play();
        }
    }
    if(lives>0){
        if(pulsing){
            drawGrad();
        }
        if(pulse>= Math.PI){
            pulsing = false;
        }
     }
    else{
        if(pulsing){
            drawGrad();
            if(sirenLong.paused){
                sirenLong.play();
            }
        }
        else{
            sirenLong.pause();
        }
    }
    if(lives<0){
        gameover = true;
    }
   
}

const benefitCollisionDetection = () => {
    for (let i = 0; i<Benefits.length; i++){
        if(Benefits[i].x <= 0 || (Benefits[i].x >= musk["x"] && Benefits[i].x <= truck["x"] +truck["width"]
                                  && Benefits[i].y>=truck["y"] && Benefits[i].y <= truck["y"]+truck["height"])
          ){
            if(Benefits[i].type == "health"){
                if(lives<3)
                    lives++;
                Benefits[i].isDead = true;
                
            }
                    coinSound.cloneNode(true).play();
        }
    }
}

const gameoverDraw = () =>{
    let sounds = document.querySelectorAll("audio");
    for (let i = 0; i<sounds.length; i++){
        sounds[i].pause();
    }
    let oof = document.querySelector("audio#oof");
    oof.play();
    
    context.font = "64px Comic Sans MS";
    context.fillStyle = "#FFFFFF";
    context.textAlign="center"; 
    context.textBaseline = "middle";
    context.fillText("Game over.", context.canvas.width*.5, context.canvas.height*.5);
}



const mainDraw = () => {
    framecount++;

   
    adjustCanvas();

    
    
    updateTruckPos();
    
//     context.scale(transformScale,transformScale);
   backgroundDraw();
   backgroundItterate();
   easeBackground(); 
   
//     transformScale-=.001;
//     context.translate(-canvas.width / 4, -canvas.height / 4);

//     context.scale(1/transformScale,1/transformScale);
    drawMars();
    context.drawImage(musk["image"], musk["x"], musk["y"], 100,100);
    context.drawImage(truck["image"],truck["x"],truck["y"],truck["width"],truck["height"]);
    drawObstacles(); 
    drawBenefits();
    showScore(); 
    drawLives(); 
    checkGlow();      
    
    collisionDetection();
    updateProjectiles();
    obstacleCollisionDetection();
    benefitCollisionDetection();
    checkExplosions();
    
    
    if(explosionI==explosionGif.length){
        explosionI=0;
    }
    
   randomSpawn();
   randomSpawnBenefit(); 
    

    itterateLevel(); 
    if(!gameover){
    window.requestAnimationFrame(mainDraw);
    } else{
        gameoverDraw();
    }
    destroyObstacles();
    destroyProjectiles();
    destroyBenefits();
    
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

class BenefitObject{
    constructor(image, x, y, velocity, type, isDead){
        this.image = image;
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.type = type;
        this.isDead = false;
        
    }
}

class Gif{
    constructor(images, x, y, speed, loop){
        this.images = images;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.i = 0;
        this.animating = false;
        this.dead = false;
        this.loop = loop
    }
    itterateI(){
        this.i+=this.speed;
        if(!this.loop){
            if(Math.floor(this.i)>this.images.length-1){
            this.dead=true;
           }
        } else{
            if(this.i>this.images.length-1){
                this.i=0;
            }
        }
    }
    drawFrame(){
        return this.images[Math.floor(this.i)];
    }
}

