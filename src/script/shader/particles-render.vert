#define HUGE 9E16
#define PI 3.14159265
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,m) (floor((i)/(m))*(m))

// ------

attribute vec3 vuv;

varying vec3 vPos;
varying vec3 vNor;
varying float vLife;
varying vec2 vShadowCoord;

uniform vec2 resolution;
uniform vec2 resolutionPcompute;
uniform vec3 cameraPos;
uniform float cameraRot;
uniform float cameraFov;
uniform float vertsPerParticle;
uniform mat4 matP;
uniform mat4 matV;
uniform mat4 matPL;
uniform mat4 matVL;

uniform sampler2D texturePcompute;
uniform sampler2D textureOctPos;
uniform sampler2D textureOctNor;

// ------

mat2 rotate2D( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

void main() {
  vec2 puv = ( vuv.xy + 0.5 ) / resolutionPcompute;
  vec2 dppix = vec2( 1.0 ) / resolutionPcompute;

  vec4 pos = texture2D( texturePcompute, puv );
  vec4 vel = texture2D( texturePcompute, puv + dppix * vec2( 1.0, 0.0 ) );
  vec4 rot = texture2D( texturePcompute, puv + dppix * vec2( 2.0, 0.0 ) );

  vec3 octPos = texture2D( textureOctPos, vec2( ( vuv.z + 0.5 ) / vertsPerParticle, 0.5 ) ).xyz;
  vec3 octNor = texture2D( textureOctNor, vec2( ( vuv.z + 0.5 ) / vertsPerParticle, 0.5 ) ).xyz;

  octPos.yz = rotate2D( rot.x ) * octPos.yz;
  octPos.zx = rotate2D( rot.y ) * octPos.zx;
  octNor.yz = rotate2D( rot.x ) * octNor.yz;
  octNor.zx = rotate2D( rot.y ) * octNor.zx;

  octPos.xyz *= 0.5 * (
    vel.w * sin( PI * pos.w ) *
    ( 1.0 - exp( -length( cameraPos - pos.xyz ) ) )
  );
  pos.xyz += octPos.xyz;

  vPos = pos.xyz;
  vNor = octNor.xyz;
  vLife = pos.w;

  vec4 posFromLight = matPL * matVL * vec4( pos.xyz, 1.0 );
  vShadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;

  vec4 outPos = matP * matV * vec4( pos.xyz, 1.0 );
  gl_Position = outPos;
}