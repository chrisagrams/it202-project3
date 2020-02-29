let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

let img = new Image(); 
img.src = "img/background.jpg";

let mars = new Image();
mars.src = "img/mars.png";
let marsWidth = 500;
let marsX = context.canvas.width + marsWidth;
let backgroundX = 0;

let truck = {image: new Image(),
             x: 50,
             y: 100,
             width: 200,
             height: 200};
truck["image"].src = "img/truck.png";

let mainSound = document.querySelector("audio");
mainSound.controls = false;
mainSound.loop = true;

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
let Obstacles = [];

let explosionGif = [];

let spawnProbability = 0.005;

let explosionI = 0;
let explosioning = false;

let explosionX = 0;
let explosionY = 0;



for(let i = 0; i<17; i++){
    explosionGif.push(new Image());
    explosionGif[i].src = "img/explosionPNG/explosion" + (i+1) + ".png";
}

let explosionGIFS = [];


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
      Projectiles.push(new Projectile(twitter, truck["x"], truck["y"], 1, 1));
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
        }    
    }
    if(movingUp){
        if(truck["y"]+truck["height"]*.25 >= 0){
        truck["y"]-=10;
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
    Obstacles.push(new Obstacle(SEC, context.canvas.width, y, 1, 10));
//     console.log("Obstacle Added");
}

const destroyObstacles = (i) => {
    Obstacles.splice(i,1);
}

const destroyProjectile = (i) => {
    Projectiles.splice(i,1);
}

const collisionDetection = () => {
    let width = 100;
    let height = 100;
    for (let i = 0; i<Projectiles.length; i++){
        for(let j = 0; j<Obstacles.length; j++){
            if(Obstacles[j].x >= Projectiles[i].x && Obstacles[j].x <= Projectiles[i].x + width){
                if(Obstacles[j].y>=Projectiles[i].y && Obstacles[j].y <= Projectiles[i].y+height){
                   explosionGIFS.push(new Gif(explosionGif, Obstacles[j].x-50, Obstacles[j].y-150, .25));   
                   destroyObstacles(j);
                   destroyProjectile(i);
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
    let NOWidth = Math.ceil(context.canvas.width/1024);
    let NOHeight = Math.ceil(context.canvas.height/1024);
    for (let i = 0; i<= NOWidth+1; i++){
        for(let j = 0; j<=NOHeight+1; j++){
          context.drawImage(img, 1024*i+backgroundX, 1024*j);  
        }
    }
    
    backgroundX-=10;
    if(backgroundX<=-1024){
      backgroundX=0;
    }
}

const mainDraw = () => {
  
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;


    if(marsX+marsWidth <=0){
        marsX = context.canvas.width;
    }
    
    updateTruckPos();
    
//     context.scale(transformScale,transformScale);
   backgroundDraw();
    
    context.drawImage(mars, marsX, 250, marsWidth,500);
//     transformScale-=.001;
//     context.translate(-canvas.width / 4, -canvas.height / 4);

    context.scale(1/transformScale,1/transformScale);
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
    

    marsX--;
    
    window.requestAnimationFrame(mainDraw);
    
}
mainDraw();


class Projectile{
    constructor(image, x, y, velocity, power){
    this.image = image;
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.power = power;
    }
}

class Obstacle{
    constructor(image, x, y, velocity, health){
        this.image = image;
        this.x = x;
        this.y = y; 
        this.velocity = velocity;
        this.health = health;
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

