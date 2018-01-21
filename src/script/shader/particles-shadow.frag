precision highp float;

varying float vLife;
varying vec3 vPos;
uniform vec3 lightPos;

uniform float cameraNear;
uniform float cameraFar;

// ------

void main() {
  if ( vLife <= 0.0 ) { discard; }

  gl_FragColor = vec4( length( vPos - lightPos ), 0.0, 0.0, 1.0 );
}