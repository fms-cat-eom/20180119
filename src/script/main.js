import xorshift from './lib/xorshift';
import GLCat from './lib/glcat';
import CatMath from './lib/catmath';
import Path from './lib/glcat-path-gui';
import step from './lib/step';
import Tweak from './lib/tweak';

import octahedron from './octahedron';
import monitorRecover from './monitor-recover';
import { fail } from 'assert';

const glslify = require( 'glslify' );

// ------

xorshift( 347895017458906 );

const clamp = ( _value, _min, _max ) => Math.min( Math.max( _value, _min ), _max );
const saturate = ( _value ) => clamp( _value, 0.0, 1.0 );

// ------

let frames = 200;
let automaton = new Automaton( {
  gui: divAutomaton,
  fps: frames,
  data: `
  {"rev":20170418,"length":1,"resolution":1000,"params":{"cameraRot":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"focus":[{"time":0,"value":1.849002511160713,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.07951070336391437,"value":16.31777912775675,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":0.25891946992864423,"value":5.684655321212041,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":0.4923547400611621,"value":9.428193046933128,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":0.7981651376146789,"value":6.110135829377761,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":2.577551941786524,"mode":2,"params":{},"mods":[false,false,false,false]}],"cameraX":[{"time":0,"value":1.580264486585346,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.8318042813455657,"value":9.819063391417341,"mode":4,"params":{"rate":18,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":-11.83736895152501,"mode":5,"params":{"gravity":420,"bounce":0.3},"mods":[false,false,false,false]}],"cameraY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":2.11778629872628,"mode":4,"params":{"rate":8,"damp":1},"mods":[false,false,false,false]}],"cameraZ":[{"time":0,"value":38.34969060665796,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.2579001019367992,"value":13.153491821140062,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]},{"time":0.829459734964322,"value":4.3283915442425585,"mode":4,"params":{"rate":28.36,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":-9.902416705553017,"mode":5,"params":{"gravity":110.086,"bounce":0.3},"mods":[false,false,false,false]}],"cameraTX":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTZ":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"moshThreshold":[{"time":0,"value":0.9589370381735667,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.07849133537206937,"value":0.004761904761904745,"mode":4,"params":{"rate":7500.042,"damp":1},"mods":[false,false,false,false]},{"time":0.09276248725790011,"value":-0.023809523809523836,"mode":2,"params":{},"mods":[{"velocity":0},false,false,false]},{"time":0.5178389398572885,"value":0,"mode":2,"params":{},"mods":[{"velocity":0},false,false,false]},{"time":0.7573904179408767,"value":0.2654369535900294,"mode":4,"params":{"rate":240,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":1.412358225456306,"mode":5,"params":{"gravity":31,"bounce":0.3},"mods":[false,false,false,false]}],"recoverBar":[{"time":0,"value":0.20952380952380956,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.05708460754332314,"value":0.2142857142857142,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.15086646279306828,"value":1.019047619047619,"mode":4,"params":{"rate":4300,"damp":1},"mods":[false,false,false,false]},{"time":0.9001019367991845,"value":0,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0.04761904761904767,"mode":1,"params":{},"mods":[false,false,false,false]}],"recoverClose":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.2222222222222222,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.583078491335372,"value":0.9952380952380951,"mode":4,"params":{"rate":5800,"damp":1},"mods":[false,false,false,false]},{"time":0.9011213047910296,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":29000,"damp":1},"mods":[false,false,false,false]}],"circleRadius":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.109072375127421,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.8979806320081549,"value":0.5386718749999997,"mode":4,"params":{"rate":3000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":13000,"damp":1},"mods":[false,false,false,false]}],"circleSpin":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.06931702344546381,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.48827726809378186,"value":1.7184151785714272,"mode":4,"params":{"rate":93,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":2.0313337053571425,"mode":1,"params":{},"mods":[false,false,false,false]}],"metaballRadius":[{"time":0,"value":-0.9214285714285715,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.1559633027522936,"value":-0.8797619047619046,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.3200815494393476,"value":1,"mode":4,"params":{"rate":5800,"damp":1},"mods":[false,false,false,false]},{"time":0.8786952089704383,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":-2.775687081473208,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}]},"gui":{"snap":{"enable":false,"bpm":"60","offset":"0"}}}
`
} );
let auto = automaton.auto;

