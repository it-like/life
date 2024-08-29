/* Constants */
let angle = 0;
let time = 0;
const width = 1000;
const height = 1000;
let buffer;
let prevX = 0;
let prevY = 0;

function setup(){
    createCanvas(width, height);
    buffer = createGraphics(width, height);  // Create a separate graphics buffer
}

function draw(){
    
    clear();  
  
    let time_threshold = 1000;
    forierSeries(time, buffer);
    time  = increment(time, 2, time_threshold)

    if (time >= time_threshold){
        buffer.clear()
        prevX = 0; /* Reset coordiantes */
        prevY = 0;
        time = 0
    }
   
    image(buffer, 0, 0); 
}  
function increment(variable, increment_size, threshold){
    if (variable > threshold){
        variable = 0;
    }
    variable += increment_size;
    return variable
}

function drawCircle(theta){
    let x = 500 + 30 * cos(theta)
    let y = 500 + 30 * sin(theta)
   
    clear();  // Clear main canvas 
    fill(255)
    circle(500, 500, 60)
    line(x, y, width / 2, height / 2)
    circle(x, y, 10)
}

function drawSinWave(t, buff){
    let x = t*10 
    let y = 400 + 30 * sin(t)
    buff.circle(x, y, 1)
    
}

function forierSeries(time,buffer){
    const b_0 = 4/PI
    let sum = 0;
    /* Approximation for heavyside function f(x) = 100[H(x/L) - H(x/L - 1)] - 1 */
    const L = 1/20;
    for(i = 1; i<20; i += 2){
       sum += (200/i)*sin(i *PI*time*(L/2))
    }
    f = b_0 * sum

    x = time + 200
    y= f + 500
    buffer.circle(x,y,0)
    if(prevX){ /* Skips drawing from (0,0) */
        buffer.line(prevX, prevY, x, y)
    }

    prevX = x
    prevY = y
    
    
}
