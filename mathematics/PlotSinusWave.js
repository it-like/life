
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

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


    var amplitude = 80;
    var frequency = 20;
    //var period = 2 * Math.PI * 40 ; // P = 2pi/frequency
    
    
    if (x>=width){
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
    setTimeout(() => plotSine(ctx, x = x+1), 10);

}

plotSine(ctx)
//calculateXValues()