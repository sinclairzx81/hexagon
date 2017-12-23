import * as hex from "@hexagon/index"
import { Voxel } from "./meshes/voxel"

const canvas   = document.getElementById("canvas") as HTMLCanvasElement
const renderer = new hex.Renderer(canvas)
const camera   = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, 0, -64),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(64, 64, 32)
const scene = new hex.Scene()
scene.objects.push(voxel)

const texture = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3))

let t = 0
setInterval(() => {

  const x = (Math.cos(t) + 1) / 2
  const y = (Math.sin(t) + 1) / 2
  t += 0.01
  voxel.matrix = voxel.matrix.rotateZ(0.001).rotateY(0.001).rotateX(0.002)
  renderer.clear(0.2, 0.2, 0.2, 1)
  renderer.render(camera, scene)

}, 1)


