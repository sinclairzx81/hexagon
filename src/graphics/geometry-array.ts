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


import { Geometry }  from "./geometry"
import { Attribute } from "./attribute"

/**
 * GeometryArray
 * 
 * A container type for an array of the given geometry.
 */
export class GeometryArray {
  public attributes: { [name: string]: Attribute }
  public disposed:    boolean
  public needsupdate: boolean
  
  /**
   * creates a new instance of a GeometryArray
   * @param {Geometry} instance the geometry to create an array of.
   * @param {number} length the number of instances of this array.
   * @returns {GeometryArray}
   */
  constructor(public instance: Geometry, public length: number) {
    this.attributes  = {}
    this.disposed    = false
    this.needsupdate = true
  }

  /**
   * adds a new attribute to this array.
   * @param {string} name the name of this attribute.
   * @param {Attribute} attribute the attribute to add.
   * @returns {void}
   */
  public addAttribute(name: string, attribute: Attribute): void {
    const elements = (attribute.data.length / attribute.stride)
    if (elements !== this.length) {
      throw Error(`invalid attribute length for ${name}. expected ${this.length} elements but computed ${elements} from stride.`)
    }
    this.attributes[name] = attribute
  }

  /**
   * synchronizes this geometry.
   * @param {WebGL2RenderingContext} this webgl context.
   * @returns {void}
   */
  public update (context: WebGL2RenderingContext): void { 
    this.instance.update(context)
    if (this.needsupdate) { 
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
    if (!this.disposed) {
      for (const name in this.attributes) {
        this.attributes[name].dispose()
      }
      this.disposed = true
    }
  }
}