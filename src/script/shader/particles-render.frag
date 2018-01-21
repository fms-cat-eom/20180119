#define PARTICLE_LIFE_SPEED 2.0

#define HUGE 9E16
#define PI 3.14159265
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)

// ------

#extension GL_EXT_draw_buffers : require
precision highp float;

varying vec3 vPos;
varying vec3 vNor;
varying float vLife;
varying vec2 vShadowCoord;

uniform vec3 color;
uniform vec3 cameraPos;
uniform float cameraNear;
uniform float cameraFar;
uniform vec3 lightPos;

uniform sampler2D textureShadow;

// ------

float shadow( float d ) {
  float dc = length( vPos - lightPos );
  float ret = 0.0;
  for ( int iy = -1; iy <= 1; iy ++ ) {
    for ( int ix = -1; ix <= 1; ix ++ ) {
      vec2 uv = vShadowCoord + vec2( float( ix ), float ( iy ) ) * 0.001;
      float proj = texture2D( textureShadow, uv ).x;
      float bias = 1E-3 + ( 1.0 - d ) * 0.3;

      float dif = step( ( dc - proj ), bias );
      ret += dif / 9.0;
    }
  }
  return ret;
}

void main() {
  if ( vLife <= 0.0 ) { discard; }

  float depth = length( vPos - cameraPos );
  vec3 ld = normalize( vPos - lightPos );
  vec3 dif = 150.0 * vec3( 1.0 ) * (
    saturate( dot( -vNor, ld ) )
    / pow( length( vPos - lightPos ), 2.0 )
    * mix( 0.2, 1.0, shadow( dot( -vNor, ld ) ) )
  );
  vec3 rd = normalize( vPos - cameraPos );
  vec3 spe = 0.0 * vec3( 1.0 ) * vec3(
    pow( saturate( dot( -vNor, normalize( ld + rd ) ) ), 50.0 )
    / pow( length( vPos - lightPos ), 2.0 )
    * shadow( dot( -vNor, ld ) )
  );

  gl_FragData[ 0 ] = vec4( dif + spe, 1.0 );
  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );
}