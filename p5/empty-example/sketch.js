//global variables
let red = true;
let counter =0;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  angleMode(DEGREES);
} 
setup();
function draw() {
  noFill();
  background(0,200,145);
  //rotateX(90 +counter);
  speedOfRotation = sin(counter/10)*180;
  rotateY(speedOfRotation);
  rotateX(speedOfRotation);
  rotateZ(speedOfRotation);
  stroke(255,165,0);
  strokeWeight(5);
  for(var i = 0; i < 360; i+=20){
    beginShape();
    for(var j = 0; j < 360; j+=5){
      var rad = i;
      let x = rad * cos(j);
      let y = rad * sin(j);
      let z = 20*sin(frameCount*8 + i/2) ;
      counter += 0.001;
      vertex(x , y, z);
    }
    endShape(CLOSE)
  }

}
  

