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

import {Single}              from "../math/single"
import {Vector2}             from "../math/vector2"
import {Vector3}             from "../math/vector3"
import {Vector4}             from "../math/vector4"
import {TypeName, TypeInfo}  from "./typeinfo"


export class Attribute implements TypeInfo {
  public context     : WebGLRenderingContext
  public buffer      : WebGLBuffer
  public disposed    : boolean
  
  /**
   * creates a new attribute. 
   * @param {AttributeArray} the local data for this attribute.
   * @param {number} the size of each element.
   * @returns Attribute.
   */
  constructor(public array: Float32Array | Uint8Array | Uint16Array, public size: number) {
    if(array.length % size !== 0) 
      throw Error("attribute: (array.length % size) does not equal 0")
    this.context     = undefined
    this.buffer      = undefined
    this.disposed    = false
  }
  
  /**
   * returns the typename for this type.
   * @returns {TypeName}
   */
  public typeinfo(): TypeName {
    return "Attribute"
  }
  
  /**
   * synchronizes this attribute.
   * @param {WebGLRenderingContext} this webgl context.
   * @param {number} the target ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
   * @returns {void}
   */
  public sync(context: WebGLRenderingContext, target: number): void {
    this.context = context
    this.buffer  = (this.buffer === undefined)
      ? this.context.createBuffer()
      : this.buffer
    this.context.bindBuffer(target, this.buffer)
    this.context.bufferData(target, this.array, this.context.STATIC_DRAW)
  }

  /**
   * disposes of this attribute.
   * returns {void}
   */
  public dispose(): void {
    if (this.disposed === true)       return
    if (this.context  === undefined)  return
    if (this.buffer   === undefined)  return
    this.context.deleteBuffer(this.buffer)
    this.context  = undefined
    this.buffer   = undefined
    this.disposed = true
  }

  /**
   * creates a new attribute from the given vector array.
   * @param {Array<Single> | Array<Vector2> | Array<Vector3> | Array<Vector4>} array the array source. 
   * @returns {Attribute}
   */
  public static fromArray(array: Array<Single> | Array<Vector2> | Array<Vector3> | Array<Vector4>) : Attribute {
    if(array.length === 0) throw new Error("array is empty")
    let length = 0;
    let size   = 0;
    switch(array[0].typeinfo()) {
      case "Single":  length = array.length * 1;   size = 1;   break;
      case "Vector2": length = array.length * 2;   size = 2;   break;
      case "Vector3": length = array.length * 3;   size = 3;   break;
      case "Vector4": length = array.length * 4;   size = 4;   break;
      default: throw new Error("unknown array type.")
    }
    
    let index  = 0
    let buffer = new Float32Array(length)
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < array[i].v.length; j++) {
        buffer[index] = array[i].v[j]
        index += 1
      }
    }
    return new Attribute(buffer, size)
  }
}

  