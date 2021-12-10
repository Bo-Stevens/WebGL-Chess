var canvas
var gl

var projectionMatrix
var viewProjectionMatrix
var worldViewProjectionMatrix
var worldViewPosition
var shininess
var viewMatrix
var aspectRatio
var zNear = 1;
var zFar = 6000;

var radius = 200
var numF = 5

var lightPos
var socket = io();

var gameObjects = new Array()

var mouseDown = false


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

  translate: function(projectionMatrix, x, y){
      return mat3.multiply(projectionMatrix, mat3.translation(x,y))
  },

  rotate: function(projectionMatrix, angleInRadians){
      return mat3.multiply(projectionMatrix, mat3.rotation(angleInRadians))
  },

  scale: function(projectionMatrix, x, y){
      return mat3.multiply(projectionMatrix, mat3.scaling(x,y))
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

  transformPoint: function (m, v, dst) {
    dst = dst || new MatType(3);
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];
    var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

    dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
    dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
    dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;

    return dst;
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
  },

  cross: function(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]];
  },

  subtractVectors: function(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  },

  normalize: function(v) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    } else {
      return [0, 0, 0];
    }
  },

  lookAt: function(cameraPosition, target, up) {
    var zAxis = this.normalize(
        this.subtractVectors(cameraPosition, target));
    var xAxis = this.normalize(this.cross(up, zAxis));
    var yAxis = this.normalize(this.cross(zAxis, xAxis));
 
    return [
       xAxis[0], xAxis[1], xAxis[2], 0,
       yAxis[0], yAxis[1], yAxis[2], 0,
       zAxis[0], zAxis[1], zAxis[2], 0,
       cameraPosition[0],
       cameraPosition[1],
       cameraPosition[2],
       1,
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
    return mat4.multiply(projectionMatrix, viewMatrix)
  },

  rotateAround: function(x,y,z){
    // Compute the position of the first F
    var fPosition = [radius, 0, 0];
  
    // Use matrix math to compute a position on a circle where
    // the camera is
    var cameraMatrix = mat4.rotationX(x)
    cameraMatrix = mat4.rotateY(cameraMatrix, y)
    cameraMatrix = mat4.rotateZ(cameraMatrix, z)
    cameraMatrix = mat4.translate(cameraMatrix, 0, 0, radius * 1.5)
    // Get the camera's position from the matrix we computed
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];
  
    var up = [0, 1, 0];
  
    // Compute the camera's matrix using look at.
    var cameraMatrix = mat4.lookAt(cameraPosition, fPosition, up);
  
    // Make a view matrix from the camera matrix.
    var viewMatrix = mat4.inverse(cameraMatrix);
    return mat4.multiply(projectionMatrix, viewMatrix)
  },

  createCamera : function(x,y,z){
    this.x = x
    this.y = y
    this.z = z
  }
}
var worldMatrix = mat4.rotationY(0);
var f
var uniforms


async function startEngine(){
  initializeWebGL("rendererWindow")
}

