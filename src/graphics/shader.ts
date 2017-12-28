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

export class Shader implements Disposable {
  public context        : WebGLRenderingContext
  public program        : WebGLProgram
  public vertexShader   : WebGLShader
  public fragmentShader : WebGLShader
  public needsupdate    : boolean
  public disposed       : boolean

  /**
   * creates a new shader.
   * @param {string} the vertex shader source.
   * @param {string} the fragment shader source.
   * @returns {Shader}
   */
  constructor(public vertexSource: string, public fragmentSource: string) {
    this.context     = undefined
    this.needsupdate = true
    this.disposed    = false
  }

  /**
   * synchronizes this shader.
   * @param {WebGLRenderingContext} this webgl context.
   * @returns {void}
   */
  public update(context: WebGLRenderingContext): void {
    if (this.needsupdate === false) return
    
    this.context         = context
    this.needsupdate     = false
    
    //----------------------------------------
    // create program. 
    //----------------------------------------   
    this.program = this.program || this.context.createProgram()

    //----------------------------------------
    // compile vertex program. 
    //---------------------------------------- 
    this.vertexShader = this.vertexShader || this.context.createShader(this.context.VERTEX_SHADER)
    this.context.shaderSource (this.vertexShader, this.vertexSource)
    this.context.compileShader(this.vertexShader)
    if (this.context.getShaderParameter(this.vertexShader, this.context.COMPILE_STATUS) === false) {
      console.log(this.context.getShaderInfoLog(this.vertexShader))
      this.context.deleteShader(this.vertexShader)
      return
    }

    //----------------------------------------
    // compile fragment program. 
    //---------------------------------------- 
    this.fragmentShader = this.fragmentShader || this.context.createShader(this.context.FRAGMENT_SHADER)
    this.context.shaderSource(this.fragmentShader, this.fragmentSource)
    this.context.compileShader(this.fragmentShader)
    if (this.context.getShaderParameter(this.fragmentShader, this.context.COMPILE_STATUS) === false) {
      console.log(this.context.getShaderInfoLog(this.fragmentShader))
      this.context.deleteShader(this.fragmentShader)
      return
    }

    //----------------------------------------
    // attach and link.
    //---------------------------------------- 
    this.context.attachShader(this.program, this.vertexShader)
    this.context.attachShader(this.program, this.fragmentShader)
    this.context.linkProgram (this.program)
  }

  /**
   * disposes of this shader.
   * @returns {void}
   */
  public dispose(): void {
    if (this.disposed === true) return
    this.disposed = true
    if (this.context !== undefined) {
      if (this.program        !== undefined) this.context.deleteProgram(this.program)
      if (this.vertexShader   !== undefined) this.context.deleteShader (this.vertexShader)
      if (this.fragmentShader !== undefined) this.context.deleteShader (this.fragmentShader)
      this.program        = undefined
      this.vertexShader   = undefined
      this.fragmentShader = undefined
    }
  }
}