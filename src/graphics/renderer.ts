/*--------------------------------------------------------------------------

hexagon - webgl graphics renderer written in typescript.

The MIT License (MIT)

Copyright (c) 2017 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Matrix }                from "../math/matrix"
import { Single }                from "../math/single"
import { Vector2 }               from "../math/vector2"
import { Vector3 }               from "../math/vector3"
import { Vector4 }               from "../math/vector4"
import { Plane }                 from "../math/plane"
import { Quaternion }            from "../math/quaternion"
import { TypeName, TypeInfo }    from "./typeinfo"
import { Shader }                from "./shader"
import { Camera }                from "./camera"
import { Scene }                 from "./scene"
import { Light }                 from "./light"
import { Mesh }                  from "./mesh"
import { Object3D }              from "./object"
import { Texture2D }             from "./texture2D"
import { TextureCube }           from "./textureCube"

/**
 * Renderer:
 * 
 * WebGL 1.0 based scene graph renderer.
 */
export class Renderer implements TypeInfo {
  private context    : WebGL2RenderingContext
  private lights     : Array<Light>

  /**
   * creates a new webgl device context.
   * @param {HTMLCanvasElement} canvas the html canvas element to render to..
   * @returns {Device}
   */
  constructor(public canvas: HTMLCanvasElement) {
    this.context    = this.canvas.getContext("webgl2")
    this.lights     = new Array<Light>()
  }

  /**
   * returns the typename for this type.
   * @returns {TypeName}
   */
  public typeinfo(): TypeName {
    return "Renderer"
  }

  /**
   * sets this renderers viewport.
   * @param {number} x the x position of the viewport.
   * @param {number} y the y position of the viewport.
   * @param {number} width the width of the viewport.
   * @param {number} height the height of the viewport.
   * @returns {void}
   */
  public viewport(x: number, y: number, width: number, height: number): void {
    this.context.viewport(x, y, width, height)
  }

  /**
   * clears the framebuffer.
   * @param {number} r the red value.
   * @param {number} g the green value.
   * @param {number} b the blue value.
   * @param {number} a the alpha value.
   * @returns {void}
   */
  public clear(r: number, g: number, b: number, a: number): void {
    this.context.clearColor (r, g, b, a)
    this.context.enable     (this.context.DEPTH_TEST)
    this.context.depthFunc  (this.context.LEQUAL)
    this.context.clear      (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT)
  }

  /**
   * renders the given node.
   * @param {Node} the node.
   * @returns {void}
   */
  private renderObject(camera: Camera, transform: Matrix, object: Object3D): void {
    if(object.visible === false) return
    this.renderObjects(camera, transform, object.objects)
  }