// ------

let width = 400;
let height = 400;
canvas.width = width;
canvas.height = height;

let gl = canvas.getContext( 'webgl' );
let glCat = new GLCat( gl );
glCat.getExtension( "OES_texture_float", true );
glCat.getExtension( "OES_texture_float_linear", true );
glCat.getExtension( "EXT_frag_depth", true );
glCat.getExtension( "WEBGL_draw_buffers", true );

let glCatPath = new Path( glCat, {
  drawbuffers: true,
  el: divPath,
  canvas: canvas,
  stretch: true
} );

// ------

let tweak = new Tweak( divTweak );

// ------

let totalFrames = 0;
let init = true;

// ------

let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );
let vboQuadUV = glCat.createVertexbuffer( [ 0, 0, 1, 0, 0, 1, 1, 1 ] );
let vboQuad3 = glCat.createVertexbuffer( [ -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0 ] );

let oct = octahedron( 1 );
let textureOctPos = glCat.createTexture();
glCat.setTextureFromFloatArray( textureOctPos, oct.pos.length / 4, 1, oct.pos );
let textureOctNor = glCat.createTexture();
glCat.setTextureFromFloatArray( textureOctNor, oct.pos.length / 4, 1, oct.nor );

let particlePixels = 3;
let particlesSqrt = 128;
let particles = particlesSqrt * particlesSqrt;
let vertsPerParticle = oct.pos.length / 4;

let vboParticle = glCat.createVertexbuffer( ( () => {
  let ret = [];
  for ( let i = 0; i < particlesSqrt * particlesSqrt * vertsPerParticle; i ++ ) {
    let ix = Math.floor( i / vertsPerParticle ) % particlesSqrt;
    let iy = Math.floor( i / particlesSqrt / vertsPerParticle );
    let iz = i % vertsPerParticle;
    
    ret.push( ix * particlePixels );
    ret.push( iy );
    ret.push( iz );
  }
  return ret;
} )() );

// ------

let textureRandomSize = 256;

let textureRandomUpdate = ( _tex ) => {
  glCat.setTextureFromArray( _tex, textureRandomSize, textureRandomSize, ( () => {
    let len = textureRandomSize * textureRandomSize * 4;
    let ret = new Uint8Array( len );
    for ( let i = 0; i < len; i ++ ) {
      ret[ i ] = Math.floor( xorshift() * 256.0 );
    }
    return ret;
  } )() );
};

let textureRandomStatic = glCat.createTexture();
glCat.textureWrap( textureRandomStatic, gl.REPEAT );
textureRandomUpdate( textureRandomStatic );

let textureRandom = glCat.createTexture();
glCat.textureWrap( textureRandom, gl.REPEAT );

let textureMonitorRecover = glCat.createTexture();
glCat.setTexture( textureMonitorRecover, monitorRecover );

// ------

let framebuffersGauss = [
  glCat.createFloatFramebuffer( width / 4, height / 4 ),
  glCat.createFloatFramebuffer( width / 4, height / 4 ),
  glCat.createFloatFramebuffer( width / 4, height / 4 )
];

let framebufferPreDof = glCat.createFloatFramebuffer( width, height );

let framebufferMotionPrev = glCat.createFramebuffer( width, height );
let framebufferMotionMosh = glCat.createFramebuffer( width, height );

// ------

let renderA = document.createElement( 'a' );

let saveFrame = () => {
  renderA.href = canvas.toDataURL( 'image/jpeg' );
  renderA.download = ( '0000' + totalFrames ).slice( -5 ) + '.jpg';
  renderA.click();
};

// ------

let mouseX = 0.0;
let mouseY = 0.0;

