//Remove collapse
$('.collapse').off();

//Canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

//Variables
let x = 0;
let y = 0;

let cartesianX = 0;
let cartesianY = 0;

let originX = 250; //Origin of axes
let originY = 250;

const pixelScale = 15; //Number of pixels to a unit

const markDimension = 10; //Width of marks

let radians = false; //Angles in radians

//Input/Output elements
const xBox = document.querySelector("input[name='xCoordinate']");
const yBox = document.querySelector("input[name='yCoordinate']");
const cartesianOutput = document.querySelector('.cartesian-output');

const radialBox = document.querySelector("input[name='radialCoordinate']");
const angularBox = document.querySelector("input[name='angularCoordinate']");
const polarOutput = document.querySelector('.polar-output');

let outputCleared = false;

//Draw axes on grid
drawAxes();

function drawAxes() {
  //Clear canvas
  context.beginPath();
  context.rect(0, 0, 500, 500);
  context.fillStyle = '#f9f9f9';
  context.fill();

  //Vertical axis goes from (250, 10) to (250, 490)
  let yAxisStart_x = 250;
  let yAxisStart_y = 10;
  let yAxisEnd_x = 250;
  let yAxisEnd_y = 490;

  //Vertical arrow head
  let yArrowStart_x = 240;
  let yArrowStart_y = 20;
  let yArrowEnd_x = 260;
  let yArrowEnd_y = 20;

  //Horizontal axis goes from (10, 250) to (490, 250)
  let xAxisStart_x = 10;
  let xAxisStart_y = 250;
  let xAxisEnd_x = 490;
  let xAxisEnd_y = 250;

  //Horizontal arrow head
  let xArrowStart_x = 480;
  let xArrowStart_y = 240;
  let xArrowEnd_x = 480;
  let xArrowEnd_y = 260;

  //Draw vertical axis
  context.beginPath();
  context.moveTo(yAxisStart_x, yAxisStart_y);
  context.lineTo(yAxisEnd_x, yAxisEnd_y);
  context.closePath();
  context.stroke();

  //Draw vertical axis arrow head
  context.beginPath();
  context.moveTo(yArrowStart_x, yArrowStart_y);
  context.lineTo(yAxisStart_x, yAxisStart_y);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.moveTo(yAxisStart_x, yAxisStart_y);
  context.lineTo(yArrowEnd_x, yArrowEnd_y);
  context.closePath();
  context.stroke();

  //Draw vertical axis marks
  for(let i = 0; i < 455; i = i + pixelScale ) {
    context.beginPath();
    context.moveTo(originX, 25 + i);
    context.lineTo(originX + markDimension, 25 + i);
    context.closePath();
    context.stroke();
  }

  //Draw horizontal axis
  context.beginPath();
  context.moveTo(xAxisStart_x, xAxisStart_y);
  context.lineTo(xAxisEnd_x, xAxisEnd_y);
  context.closePath();
  context.stroke();

  //Draw horizontal axis arrow head
  context.beginPath();
  context.moveTo(xArrowStart_x, xArrowStart_y);
  context.lineTo(xAxisEnd_x, xAxisEnd_y);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.moveTo(xAxisEnd_x, xAxisEnd_y);
  context.lineTo(xArrowEnd_x, xArrowEnd_y);
  context.closePath();
  context.stroke();

  //Draw horizontal axis marks
  for(let i = 0; i < 455; i = i + pixelScale ) {
    context.beginPath();
    context.moveTo(25 + i, originY);
    context.lineTo(25 + i, originY + markDimension);
    context.closePath();
    context.stroke();
  }
}

//Get mouse position when click on canvas
canvas.addEventListener('click', function(e) {
  drawAxes();
  getMousePosition(this, e);
  drawPoint(this);
  outputCleared = false;
  outputCartesian();
  outputPolar();
});

//Get the position of the mouse in Cartesian coordinates
function getMousePosition(canvasEl, e) {
  let rect = canvas.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;

    //Find the Cartesian coordinates in pixels from the origin
    let pixelX = x - originX;
    let pixelY = originY - y;

  //Scale the pixel units into actual Cartesian units

  cartesianX = Math.round(pixelX/pixelScale);
  cartesianY = Math.round(pixelY/pixelScale);
}

//Draw the point
function drawPoint(canvasEl) {
  context.lineWidth = 3;

  let pointX = cartesianX*pixelScale + originX;
  let pointY = originY - cartesianY*pixelScale;

  //Draw a red line from the origin to the point
  context.beginPath();
  context.moveTo(originX, originY);
  context.lineTo(pointX, pointY);
  context.closePath();
  context.strokeStyle = 'red';
  context.stroke();

  //Draw a horizontal line from the vertical axis to the point
  context.beginPath();
  context.moveTo(originX, pointY);
  context.lineTo(pointX, pointY);
  context.closePath();
  context.strokeStyle = '#002060';
  context.stroke();

  //Draw a vertical line from the horizontal axis to the point
  context.beginPath();
  context.moveTo(pointX, originY);
  context.lineTo(pointX, pointY);
  context.closePath();
  context.strokeStyle = '#002060';
  context.stroke();

  //Draw a cross
  context.beginPath();
  context.moveTo(pointX - 5, pointY - 5);
  context.lineTo(pointX + 5, pointY + 5);
  context.closePath();
  context.strokeStyle = 'black';
  context.stroke();

  context.beginPath();
  context.moveTo(pointX + 5, pointY - 5);
  context.lineTo(pointX - 5, pointY + 5);
  context.closePath();
  context.stroke();

  context.lineWidth = 1;
}