  /**
   * renders this mesh.
   * @param {Camera} the camera to render with.
   * @param {Matrx} the parent transformation matrix.
   * @param {Mesh} the mesh to render.
   * @returns {void}
   */
  private renderMesh(camera: Camera, transform: Matrix, mesh: Mesh): void {
    if(mesh.visible === false) return

    // synchronize mesh.
    mesh.sync(this.context)

    // bind shader.
    this.context.useProgram (mesh.material.shader.program)

    // bind lights.
    for(let i = 0; i < this.lights.length; i++) {
      let light_position    = this.context.getUniformLocation(mesh.material.shader.program, `lights[${i}].position`)
      let light_diffuse     = this.context.getUniformLocation(mesh.material.shader.program, `lights[${i}].diffuse`)
      let light_ambient     = this.context.getUniformLocation(mesh.material.shader.program, `lights[${i}].ambient`)
      let light_specular    = this.context.getUniformLocation(mesh.material.shader.program, `lights[${i}].specular`)
      let light_attenuation = this.context.getUniformLocation(mesh.material.shader.program, `lights[${i}].attenuation`)
      let light_intensity   = this.context.getUniformLocation(mesh.material.shader.program, `lights[${i}].intensity`)
      this.context.uniform3fv (light_position,    this.lights[i].position.v)
      this.context.uniform3fv (light_diffuse,     this.lights[i].diffuse.v)
      this.context.uniform3fv (light_ambient,     this.lights[i].ambient.v)
      this.context.uniform3fv (light_specular,    this.lights[i].specular.v)
      this.context.uniform1f  (light_attenuation, this.lights[i].attenuation.v[0])
      this.context.uniform1f  (light_intensity,   this.lights[i].intensity.v[0])
    }

    // bind camera uniform.
    let camera_position   = this.context.getUniformLocation(mesh.material.shader.program, "camera_position")
    let camera_projection = this.context.getUniformLocation(mesh.material.shader.program, "camera_projection")
    let camera_view       = this.context.getUniformLocation(mesh.material.shader.program, "camera_view")
    this.context.uniform3fv      (camera_position,   Matrix.origin(camera.matrix).v)
    this.context.uniformMatrix4fv(camera_projection, false, camera.projection.v)
    this.context.uniformMatrix4fv(camera_view,       false, camera.matrix.v)
    
    // bind object uniforms.
    let object_matrix = this.context.getUniformLocation(mesh.material.shader.program, "object_matrix")
    this.context.uniformMatrix4fv(object_matrix, false, transform.v)

    // bind material uniforms.
    let texture_index = 0
    Object.keys(mesh.material.uniforms).forEach(key => {
      let location = this.context.getUniformLocation(mesh.material.shader.program, key)
      let uniform  = mesh.material.uniforms[key]
      switch(uniform.typeinfo()) {
        case "Matrix":     this.context.uniformMatrix4fv(location, false, (<Matrix>uniform).v); break;
        case "Single":     this.context.uniform1fv      (location, (<Single>uniform).v);        break;
        case "Vector2":    this.context.uniform2fv      (location, (<Vector2>uniform).v);       break;
        case "Vector3":    this.context.uniform3fv      (location, (<Vector3>uniform).v);       break;
        case "Vector4":    this.context.uniform4fv      (location, (<Vector4>uniform).v);       break;
        case "Plane":      this.context.uniform4fv      (location, (<Plane>uniform).v);         break;
        case "Quaternion": this.context.uniform4fv      (location, (<Quaternion>uniform).v);    break;
        case "Texture2D":
          this.context.activeTexture(this.context.TEXTURE0 + texture_index)
          this.context.bindTexture  (this.context.TEXTURE_2D, (<Texture2D>uniform).texture)
          this.context.uniform1i    (location, texture_index)
          texture_index += 1
          break;
        case "TextureCube":
          texture_index += 1
          break;
      }
    })

    // bind instances.
    if(Object.keys(mesh.instances).length > 0) {
      Object.keys(mesh.instances).forEach(key => {
        let instance = mesh.instances[key]
        let location = this.context.getAttribLocation(mesh.material.shader.program, key)
        if(location === -1) return
        this.context.bindBuffer(this.context.ARRAY_BUFFER, instance.buffer)
        this.context.enableVertexAttribArray(location)
        this.context.vertexAttribPointer (
          location, 
          instance.size, 
          this.context.FLOAT, 
          false,
          0, 0)
        this.context.vertexAttribDivisor(location, 1)
      })
    }

    // bind attributes.
    Object.keys(mesh.geometry.attributes).forEach(key => {
      let attribute = mesh.geometry.attributes[key]
      let location  = this.context.getAttribLocation(mesh.material.shader.program, key)
      if(location === -1) return
      this.context.bindBuffer(this.context.ARRAY_BUFFER, attribute.buffer)
      this.context.enableVertexAttribArray(location)
      this.context.vertexAttribPointer(
        location,
        attribute.size, 
        this.context.FLOAT, 
        false, 
        0, 0)
    })
    
    // wireframe path.
    if(mesh.material.wireframe) {
      let target = this.context.ELEMENT_ARRAY_BUFFER
      let buffer =  mesh.geometry.indices_wireframe.buffer
      this.context.bindBuffer (target, buffer)
      if(Object.keys(mesh.instances).length === 0) {
        let mode   = this.context.LINES
        let count  = mesh.geometry.indices_wireframe.array.length
        let offset = 0
        let type   = (mesh.geometry.indices_wireframe.array instanceof Uint8Array) 
            ? this.context.UNSIGNED_BYTE
            : this.context.UNSIGNED_SHORT;
        this.context.drawElements (mode, count, type, offset)
      } else {
        let mode   = this.context.LINES
        let length = mesh.geometry.indices_wireframe.array.length
        let offset = 0
        let iterations = mesh.instanceCount()
        let type   = (mesh.geometry.indices_wireframe.array instanceof Uint8Array) 
            ? this.context.UNSIGNED_BYTE
            : this.context.UNSIGNED_SHORT
        this.context.drawElementsInstanced(mode, length, type, offset, iterations)
      }
    }
    // standard path.
    else {
      let target = this.context.ELEMENT_ARRAY_BUFFER
      let buffer = mesh.geometry.indices.buffer
      this.context.bindBuffer (target, buffer)
      if(Object.keys(mesh.instances).length === 0) {
        let mode   = this.context.TRIANGLES
        let count  = mesh.geometry.indices.array.length
        let offset = 0
        let type   = (mesh.geometry.indices.array instanceof Uint8Array) 
          ? this.context.UNSIGNED_BYTE
          : this.context.UNSIGNED_SHORT
        this.context.drawElements (mode, count, type, offset)
      } else {
        let mode       = this.context.TRIANGLES
        let count      = mesh.geometry.indices.array.length
        let offset     = 0
        let iterations = mesh.instanceCount()
        let type   = (mesh.geometry.indices.array instanceof Uint8Array) 
          ? this.context.UNSIGNED_BYTE
          : this.context.UNSIGNED_SHORT
        this.context.drawElementsInstanced(mode, count, type, offset, iterations)
      }
    }
    // next
    this.renderObjects(camera, transform, mesh.objects)
  }


  /**
   * renders a group of objects.
   * @param {Camera} camera the camera 
   * @param {Matrix} transform the current world transform.
   * @param {Array<Object3D>} objects the objects to render.
   */
  private renderObjects(camera: Camera, transform: Matrix, objects: Array<Object3D>) {
    objects.forEach(object => {
      switch (object.typeinfo()) {
        case "Object3D": this.renderObject(camera, Matrix.mul(object.matrix, transform), object as Object3D); break;
        case "Mesh":     this.renderMesh  (camera, Matrix.mul(object.matrix, transform), object as Mesh);     break;
      }
    })
  }

  /**
   * renders a pass with the given camera and scene.
   * @param {Camera} the camera to render with.
   * @param {Scene} the scene.
   * @returns {void}
   */
  public render(camera: Camera, scene: Scene): void {
    if(scene.visible === false) return
    

    this.lights = scene.lights
    this.renderObjects(camera, scene.matrix, scene.objects)
  }
} 