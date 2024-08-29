/* Constants */
let angle = 0;
let time = 0;
const width = 1000;
const height = 800;
let buffer;
let prevX = 0;
let prevY = 0;
let prevX2 = 0;
let prevY2 = 0;

function setup(){
    createCanvas(width, height);
    buffer = createGraphics(width, height);  // Create a separate graphics buffer
}

function draw(){
    clear();  

    let time_threshold = 500;

    fourierSeries(time, buffer,  24);
    

    time  = increment(time, 0.1, time_threshold)

    if (time >= time_threshold){
        buffer.clear()
        prevX = 0; 
        prevY = 0;
        prevX2 = 0;
        prevY2 = 0;
        time = 0;
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


function fourierSeries(time,buffer, iterations){
    const b_0 = 4/PI
    let sum = 0;
    let sum2 = 0;
    let amplitudes = [];
    const radius = 100;
    let periods = [];
    /* Approximation for heavyside function f(x) = 100[H(x/L) - H(x/L - 1)] - 1 */
    const L = 1/20;
    for(i = 1; i <= iterations; i += 2){ 
        amplitude = (radius/i)
        currentPeriod = i*PI*(L/2) * time
        amplitudes.push(amplitude) /* List of fourier values */
        periods.push(currentPeriod)
        sum += amplitude*sin(currentPeriod)
        circle(300, 500 , radius*2*b_0)
    }

    for(i = 1; i <= 1000000; i += 2){ 
        sum2 += (radius/i)*sin(i*PI*(L/2) * time)
    }

    f = b_0 * sum /* Fourier approximation */
    x = time + 500
    y= f + 500


    f2 = b_0 * sum2
    x2 = time + 500
    y2 = f2 + 200


circle_X = 300 + amplitudes[0]*cos(periods[0])*b_0;
circle_Y = 500 + amplitudes[0]*sin(periods[0])*b_0;

line(300, 500, circle_X,circle_Y) /* inside circle, center to edge*/


amplitudes.forEach(function (item, index){
    if(index > 0 && amplitudes.length -1 != index){
        var nextX = circle_X + item*cos(periods[index])*b_0
        var nextY = circle_Y + item*sin(periods[index])*b_0
        line(circle_X, circle_Y, nextX, nextY)
        circle(circle_X, circle_Y , item*b_0/2)

        circle_X = nextX
        circle_Y = nextY
    }
});
lastx = circle_X + amplitudes[amplitudes.length - 1] * cos(periods[periods.length - 1])*b_0;
lasty = circle_Y + amplitudes[amplitudes.length - 1] * sin(periods[periods.length - 1])*b_0;



line(circle_X , circle_Y, lastx , lasty) 
circle(circle_X, circle_Y ,  amplitudes[amplitudes.length - 1]*b_0/2)
line(lastx, lasty, x,y)
circle(lastx, lasty ,  amplitudes[amplitudes.length - 1]*b_0/2)



    if(prevX){ /* Skips drawing from (0,0) */
        buffer.line(prevX, prevY, x, y)
      
    }
    if(prevX2){
        buffer.line(prevX2,prevY2,x2,y2)
    }

    
    prevX2 = x2
    prevY2 = y2
    prevX = x
    prevY = y 
    

}






/* Old Functions */


function drawSinWave(t, buff){
    let x = t*10 
    let y = 400 + 30 * sin(t)
    buff.circle(x, y, 1)
    
}