//Print out the coordinates in Cartesian form to the user
function outputCartesian() {

  //Output Cartesian coordinates to text boxes
  xBox.value = cartesianX;
  yBox.value = cartesianY;

  //Output sentences
  cartesianOutput.innerText = `The Cartesian coordinate of the point is
  (${cartesianX}, ${cartesianY})`;
}

//Print out the coordinates in polar form to the user
function outputPolar() {

  //Output radial coordinate to text
  const polarR = roundExtra(Math.sqrt(cartesianX*cartesianX + cartesianY*cartesianY), 2);

  //Find angle in radians and degrees
  let theta = roundExtra(Math.atan2(cartesianY,cartesianX), 2);

  //Angle between 0 and 360 degrees (or 0 and 2 pi radians)
  if (theta >= 0) {
    theta = theta;
  } else {
    theta = 2*Math.PI + theta;
  }

  const polarThetaRadians = roundExtra(theta, 2);
  const polarThetaDegrees = Math.round(polarThetaRadians*180/Math.PI);
  let polarTheta = '';

  if (outputCleared == false) {
    radialBox.value = polarR;

    if (radians == false) {
      polarTheta = polarThetaDegrees + '°';
    } else {
      polarTheta = polarThetaRadians + ' radians';
    }

    angularBox.value = polarTheta;

    //Output sentences
    polarOutput.innerText = `The polar coordinate of the point is
    (${polarR}, ${polarTheta})`;
  }
}

//Round number to decimal places
function roundExtra(number, precision) {
  //Find power of 10 to appropriate number of decimal places

  const factor = Math.pow(10, precision);
  //Multiply number so the decimal place to be rounded is the unit

  let tempValue = number*factor;
  //Round the number
  tempValue = Math.round(tempValue);

  //Divide by the power of 10 to make the appropriate decimal
  return tempValue/factor;
}

//Get unit of angle
const toggleButton =document.querySelector('input[type=\'checkbox\']');

toggleButton.addEventListener('click', function() {
  radians = toggleButton.checked;
  outputPolar();
})

//Clear button
const clearButton = document.querySelector('.clear-button');


function clearCartesian() {
  xBox.value = '';
  yBox.value = '';

  cartesianX = '';
  cartesianY = '';

  cartesianOutput.innerText = '';
}

function clearPolar() {
  radialBox.value = '';
  angularBox.value = '';

  polarTheta = '';
  theta = '';
  polarThetaRadians = '';
  polarThetaDegrees = '';
  polarR = '';

  polarOutput.innerText = '';
}

clearButton.addEventListener('click', function() {
  //Clear graph
  drawAxes();

  //Clear output
  outputCleared = true;

  clearCartesian();
  clearPolar();
})

//Plot from Cartesian input
const plotCartesianButton = document.querySelector('.cartesian-plot');

plotCartesianButton.addEventListener('click', function(e) {
  //Clear graph
  drawAxes();

  //Get Cartesian coordinates from text boxes
  cartesianX = xBox.value;
  cartesianY = yBox.value;

  //Draw point
  drawPoint();

  //Print out the polar coordinates to the user
  outputPolar();

  //Output sentence
  cartesianOutput.innerText = `The Cartesian coordinate of the point is
  (${cartesianX}, ${cartesianY})`;
});

//Plot from polar input
const plotPolarButton = document.querySelector('.polar-plot');

plotPolarButton.addEventListener('click', function(e) {
  //Clear graph
  drawAxes();

  //Get radial coordinate from text box
  polarR = radialBox.value;

  //Get angular coordinate from text box

  //Ensure there is no degree symbol
  let tempTheta = angularBox.value;

  //Check if last character of angular coordinate is °
  if(tempTheta.charAt(tempTheta.length - 1) == '°') {
    //Remove ° from end of string
    tempTheta = tempTheta.slice(0, tempTheta.length - 1);
  }

  //Use string with ° removed
  polarTheta = tempTheta;

  //Convert polar coordinates to Cartesian coordinates
  if(!radians) {
    cartesianX = roundExtra(polarR*Math.cos(polarTheta*Math.PI/180),2);
    cartesianY = roundExtra(polarR*Math.sin(polarTheta*Math.PI/180),2);
  } else {
    cartesianX = roundExtra(polarR*Math.cos(polarTheta),2);
    cartesianY = roundExtra(polarR*Math.sin(polarTheta), 2);
  }

  //Draw point
  drawPoint();

  //Print out the Cartesian coordinates to the user
  outputCartesian();

  //Output sentence
    polarOutput.innerText = `The polar coordinate of the point is
    (${polarR}, ${polarTheta})`;
});