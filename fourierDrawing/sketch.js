let angle = 0;
let offset = 10;
let width = 1000;
let height = 1000;
function setup(){
    createCanvas(width, height);
}

function draw(){
    drawCircle(angle, offset)
   
    if (angle>2*Math.PI){
        angle = 0
    }
    angle += 0.02

}  

function drawCircle(theta){
    x =500 + 300 * Math.cos(theta)
    y =500 + 300 * Math.sin(theta)
   
    clear()
    fill('none')
    
    circle(500, 500, 600)
    line(x,y,width/2, height/2)
    circle(x,y,10)
    

}