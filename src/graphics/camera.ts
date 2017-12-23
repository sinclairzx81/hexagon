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

import { Matrix }   from "../math/matrix"
import { Vector3 }  from "../math/vector3"
import { Object3D } from "./object"

/**
 * Camera
 * 
 * A base class camera type.
 */
export class Camera extends Object3D {
  public projection: Matrix

  /**
   * creates a new camera.
   * @param {Matrix} this cameras projection matrix.
   * @param {Matrix} this cameras view matrix.
   * @returns {Camera}
   */
  constructor(projection: Matrix) { 
    super()
    this.matrix     = Matrix.identity()
    this.projection = projection
  }

  /**
   * orientates this cameras view matrix from the given arguments.
   * @param {Vector3} the position of the camera.
   * @param {Vector3} the target vector.
   * @param {Vector3} the up vector.
   * @returns {void}
   */
  public lookAt(position: Vector3, target: Vector3, up: Vector3) : void {
    this.matrix = Matrix.lookAt(position, target, up)
  }

  /**
   * returns the world space position of this camera.
   * @returns {Vector3}
   */
  public position(): Vector3 {
    return Matrix.origin(this.matrix)
  }
}

/**
 * PerspectiveCamera
 * 
 * A typical perspective camera type.
 */
export class PerspectiveCamera extends Camera {
  
  /**
   * creates a new perspective camera.
   * @param {number} the field of view.
   * @param {number} the aspect ratio.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {PerspectiveCamera}
   */
  constructor(field: number, aspect: number, near: number, far: number) {
    super(Matrix.perspectiveFov(field, aspect, near, far))
  }
}

/**
 * OrthoCamera
 * 
 * A typical orthographic camera.
 */
export class OrthoCamera extends Camera {
  /**
   * creates a new orthographic camera.
   * @param {number} the width.
   * @param {number} the height.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {PerspectiveCamera}
   */  
  constructor(width: number, height: number, near: number, far: number) {
    super(Matrix.orthographic(width, height, near, far))
  }
}