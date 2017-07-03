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

/**
 * webGL primitive types.
 */
export type GLenum     = number;  // unsigned long	Used for enums. See also the list of constants.
export type GLboolean  = boolean; // boolean	A Boolean.
export type GLbitfield = number;  // unsigned long	A bit field that stores multiple, logical bits. Used for example in WebGLRenderingContext.clear().
export type GLbyte	   = number;  // byte	8-bit twos complement signed integer.
export type GLshort	   = number;  // short	16-bit twos complement signed integer.
export type GLint	     = number;  // long	32-bit twos complement signed integer.
export type GLsizei    = number;  // long	Used for sizes (e.g. width and height of the drawing buffer).
export type GLintptr   = number;  // long long	Special type for pointer arithmetic.
export type GLsizeiptr = number;  // long long	Special type for pointer arithmetic.
export type GLubyte	   = number;  // octet	8-bit twos complement unsigned integer.
export type GLushort   = number;  // unsigned short	16-bit twos complement unsigned integer.
export type GLuint     = number;  // unsigned long	32-bit twos complement unsigned integer.
export type GLfloat	   = number;  // unrestricted float	32-bit IEEE floating point number.
export type GLclampf   = number;  // unrestricted float	Clamped 32-bit IEEE floating point number.

/**
 * Extension: ANGLE_instanced_arrays
 */
export interface ANGLEInstancedArrays {

  /**
   * The ANGLE_instanced_arrays.drawArraysInstancedANGLE() method of the WebGL API renders primitives 
   * from array data like the gl.drawArrays() method. In addition, it can execute multiple instances 
   * of the range of elements.
   * @param {GLenum} A GLenum specifying the type primitive to render.  gl.POINTS, gl.LINE_STRIP, gl.LINE_LOOP, gl.LINES, gl.TRIANGLES, etc.
   * @param {GLint} A GLint specifying the starting index in the array of vector points.
   * @param {GLsizei} A GLsizei specifying the number of indices to be rendered.
   * @param {GLsizei} A GLsizei specifying the number of instances of the range of elements to execute.
   * @returns {void}
   */
  drawArraysInstancedANGLE(mode: GLenum, first: GLint, count: GLsizei, primcount: GLsizei): void
  
  /**
   * The ANGLE_instanced_arrays.drawElementsInstancedANGLE() method of the WebGL API renders primitives 
   * from array data like the gl.drawElements() method. In addition, it can execute multiple instances 
   * of a set of elements.
   * @param {GLenum} A GLenum specifying the type primitive to render.  gl.POINTS, gl.LINE_STRIP, gl.LINE_LOOP, gl.LINES, gl.TRIANGLES, etc.
   * @param {GLsizei} A GLsizei specifying the number of indices to be rendered.
   * @param {GLenum} A GLenum specifying the type of the values in the element array buffer. Possible values are:
   * @param {} A GLenum specifying the type of the values in the element array buffer
   * @param {GLintptr} A GLsizei specifying the number of instances of the set of elements to execute.
   */
  drawElementsInstancedANGLE(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, primcount: GLsizei): void

  /**
   * The ANGLE_instanced_arrays.vertexAttribDivisorANGLE() method of the WebGL API  modifies the rate at which 
   * generic vertex attributes advance when rendering multiple instances of primitives with ext.drawArraysInstancedANGLE() 
   * and ext.drawElementsInstancedANGLE().
   * @param {GLuint} A GLuint specifying the index of the generic vertex attributes.
   * @param {GLuint} A GLuint specifying the number of instances that will pass between updates of the generic attribute.
   * @returns {void}
   */
  vertexAttribDivisorANGLE(location: GLuint, divisor: GLuint): void
}

/**
 * A webgl extension provider.
 */
export class Extensions {

  /**
   * internal cache of loaded extensions.
   */
  private cache: {[name: string]: any}
  /**
   * creates a new webgl extension provider.
   * @param {WebGLRenderingContext} the webgl rendering context.
   * @returns {Extensions}
   */
  constructor(private context: WebGLRenderingContext) {
    this.cache = {}
  }
  
  /**
   * returns the ANGLE_instanced_arrays extension.
   * @param {string} the extension name.
   * @returns {ANGLEInstancedArrays}
   */
  public get(extension: "ANGLE_instanced_arrays"): ANGLEInstancedArrays
  
  /**
   * returns a extension by its extension name.
   * @param {string} the name of the extension.
   * @returns {T}
   */
  public get(...args: string[]) : any {
    let extension = args[0]
    if(this.cache[extension] !== undefined) {
      return this.cache[extension]
    }
    let ext = this.context.getExtension(extension)
    if(ext !== undefined) {
      this.cache[extension] = ext
    } return ext
  }
}