import * as zero from "../../src/index"

const createCubeGeometry = () => new zero.Geometry({
  attributes: {
    position: new zero.Attribute(new Float32Array([
      /* front  */ -1.0,-1.0, 1.0,  1.0,-1.0, 1.0,  1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      /* back   */ -1.0,-1.0,-1.0, -1.0, 1.0,-1.0,  1.0, 1.0,-1.0,  1.0,-1.0,-1.0,
      /* top    */ -1.0, 1.0,-1.0, -1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0,-1.0,
      /* bottom */ -1.0,-1.0,-1.0,  1.0,-1.0,-1.0,  1.0,-1.0, 1.0, -1.0,-1.0, 1.0,
      /* right  */  1.0,-1.0,-1.0,  1.0, 1.0,-1.0,  1.0, 1.0, 1.0,  1.0,-1.0, 1.0,
      /* left   */ -1.0,-1.0,-1.0, -1.0,-1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,-1.0
    ]), 3),

    color: new zero.Attribute(new Float32Array([
      /* front  */ 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      /* back   */ 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      /* top    */ 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      /* bottom */ 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      /* right  */ 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      /* left   */ 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0
    ]), 3),

    normal: new zero.Attribute(new Float32Array([
      /* front  */ 0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,
      /* back   */ 0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
      /* top    */ 0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
      /* bottom */ 0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,
      /* right  */ 1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
      /* left   */-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
    ]), 3),

    texcoord: new zero.Attribute(new Float32Array([
      /* front  */ 0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0,
      /* back   */ 0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0,
      /* top    */ 0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0,
      /* bottom */ 0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0,
      /* right  */ 0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0,
      /* left   */ 0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0
    ]), 2)
  },
  indices: new zero.Attribute(new Uint8Array([
    /* front  */ 0,  1,  2,  0,  2,  3,   
    /* back   */ 4,  5,  6,  4,  6,  7,   
    /* top    */ 8,  9,  10, 8,  10, 11, 
    /* bottom */ 12, 13, 14, 12, 14, 15, 
    /* right  */ 16, 17, 18, 16, 18, 19, 
    /* left   */ 20, 21, 22, 20, 22, 23
  ]), 3)
})


export function createCubeMesh(scale: number) : zero.Mesh {
  let material = new zero.Material(new zero.Shader(`
    precision highp float;
    attribute vec3  position;
    attribute vec3  color;
    attribute vec3  normal;
    attribute vec2  texcoord;
    attribute vec3  offset;
    attribute float timeOffset;

    uniform   float time;
    uniform   mat4  model;
    uniform   mat4  view; 
    uniform   mat4  projection;

    varying   vec3  out_color;
    varying   vec3  out_normal;
    varying   vec2  out_texcoord;

    void main(void) {
      float scale  = 14.0; //cos((time + timeOffset) * 0.01) * 10.0;
      vec3 scaled  = position * scale + offset;
      out_color    = color;
      out_normal   = normal;
      out_texcoord = texcoord;
      gl_Position  = projection * view * (model * vec4(scaled, 1.0));
    }
    `,
    ` 
    precision highp float;
    uniform sampler2D texture;
    varying vec3 out_color;
    varying vec3 out_normal;
    varying vec2 out_texcoord;
    void main(void) {
      vec4 color = texture2D(texture, out_texcoord.xy);
      gl_FragColor = color;
      //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `))
  material.uniforms["time"]    = new zero.Single(0)

  let _width  = 512; 
  let _height = 512;

  let image   = new Uint8Array        ((_width * _height) * 4)
  let encoder = new zero.LinearEncoder([_width, _height]);
  let simplex = new zero.SimplexNoise (new zero.DefaultRandomGenerator())
  let index   = 0;
  for(let i = 0; i < encoder.length(); i++) {
    let address = encoder.address(i)
    let value   = simplex.noise(address[1] * 0.005, address[0] * 0.005)
    value = Math.round(Math.abs(value + 1) * 256) 
    image[index + 0] = value 
    image[index + 1] = value 
    image[index + 2] = value
    image[index + 3] = 255
    index += 4
  }
  material.uniforms["texture"] = new zero.Texture2D (
    image, _width, _height, "rgba"
  )
  // material.uniforms["texture"] = new zero.Texture2D(
  //   new Uint8Array([
  //     255, 0, 0, 255,  0  , 0, 0, 255, 255, 0, 0, 255,  0  , 0, 0, 255,
  //     255, 255,  255, 255,  255, 0, 0, 255, 0,   0, 0, 255,  255, 0, 0, 255,
  //     255, 0, 0, 255,  0  , 0, 0, 255, 255, 0, 0, 255,  0  , 0, 0, 255,
  //     0,   0, 0, 255,  255, 0, 0, 255, 0,   0, 0, 255,  255, 0, 0, 255,
  //   ]), 4, 4, "rgba"
  // )


  //material.wireframe = true
  let geometry   = createCubeGeometry();
  let count      = 500;
  let offset     = new Float32Array(count * 3)
  let offsettime = new Float32Array(count)
  let idx = 0;
  for (let i = 0; i < count; i += 1) {
    offsettime[i] = i
    offset[idx + 0] = (Math.random() * 500) - 250
    offset[idx + 1] = (Math.random() * 500) - 250
    offset[idx + 2] = (Math.random() * 500) - 250
    idx += 3
  }
  geometry.instances.timeOffset = new zero.Attribute(offsettime, 1)
  geometry.instances.offset     = new zero.Attribute(offset,     3)
  return new zero.Mesh(material, geometry)
}