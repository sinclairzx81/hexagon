import * as hex from "@hexagon/index"
import { Voxel } from "./meshes/voxel"

const canvas   = document.getElementById("canvas") as HTMLCanvasElement
const renderer = new hex.Renderer(canvas)
const camera   = new hex.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, 0, -100),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(240, 120, 1)
const scene = new hex.Scene()
scene.objects.push(voxel)

const texture = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3))

let t = 0
setInterval(() => {
  
  voxel.matrix = voxel.matrix.rotateZ(0.001)
  renderer.clear(0.1, 0.1, 0.1, 1)
  renderer.render(camera, scene)

}, 1)