// ------

let cameraPos = [ 0.0, 0.0, 0.0 ];
let cameraTar = [ 0.0, 0.0, 0.0 ];
let cameraRot = 0.0;
let cameraFov = 90.0;

let cameraNear = 0.01;
let cameraFar = 100.0;

let lightPos = [ 10.0, 10.0, 10.0 ];

let matP;
let matV;
let matPL;
let matVL;

let updateMatrices = () => {
  matP = CatMath.mat4Perspective( cameraFov, width / height, cameraNear, cameraFar );
  matV = CatMath.mat4LookAt( cameraPos, cameraTar, [ 0.0, 1.0, 0.0 ], cameraRot );

  matPL = CatMath.mat4Perspective( 70.0, 1.0, cameraNear, cameraFar );
  matVL = CatMath.mat4LookAt( lightPos, cameraTar, [ 0.0, 1.0, 0.0 ], 0.0 );
};
updateMatrices();

// ------

let bgColor = [ 0.4, 0.4, 0.4, 1.0 ];

// ------

glCatPath.setGlobalFunc( () => {
  glCat.uniform1i( 'init', init );
  glCat.uniform1f( 'time', automaton.time );
  glCat.uniform1f( 'deltaTime', automaton.deltaTime );
  glCat.uniform3fv( 'cameraPos', cameraPos );
  glCat.uniform1f( 'cameraRot', cameraRot );
  glCat.uniform1f( 'cameraFov', cameraFov );
  glCat.uniform1f( 'cameraNear', cameraNear );
  glCat.uniform1f( 'cameraFar', cameraFar );
  glCat.uniform3fv( 'lightPos', lightPos );
  glCat.uniform1f( 'particlesSqrt', particlesSqrt );
  glCat.uniform1f( 'particlePixels', particlePixels );
  glCat.uniform1f( 'frame', automaton.frame % frames );
  glCat.uniform1f( 'frames', frames );
  glCat.uniform1f( 'vertsPerParticle', vertsPerParticle );
  glCat.uniformMatrix4fv( 'matP', matP );
  glCat.uniformMatrix4fv( 'matV', matV );
  glCat.uniformMatrix4fv( 'matPL', matPL );
  glCat.uniformMatrix4fv( 'matVL', matVL );
  glCat.uniform4fv( 'bgColor', bgColor );
} );

