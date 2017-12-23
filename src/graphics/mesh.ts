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


import { Object3D }  from "./object"
import { Geometry }  from "./geometry"
import { Material }  from "./material"
import { Attribute } from "./attribute"

/**
 * Mesh
 * 
 * A renderable mesh container housing geometry and material.
 */
export class Mesh extends Object3D {
  public instances: {[name: string]: Attribute}  = {}
  public needsupdate: boolean

  /**
   * creates a new mesh.
   * @param {Material} material the material for this mesh.
   * @param {Geometry} geometry the geometry for this mesh.
   * @returns {Mesh}
   */
  constructor(public material: Material, public geometry: Geometry) {
    super()
    this.needsupdate = true
  }
  public instanceCount(): number {
    let keys = Object.keys(this.instances)
    return (keys.length > 0) 
      ? this.instances[keys[0]].data.length / 
        this.instances[keys[0]].stride
      : 0
  }

  /**
   * synchronizes this mesh.
   * @param {WebGL2RenderingContext} this webgl context.
   * @returns {void}
   */
  public update(context: WebGL2RenderingContext) : void {
    if(this.needsupdate) {
      this.needsupdate = false
      // validate instances array lengths. 
      if(Object.keys(this.instances).length > 1) {
        let lens = Object.keys(this.instances).map(key => 
          this.instances[key].data.length / 
          this.instances[key].stride)
        if(lens.every(n => n === lens[0]) === false) {
          throw Error("geometry: instance length mismatch.")
        }
      }
      
      // synchronize instances.
      Object.keys(this.instances).forEach(key => {
        let instance = this.instances[key]
        instance.update(context, context.ARRAY_BUFFER)
      })
    }

    this.material.update(context)
    this.geometry.update(context)
  }
}