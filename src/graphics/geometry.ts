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

import {TypeName, TypeInfo} from "./typeinfo"
import {Attribute}          from "./attribute"

export interface GeometryOptions {
  attributes : {[name: string]: Attribute }
  indices    : Attribute
}
export class Geometry implements TypeInfo {
  public attributes        : {[name: string]: Attribute }
  public indices           : Attribute
  public indices_wireframe : Attribute
  public needsupdate       : boolean
  public disposed          : boolean

  /**
   * creates a new geometry object.
   * @params {GeometryOptions} the options for this geometry.
   * @returns {Geometry}
   */
  constructor(options?: GeometryOptions) {
    options = options || {attributes: undefined, indices: undefined} 
    this.attributes        = options.attributes || {}
    this.indices           = options.indices
    this.indices_wireframe = undefined
    this.needsupdate       = true
    this.disposed          = false
  }

  /**
   * returns the typename for this type.
   * @returns {TypeName}
   */
  public typeinfo(): TypeName {
    return "Geometry"
  }

  /**
   * synchronizes this geometry.
   * @param {WebGLRenderingContext} this webgl context.
   * @returns {void}
   */
  public sync(context: WebGLRenderingContext): void { 
    // need update check.
    if(!this.needsupdate) return
    this.needsupdate = false

    // synchronize indices.
    this.indices.sync(context, context.ELEMENT_ARRAY_BUFFER)
    
    // generate indices wireframe.
    let wireframe = new Uint16Array(this.indices.array.length * 2)
    for(let i = 0, j  = 0; i < this.indices.array.length; i += 3, j += 6) {
      wireframe[j + 0] = this.indices.array[i + 0]
      wireframe[j + 1] = this.indices.array[i + 1]
      wireframe[j + 2] = this.indices.array[i + 1]
      wireframe[j + 3] = this.indices.array[i + 2]
      wireframe[j + 4] = this.indices.array[i + 2]
      wireframe[j + 5] = this.indices.array[i + 0]
    } this.indices_wireframe = new Attribute(wireframe, 1)

    // synchronize indices wireframe. 
    this.indices_wireframe.sync(context, context.ELEMENT_ARRAY_BUFFER)

    // synchronize attributes.  
    Object.keys(this.attributes).forEach(key => {
      let attribute = this.attributes[key]
      attribute.sync(context, context.ARRAY_BUFFER)
    }) 
  }

  /**
   * disposes of this geometry.
   * @returns {void}
   */
  public dispose(): void {
    if(this.disposed   === true)      return
    if(this.indices    === undefined) return
    if(this.attributes === undefined) return
    this.indices.dispose()
    Object.keys(this.attributes).forEach(key => {
      this.attributes[key].dispose()
    })
    this.disposed = true
  }
}