import * as hex from "@hexagon/index"

const createShader = () => new hex.Shader(
 // vertex shader
 `#version 300 es
  precision highp float;

  uniform mat4   model;
  uniform mat4   view;
  uniform mat4   projection;

  // attributes
  in vec4        position;
  in vec2        texcoord;
  in vec3        normal;

  // array attributes
  in vec3        offset;
  in vec3        color;
  in vec3        target;
  in float       enabled;
  in float       amount;

  // vs-out
  out vec4       out_position;
  out vec3       out_color;
  out vec2       out_texcoord;

  void main() {
    if (enabled == 0.0) {
      gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
      vec3 local    = (position.xyz + offset);
      vec3 remote   = (position.xyz + offset) + target;
      vec3 direct   = (remote - local);
      vec4 temp     = vec4(local + (direct * amount), 1.0);

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

 in vec4 out_position;
 in vec3 out_color;
 in vec2 out_texcoord;
 
 out vec4 color;

 void main() {
   color = vec4(out_color, 1.0);
 }
`)

const createGeometry = (width: number, height: number, depth: number) => {
  const cube     = new hex.CubeGeometry()
  const offsets  = new Array(width * height * depth * 3)
  const colors   = new Array(width * height * depth * 3)
  const targets  = new Array(width * height * depth * 3)
  const enableds = new Array(width * height * depth)
  const amounts  = new Array(width * height * depth)
  let offset_index  = 0
  let enabled_index = 0
  let color_index   = 0
  let target_index  = 0
  let amount_index  = 0
  for ( let iz = 0; iz < depth; iz ++) {
    for ( let iy = 0; iy < height; iy ++) {
      for ( let ix = 0; ix < width; ix ++) {
        const x = (ix - (width / 2))
        const y = (iy - (height / 2))
        const z = (iz - (depth / 2))
        offsets[offset_index + 0] = x * 1.2
        offsets[offset_index + 1] = y * 1.2
        offsets[offset_index + 2] = z * 1.2
        offset_index += 3
        colors[color_index + 0] = 0; Math.random()
        colors[color_index + 1] = 0; Math.random()
        colors[color_index + 2] = 0; Math.random()
        color_index += 3
        targets[target_index + 0] = (Math.random() - 0.5) * 32
        targets[target_index + 1] = (Math.random() - 0.5) * 32
        targets[target_index + 2] = (Math.random() - 0.5) * 32
        target_index += 3 
        enableds[enabled_index] = 1
        enabled_index += 1
        amounts[amount_index] = 0.0
        amount_index += 1
      }
    }
  }

  const geometry = new hex.GeometryArray(cube, width * height * depth)
  geometry.addAttribute("offset",  new hex.Attribute(3, offsets))
  geometry.addAttribute("color",   new hex.Attribute(3, colors))
  geometry.addAttribute("target",  new hex.Attribute(3, targets))
  geometry.addAttribute("enabled", new hex.Attribute(1, enableds))
  geometry.addAttribute("amount",  new hex.Attribute(1, amounts))
  return geometry
}

export type VoxelData = {
  r: number,
  g: number,
  b: number,
  a: number,
  v: boolean,
  d: number
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
   * sets the color of this voxel
   * @param {number} x the x position of this voxel.
   * @param {number} y the y position of this voxel.
   * @param {number} z the z position of this voxel.
   * @param {boolean} state the on and off state.
   * @returns {void}
   */
  public enable (x: number, y: number, z: number, state: boolean): void {
    const geometry = this.geometry as hex.GeometryArray
    const enabled = geometry.attributes["enabled"].data  as Float32Array
    const index = ((x + (y * this.width) + (z * this.width * this.height)))
    enabled[((x + (y * this.width) + (z * this.width * this.height)))] = (state) ? 1.0 : 0.0
    geometry.attributes["enabled"].needsupdate   = true
    geometry.needsupdate = true
  }
  /**
   * clears the buffer
   * @param {number} r the red component.
   * @param {number} g the green component.
   * @param {number} b the blue component.
   * @returns {void}
   */
  public clear(r: number, g: number, b:number) : void {
    const geometry = this.geometry as hex.GeometryArray
    const colors = geometry.attributes["color"].data  as Float32Array
    for (let i = 0; i < colors.length; i+= 3) {
      colors[i+0] = r
      colors[i+1] = g
      colors[i+2] = g
    }
    geometry.attributes["color"].needsupdate   = true
    geometry.needsupdate = true
  }

  /**
   * sets the color of this voxel
   * @param {number} x the x position of this voxel.
   * @param {number} y the y position of this voxel.
   * @param {number} z the z position of this voxel.
   * @param {number} r the red component (0.0 - 1.0)
   * @param {number} g the green component (0.0 - 1.0)
   * @param {number} b the blue component (0.0 - 1.0)
   * @returns {void}
   */
  public color (x: number, y: number, z: number, r: number, g: number, b: number): void {
    const geometry = this.geometry as hex.GeometryArray
    const colors = geometry.attributes["color"].data  as Float32Array
    const index = ((x + (y * this.width) + (z * this.width * this.height)) * 3)
    colors [index + 0] = r
    colors [index + 1] = g
    colors [index + 2] = b
    geometry.attributes["color"].needsupdate   = true
    geometry.needsupdate = true
  }
}