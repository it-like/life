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
  wobblingWave();
  //stiroGraph();
  
}


function stiroGraph() {
  background('orange'); 
  const diameter =20
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
  //rotateX(counter/20);
  rotateY(counter/20 + 20);
  rotateX(45)
  speedOfRotation = sin(counter/20)*100;
  stroke(255,165,0);
  strokeWeight(5);
  for(var i = 0; i < 360; i+=5){
    beginShape();
    let interp = map(i, 0, 500, 0,1);
      let r = lerp(0, 255, interp);
      stroke(r, 0,0);
    for(var j = 0; j < 360; j+=10){
      var rad = i/1.5;
      let x = rad * cos(j);
      let y = rad * sin(j);
      let z = 40*sin(frameCount*3 +i) ;
      counter += 0.01;
      vertex(x , y, z);
    }
    endShape(CLOSE)
  }

}

function plotSine(ctx, x=0){
  var width = ctx.canvas.width;
  var height = ctx.canvas.height/2;

  var amplitude = 100;
  var frequency = ctx.canvas.width/(Math.PI*22);
  //var period = 2 * Math.PI * 40 ; // P = 2pi/frequency
  
  if (x>=width){
      // ctx.clearRect(0, 0, canvas.width, canvas.height); // reset canvas
      //  x = 0;
      x= 0;
  };

  var y = height + amplitude*Math.sin(x/frequency + Math.PI/2 );

  if (x===0){
      ctx.beginPath();
      ctx.moveTo(x,y);
  }

  ctx.lineTo(x,y)
  ctx.stroke();
  ctx.lineTo(canvasCenterX, canvasCenterY*2);
  ctx.stroke();
  setTimeout(() => plotSine(ctx, x = x+3),1);
}