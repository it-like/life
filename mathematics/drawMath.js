
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
var canvasCenterX = canvas.width/2;
var canvasCenterY= canvas.height/2;

function calculateXValues(){
    for (let i = 0;i < 200; i++ ) {
        setTimeout(() => {
                console.log(i);
        }, i*10);
    }
   
}

function plotSine(ctx, x=0){
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;


    var amplitude = 100;
    var frequency = Math.PI*10;
    //var period = 2 * Math.PI * 40 ; // P = 2pi/frequency
    
    
    if (x>=width){
        // ctx.clearRect(0, 0, canvas.width, canvas.height); // reset canvas
        // x = 0
        return;
    };
    var y = height/2 + amplitude*Math.sin(x/frequency);

    if (x===0){
        ctx.beginPath();
        ctx.moveTo(x,y);
    } else{
        ctx.lineTo(x,y)
    }
    ctx.stroke();
    ctx.lineTo(canvasCenterX,canvasCenterY);
    ctx.stroke();
    setTimeout(() => plotSine(ctx, x = x+2),1);
}

function unitCircle (ctx,xPos, yPos, timeout, phi = 0 ){
    var radius = 1;
    xPos += radius * Math.cos(phi);
    yPos += radius * Math.sin(phi);
    
    
// if (phi >= Math.PI*2){
//     //ctx.clearRect(0, 0, canvas.width, canvas.height); 
//     return;
// }

// Draw first positon, otherwise connect to earlier position.
if (phi ===0){
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);
    }else{
        ctx.lineTo(xPos,yPos);
    }
    //ctx.stroke();
    
    if(timeout)
        {setTimeout(() => unitCircle(ctx, xPos, yPos, true, phi = phi+0.01),1)}
    else{
        unitCircle(ctx, xPos, yPos, false, phi = phi+0.01)}
    
    
}


plotSine(ctx)
//unitCircle(ctx,canvasCenterX, canvasCenterY, true, 0 );

//calculateXValues()