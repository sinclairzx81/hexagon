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


import {Matrix}             from "../math/index"
import {TypeName, TypeInfo} from "./typeinfo"
import {Guid}               from "./guid"

/**
 * Object3D - base class 3D object. contains the object 
 * transformation and scene graph query operations.
 */
export class Object3D implements TypeInfo {
  public id        : string
  public name      : string
  public matrix    : Matrix
  public objects   : Array<Object3D>
  public visible   : boolean

  /**
   * creates a new Object3D.
   * @returns {Object3D}
   */
  constructor() {
    this.id        = Guid.next()
    this.name      = undefined 
    this.matrix    = Matrix.identity()
    this.objects   = new Array<Object3D>()
    this.visible   = true
  }

  /**
   * returns the typename for this type.
   * @returns {TypeName}
   */
  public typeinfo(): TypeName {
    return "Object3D"
  }
}