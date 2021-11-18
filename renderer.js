var vertexShaderSource = `
    attribute vec4 a_position;
    uniform mat4 u_matrix;

    attribute vec4 in_color;
    varying vec4 out_color;

    void main(){
        gl_Position = u_matrix * a_position;

        out_color = in_color;
    }
`

var fragmentShaderSource = `
    precision mediump float;

    uniform vec4 u_color;

    varying vec4 out_color;
    
    void main(){
        gl_FragColor = out_color;
    }

`

var canvas
var gl

var transformMatrix
var viewProjectionMatrix
var aspectRatio
var zNear = 1;
var zFar = 2000;

var radius = 200
var numF = 5

var program

var socket = io();

var positions = [
    // left column front
    0,   0,  0,
    0, 150,  0,
    30,   0,  0,
    0, 150,  0,
    30, 150,  0,
    30,   0,  0,

    // top rung front
    30,   0,  0,
    30,  30,  0,
    100,   0,  0,
    30,  30,  0,
    100,  30,  0,
    100,   0,  0,

    // middle rung front
    30,  60,  0,
    30,  90,  0,
    67,  60,  0,
    30,  90,  0,
    67,  90,  0,
    67,  60,  0,

    // left column back
    0,   0,  30,
    30,   0,  30,
    0, 150,  30,
    0, 150,  30,
    30,   0,  30,
    30, 150,  30,

    // top rung back
    30,   0,  30,
    100,   0,  30,
    30,  30,  30,
    30,  30,  30,
    100,   0,  30,
    100,  30,  30,

    // middle rung back
    30,  60,  30,
    67,  60,  30,
    30,  90,  30,
    30,  90,  30,
    67,  60,  30,
    67,  90,  30,

    // top
    0,   0,   0,
    100,   0,   0,
    100,   0,  30,
    0,   0,   0,
    100,   0,  30,
    0,   0,  30,

    // top rung right
    100,   0,   0,
    100,  30,   0,
    100,  30,  30,
    100,   0,   0,
    100,  30,  30,
    100,   0,  30,

    // under top rung
    30,   30,   0,
    30,   30,  30,
    100,  30,  30,
    30,   30,   0,
    100,  30,  30,
    100,  30,   0,

    // between top rung and middle
    30,   30,   0,
    30,   60,  30,
    30,   30,  30,
    30,   30,   0,
    30,   60,   0,
    30,   60,  30,

    // top of middle rung
    30,   60,   0,
    67,   60,  30,
    30,   60,  30,
    30,   60,   0,
    67,   60,   0,
    67,   60,  30,

    // right of middle rung
    67,   60,   0,
    67,   90,  30,
    67,   60,  30,
    67,   60,   0,
    67,   90,   0,
    67,   90,  30,

    // bottom of middle rung.
    30,   90,   0,
    30,   90,  30,
    67,   90,  30,
    30,   90,   0,
    67,   90,  30,
    67,   90,   0,

    // right of bottom
    30,   90,   0,
    30,  150,  30,
    30,   90,  30,
    30,   90,   0,
    30,  150,   0,
    30,  150,  30,

    // bottom
    0,   150,   0,
    0,   150,  30,
    30,  150,  30,
    0,   150,   0,
    30,  150,  30,
    30,  150,   0,

    // left side
    0,   0,   0,
    0,   0,  30,
    0, 150,  30,
    0,   0,   0,
    0, 150,  30,
    0, 150,   0
]

