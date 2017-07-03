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

import {TypeName, TypeInfo}    from "./typeinfo"
import {Object3D}              from "./object"
import {Geometry}              from "./geometry"
import {Material}              from "./material"
import {Attribute}             from "./attribute"

export class Mesh extends Object3D implements TypeInfo {
  public instances: {[name: string]: Attribute}  = {}
  public needsupdate: boolean

  /**
   * creates a new mesh.
   * @param {Material} the material for this mesh.
   * @param {Geometry} the geometry for this mesh.
   * @returns {Mesh}
   */
  constructor(public material: Material, public geometry: Geometry) {
    super()
    this.needsupdate = true
    
  }
  public instanceCount(): number {
    let keys = Object.keys(this.instances)
    return (keys.length > 0) 
      ? this.instances[keys[0]].array.length / 
        this.instances[keys[0]].size
      : 0
  }
  /**
   * returns the typename for this type.
   * @returns {TypeName}
   */
  public typeinfo(): TypeName {
    return "Mesh"
  }

  /**
   * synchronizes this mesh.
   * @param {WebGLRenderingContext} this webgl context.
   * @returns {void}
   */
  public sync(context: WebGLRenderingContext) : void {
    if(this.needsupdate) {
      this.needsupdate = false
      // validate instances array lengths. 
      if(Object.keys(this.instances).length > 1) {
        let lens = Object.keys(this.instances).map(key => 
          this.instances[key].array.length / 
          this.instances[key].size)
        if(lens.every(n => n === lens[0]) === false) {
          throw Error("geometry: instance length mismatch.")
        }
      }
      
      // synchronize instances.
      Object.keys(this.instances).forEach(key => {
        let instance = this.instances[key]
        instance.sync(context, context.ARRAY_BUFFER)
      })
    }

    this.material.sync(context)
    this.geometry.sync(context)
  }
}