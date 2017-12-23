import * as hex from "@hexagon/index"

const createShader = () => new hex.Shader(
 // vertex shader
 `#version 300 es
  precision highp float;

  uniform mat4   model;
  uniform mat4   view;
  uniform mat4   projection;

  in vec4 position;
  in vec2 texcoord;
  in vec3 normal;
  in vec4 offset;
  in vec4 color;

  out vec2 out_texcoord;
  out vec4 out_position;
  out vec4 out_color;

  void main() {
    vec4 temp    = position + offset;
    out_texcoord = texcoord;
    out_color    = color;
    out_position = (model * temp);
    gl_Position  = projection * view * (model * temp);
  }
`,
// fragment shader
`#version 300 es

precision highp float;

uniform sampler2D map;
in vec2 out_texcoord;
in vec4 out_position;
in vec4 out_color;

out vec4 color;

void main() {
  color = out_color;
}
`)

const createGeometry = (width: number, height: number, depth: number) => {
  const cube    = new hex.CubeGeometry()
  const offsets = new Array(width * height * depth * 4)
  const colors  = new Array(width * height * depth * 4)
  const actives = new Array(width * height * depth)
  let offset_index = 0
  let active_index = 0
  let color_index = 0
  for ( let iz = 0; iz < depth; iz ++) {
    for ( let iy = 0; iy < height; iy ++) {
      for ( let ix = 0; ix < width; ix ++) {
        const x = (ix - (width / 2))
        const y = (iy - (height / 2))
        const z = (iz - (depth / 2))
        offsets[offset_index + 0] = x * 1
        offsets[offset_index + 1] = y * 1
        offsets[offset_index + 2] = z * 1
        offsets[offset_index + 3] = 1
        offset_index += 4

        colors[color_index + 0] = Math.random()
        colors[color_index + 1] = Math.random()
        colors[color_index + 2] = Math.random()
        colors[color_index + 3] = 1
        color_index += 4 

        actives[active_index] = 1
        active_index = 0
      }
    }
  }

  const geometry = new hex.GeometryArray(cube, width * height * depth)
  geometry.addAttribute("offset", new hex.Attribute(4, offsets))
  geometry.addAttribute("color",  new hex.Attribute(4, colors))
  geometry.addAttribute("active", new hex.Attribute(1, actives))
  return geometry
}

export class Voxel extends hex.Mesh {
  constructor(private width: number, private height: number, private depth: number) {
    super(new hex.Material(createShader()), createGeometry(width, height, depth))
  }

  public set(x: number, y: number, z: number, active: number): void {
    const geometry = this.geometry as hex.GeometryArray

  }
}