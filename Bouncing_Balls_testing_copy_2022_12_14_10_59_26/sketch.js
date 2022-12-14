/*
 * This program sketch is copied from Even Peck's example at
 * https://editor.p5js.org/evanpeck/sketches/O7MjzPFxb
 * This is from my own learning.
 * Xiannong Meng
 * 2022-06-25
 *
 * Revisions
 * 1. 2022-06-28: added sound file loading and playing
 *    a. The Apollo launch audio file is downloaded from
 *    https://www.nasa.gov/62282main_countdown_launch.wav
 *    which is then converted into mp3 format to be used here.
 * 2. 2022-06-28: added a textbox; check if any ball is colliding with the textbox.
 *    If so, the ball reverses the move direction.
 */

/* 
* REVISIONS FOR FINAL
* 1. Added ringing noise for every time a ball hit the    
*    text box (and removed the apollo soundtrack)
*
* 2. Added color changing effect when balls hit the top or 
*    bottom of the screen. Added size changing effect when 
*    balls hit right or left of the screen.
*
* 3. Added a hits counter in the text box to track the pings.
*    Created global variable to keep track and updates with ping.
*/

const BOX_WIDTH  = 200;  // textbox dimensions
const BOX_HEIGHT = 100;

var balls = [];
var sound;
var testBall;
// created variable to track hits
var hits = 0;

function preload() {

  sound = loadSound("apollo11.mp3");  // preload the sound file
  collisionSound = loadSound("ping.mp3");
}

function setup() {

//  createCanvas(windowWidth, windowHeight);
  createCanvas(600,400)

  
  noStroke();
  
  //sound.play();    // play the audio file once
  //sound.loop();  // play the sound file repeatedly
  
  for (var ballNum = 0; ballNum < 10; ballNum++) {
  	balls[ballNum] = new Ball();  
  }

  let y = height;
  testBall = new Ball();
  testBall.size = 50;
  testBall.ballX = 220;  // if ballX == 225, the ball just slides over the right edge
  testBall.ballY = 300;
  testBall.red = 0;
  testBall.blue = 0;
  testBall.green = 0;
  testBall.speedX = 0;
  testBall.speedY = 1.2;
}

function createBox() {
  // prepare a box first
  strokeWeight(4);
  rect(0, 0, BOX_WIDTH, BOX_HEIGHT);
  
  textSize(32);           // size of the text (pixels)
  fill(0, 102, 153);      // fill() takes R,G,B values as the color
  // draw the text in the box (x,y,width,height) with the color in fill()
  textAlign(CENTER);
  // Added some text and variable to text box
  text('Hello World!' + "\n" + "Hit " + hits + " times", BOX_WIDTH/2, BOX_HEIGHT/2);   
 
}

function draw() {

  background(255);
  createBox();
  
  testBallMove();  // a special ball to test corner collision
  
  for (var ballNum = 0; ballNum < balls.length; ballNum++) {
    balls[ballNum].display();
    
    //HERE IS THE CODE FOR CHANGE #2 (also some returns added)
    boolVal = balls[ballNum].checkForHitWall();
    // if ball hits top/bottom change color
    if (boolVal == false) {
      balls[ballNum].red   = random(255);
      balls[ballNum].green = random(255);
      balls[ballNum].blue  = random(255)
    }
    // if ball hits side change size
    if (boolVal == true) {
      balls[ballNum].size = random(100)
    }
    balls[ballNum].checkForHitBox();
    balls[ballNum].moveBall();
    
    if (mouseIsPressed) {
      balls[ballNum].randomize()
      
    }
  }
}

function testBallMove() {
  
  testBall.display();
  testBall.checkForHitWall();
  testBall.checkForHitBox();
  testBall.moveBall();
}

class Ball { // Constructor
  
  constructor() {
    // initial position
    this.ballX = random(100, width)
    this.ballY = random(100, height)
    
    // Dictates velocity + direction
    this.speedY = random(-5, 5);
    this.speedX = random(-5, 5);
    
    this.size = random(100);
    
    // How transparent the ball is
    this.alpha = 100
    
    // RGB values for color
    this.red   = random(255);
    this.green = random(255);
    this.blue  = random(255)
  }
  
  display() {
    fill(this.red, this.green, this.blue, this.alpha);
    ellipse(this.ballX, this.ballY, this.size);
  }
  
  randomize() {
    this.speedY = random(-5, 5);
    this.speedX = random(-5, 5);
  }
  
  checkForHitWall() {
  
    let radius = this.size / 2;
    if ((this.ballY+radius) > height || (this.ballY-radius) < 0) {
  	  this.speedY = -this.speedY;  
      return false;

  	}
    if ((this.ballX+radius) > width  || (this.ballX-radius) < 0) {
      this.speedX = -this.speedX;
      return true;
    }
    
  }
  
  checkForHitBox() {
    
    let radius = this.size / 2;

//    if (((this.ballX-radius) < BOX_WIDTH && (this.ballY-radius) < BOX_HEIGHT) || d < radius) {
    if (((this.ballX-radius) < BOX_WIDTH && (this.ballY-radius) < BOX_HEIGHT)) {
      // bump into the textbox, need to reverse direction
      this.reverseBall();
      
      // ping noise being added when the box is hit
      collisionSound.play();
      // hits being updated
      hits += 1;
      
    }
  }
  
  reverseBall() {
    
      this.speedX = -this.speedX;
      this.speedY = -this.speedY;    
  }
  
  moveBall() {

    this.ballX += this.speedX;
  	this.ballY += this.speedY;
    
  }
  
}