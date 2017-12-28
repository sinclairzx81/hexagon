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
import { Texture2D }  from "./texture2D"

/**
 * RenderTarget
 * 
 * A render target object.
 */
export class RenderTarget implements Disposable {
  public context:     WebGLRenderingContext
  public framebuf:    WebGLFramebuffer
  public texture:     WebGLTexture
  public buffer:      Uint8Array
  public needsupdate: boolean
  public disposed:    boolean
  
  /**
   * creates a new render target.
   * @param {number} width the width of this render target.
   * @param {number} height the height of this render target.
   * @returns {RenderTarget}
   */
  constructor(public width: number, public height: number) {
    this.buffer      = new Uint8Array(this.width * this.height * 3)
    this.needsupdate = true
    this.disposed    = false
  }

  /**
   * synchronizes this object.
   * @param {WebGL2RenderingContext} context the webgl rendering context.
   * @returns {void}
   */
  public update(context: WebGL2RenderingContext): void {
    if (this.needsupdate) {
      this.context  = context
      this.framebuf = context.createFramebuffer()
      this.texture  = this.context.createTexture()
      context.bindTexture    (context.TEXTURE_2D, this.texture)
      context.texImage2D     (context.TEXTURE_2D, 0, context.RGB, this.width, this.height, 0, context.RGB, context.UNSIGNED_BYTE, this.buffer)
      context.texParameteri  (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST)
      context.texParameteri  (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST)
      context.generateMipmap (context.TEXTURE_2D)
      context.bindTexture    (context.TEXTURE_2D, null)
      this.needsupdate = false
    }
  }

  /**
   * disposes of this framebuffer.
   * @returns {void}
   */
  public dispose(): void {
    if(!this.disposed) {
      if(this.framebuf !== undefined) { this.context.deleteFramebuffer(this.framebuf) }
      if(this.texture !== undefined)  { this.context.deleteTexture(this.texture) }
    }
  }
}