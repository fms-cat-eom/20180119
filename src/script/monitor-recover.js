let canvas = document.createElement( 'canvas' );
let canvasSize = 1024;
canvas.width = canvasSize;
canvas.height = canvasSize;

let context = canvas.getContext( '2d' );
context.textAlign = 'center';
context.textBaseline = 'middle';
context.font = '900 ' + canvasSize / 20.0 + 'px Times New Roman';

context.fillStyle = '#000';
context.fillRect( 0, 0, canvasSize, canvasSize );

context.fillStyle = '#fff';
context.fillText(
  "R  E  C  O  V  E  R  I  N  G",
  canvasSize / 2,
  canvasSize / 2
);

export default canvas;
