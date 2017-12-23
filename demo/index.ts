import * as hex from "@hexagon/index"
import { Voxel } from "./meshes/voxel"

const canvas   = document.getElementById("canvas") as HTMLCanvasElement
const renderer = new hex.Renderer(canvas)
const camera   = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, 0, -32),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(64, 64, 32)
const scene = new hex.Scene()
scene.objects.push(voxel)

const texture = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3))

let t = 0
setInterval(() => {
  for ( let iz = 0; iz < voxel.depth; iz ++) {
    for ( let iy = 0; iy < voxel.height; iy ++) {
      for ( let ix = 0; ix < voxel.width; ix ++) {
        const l = Math.random()
        if (l > 0.99) {
          const p = Math.random()
          if(p < 0.9) {
            const n = Math.random()
            const k = Math.random()
            voxel.set(ix, iy, iz, {  r: k, g: k, b: k, a: 1, v: n > 0.5 })
          } else {
            const n = Math.random()
            voxel.set(ix, iy, iz, {  r: Math.random(), g: Math.random(), b: Math.random(), a: 1, v: n > 0.5 })
          }
        }
      }
    }
  }
  voxel.matrix = voxel.matrix.rotateZ(0.001).rotateY(0.001).rotateX(0.002)
  renderer.clear(0.1, 0.1, 0.1, 1)
  renderer.render(camera, scene)

}, 1)


