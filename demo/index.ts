import * as hex from "@hexagon/index"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const renderer = new hex.Renderer(canvas)
const camera = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt(
  new hex.Vector3(0, 0, -3),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const geometry = new hex.CubeGeometry()

const shader = new hex.Shader(`#version 300 es
  
  precision highp float;
  
  uniform mat4   model;
  uniform mat4   view;
  uniform mat4   projection;

  in vec4 position;
  in vec2 texcoord;
  in vec3 normal;

  out vec2 out_texcoord;
  out vec4 out_position;
  void main() {
    out_texcoord = texcoord;
    out_position = (model * position);
    gl_Position  = projection * view * (model * position);
  }
`, `#version 300 es

  precision highp float;

  uniform sampler2D map;
  in vec2 out_texcoord;
  in vec4 out_position;
  out vec4 color;
  
  void main() {
    int a = int(3.0);
    int b = int(out_position.x * 20.0);
    int c = int(out_position.y * 20.0);
    int d = int(out_position.z * 20.0);
    
    if (((b % a) == 0) || ((c % a) == 0) || ((d % a) == 0)) {
      // color = vec4(0.8, 0.8, 0.8, 1.0);
      color = texture(map, out_texcoord);
    } else {
      //color = texture(map, out_texcoord);
      color = vec4(0.3, 0.3, 0.3, 0.1);
      //discard;
    }

    // float x = 0.1;
    // if((out_position.x > -x && out_position.x < x) || 
    //    (out_position.y > -x && out_position.y < x) || 
    //    (out_position.z > -x && out_position.z < x) ) {
    //     color = vec4(1.0, 1.0, 1.0, 1.0);
    // } else {
    //   discard;
    //   //gl_FragColor = texture2D(texture, out_texcoord);
    // }
    
  }
`)



const material = new hex.Material(shader)
const mesh     = new hex.Mesh(material, geometry)
const scene    = new hex.Scene()
scene.objects.push(mesh)


const texture = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3))

let t = 0
setInterval(() => {
  const data = texture.pixels as Uint8Array
  for (let i = 0; i < data.length; i+=3) {
    const r = Math.random()
    if (r > 0.995) {
      const x =  Math.floor(Math.random() * 256)
      data[i] = x;
      data[i+1] = x;
      data[i+2] = x;
    }
      
  }
  texture.needsupdate = true
  const x = (Math.cos(t) + 1) / 2
  const y = (Math.sin(t) + 1) / 2
  t += 0.01
  material.uniforms.color = new hex.Vector4(x, y, 0, 1)
  material.uniforms.map = texture
  mesh.matrix = mesh.matrix.rotateZ(0.001).rotateY(0.001).rotateX(0.002)
  renderer.clear(0.2, 0.2, 0.2, 1)
  renderer.render(camera, scene)

}, 1)


