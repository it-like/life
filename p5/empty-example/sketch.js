//global variables
phi = 0;
let counter =0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  angleMode(DEGREES);
  frameRate(120); 

} 

function draw() {
   //wobblingWave();
  stiroGraph();
  
}


function stiroGraph() {
  background('orange'); 
  const diameter =200;
  radius = diameter/2;
  translate(-window.innerWidth/3,window.innerWidth/7)
  //rotateX(phi);
  noFill();
  stroke(0);
  ellipse(0, 0,  diameter, diameter); 
    
  let x = radius * cos(phi);
  let y = radius * sin(phi);
  
  // rotate blue ball
  
  translate(x,y);   
  ellipse(0, 0, 4, 4); 
  translate(-x,-y);
  // rotate back


 
  line(-radius,0,radius,0) // x-axis
  line(0,-radius,0,radius) // y-axis

  strokeWeight(4);
  line(0,0,x,y) // hypothenuse
  line(0,0, x,0) // cos
  line(x,0,x,y) // sin
  strokeWeight(1);
  phi -= 1


  
}
  

function wobblingWave(){
  noFill();
  background(0,200,145);
  //rotateX(90 +counter);
  speedOfRotation = sin(counter/20)*100;
  rotateX(75);
  stroke(255,165,0);
  strokeWeight(5);
  for(var i = 0; i < 360; i+=10){
    beginShape();
    for(var j = 0; j < 360; j+=5){
      var rad = i/1.5;
      let x = rad * cos(j);
      let y = rad * sin(j);
      let z = 20*sin(frameCount*4 + i/2) ;
      counter += 0.001;
      vertex(x , y, z);
    }
    endShape(CLOSE)
  }

}