function parseOBJ(text) {

    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];
    const objColors = [[0, 0, 0]];
    // same order as `f` indices
    const objVertexData = [
      objPositions,
      objTexcoords,
      objNormals,
      objColors,
    ];
   
    // same order as `f` indices
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
      [],   // colors
    ];

    const materialLibs = [];
    const geometries = [];
    let geometry;
    let material = 'default';
    let object = 'default';
    let groups = ['default'];
    const noop = () => {};

    function newGeometry() {
      // If there is an existing geometry and it's
      // not empty then start a new one.
      if (geometry && geometry.data.position.length) {
        geometry = undefined;
      }
    }
   
    function setGeometry() {
      if (!geometry) {
        const position = [];
        const texcoord = [];
        const normal = [];
        const color = [];
        webglVertexData = [
          position,
          texcoord,
          normal,
          color,
        ];
        geometry = {
          groups,
          object,
          material,
          data: {
            position,
            texcoord,
            normal,
            color,
          },
        };
        geometries.push(geometry);
      }
    }
   
    function addVertex(vert) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
        webglVertexData[i].push(...objVertexData[i][index]);
        if (i === 0 && objColors.length > 1) {
          geometry.data.color.push(...objColors[index]);
        }
      });
    }
   
 
  const keywords = {
    v(parts) {
      if (parts.length > 3) {
        objPositions.push(parts.slice(0, 3).map(parseFloat));
        objColors.push(parts.slice(3).map(parseFloat));
      } else {
        objPositions.push(parts.map(parseFloat));
      }
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop,
    mtllib(parts, unparsedArgs) {
      materialLibs.push(unparsedArgs);
    },
    usemtl(parts, unparsedArgs) {
      material = unparsedArgs;
      newGeometry();
    },
    g(parts) {
      groups = parts;
      newGeometry()
    },
    o(parts, unparsedArgs) {
      object = unparsedArgs;
      newGeometry();
    },
  };
 
  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
      continue;
    }
    handler(parts, unparsedArgs);
  }

  // remove any arrays that have no entries.
  for (const geometry of geometries) {
    geometry.data = Object.fromEntries(
        Object.entries(geometry.data).filter(([, array]) => array.length > 0));
  }
  return {geometries, materialLibs}
}
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}
function parseMapArgs(unparsedArgs) {
  // TODO: handle options
  return unparsedArgs;
}
function parseMTL(text) {
  const materials = {};
  let material;
 
  const keywords = {
    newmtl(parts, unparsedArgs) {
      material = {};
      materials[unparsedArgs] = material;
    },
    Ns(parts)     { material.shininess      = parseFloat(parts[0]); },
    Ka(parts)     { material.ambient        = parts.map(parseFloat); },
    Kd(parts)     { material.diffuse        = parts.map(parseFloat); },
    Ks(parts)     { material.specular       = parts.map(parseFloat); },
    Ke(parts)     { material.emissive       = parts.map(parseFloat); },
    map_Kd(parts, unparsedArgs)   { material.diffuseMap = parseMapArgs(unparsedArgs); },
    map_Ns(parts, unparsedArgs)   { material.specularMap = parseMapArgs(unparsedArgs); },
    map_Bump(parts, unparsedArgs) { material.normalMap = parseMapArgs(unparsedArgs); },
    Ni(parts)     { material.opticalDensity = parseFloat(parts[0]); },
    d(parts)      { material.opacity        = parseFloat(parts[0]); },
    illum(parts)  { material.illum          = parseInt(parts[0]); },
  };
 
  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);
      continue;
    }
    handler(parts, unparsedArgs);
  }
 
  return materials;
}
function create1PixelTexture(gl, pixel) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array(pixel));
  return texture;
}
function getGeometriesExtents(geometries) {
  return geometries.reduce(({min, max}, {data}) => {
    const minMax = getExtents(data.position);
    return {
      min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
      max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
    };
  }, {
    min: Array(3).fill(Number.POSITIVE_INFINITY),
    max: Array(3).fill(Number.NEGATIVE_INFINITY),
  });
}
 
function getExtents(positions) {
  const min = positions.slice(0, 3);
  const max = positions.slice(0, 3);
  for (let i = 3; i < positions.length; i += 3) {
    for (let j = 0; j < 3; ++j) {
      const v = positions[i + j];
      min[j] = Math.min(v, min[j]);
      max[j] = Math.max(v, max[j]);
    }
  }
  return {min, max};
}

function createTexture(gl, url) {
  const texture = create1PixelTexture(gl, [128, 192, 255, 255]);
  // Asynchronously load an image
  const image = new Image();
  image.src = url;
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
 
    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  });
  return texture;

}

