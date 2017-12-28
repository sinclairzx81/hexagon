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

import { Attribute }  from "./attribute"
import { Disposable } from "./dispose"
/**
 * Geometry
 * 
 * A general container object for 3D geometry.
 */
export class Geometry implements Disposable {
  public context:     WebGL2RenderingContext
  public attributes:  {[name: string]: Attribute }
  public indices:     Attribute
  public needsupdate: boolean
  public disposed:    boolean

  /**
   * creates a new geometry object.
   * @params {GeometryOptions} the options for this geometry.
   * @returns {Geometry}
   */
  constructor() {
    this.attributes   = {}
    this.indices      = undefined
    this.needsupdate  = true
    this.disposed     = false
  }

  /**
   * adds a new attribute to this geometry.
   * @param {string} name the name of this attribute.
   * @param {Attribute} attribute the attribute to add.
   * @returns {void}
   */
  public addAttribute(name: string, attribute: Attribute): void {
    if (this.disposed) { 
      throw Error("cannot add attribute on disposed geometry.") 
    }
    this.attributes[name] = attribute
    this.needsupdate = true
  }

  /**
   * adds a index attribute array to this geometry.
   * @param {Attribute} attribute the indexing attribute.
   * @returns {void}
   */
  public addIndex(attribute: Attribute): void {
    if (this.disposed) { 
      throw Error("cannot add indexing attribute on disposed geometry.") 
    }
    this.indices = attribute
    this.needsupdate = true
  }

  /**
   * synchronizes this geometry.
   * @param {WebGL2RenderingContext} this webgl context.
   * @returns {void}
   */
  public update (context: WebGL2RenderingContext): void { 
    if (this.needsupdate) { 
      if (this.indices !== undefined) {
        this.indices.update (context, context.ELEMENT_ARRAY_BUFFER)
      }
      for (const name in this.attributes) {
        this.attributes[name].update(context, context.ARRAY_BUFFER)
      }
      this.needsupdate = false
    }
  }

  /**
   * disposes of this geometry.
   * @returns {void}
   */
  public dispose(): void {
    if (this.disposed) { return }
    if (this.indices !== undefined) {
      this.indices.dispose()
    }
    for (const name in this.attributes) {
      this.attributes[name].dispose()
    }
    this.disposed = true
  }
}

/**
 * CubeGeometry
 * 
 * A simple cube geometry
 */
export class CubeGeometry extends Geometry {
  constructor(private scale: number = 0.5) {
    super()
    this.build()
  }
  private build() {
    this.addAttribute("position", new Attribute(4, [
      /* front  */ 
      -this.scale, -this.scale,  this.scale, 1.0, 
       this.scale, -this.scale,  this.scale, 1.0,  
       this.scale,  this.scale,  this.scale, 1.0,  
      -this.scale,  this.scale,  this.scale, 1.0,
      /* back   */ 
      -this.scale, -this.scale, -this.scale, 1.0, 
      -this.scale,  this.scale, -this.scale, 1.0,  
       this.scale,  this.scale, -this.scale, 1.0,  
       this.scale, -this.scale, -this.scale, 1.0,
      /* top    */ 
      -this.scale, this.scale, -this.scale, 1.0, 
      -this.scale,  this.scale,  this.scale, 1.0,  
       this.scale,  this.scale,  this.scale, 1.0,  
       this.scale,  this.scale, -this.scale, 1.0,
      /* bottom */
      -this.scale, -this.scale, -this.scale, 1.0, 
       this.scale, -this.scale, -this.scale, 1.0,  
       this.scale, -this.scale,  this.scale, 1.0,  
      -this.scale, -this.scale,  this.scale, 1.0,
      /* right  */ 
       this.scale, -this.scale, -this.scale, 1.0, 
       this.scale,  this.scale, -this.scale, 1.0,  
       this.scale,  this.scale,  this.scale, 1.0,  
       this.scale, -this.scale,  this.scale, 1.0,
      /* left   */ 
      -this.scale, -this.scale,  this.scale, 1.0,  
      -this.scale,  this.scale,  this.scale, 1.0,  
      -this.scale,  this.scale, -this.scale, 1.0,
      -this.scale, -this.scale, -this.scale, 1.0
    ]))
    this.addAttribute("normal", new Attribute(3, [
      /* front  */  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,
      /* back   */  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,
      /* top    */  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,
      /* bottom */  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,
      /* right  */  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,
      /* left   */  -1.0, 0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0
    ]))
    this.addAttribute("texcoord", new Attribute(2, [
      /* front  */  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0, 
      /* back   */  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0, 
      /* top    */  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,
      /* bottom */  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,
      /* right  */  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,
       /* left   */ 0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0
    ]))
    this.addIndex(new Attribute(1, [
      /* front  */ 0,  1,  2,  0,  2,  3,   
      /* back   */ 4,  5,  6,  4,  6,  7,   
      /* top    */ 8,  9,  10, 8,  10, 11, 
      /* bottom */ 12, 13, 14, 12, 14, 15, 
      /* right  */ 16, 17, 18, 16, 18, 19, 
      /* left   */ 20, 21, 22, 20, 22, 23
    ]))
  }
}