

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

import { Disposable } from "./dispose"

/**
 * AttributeData
 * 
 * The allowed attribute data types.
 */
export type AttributeData =
  | Float32Array
  | Uint8Array
  | Uint16Array
  | Array<number>

/**
 * Attribute
 * 
 * A container type for a webgl geomtry attribute or index buffer.
 */
export class Attribute implements Disposable {
  public context:     WebGL2RenderingContext
  public buffer:      WebGLBuffer
  public location:    number
  public disposed:    boolean
  public needsupdate: boolean
  
  /**
   * creates a new attribute. 
   * @param {number} stride the stride between each element in the buffer. 
   * @param {AttributeArray} data the attribute data array.
   * @returns {Attribute}
   */
  constructor(public stride: number, public data: AttributeData) {
    if(data.length % stride !== 0) {
      throw Error("attribute stride mismatch with given data length.")
    }
    this.context     = undefined
    this.buffer      = undefined
    this.location    = -1
    this.disposed    = false
    this.needsupdate = true
  }
  
  /**
   * synchronizes this attribute.
   * @param {WebGL2RenderingContext} context this webgl context.
   * @param {number} target the target ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
   * @returns {void}
   */
  public update (context: WebGL2RenderingContext, target: number): void {
    if (this.needsupdate) { 
      this.context = context
      this.buffer  = (this.buffer === undefined) ? this.context.createBuffer() : this.buffer
      const data   = this.resolve_data (context, this.data, target)
      this.context.bindBuffer (target, this.buffer)
      this.context.bufferData (target, data, this.context.STATIC_DRAW)
      this.needsupdate = false
    }
  }

  /**
   * resolves a typed array from the attribute data and target.
   * @param {WebGl2RenderingContext} context the webgl2 rendering context.
   * @param {AttributeData} buffer the buffer to resolve.
   * @param {number} target the element target type.
   * @returns {Float32Array | Uint8Array | Uint16Array}
   */
  private resolve_data (context: WebGL2RenderingContext, buffer: AttributeData, target: number): Float32Array | Uint8Array | Uint16Array {
    if (buffer instanceof Float32Array || buffer instanceof Uint8Array || buffer instanceof Uint16Array) {
      return buffer
    } else {
      switch (target) {
        case context.ELEMENT_ARRAY_BUFFER: return new Uint16Array(buffer)
        case context.ARRAY_BUFFER:         return new Float32Array(buffer)
        default: throw Error("unable to resolve js array from target")
      }
    }
  }

  /**
   * disposes of this attribute.
   * returns {void}
   */
  public dispose(): void {
    if (!this.disposed) {
      if (this.context  === undefined)  return
      if (this.buffer   === undefined)  return
      this.context.deleteBuffer(this.buffer)
      this.context  = undefined
      this.buffer   = undefined
      this.disposed = true
    }
  }
}

  