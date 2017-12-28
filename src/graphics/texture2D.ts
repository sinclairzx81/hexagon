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

export type TextureFormat =  "rgb" | "rgba" | "float"
export type TextureData   =  Uint8Array | Float32Array | ArrayBufferView

/**
 * converts the given texture format to a gl format.
 * @param {WebGL2RenderingContext} the webgl context.
 * @param {TextureFormat} the texture format.
 * @returns {number} the webgl texture format.
 */
const to_format = (context: WebGL2RenderingContext, format: TextureFormat) : number => {
  switch(format) {
    case "rgb"  : return context.RGB
    case "rgba" : return context.RGBA
    case "float": return context.FLOAT
    default: throw Error("unsupported texture format " + format)
  }
}

/**
 * Texture2D
 * 
 * A standard texture2D texture type.
 */
export class Texture2D implements Disposable {
  public context:     WebGLRenderingContext
  public texture:     WebGLTexture
  public pixels:      TextureData
  public needsupdate: boolean
  public disposed:    boolean
  
  /**
   * creates a new texture2D.
   * @param {number} the width of this texture.
   * @param {number} the height of this texture.
   * @param {string} the number of components per pixel.
   * @param {TextureData} the data for this texture.
   * @returns {Texture2D}
   */
  constructor(public width   : number,
              public height  : number,
              public format  : TextureFormat) {
    switch(format) {
      case "rgba":  { this.pixels = new Uint8Array(this.width * this.height * 4); break; }
      case "rgb":   { this.pixels = new Uint8Array(this.width * this.height * 3); break; }
      case "float": { this.pixels = new Float32Array(this.width * this.height); break; }
    }
    this.needsupdate = true
    this.disposed    = false
  }

  /**
   * synchronizes this attribute.
   * @param {WebGL2RenderingContext} context this webgl context.
   * @param {number} target the target ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
   * @returns {void}
   */
  public update (context: WebGL2RenderingContext): void {
    if (this.needsupdate) {
      this.context     = this.context || context
      this.texture     = this.texture || context.createTexture()
      const format = to_format(context, this.format)
      context.bindTexture    (context.TEXTURE_2D, this.texture)
      context.texImage2D     (context.TEXTURE_2D, 0, format, this.width, this.height, 0, format, context.UNSIGNED_BYTE, this.pixels)
      context.texParameteri  (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST)
      context.texParameteri  (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST)
      context.generateMipmap (context.TEXTURE_2D)
      context.bindTexture    (context.TEXTURE_2D, null)
      this.needsupdate = false
    }
  }

  /**
   * disposes of this attribute.
   * returns {void}
   */
  public dispose(): void {
    if (this.disposed === true)      return
    if (this.context  === undefined) return
    if (this.texture  === undefined) return
    this.context.deleteTexture(this.texture)
    this.disposed = true
  }
}