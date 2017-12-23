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

import { Matrix }  from "../math/matrix"
import { Single }  from "../math/single"
import { Vector2 } from "../math/vector2"
import { Vector3 } from "../math/vector3"
import { Vector4 } from "../math/vector4"
import { Plane }   from "../math/plane"

export interface LightOptions {
  position?    : Vector3
  diffuse?     : Vector3
  ambient?     : Vector3
  specular?    : Vector3
  attenuation? : Single
  intensity?   : Single
}

export class Light {
  public position    : Vector3
  public diffuse     : Vector3
  public ambient     : Vector3
  public specular    : Vector3
  public attenuation : Single
  public intensity   : Single
  constructor(options: LightOptions = {}) {
    this.position    = options.position    || new Vector3(0, 0, 0);
    this.diffuse     = options.diffuse     || new Vector3(1, 1, 1);
    this.ambient     = options.ambient     || new Vector3(0, 0, 0);
    this.specular    = options.specular    || new Vector3(1, 1, 1);
    this.attenuation = options.attenuation || new Single (0.0)
    this.intensity   = options.intensity   || new Single (1.0)
  }
}