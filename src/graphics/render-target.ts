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

export class RenderTarget implements TypeInfo {
  public context  : WebGLRenderingContext
  public buffer   : WebGLRenderbuffer
  public disposed : boolean
  
  /**
   * creates a new framebuffer object.
   * @param {width} the width of this framebuffer.
   * @param {height} the height of this framebuffer.
   * @returns {FrameBuffer}
   */
  constructor(public width: number, public height: number) {
    
  }

  /**
   * returns the typename for this type.
   * @returns {TypeName}
   */
  public typeinfo(): TypeName {
    return "Object3D"
  }

  /**
   * disposes of this framebuffer.
   * @returns {void}
   */
  public dispose(): void {
    if(this.disposed === true)      return
    if(this.context  === undefined) return
    if(this.buffer   === undefined) return
    this.context.deleteFramebuffer(this.buffer)
    this.disposed = true
  }
}