async function createGameObjectsFromOBJ(fileName){
  //READING IN OBJ
  const response = await fetch(fileName)
  // const response = await fetch('https://webglfundamentals.org/webgl/resources/models/cube/cube.obj')
  const text = await response.text()
  var objects = parseOBJ(text)
  const baseHref = new URL("Objects/checkers_obj.obj", window.location.href);
  const matTexts = await Promise.all(objects.materialLibs.map(async filename => {
    const matHref = new URL(filename, baseHref).href;
    const response = await fetch(matHref);
    return await response.text();
  }));
  const materials = parseMTL(matTexts.join('\n'));

  const textures = {
    defaultWhite: create1PixelTexture(gl, [255, 255, 255, 255]),
  };

  const defaultMaterial = {
    diffuse: [1, 1, 1],
    diffuseMap: textures.defaultWhite,
    ambient: [0, 0, 0],
    specular: [1, 1, 1],
    shininess: 400,
    opacity: 1,
  };

  const parts = objects.geometries.map(({material, data}) => {
    if (data.color) {
      if (data.position.length === data.color.length) {
        // it's 3. The our helper library assumes 4 so we need
        // to tell it there are only 3.
        data.color = { numComponents: 3, data: data.color };
      }
    } else {
      // there are no vertex colors so just use constant white
      data.color = { value: [1, 1, 1, 1] };
    }

    // create a buffer for each array by calling
    // gl.createBuffer, gl.bindBuffer, gl.bufferData
    const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
    return {
      material: {
        ...defaultMaterial,
        ...materials[material],
      },
      bufferInfo,
    };
  });


  // load texture for materials
  for (const material of Object.values(materials)) {
    Object.entries(material)
      .filter(([key]) => key.endsWith('Map'))
      .forEach(([key, filename]) => {
        let texture = textures[filename];
        if (!texture) {
          const textureHref = new URL(filename, baseHref).href;
          texture = createTexture(gl, textureHref);
          textures[filename] = texture;
        }
        material[key] = texture;
    });
  }

  var newObjects = new Array()
  for(var i = 0; i < objects.geometries.length; i++){
    var gameObject = new GameObject()
    gameObject.positions = objects.geometries[i].data.position
    gameObject.normals = objects.geometries[i].data.normal
    //gameObject.diffuseTexture = parts[i]['material']["diffuseMap"]
    //console.log("IT IS " + parts[i]['bufferInfo']["attribs"]['a_texcoord'])

    
    gameObject.setDefaultAttributes()
    gameObject.setUniforms([
      ["u_worldInverseTranspose", 'worldMatrix',                       setUniformMat4f],
      ["u_world",                 'worldMatrix',                       setUniformMat4f],
      ["u_lightWorldPosition",    'lightPos',                          setUniform3f],
      ["u_viewWorldPosition",     'worldViewPosition',                 setUniform3f],
      ["shininess",               'shininess',                         setUniformf],
    ])
    if(parts[i].material != null){
      gameObject.setStaticUniforms([
        ["ambient",                 parts[i].material['ambient'],      setUniform3f],
        ["diffuse",                 parts[i].material['diffuse'],      setUniform3f],
        ["diffuseMap",              parts[i].material['diffuseMap'],   setUniform3f],
        ["emissive",                parts[i].material['emissive'],     setUniform3f],
        ["opacity",                 parts[i].material['opacity'],      setUniformf],
        ["shininess",               parts[i].material['shininess'],    setUniformf],
        ["specular",                parts[i].material['specular'],     setUniform3f],
        ["specular",                parts[i].material['specular'],     setUniform3f],
        
      ])
    }
    gameObject.textureCoords = objects.geometries[i].data.texcoord
    gameObject.setTexture(parts[i]['material']["diffuseMap"])
    gameObject.setPosition(0,300,0)
    newObjects.push(gameObject)
  }
  return newObjects
}

