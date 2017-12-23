import * as hex from "@hexagon/index"

const createShader = () => new hex.Shader(
 // vertex shader
 `#version 300 es
  precision highp float;

  uniform mat4   model;
  uniform mat4   view;
  uniform mat4   projection;

  in vec4        position;
  in vec2        texcoord;
  in vec3        normal;

  in vec4        offset;
  in vec4        color;
  in float       enabled;

  out vec2       out_texcoord;
  out vec4       out_position;
  out vec4       out_color;

  void main() {
    if (enabled == 0.0) {
      gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
      vec4 temp    = position + offset;
      out_texcoord = texcoord;
      out_color    = color;
      out_position = (model * temp);
      gl_Position  = projection * view * (model * temp);
    }
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
  const cube     = new hex.CubeGeometry()
  const offsets  = new Array(width * height * depth * 4)
  const colors   = new Array(width * height * depth * 4)
  const enableds = new Array(width * height * depth)
  let offset_index  = 0
  let enabled_index = 0
  let color_index   = 0
  for ( let iz = 0; iz < depth; iz ++) {
    for ( let iy = 0; iy < height; iy ++) {
      for ( let ix = 0; ix < width; ix ++) {
        const x = (ix - (width / 2))
        const y = (iy - (height / 2))
        const z = (iz - (depth / 2))
        offsets[offset_index + 0] = x * 1.2
        offsets[offset_index + 1] = y * 1.2
        offsets[offset_index + 2] = z * 1.2
        offsets[offset_index + 3] = 1
        offset_index += 4
        colors[color_index + 0] = Math.random()
        colors[color_index + 1] = Math.random()
        colors[color_index + 2] = Math.random()
        colors[color_index + 3] = 1
        color_index += 4 
        enableds[enabled_index] = 1
        enabled_index = 0
      }
    }
  }

  const geometry = new hex.GeometryArray(cube, width * height * depth)
  geometry.addAttribute("offset",  new hex.Attribute(4, offsets))
  geometry.addAttribute("color",   new hex.Attribute(4, colors))
  geometry.addAttribute("enabled", new hex.Attribute(1, enableds))
  return geometry
}

export type VoxelData = {
  r: number,
  g: number,
  b: number,
  a: number,
  v: boolean
}

/**
 * Voxel
 * 
 * A programmable voxel mesh of the given dimensions.
 */
export class Voxel extends hex.Mesh {
  /**
   * creates a new voxel mesh.
   * @param {number} width the width of this mesh.
   * @param {number} height the height of this mesh.
   * @param {number} depth the depth of this mesh.
   * @returns {Mesh}
   */
  constructor(public width: number, public height: number, public depth: number) {
    super(new hex.Material(createShader()), createGeometry(width, height, depth))
  }

  /**
   * sets the value at the given geometry
   * @param {number} x the x position to set.
   * @param {number} y the y position to set.
   * @param {number} z the z position to set.
   * @param {VoxelData} data the data to set.
   * @returns {void}
   */
  public set(x: number, y: number, z: number, data: VoxelData): void {
    const geometry = this.geometry as hex.GeometryArray
    const colors   = geometry.attributes["color"].data  as Float32Array
    const enabled  = geometry.attributes["enabled"].data as Float32Array
    colors [((x + (y * this.width) + (z * this.width * this.height)) * 4) + 0] = data.r
    colors [((x + (y * this.width) + (z * this.width * this.height)) * 4) + 1] = data.g
    colors [((x + (y * this.width) + (z * this.width * this.height)) * 4) + 2] = data.b
    colors [((x + (y * this.width) + (z * this.width * this.height)) * 4) + 3] = data.a
    enabled[((x + (y * this.width) + (z * this.width * this.height)))] = (data.v) ? 1.0 : 0.0
    geometry.attributes["color"].needsupdate = true
    geometry.attributes["enabled"].needsupdate = true
    geometry.needsupdate = true
  }
}