var colorData = [
    // left column front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // top rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // middle rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // left column back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // middle rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,

    // top rung right
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,

    // under top rung
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,

    // between top rung and middle
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,

    // top of middle rung
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,

    // right of middle rung
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,

    // bottom of middle rung.
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,

    // right of bottom
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,

    // bottom
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,

    // left side
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220
]
var mat3 = {
  translation: function(tX, tY){
      return [
          1,  0,  0,
          0,  1,  0,
          tX, tY, 1
      ]
  },

  rotation: function(angleInRadians){
      var c = Math.cos(angleInRadians)
      var s = Math.sin(angleInRadians)
      return [
          c, -s, 0,
          s,  c, 0,
          0,  0, 1,
      ]
  },

  scaling: function(sx, sy){
      return[
          sx, 0,  0,
          0,  sy, 0,
          0,  0,  1
      ]
  },

  multiply: function(a, b) {
      var a00 = a[0 * 3 + 0];
      var a01 = a[0 * 3 + 1];
      var a02 = a[0 * 3 + 2];
      var a10 = a[1 * 3 + 0];
      var a11 = a[1 * 3 + 1];
      var a12 = a[1 * 3 + 2];
      var a20 = a[2 * 3 + 0];
      var a21 = a[2 * 3 + 1];
      var a22 = a[2 * 3 + 2];
      var b00 = b[0 * 3 + 0];
      var b01 = b[0 * 3 + 1];
      var b02 = b[0 * 3 + 2];
      var b10 = b[1 * 3 + 0];
      var b11 = b[1 * 3 + 1];
      var b12 = b[1 * 3 + 2];
      var b20 = b[2 * 3 + 0];
      var b21 = b[2 * 3 + 1];
      var b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },

  projection: function(width, height) {
      return [
          2/width,0, 0,
          0,-2/height, 0,
          -1, 1, 1
      ]
  },

  translate: function(transformMatrix, x, y){
      return mat3.multiply(transformMatrix, mat3.translation(x,y))
  },

  rotate: function(transformMatrix, angleInRadians){
      return mat3.multiply(transformMatrix, mat3.rotation(angleInRadians))
  },

  scale: function(transformMatrix, x, y){
      return mat3.multiply(transformMatrix, mat3.scaling(x,y))
  }

}
var mat4 = {
  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },
 
  rotationX: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  rotationY: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  rotationZ: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },
 
  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
      return mat4.multiply(m, mat4.translation(tx, ty, tz));
  },
   
  rotateX: function(m, angleInRadians) {
      return mat4.multiply(m, mat4.rotationX(angleInRadians));
  },
  
  rotateY: function(m, angleInRadians) {
      return mat4.multiply(m, mat4.rotationY(angleInRadians));
  },
  
  rotateZ: function(m, angleInRadians) {
      return mat4.multiply(m, mat4.rotationZ(angleInRadians));
  },
  
  scale: function(m, sx, sy, sz) {
      return mat4.multiply(m, mat4.scaling(sx, sy, sz));
  },

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
      var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
      var rangeInv = 1.0 / (near - far);
   
      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ];
  },

  multiply: function(a, b) {
      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];
      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];
      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];
      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];
      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];
      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];
      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];
   
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
  },

  projection: function(width, height, depth) {
    return [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  inverse: function(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  }
};
var camera = {
  x : 0,
  y : 0,
  z : 0,
  rotate : function(x, y, z){
    //Move into one function for efficiency
      var cameraMatrix = mat4.rotationX(x)
      cameraMatrix = mat4.rotateY(cameraMatrix, y)
      cameraMatrix = mat4.rotateZ(cameraMatrix, z)
      cameraMatrix = mat4.translate(cameraMatrix, 0, 0, radius * 1.5)
    var viewMatrix = mat4.inverse(cameraMatrix)
    return mat4.multiply(transformMatrix, viewMatrix)
  },

  createCamera : function(x,y,z){
    this.x = x
    this.y = y
    this.z = z
  }
}



function initializeWebGL(canvasID){
    canvas = document.getElementById(canvasID)
    gl = canvas.getContext("webgl")
    
    if(!gl){
        console.log("WEBGL INITIALIZATION ERROR")
    }

    var vertexShader = initializeShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = initializeShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader)
    gl.useProgram(program)


    createPositionBuffer(program, positions, "a_position")
    bindBufferUint8(program, colorData, "in_color", gl.STATIC_DRAW)

    setUniform4f(program, "u_color",1,0,.25,1)
    
    setUniform2f(program, "u_resolution", gl.canvas.width, gl.canvas.height)
    createUIEventListeners()

    // transformMatrix = mat4.matrixZToW(1)
    // transformMatrix = mat4.multiply(transformMatrix, mat4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1600))

    //transformMatrix = mat4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1600)

    aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight

    transformMatrix = mat4.perspective(degToRad(90), aspectRatio, zNear, zFar)
    console.log("TRANFORM IS " + transformMatrix)
    viewProjectionMatrix = camera.rotate(0,0,0)

    calculateTransformationMatrix3D()
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    draw()
    setTransformations()
}

function draw(){

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clearColor(0,0,0,0)
  //Maybe check if canvas has changed size
    webglUtils.resizeCanvasToDisplaySize(gl.canvas)
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
    aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight
  //



  for(var i = 0; i < numF; ++i){
    var angle = i * Math.PI * 2/numF
    var x = Math.cos(angle) * radius
    var z = Math.sin(angle) * radius

    var matrix = mat4.translate(viewProjectionMatrix, x, 0, z)

    setUniformMat4f(program, "u_matrix", matrix)
    gl.drawArrays(gl.TRIANGLES, 0, 16*6)
  }
}

//Used exclusively for position buffer rn but could posssibly be made generic to work for any Float32 buffer
function createPositionBuffer(program, positions, attributeName){
    var positionBuffer = gl.createBuffer()
    var positionAttributeLocation = gl.getAttribLocation(program, attributeName)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(positionAttributeLocation)
}

//Still partially hard-coded. Meant to handle color data right now, but could be made more generic with possible inclusion of an attribPointer settings object
function bindBufferUint8(program, data, attributeName, drawMode){
    var buffer = gl.createBuffer()
    var positionAttributeLocation = gl.getAttribLocation(program, attributeName)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data), drawMode)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0)
    gl.enableVertexAttribArray(positionAttributeLocation)
}

function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    if(gl.getProgramParameter(program,gl.LINK_STATUS)){
        return program
    }

    console.log("ERROR IN CREATING PROGRAM " + gl.getProgramInfoLog(program))

    gl.deleteProgram(program)
}

function initializeShader(gl, shaderType, shaderSource){
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource)

    gl.compileShader(shader)
    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        return shader;
    }

    console.log("Shader initialization error!" + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader);
}

