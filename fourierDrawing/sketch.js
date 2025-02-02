/* Constants */
let elapsedTime = 0;
const width = 5000;
const height = 1000;
let curveBuffer, ballBuffer;
let prevX = 0, prevY = 0, prevX2 = 0, prevY2 = 0;
let LSlider, speedSlider;
let ballColor;
let prevIterations;

function setup() {
  createCanvas(width, height);
  curveBuffer = createGraphics(width, height);
  ballBuffer = createGraphics(width, height);

  // Approximations slider
  LSlider = createSlider(2, 200, 1, 2);
  LSlider.position(0, 50);
  LSlider.style('width', '480px');

  // Speed slider
  speedSlider = createSlider(1, 50, 1, 0.1);
  speedSlider.position(0, 100);
  speedSlider.style('width', '480px');

  ballColor = color(123, 123, 200);
  prevIterations = LSlider.value();
}

function draw() {
  clear();
  let timeThreshold = 500;
  let iters = LSlider.value();

  textSize(16);
  text('Approximations = ' + (iters / 2), LSlider.x + 1, LSlider.y - 35);
  text('Rotation Speed = ' + nf(speedSlider.value(), 1, 1), speedSlider.x + 1, speedSlider.y - 35);



  // Draw the Fourier series and get final ball info.
  let ballData = fourierSeries(elapsedTime, curveBuffer, iters, true);

  // Increment time based on speed slider.
  elapsedTime = increment(elapsedTime, speedSlider.value() * 0.1, timeThreshold);

  // Reset the curveBuffer periodically.
  if (elapsedTime >= timeThreshold) {
    curveBuffer.clear();
    prevX = prevY = prevX2 = prevY2 = 0;
    elapsedTime = 0;
  }

  image(curveBuffer, 0, 0);
  image(ballBuffer, 0, 0);
}

function increment(variable, incrementSize, threshold) {
  if (variable > threshold) variable = 0;
  return variable + incrementSize;
}

// fourierSeries now returns the final ball's coordinates and diameter.
// When drawBall is false, it draws without rendering the final ball.
function fourierSeries(time, buffer, iterations, drawBall) {
  const b0 = 2.5 / PI;
  let sum = 0;
  let circleX = 500;
  let amplitudes = [];
  const radius = 200;
  let periods = [];

  const L = 1 / 30;
  for (let i = 1; i <= iterations; i += 2) { 
    let amplitude = radius / i;
    let currentPeriod = i * PI * (L / 2) * time;
    amplitudes.push(amplitude);
    periods.push(currentPeriod);
    sum += amplitude * sin(currentPeriod);
    circle(circleX, 500, radius * 2 * b0);
  }

  let f = b0 * sum;
  let x = time + 1000;
  let y = f + 500;

  let posX = circleX + amplitudes[0] * cos(periods[0]) * b0;
  let posY = 500 + amplitudes[0] * sin(periods[0]) * b0;

  line(circleX, 500, posX, posY);

  if (iterations <= 2) {
    line(posX, posY, x, y);
    if (drawBall) {
      fill(ballColor);
      circle(posX, posY, 26.525823848649228);
    }
    var finalBall = { x: posX, y: posY, diameter: 26.525823848649228 };
  } else {
    for (let index = 0; index < amplitudes.length; index++) {
      if (index > 0 && index < amplitudes.length - 1) {
        let nextX = posX + amplitudes[index] * cos(periods[index]) * b0;
        let nextY = posY + amplitudes[index] * sin(periods[index]) * b0;
        line(posX, posY, nextX, nextY);
        circle(posX, posY, amplitudes[index] * b0 / 2);
        posX = nextX;
        posY = nextY;
      }
    }

    let lastX = posX + amplitudes[amplitudes.length - 1] * cos(periods[periods.length - 1]) * b0;
    let lastY = posY + amplitudes[amplitudes.length - 1] * sin(periods[periods.length - 1]) * b0;

    line(posX, posY, lastX, lastY);
    circle(posX, posY, amplitudes[amplitudes.length - 1] * b0 / 2);
    line(lastX, lastY, x, y);
    if (drawBall) {
      let dia = amplitudes[amplitudes.length - 1] * b0 / 4;
  
      circle(lastX, lastY, dia);
      var finalBall = { x: lastX, y: lastY, diameter: dia };
    }
  }

  if (prevX) buffer.line(prevX, prevY, x, y);
  if (prevX2) buffer.line(prevX2, prevY2, x, y);

  prevX2 = x; prevY2 = y; prevX = x; prevY = y;
  return finalBall || { x: x, y: y, diameter: 26.525823848649228 };
}

function drawSinWave(t, buff) {
  let x = t * 10;
  let y = 400 + 30 * sin(t);
  buff.circle(x, y, 1);
}
