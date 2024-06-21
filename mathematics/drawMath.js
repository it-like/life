 
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight/1.5;

var canvasCenterX = canvas.width/2;
var canvasCenterY= canvas.height/2;

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


function unitCircle(ctx, xPos, yPos, phi) {
    const radius = 1;
    if (phi <= Math.PI * 2) {
        xPos += radius * Math.cos(phi);
        yPos += radius * Math.sin(phi);

        // Draw first position, otherwise connect to earlier position.
        if (phi === 0) {
            ctx.beginPath();
            ctx.moveTo(xPos, yPos);
        } else {
            ctx.lineTo(xPos, yPos);
        }
        ctx.stroke();

        // Recursively draw next point
        unitCircle(ctx, xPos, yPos, phi + 0.1);
    }else {
        phi = 0;
        movingBall(ctx, phi, xPos, yPos)
    }
}
function animateBall(ctx, centerX, centerY, radius) {
    let phi = 0;
    setInterval(() => {
        //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let xPos = centerX + radius * Math.cos(phi);
        let yPos = centerY + radius * Math.sin(phi);

        ctx.beginPath();
        ctx.arc(xPos, yPos, 0, 0, Math.PI * 2, false);
        //ctx.fill();
        ctx.stroke();

        phi += 0.1;
        if (phi >= 2 * Math.PI) {
            phi = 0;
        }
    }, Math.PI/2);
}
plotSine(ctx)

//unitCircle(ctx,canvasCenterX, canvasCenterY, 0 );
//plotSine(ctx)
//animateBall(ctx, canvasCenterX, canvasCenterY/8, 0);

//calculateXValues()
