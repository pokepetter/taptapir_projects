// 3D
engine_3d = new Object();

gl_canvas = document.createElement('canvas')
gl_canvas.name = "gl_canvas"
gl_canvas.id = "game"
gl_canvas.width = 1920 / 2
gl_canvas.height = 1080 / 2
gl_canvas.style.zIndex = -1
game_window.appendChild(gl_canvas)


const gl = gl_canvas.getContext('webgl');
if (!gl) { // If we don't have a GL context, give up now
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}

const vertex_program = `
  attribute vec4 aVertexPosition;
  uniform mat4 mvp;

  void main() {
    gl_Position = mvp * aVertexPosition;
  }
`;
const fragment_program = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;
const shaderProgram = initShaderProgram(gl, vertex_program, fragment_program);
// Collect all the info needed to use the shader program.
// Look up which attribute our shader program is using
// for aVertexPosition and look up uniform locations.
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  },
  uniformLocations: {
    mvp: gl.getUniformLocation(shaderProgram, 'mvp'),
  },
};
const buffers = initBuffers(gl);

function render() {
    // print('render')
    drawScene(gl, programInfo, buffers);
    requestAnimationFrame(render);
}


function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const verts = [1.0,1.0,   -1.0,1.0,   1.0,-1.0,   -1.0,-1.0,];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    return {position: positionBuffer};
}
// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}
// creates a shader of the given type, uploads the source and
// compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);  // Send the source to the shader object
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {     // See if it compiled successfully
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

const fieldOfView = 45 * Math.PI / 180;   // in radians
// const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const aspect = 16/9;
const zNear = 0.1;
const zFar = 100.0;

// note: glmatrix.js always has the first argument
// as the destination to receive the result.
var projection_matrix = glMatrix.mat4.create();
var projection_matrix = glMatrix.mat4.perspective(projection_matrix, fieldOfView, aspect, zNear, zFar);

var view_matrix = glMatrix.mat4.create()
view_matrix = glMatrix.mat4.lookAt(view_matrix,
    glMatrix.vec3.create(0,0,-13.0), // origin
    glMatrix.vec3.create(0,0,1.0), // target
    glMatrix.vec3.create(0,1,0), // up
    )
view_matrix[14] = -14
print('view matrinx-------------------', view_matrix)

var model_matrix = glMatrix.mat4.create(1.0)
var mvp = glMatrix.mat4.create(0.0)

print('model_matrix:', model_matrix)
print('view_matrix:', view_matrix)
print('projection_matrix:', projection_matrix)
// projection_matrix * view_matrix * model_matrix
drawScene(gl, programInfo, buffers);
requestAnimationFrame(render);


function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // Clear the canvas before we start drawing on it.

    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.useProgram(programInfo.program);

    mvp = glMatrix.mat4.multiply(mvp, projection_matrix, view_matrix)
    mvp = glMatrix.mat4.multiply(mvp, mvp, model_matrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mvp);
    const _offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, _offset, vertexCount);
    // print('--------------------', mvp)
}
