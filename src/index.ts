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

//----------------------------------------------
// mathematics
//----------------------------------------------

import { Box }        from "./math/box"
import { Frustum }    from "./math/frustum"
import { Matrix }     from "./math/matrix"
import { Plane }      from "./math/plane"
import { Quaternion } from "./math/quaternion"
import { Radian }     from "./math/radian"
import { Ray }        from "./math/ray"
import { Single }     from "./math/single"
import { Sphere }     from "./math/sphere"
import { Triangle }   from "./math/triangle"
import { Vector2 }    from "./math/vector2"
import { Vector3 }    from "./math/vector3"
import { Vector4 }    from "./math/vector4"
import { VectorN }    from "./math/vectorN"

//----------------------------------------------
// graphics
//----------------------------------------------

import { Attribute }                 from "./graphics/attribute"
import { Camera, PerspectiveCamera, OrthoCamera } from "./graphics/camera"
import { Geometry }                  from "./graphics/geometry"
import { Light }                     from "./graphics/light"
import { Material }                  from "./graphics/material"
import { Mesh }                      from "./graphics/mesh"
import { Object3D }                  from "./graphics/object"
import { Renderer }                  from "./graphics/renderer"
import { RenderTarget }              from "./graphics/rendertarget"
import { Scene }                     from "./graphics/scene"
import { Shader }                    from "./graphics/shader"
import { Texture2D }                 from "./graphics/texture2D"
import { TextureCube }               from "./graphics/textureCube"

export {
  // math
  Box,
  Frustum,
  Matrix,
  Plane,
  Quaternion,
  Radian,
  Ray,
  Single,
  Sphere,
  Triangle,
  Vector2,
  Vector3,
  Vector4,
  VectorN,

  // graphics
  Attribute,
  Camera, PerspectiveCamera, OrthoCamera,
  Geometry,
  Light,
  Material,
  Mesh,
  Object3D,
  Renderer,
  RenderTarget,
  Scene,
  Shader,
  Texture2D,
  TextureCube
}