function setUniform4f(program, uniformName, x, y, z, w){
    var attributeLocation = gl.getUniformLocation(program, uniformName)
    gl.uniform4f(attributeLocation, x, y, z, w)
}

function setUniform3f(program, uniformName, x, y, z){
    var attributeLocation = gl.getUniformLocation(program, uniformName)
    gl.uniform3f(attributeLocation, x, y, z)
}

function setUniform2f(program, uniformName, x, y){
    var attributeLocation = gl.getUniformLocation(program, uniformName)
    gl.uniform2f(attributeLocation, x, y)
}

function setUniformf(program, uniformName, x){
    var attributeLocation = gl.getUniformLocation(program, uniformName)
    gl.uniform1f(attributeLocation, x)
}

function setUniformMat3f(program, uniformName, mat3){
    var attributeLocation = gl.getUniformLocation(program, uniformName)
    gl.uniformMatrix3fv(attributeLocation, false, mat3)
}

function setUniformMat4f(program, uniformName, mat4){
    var attributeLocation = gl.getUniformLocation(program, uniformName)
    gl.uniformMatrix4fv(attributeLocation, false, mat4)
}

function degToRad(value){
  return value * Math.PI / 180
}


function calculateTransformationMatrix2D(){
    transformMatrix = mat3.translate(transformMatrix, 0, 0)
    transformMatrix = mat3.rotate(transformMatrix, 0)
    transformMatrix = mat3.scale(transformMatrix, 1, 1)
    setUniformMat3f(program, "u_matrix", transformMatrix)
}

//Make it so we only ever have to call this one function (Make it more generic). Could possibly create a class for all of the data we want to put in here
function calculateTransformationMatrix3D(){
    transformMatrix = mat4.translate(transformMatrix, 0, 0, 0)
    transformMatrix = mat4.rotateX(transformMatrix, 0)
    transformMatrix = mat4.rotateY(transformMatrix, 0)
    transformMatrix = mat4.rotateZ(transformMatrix, 0)
    transformMatrix = mat4.scale(transformMatrix, 1, 1, 1)
    setUniformMat4f(program, "u_matrix", transformMatrix)
}

function createUIEventListeners(){
    document.getElementById("positionX").addEventListener("input", setTransformations)
    document.getElementById("positionY").addEventListener("input", setTransformations)
    document.getElementById("positionZ").addEventListener("input", setTransformations)
    document.getElementById("rotationX").addEventListener("input", setTransformations)
    document.getElementById("rotationY").addEventListener("input", setTransformations)
    document.getElementById("rotationZ").addEventListener("input", setTransformations)
    document.getElementById("camRotationX").addEventListener("input", setTransformations)
    document.getElementById("camRotationY").addEventListener("input", setTransformations)
    document.getElementById("camRotationZ").addEventListener("input", setTransformations)
    document.getElementById("scaleX").addEventListener("input", setTransformations)
    document.getElementById("scaleY").addEventListener("input", setTransformations)
    document.getElementById("scaleZ").addEventListener("input", setTransformations)
}

function setTransformations(){
    var transformations = {
      positionX : document.getElementById("positionX").value,
      positionY : document.getElementById("positionY").value,
      positionZ : document.getElementById("positionZ").value,

      rotationX : document.getElementById("rotationX").value,
      rotationY : document.getElementById("rotationY").value,
      rotationZ : document.getElementById("rotationZ").value,

      camRotationX : document.getElementById("camRotationX").value,
      camRotationY : document.getElementById("camRotationY").value,
      camRotationZ : document.getElementById("camRotationZ").value,

      scaleX : document.getElementById("scaleX").value,
      scaleY : document.getElementById("scaleY").value,
      scaleZ : document.getElementById("scaleZ").value,
    }
    socket.emit("send-transformations", transformations)
    updateTransformations(transformations)
}

function updateTransformations(transformations){
      
  transformMatrix = mat4.perspective(90, aspectRatio, zNear, zFar)
  transformMatrix = mat4.translate(transformMatrix, transformations["positionX"],transformations["positionY"], transformations["positionZ"])
  
  transformMatrix = mat4.rotateX(transformMatrix, transformations["rotationX"] * (Math.PI / 180))
  transformMatrix = mat4.rotateY(transformMatrix, transformations["rotationY"] * (Math.PI / 180))
  transformMatrix = mat4.rotateZ(transformMatrix, transformations["rotationZ"] * (Math.PI / 180))

  transformMatrix = mat4.scale(transformMatrix, transformations["scaleX"]/10, transformations["scaleY"]/10, transformations["scaleZ"]/10)

  //VIEW PROJECTION MUST COME AFTER TRANSFORM MATRIX
  viewProjectionMatrix = camera.rotate( transformations["camRotationX"] * (Math.PI / 180), transformations["camRotationY"] * (Math.PI / 180), transformations["camRotationZ"] * (Math.PI / 180))


  setUniformMat4f(program, "u_matrix", transformMatrix)
  draw()
}

socket.on("receive-transformations", transformations =>{
  console.log(transformations["scaleX"].value)
  updateTransformations(transformations)
})

//TODO: CREATE GAMEOBJECT
initializeWebGL("rendererWindow")