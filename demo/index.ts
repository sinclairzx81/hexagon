import * as hex from "@hexagon/index"
import { Voxel } from "./meshes/voxel"

const canvas   = document.getElementById("canvas") as HTMLCanvasElement
const renderer = new hex.Renderer(canvas)
const camera   = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, 0, -200),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(32, 32, 32)
const scene = new hex.Scene()
scene.objects.push(voxel)

const texture = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3))

let t = 0
setInterval(() => {
  const d = (Math.cos(t) + 1.0) / 2;
  for ( let iz = 0; iz < voxel.depth; iz ++) {
    for ( let iy = 0; iy < voxel.height; iy ++) {
      for ( let ix = 0; ix < voxel.width; ix ++) {
        const l = Math.random()
        
        if (l > 0.7) {
          const p = Math.random()

            const n = Math.random()
            const k = 1;//Math.random()
            voxel.set(ix, iy, iz, {  r: k, g: k, b: k, a: 1, v: true, d })
  
       }
      }
    }
  }
  t += 0.001;
  voxel.matrix = voxel.matrix.rotateZ(0.001)
  renderer.clear(0.1, 0.1, 0.1, 1)
  renderer.render(camera, scene)

}, 1)


