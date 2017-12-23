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
import { Geometry }              from "./geometry"
import { GeometryArray }         from "./geometry-array"
import { Shader }                from "./shader"
import { Camera }                from "./camera"
import { Scene }                 from "./scene"
import { Light }                 from "./light"
import { Mesh }                  from "./mesh"
import { Object3D }              from "./object"
import { Texture2D }             from "./texture2D"
import { TextureCube }           from "./textureCube"

/**
 * Renderer
 * 
 * WebGL 2.0 graphics renderer. 
 */
export class Renderer {
  private context: WebGL2RenderingContext

  /**
   * creates a new webgl device context.
   * @param {HTMLCanvasElement} canvas the html canvas element to render to..
   * @returns {Device}
   */
  constructor(public canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext("webgl2")
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
   * @param {number} r the red value (0.0 - 1.0)
   * @param {number} g the green value  (0.0 - 1.0)
   * @param {number} b the blue value  (0.0 - 1.0)
   * @param {number} a (optional) the alpha value (default is 1.0)
   * @returns {void}
   */
  public clear(r: number, g: number, b: number, a: number = 1.0): void {
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
  private render_object(camera: Camera, transform: Matrix, object: Object3D): void {
    if (object.visible === false) {
      this.render_object_list(camera, transform, object.objects)
    }
  }

  /**
   * renders this mesh.
   * @param {Camera} the camera to render with.
   * @param {Matrx} the parent transformation matrix.
   * @param {Mesh} the mesh to render.
   * @returns {void}
   */
  private render_mesh(camera: Camera, transform: Matrix, mesh: Mesh): void {
    if (mesh.visible) {
      // mesh: update 
      mesh.update(this.context)

      // bind: material shader.
      this.context.useProgram (mesh.material.shader.program)

      // bind: camera uniform.
      const camera_projection = this.context.getUniformLocation(mesh.material.shader.program, "projection")
      const camera_view       = this.context.getUniformLocation(mesh.material.shader.program, "view")
      this.context.uniformMatrix4fv(camera_projection, false, camera.projection.v)
      this.context.uniformMatrix4fv(camera_view,       false, camera.matrix.v)
      
      // bind: object uniforms.
      const object_matrix = this.context.getUniformLocation(mesh.material.shader.program, "model")
      this.context.uniformMatrix4fv(object_matrix, false, transform.v)

      // bind: material uniforms.
      let texture_index = 0
      for (const key in mesh.material.uniforms) {
        const location = this.context.getUniformLocation(mesh.material.shader.program, key)
        const uniform  = mesh.material.uniforms[key]
        if (uniform instanceof Matrix) {
          this.context.uniformMatrix4fv(location, false, (<Matrix>uniform).v)
        } else if (uniform instanceof Single) {
          this.context.uniform1fv (location, (<Single>uniform).v)
        } else if (uniform instanceof Vector2) {
          this.context.uniform2fv (location, (<Vector2>uniform).v)
        } else if (uniform instanceof Vector3) {
          this.context.uniform3fv  (location, (<Vector3>uniform).v)
        } else if (uniform instanceof Vector4) {
          this.context.uniform4fv (location, (<Vector4>uniform).v)
        } else if (uniform instanceof Plane) {
          this.context.uniform4fv (location, (<Plane>uniform).v)
        } else if (uniform instanceof Quaternion) {
          this.context.uniform4fv (location, (<Quaternion>uniform).v)
        } else if (uniform instanceof Texture2D) {
          this.context.activeTexture(this.context.TEXTURE0 + texture_index)
          this.context.bindTexture (this.context.TEXTURE_2D, (<Texture2D>uniform).texture)
          this.context.uniform1i (location, texture_index)
          texture_index += 1
        } else if (uniform instanceof TextureCube) {
          texture_index += 1
        }
      }

      // ------------------------------------------------------
      // GeometryArray
      // ------------------------------------------------------
      if (mesh.geometry instanceof GeometryArray) {
        // bind: geometry-array attributes
        for (const key in mesh.geometry.attributes) {
          const instance = mesh.geometry.attributes[key]
          const location = this.context.getAttribLocation(mesh.material.shader.program, key)
          if (location === -1) { 
            continue
          }
          this.context.bindBuffer(this.context.ARRAY_BUFFER, instance.buffer)
          this.context.enableVertexAttribArray(location)
          this.context.vertexAttribPointer (
            location, 
            instance.stride, 
            this.context.FLOAT, 
            false,
            0, 0)
          this.context.vertexAttribDivisor(location, 1)
        }
        // bind: instance attributes
        for (const key in mesh.geometry.instance.attributes) {
          const attribute = mesh.geometry.instance.attributes[key]
          const location  = this.context.getAttribLocation(mesh.material.shader.program, key)
          if (location === -1) {
            continue
          }
          this.context.bindBuffer(this.context.ARRAY_BUFFER, attribute.buffer)
          this.context.enableVertexAttribArray(location)
          this.context.vertexAttribPointer (
            location,
            attribute.stride, 
            this.context.FLOAT, 
            false,
            0, 0)
        }
        // bind: geometry indices
        const target = this.context.ELEMENT_ARRAY_BUFFER
        const buffer = mesh.geometry.instance.indices.buffer
        this.context.bindBuffer (target, buffer)

        // draw: instanced
        const mode = this.context.TRIANGLES
        const count = mesh.geometry.instance.indices.data.length
        const offset = 0
        const iterations = mesh.geometry.length
        const type = (mesh.geometry.instance.indices.data instanceof Uint8Array) 
          ? this.context.UNSIGNED_BYTE
          : this.context.UNSIGNED_SHORT
        this.context.drawElementsInstanced(mode, count, type, offset, iterations)
      }

      // ------------------------------------------------------
      // Geometry
      // ------------------------------------------------------
      if (mesh.geometry instanceof Geometry) {
        for (const key in mesh.geometry.attributes) {
          const attribute = mesh.geometry.attributes[key]
          const location  = this.context.getAttribLocation(mesh.material.shader.program, key)
          if (location === -1) {
            continue
          }
          this.context.bindBuffer(this.context.ARRAY_BUFFER, attribute.buffer)
          this.context.enableVertexAttribArray(location)
          this.context.vertexAttribPointer (
            location,
            attribute.stride, 
            this.context.FLOAT, 
            false,
            0, 0)
        }
        // bind: geometry indices
        const target = this.context.ELEMENT_ARRAY_BUFFER
        const buffer = mesh.geometry.indices.buffer
        this.context.bindBuffer (target, buffer)

        const mode   = this.context.TRIANGLES
        const count  = mesh.geometry.indices.data.length
        const offset = 0
        const type   = (mesh.geometry.indices.data instanceof Uint8Array) 
          ? this.context.UNSIGNED_BYTE
          : this.context.UNSIGNED_SHORT
        this.context.drawElements (mode, count, type, offset)
      }

      // next:
      this.render_object_list(camera, transform, mesh.objects)
    }
  }

  /**
   * renders a group of objects.
   * @param {Camera} camera the camera 
   * @param {Matrix} transform the current world transform.
   * @param {Array<Object3D>} objects the objects to render.
   */
  private render_object_list(camera: Camera, transform: Matrix, objects: Array<Object3D>) {
    for (const object of objects) {
      if (object instanceof Mesh) {
        this.render_mesh (camera, Matrix.mul(object.matrix, transform), object as Mesh)
      } else if (object instanceof Object3D) {
        this.render_object (camera, Matrix.mul(object.matrix, transform), object as Object3D)
      } else {
        /* ignore */
      }
    }
  }

  /**
   * renders a pass with the given camera and scene.
   * @param {Camera} the camera to render with.
   * @param {Scene} the scene.
   * @returns {void}
   */
  public render(camera: Camera, scene: Scene): void {
    if (scene.visible) {
      this.render_object_list(camera, scene.matrix, scene.objects)
    }
  }
} 