glCatPath.add( {
  return: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  こんにちは: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bg.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    framebuffer: true,
    drawbuffers: 2,
    float: true,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  particlesComputeReturn: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'texture', glCatPath.fb( "particlesCompute" ).texture, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  particlesCompute: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/particles-compute.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'textureReturn', glCatPath.fb( "particlesComputeReturn" ).texture, 0 );
      glCat.uniformTexture( 'textureRandom', textureRandom, 1 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  particlesShadow: {
    width: 1024,
    height: 1024,
    vert: glslify( './shader/particles-render.vert' ),
    frag: glslify( './shader/particles-shadow.frag' ),
    framebuffer: true,
    float: true,
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    func: () => {
      glCat.attribute( 'vuv', vboParticle, 3 );
      glCat.uniformMatrix4fv( 'matV', matVL );
      glCat.uniformMatrix4fv( 'matP', matPL );
      glCat.uniform2fv( 'resolutionPcompute', [ particlesSqrt * particlePixels, particlesSqrt ] );
      glCat.uniformTexture( 'texturePcompute', glCatPath.fb( "particlesCompute" ).texture, 0 );
      glCat.uniformTexture( 'textureOctPos', textureOctPos, 2 );
      glCat.uniformTexture( 'textureOctNor', textureOctNor, 3 );
      gl.drawArrays( gl.TRIANGLES, 0, particles * vertsPerParticle );
    }
  },
  
  particlesRender: {
    width: width,
    height: height,
    vert: glslify( './shader/particles-render.vert' ),
    frag: glslify( './shader/particles-render.frag' ),
    drawbuffers: 2,
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    func: () => {
      glCat.attribute( 'vuv', vboParticle, 3 );
      glCat.uniform2fv( 'resolutionPcompute', [ particlesSqrt * particlePixels, particlesSqrt ] );
      glCat.uniformTexture( 'texturePcompute', glCatPath.fb( "particlesCompute" ).texture, 0 );
      glCat.uniformTexture( 'textureShadow', glCatPath.fb( "particlesShadow" ).texture, 1 );
      glCat.uniformTexture( 'textureOctPos', textureOctPos, 2 );
      glCat.uniformTexture( 'textureOctNor', textureOctNor, 3 );
      gl.drawArrays( gl.TRIANGLES, 0, particles * vertsPerParticle );
    }
  },
  
  gauss: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/gauss.frag' ),
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    tempFb: glCat.createFloatFramebuffer( width, height ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    func: ( path, params ) => {
      if ( params.width && params.height ) {
        glCat.resizeFloatFramebuffer( path.tempFb, params.width, params.height );
      }

      gl.bindFramebuffer( gl.FRAMEBUFFER, path.tempFb.framebuffer );
      glCat.clear( ...path.clear );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      glCat.uniform1f( 'var', params.var );
      glCat.uniform1i( 'isVert', 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      
      gl.bindFramebuffer( gl.FRAMEBUFFER, params.framebuffer );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', path.tempFb.texture, 0 );
      glCat.uniform1f( 'var', params.var );
      glCat.uniform1i( 'isVert', 1 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  dof: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/dof.frag' ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1f( 'focus', auto( 'focus' ) );
      glCat.uniformTexture( 'samplerDry', params.dry, 0 );
      glCat.uniformTexture( 'samplerPreDof', params.predof, 1 );
      glCat.uniformTexture( 'samplerDepth', params.depth, 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  "Gowrock - bloom": {
    width: width / 4.0,
    height: height / 4.0,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bloom.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    tempFb: glCat.createFloatFramebuffer( width / 4.0, height / 4.0 ),
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      for ( let i = 0; i < 3; i ++ ) {
        let gaussVar = [ 5.0, 15.0, 40.0 ][ i ];
        gl.bindFramebuffer( gl.FRAMEBUFFER, _p.tempFb.framebuffer );
        glCat.clear( ..._p.clear );

        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniform1i( 'isVert', false );
        glCat.uniform1f( 'gaussVar', gaussVar );
        glCat.uniformTexture( 'sampler0', params.input, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
        
        gl.bindFramebuffer( gl.FRAMEBUFFER, params.framebuffer );

        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniform1i( 'isVert', true );
        glCat.uniform1f( 'gaussVar', gaussVar );
        glCat.uniformTexture( 'sampler0', _p.tempFb.texture, 0 );
        glCat.uniformTexture( 'samplerDry', params.input, 1 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    }
  },
  
  bloomFinalize: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bloom-finalize.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'samplerDry', params.dry, 0 );
      glCat.uniformTexture( 'samplerWet', params.wet, 1 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  おたくはすぐポストエフェクトを挿す: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/post.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  monitor: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/monitor.frag' ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    depthTest: false,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1f( 'recoverBar', auto( "recoverBar" ) );
      glCat.uniform1f( 'recoverClose', auto( "recoverClose" ) );
      glCat.uniform1f( 'circleRadius', auto( "circleRadius" ) );
      glCat.uniform1f( 'circleSpin', auto( "circleSpin" ) );
      glCat.uniform1f( 'metaballRadius', auto( "metaballRadius" ) );
      glCat.uniformTexture( 'samplerMonitorRecover', textureMonitorRecover, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  motion: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/motion.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      glCat.uniformTexture( 'samplerP', params.prev, 1 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  motionSel: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/motionsel.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1f( 'threshold', 0.1 * auto( "moshThreshold" ) );
      glCat.uniformTexture( 'samplerDry', params.dry, 0 );
      glCat.uniformTexture( 'samplerMosh', params.mosh, 1 );
      glCat.uniformTexture( 'samplerMotion', glCatPath.fb( "motion" ).texture, 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
} );

// ------

let updateUI = () => {
  let now = new Date();
  let deadline = new Date( 2018, 0, 19, 0, 0 );

  divCountdown.innerText = "Deadline: " + Math.floor( ( deadline - now ) / 1000 );
};

// ------

let update = () => {
  if ( automaton.time === 0 ) { xorshift( 347189057829056 ); }

  if ( !tweak.checkbox( 'play', { value: true } ) ) {
    setTimeout( update, 10 );
    return;
  }
  
  textureRandomUpdate( textureRandom );

  updateUI();

  updateMatrices();
  
  automaton.update();

  cameraPos = [
    auto( "cameraX" ),
    auto( "cameraY" ),
    auto( "cameraZ" )
  ];
  cameraTar = [
    auto( "cameraTX" ),
    auto( "cameraTY" ),
    auto( "cameraTZ" )
  ]
  cameraRot = auto( "cameraRot" );

  glCatPath.begin();

  glCatPath.render( "こんにちは" );

  // glCatPath.render( "monitor", { target: glCatPath.fb( "こんにちは" ) } );

  glCatPath.render( "particlesComputeReturn" );
  glCatPath.render( "particlesCompute" );
  glCatPath.render( "particlesShadow" );
  glCatPath.render( "particlesRender", {
    target: glCatPath.fb( "こんにちは" )
  } );

  glCatPath.render( "gauss", {
    target: framebufferPreDof,
    input: glCatPath.fb( "こんにちは" ).textures[ 0 ],
    width: width,
    height: height,
    var: 5.0
  } );

  glCatPath.render( "dof", {
    dry: glCatPath.fb( "こんにちは" ).textures[ 0 ],
    predof: framebufferPreDof.texture,
    depth: glCatPath.fb( "こんにちは" ).textures[ 1 ]
  } );

  glCatPath.render( "Gowrock - bloom", {
    input: framebufferPreDof.texture,
  } );
  glCatPath.render( "bloomFinalize", {
    dry: glCatPath.fb( "dof" ).texture,
    wet: glCatPath.fb( "Gowrock - bloom" ).texture
  } );

  glCatPath.render( "おたくはすぐポストエフェクトを挿す", {
    input: glCatPath.fb( "bloomFinalize" ).texture
  } );

  glCatPath.render( "monitor", {
    target: glCatPath.fb( "おたくはすぐポストエフェクトを挿す" )
  } );

  glCatPath.render( "motion", {
    input: glCatPath.fb( "おたくはすぐポストエフェクトを挿す" ).texture,
    prev: framebufferMotionPrev.texture
  } );
  glCatPath.render( "motionSel", {
    dry: glCatPath.fb( "おたくはすぐポストエフェクトを挿す" ).texture,
    mosh: framebufferMotionMosh.texture
  } );
  glCatPath.render( "return", {
    target: framebufferMotionMosh,
    input: glCatPath.fb( "motionSel" ).texture,
    width: width,
    height: height
  } );
  glCatPath.render( "return", {
    target: glCatPath.nullFb,
    input: glCatPath.fb( "motionSel" ).texture,
    width: width,
    height: height
  } );

  glCatPath.render( "return", {
    target: framebufferMotionPrev,
    input: glCatPath.fb( "おたくはすぐポストエフェクトを挿す" ).texture,
    width: width,
    height: height
  } );

  glCatPath.end();

  init = false;
  totalFrames ++;

  if ( tweak.checkbox( 'save', { value: false } ) ) {
    saveFrame();
  }
  
  requestAnimationFrame( update );
};

// ------

step( {
  0: ( done ) => {
    update();
  }
} );

window.addEventListener( 'keydown', ( _e ) => {
  if ( _e.which === 27 ) {
    tweak.checkbox( 'play', { set: false } );
  }
} );

window.addEventListener( 'mousemove', event => {
  mouseX = event.clientX;
  mouseY = event.clientY;
} );