async function initializeWebGL(canvasID){
    canvas = document.getElementById(canvasID)
    gl = canvas.getContext("webgl")
    
    if(!gl){
        console.log("WEBGL INITIALIZATION ERROR")
    }

    createUIEventListeners()

    aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight

    projectionMatrix = mat4.perspective(degToRad(60), aspectRatio, zNear, zFar)
    var camera = [0,200,-200];
    var target = [0, 0, -100];
    var up = [0, 1, 0];
    var cameraMatrix = mat4.lookAt(camera, target, up)
    viewMatrix = mat4.inverse(cameraMatrix)






    lightPos = [20, 350, 350]
    worldViewPosition = [camera[0], camera[1], camera[2]]
    shininess = [10]

    viewProjectionMatrix = mat4.multiply(projectionMatrix, viewMatrix)
    calculateTransformationMatrix3D()
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    // worldViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, worldMatrix)
}

function draw(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clearColor(0,0,0,0)
  resizeCanvas()
  // worldViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, worldMatrix)
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 0;

  
  if(gameObjects.length > 0){

    var transformations = new Array()
    for(var i = 0; i < gameObjects.length; i++){
      transformations.push({
        position: gameObjects[i].getPosition(),
        rotation: gameObjects[i].getRotation(),
        scale:    gameObjects[i].getScale()
      })
    }
    socket.emit("send-gameObjects", transformations)
  }

  for(var i = 0; i < gameObjects.length; i++){
    gl.useProgram(gameObjects[i].program)
    count += gameObjects[i].positions.length/3;
    gameObjects[i].updateUniforms()
    gameObjects[i].setDefaultAttributes()
    gl.drawArrays(primitiveType, offset, count);
  }


}

async function drawClient(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clearColor(0,0,0,0)
  resizeCanvas()
  // worldViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, worldMatrix)
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 0;
  for(var i = 0; i < gameObjects.length; i++){
    gl.useProgram(gameObjects[i].program)
    count += gameObjects[i].positions.length/3;
    gameObjects[i].updateUniforms()
    gameObjects[i].setDefaultAttributes()
    gl.drawArrays(primitiveType, offset, count);
  }
}

function setShaderAttribute(program, attribName, data, settings){
  if(settings == null){
    settings = new Array()
    settings[0] = 3
    settings[1] = gl.FLOAT
    settings[2] = false
    settings[3] = 0
    settings[4] = 0
    
  }
  else{
    for(var i = 0; i < 4; i++){
      if(settings[i] == null){
        switch (i){
        case 0:
          settings[0] = 3
          break
        case 1:
          settings[1] = gl.FLOAT
          break
        case 2:
          settings[2] = false
          break
        case 3:
          settings[3] = 0
          break
        case 4:
          settings[4] = 0
          break
        }
      }
    }
  }
  var buffer = gl.createBuffer()
  var bufferLocation = gl.getAttribLocation(program, attribName)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    bufferLocation, settings[0], settings[1], settings[2], settings[3], settings[4])
  gl.enableVertexAttribArray(bufferLocation)

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

function setUniform4f(program, uniformName, data){
  gl.useProgram(program)
  var attributeLocation = gl.getUniformLocation(program, uniformName)
  gl.uniform4f(attributeLocation, data[0], data[1], data[2], data[3])
}

function setUniform3f(program, uniformName, data){
  gl.useProgram(program)
  var attributeLocation = gl.getUniformLocation(program, uniformName)
  gl.uniform3f(attributeLocation, data[0], data[1], data[2])
}

function setUniform2f(program, uniformName, data){
  gl.useProgram(program)
  var attributeLocation = gl.getUniformLocation(program, uniformName)
  gl.uniform2f(attributeLocation, data[0], data[1])
}

function setUniformf(program, uniformName, data){
  gl.useProgram(program)
  if(data[0] != null){
    data = data[0]
  }
  var attributeLocation = gl.getUniformLocation(program, uniformName)
  gl.uniform1f(attributeLocation, data)
}

function setUniformMat3f(program, uniformName, mat3){
  gl.useProgram(program)
  var attributeLocation = gl.getUniformLocation(program, uniformName)
  gl.uniformMatrix3fv(attributeLocation, false, mat3)
}

