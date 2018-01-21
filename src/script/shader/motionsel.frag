#define BLOCK_SIZE 8

// ------

precision highp float;

uniform vec2 resolution;
uniform float threshold;

uniform sampler2D samplerMotion;
uniform sampler2D samplerDry;
uniform sampler2D samplerMosh;

// ------

vec3 yuv2rgb( vec3 yuv ) {
  return vec3(
    yuv.x + 1.13983 * yuv.z,
    yuv.x - 0.39465 * yuv.y - 0.58060 * yuv.z,
    yuv.x + 2.03211 * yuv.y
  );
}

void main() {
  vec2 uv = floor( gl_FragCoord.xy ) / resolution;
  vec2 orig = 0.5 + floor( gl_FragCoord.xy / float( BLOCK_SIZE ) ) * float( BLOCK_SIZE );

  if ( threshold != 0.0 ) {
    float minV = 9E9;
    vec2 minP = vec2( 0.0 );
    vec3 minC = vec3( 0.0 );

    for ( int iy = 0; iy < BLOCK_SIZE; iy ++ ) {
      for ( int ix = 0; ix < BLOCK_SIZE; ix ++ ) {
        vec2 pDelta = vec2( float( ix ), float( iy ) );

        vec2 currUv = ( orig + pDelta ) / resolution;

        vec4 tex = texture2D( samplerMotion, currUv );
        float com = tex.w;
        if ( !( ix == BLOCK_SIZE / 2 && iy == BLOCK_SIZE / 2 ) ) {
          com += 1E-4;
        }

        if ( com < minV ) {
          minV = com;
          minP = vec2( float( ix ), float( iy ) ) - float( BLOCK_SIZE / 2 );
          minC = tex.xyz;
        }
      }
    }

    if ( minV < threshold ) {
      vec3 tex = texture2D( samplerMosh, ( gl_FragCoord.xy + minP ) / resolution ).xyz;
      tex += yuv2rgb( minC );
      gl_FragColor = vec4( tex, 1.0 );
      return;
    }
  }

  gl_FragColor = texture2D( samplerDry, uv );
  
  // float mCol = max( gl_FragColor.x, max( gl_FragColor.y, gl_FragColor.z ) );
  // if ( mCol < 0.1 + 1.0 * smoothstep( 0.9, 1.0, time ) ) {
  //   gl_FragColor = texture2D( textureImage, vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * uv );
  // }
}