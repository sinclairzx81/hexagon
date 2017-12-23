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

import { Matrix }      from "../math/matrix"
import { Single }      from "../math/single"
import { Vector2 }     from "../math/vector2"
import { Vector3 }     from "../math/vector3"
import { Vector4 }     from "../math/vector4"
import { Plane }       from "../math/plane"
import { Quaternion }  from "../math/quaternion"
import { Shader }      from "./shader"
import { Texture2D }   from "./texture2D"
import { TextureCube } from "./textureCube"

export type UniformType = 
  Matrix     | 
  Single     | 
  Vector2    | 
  Vector3    | 
  Vector4    |
  Plane      |
  Quaternion | 
  Texture2D  |
  TextureCube

/**
 * Material: default material. Provides a abstraction over
 * mesh uniforms and houses the shader.
 */
export class Material {
  public uniforms    : {[name: string]: UniformType}
  public wireframe   : boolean
  public needsupdate : boolean

  /**
   * creates a new material.
   * @param {Shader} the shader to use with this material.
   * @returns {Material}
   */
  constructor(public shader: Shader) {
    this.uniforms    = {}
    this.wireframe   = false
    this.needsupdate = true
  }

  /**
   * updates this material
   * @param {WebGL2RenderingContext} this webgl context.
   * @returns {void}
   */
  public update(context: WebGL2RenderingContext) : void {
    this.shader.update (context)
    
    if (this.needsupdate) {
      for (const key in this.uniforms) {
        const uniform = this.uniforms[key]
        if(uniform instanceof Texture2D) {
          uniform.update (context)
        }
      }
      this.needsupdate = false
    }
  }
}