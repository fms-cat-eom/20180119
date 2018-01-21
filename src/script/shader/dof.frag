#define BOKEH 20.0
#define BOKEH_MAX 3.0
#define FOG 0.01
#define SAMPLES 4
#define SAMPLE_INTERVAL 4.0
#define R_SAMPLES 6
#define R_INTERVAL 1.0
#define T_SAMPLES 6

#define V vec2(0.,1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,j) floor((i)/(j))*(j)
#define PI 3.14159265
#define TAU 6.28318531

// ------

precision highp float;

uniform vec2 resolution;
uniform sampler2D sampler0;
uniform sampler2D samplerPreDof;
uniform sampler2D samplerDepth;
uniform vec4 bgColor;
uniform float focus;

float gaussian( float _x, float _v ) {
  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec3 sum = V.xxx;
  vec3 ccol = vec3( 0.0 );
  float clen = 1E9;
  for ( int ir = 0; ir < R_SAMPLES; ir ++ ) {
    for ( int it = 0; it < T_SAMPLES; it ++ ) {
      float theta = TAU * float( it ) / float( T_SAMPLES );
      vec2 delta = R_INTERVAL * float( ir ) * vec2( cos( theta ), sin( theta ) );
      bool center = ir == 0;
      vec2 v = saturate( uv + SAMPLE_INTERVAL * delta / resolution );

      float len = texture2D( samplerDepth, v ).x;
      float crate = smoothstep( 0.0, 1.0, len - clen );
      len = mix( len, clen, crate );

      float gauss = min( BOKEH * abs( 1.0 / focus - 1.0 / len ), BOKEH_MAX );
      float mul = mix(
        center ? 1.0 : 0.0,
        gaussian( abs( delta.x ), gauss ) * gaussian( abs( delta.y ), gauss ),
        saturate( gauss )
      );

      vec3 tex = mix(
        texture2D( samplerPreDof, v ),
        texture2D( sampler0, v ),
        smoothstep( 0.0, 0.2, mul )
      ).xyz;
      vec3 col = mix(
        mix( bgColor.xyz, tex, exp( -len * FOG ) ),
        ccol,
        crate
      );

      sum += col * saturate( mul );

      if ( center ) {
        clen = len;
        ccol = col;
        break;
      }
    }
  }

  gl_FragColor = vec4( sum, 1.0 );
}