function setUniformMat4f(programName, uniformName, mat4){
  gl.useProgram(programName)
  var attributeLocation = gl.getUniformLocation(programName, uniformName)
  gl.uniformMatrix4fv(attributeLocation, false, mat4)
}

function setUniformBool(program, uniformName, bool){
  gl.useProgram(program)
  var attributeLocation = gl.getUniformLocation(program, uniformName)
  gl.uniform1i(attributeLocation, bool)
}

function degToRad(value){
  return value * Math.PI / 180
}

//Make it so we only ever have to call this one function (Make it more generic). Could possibly create a class for all of the data we want to put in here
function calculateTransformationMatrix3D(){
    projectionMatrix = mat4.translate(projectionMatrix, 0, 0, 0)
    projectionMatrix = mat4.rotateX(projectionMatrix, 0)
    projectionMatrix = mat4.rotateY(projectionMatrix, 0)
    projectionMatrix = mat4.rotateZ(projectionMatrix, 0)
    projectionMatrix = mat4.scale(projectionMatrix, 1, 1, 1)
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

    document.getElementById("objectRotationX").addEventListener("input", setTransformations)
    document.getElementById("objectRotationY").addEventListener("input", setTransformations)
    document.getElementById("objectRotationZ").addEventListener("input", setTransformations)

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

      objectRotationX : document.getElementById("objectRotationX").value,
      objectRotationY : document.getElementById("objectRotationY").value,
      objectRotationZ : document.getElementById("objectRotationZ").value,

      scaleX : document.getElementById("scaleX").value,
      scaleY : document.getElementById("scaleY").value,
      scaleZ : document.getElementById("scaleZ").value,
    }

    console.log(transformations)
    //socket.emit("send-transformations", transformations)
    updateTransformations(transformations)
}

function mouseClicked(){
  mouseDown = true
}

function mouseUp(){
  mouseDown = false
  
}

function updateTransformations(transformations){
  projectionMatrix = mat4.perspective(90, aspectRatio, zNear, zFar)
  worldMatrix = mat4.rotationX(0)
  worldMatrix = mat4.translate(worldMatrix, transformations["positionX"], transformations["positionY"], transformations["positionZ"])

  worldMatrix = mat4.rotateX(worldMatrix, transformations["rotationX"] * (Math.PI / 180))
  worldMatrix = mat4.rotateY(worldMatrix, transformations["rotationY"] * (Math.PI / 180))
  worldMatrix = mat4.rotateZ(worldMatrix, transformations["rotationZ"] * (Math.PI / 180))

  worldMatrix = mat4.scale(worldMatrix, transformations["scaleX"]/10, transformations["scaleY"]/10, transformations["scaleZ"]/10)
  //VIEW PROJECTION MUST COME AFTER TRANSFORM MATRIX
  viewProjectionMatrix = camera.rotate( transformations["camRotationX"] * (Math.PI / 180), transformations["camRotationY"] * (Math.PI / 180), transformations["camRotationZ"] * (Math.PI / 180))
  viewProjectionMatrix = mat4.multiply(viewProjectionMatrix, viewMatrix)

  gameObjects[0].setRotation(transformations["objectRotationX"] * (Math.PI / 180), transformations["objectRotationY"] * (Math.PI / 180), transformations["objectRotationZ"] * (Math.PI / 180))

  drawClient()
}
function resizeCanvas(){
  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
  aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight
}



socket.on("receive-transformations", transformations =>{
  updateTransformations(transformations)
})

socket.on("receive-gameObjects", transformations =>{
  for(var i = 0; i < gameObjects.length; i++){
    gameObjects[i].setPosition(transformations[i]["position"][0],transformations[i]["position"][1],transformations[i]["position"][2])
    gameObjects[i].setRotation(transformations[i]["rotation"][0],transformations[i]["rotation"][1],transformations[i]["rotation"][2])
    gameObjects[i].setScale(transformations[i]["scale"][0],transformations[i]["scale"][1],transformations[i]["scale"][2])
  }
  drawClient()
})
