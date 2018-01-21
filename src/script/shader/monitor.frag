#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)

precision highp float;

uniform float recoverBar;
uniform float recoverClose;
uniform float circleRadius;
uniform float circleSpin;
uniform float metaballRadius;

uniform float time;
uniform float frames;
uniform vec2 resolution;

uniform sampler2D samplerMonitorRecover;

bool uvvalid( vec2 v ) { return abs( v.x - 0.5 ) < 0.5 && abs( v.y - 0.5 ) < 0.5; }
vec2 uvflip( vec2 v ) { return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * v; }

// ------

float v2random( vec2 co ) {
    return fract( sin( dot( co.xy, vec2( 2.9898, 7.233 ) ) ) * 4838.5453 );
}

// ------

float smin( float a, float b, float k ) {
  float h = clamp( 0.5 + 0.5 * ( b - a ) / k, 0.0, 1.0 );
  return mix( b, a, h ) - k * h * ( 1.0 - h );
}

vec3 lissajous( vec3 _m ) {
  vec3 m = _m * PI * 2.0 * time;
  return vec3(
    sin( m.x ),
    sin( m.y ),
    sin( m.z )
  );
}

float distFunc( vec3 p ) {
  float ret = 1E9;
  float k = 0.7;
  ret = smin( ret, length( p - lissajous( vec3( 1.0, 2.0, 3.0 ) ) ) - metaballRadius, k );
  ret = smin( ret, length( p - lissajous( vec3( 3.0, -1.0, -1.0 ) ) ) - metaballRadius, k );
  ret = smin( ret, length( p - lissajous( vec3( -2.0, 3.0, -1.0 ) ) ) - metaballRadius, k );
  ret = smin( ret, length( p - lissajous( vec3( 4.0, -3.0, -2.0 ) ) ) - metaballRadius, k );
  ret = smin( ret, length( p - lissajous( vec3( 1.0, -4.0, 3.0 ) ) ) - metaballRadius, k );
  ret = smin( ret, length( p - lissajous( vec3( -3.0, 1.0, 4.0 ) ) ) - metaballRadius, k );
  return ret;
}

vec3 normalFunc( vec3 p ) {
  vec2 d = vec2( 0.0, 1E-3 );
  return normalize( vec3(
    distFunc( p + d.yxx ) - distFunc( p - d.yxx ),
    distFunc( p + d.xyx ) - distFunc( p - d.xyx ),
    distFunc( p + d.xxy ) - distFunc( p - d.xxy )
  ) );
}

float raymarch( vec2 p ) {
  vec3 rd = normalize( vec3( p, -1.0 ) );
  vec3 ro = vec3( 0.0, 0.0, 4.0 );
  float rl = 1E-2;
  vec3 rp = ro + rl * rd;

  float dist = 0.0;
  for ( int i = 0; i < 50; i ++ ) {
    dist = distFunc( rp );
    rl += dist * 0.8;
    rp = ro + rl * rd;
    if ( dist < 1E-3 || 10.0 < rl ) { break; }
  }

  if ( dist < 1E-2 ) {
    vec3 n = normalFunc( rp );
    return saturate( 0.3 + 0.7 * dot( n, normalize( vec3( 1.0 ) ) ) );
  }
  return 0.0;
}

// ------

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  float ret = 0.0;

  // recovering...
  if ( recoverClose < 0.9 ) {
    vec2 barI = vec2( 0.4, 0.03 - 0.06 * recoverClose );
    vec2 barOI = barI + 0.015;
    vec2 barOO = barI + 0.02;

    if ( all( lessThan( abs( uv - 0.5 ), barI ) ) ) {
      float recovering = texture2D( samplerMonitorRecover, uvflip( uv ) ).x;
      ret += uv.x < ( 0.1 + recoverBar * 0.8 ) ? 1.0 - recovering : recovering;
    }

    if (
      any( lessThan( barOI, abs( uv - 0.5 ) ) )
      && all( lessThan( abs( uv - 0.5 ), barOO ) )
      && sin( 200.0 * ( uv.x - uv.y - 0.3 * time ) ) < 0.9
    ) {
      ret += 1.0;
    }
  }

  // saint pepsi - winners circle
  {
    float layer = 90.0 * ( circleRadius - length( uv - 0.5 ) );
    if ( 0.0 < circleRadius && 0.0 < layer && layer < 9.0 ) {
      float layerI = floor( layer );
      float layerF = layer - layerI;

      float theta = ( atan( uv.y - 0.5, uv.x - 0.5 ) + PI ) / 2.0 / PI;
      float vel = ( v2random( vec2( layerI, 3.155 ) ) - 0.5 );
      float freq = 1.0 + floor( 64.0 * pow( v2random( vec2( layerI, 2.456 ) ), 2.0 ) );

      float phase = fract( ( theta + vel * circleSpin ) * 3.0 ) * freq;
      float phaseI = floor( phase );
      float phaseF = fract( phase );

      ret += 0.5 * (
        smoothstep( 0.0, 0.1, layerF ) * smoothstep( 0.7, 0.6, layerF )
        * v2random( vec2( layerI, phaseI ) ) < 0.5 ? 0.0 : 1.0
      );
    }
  }

  // metaball is fun
  {
    vec2 p = 12.0 * ( abs( uv - 0.5 ) - vec2( 0.40, 0.40 ) ) / ( 0.8 + 0.2 * saturate( metaballRadius ) );
    if ( all( lessThan( abs( p ), vec2( 1.0 ) ) ) ) {
      float rett = raymarch( p );

      if ( any( lessThan( vec2( 0.97 ), abs( p ) ) ) ) {
        rett = 1.0;
      }

      if (
        0.7 < min( abs( p.x ), abs( p.y ) )
        && 0.92 < max( abs( p.x ), abs( p.y ) )
      ) {
        rett = 1.0;
      }

      ret = mix( ret, rett, saturate( metaballRadius ) );
    }
  }

  gl_FragColor = vec4( vec3( 1.0 ), ret );
}
