import * as hex      from "@hexagon/index"
import { Voxel }     from "./meshes/voxel"
import { TextBlock } from "./meshes/text-block"

const canvas   = document.getElementById("canvas") as HTMLCanvasElement
const context  = canvas.getContext("webgl2")
const renderer = new hex.Renderer(context)
const camera   = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, -100, -100),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(160, 100, 1)
const scene = new hex.Scene()
scene.objects.push(voxel)

const texture      = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3))
const renderTarget = new hex.RenderTarget(100, 100)



setInterval(() => {
  voxel.clear(0, 0, 0)
  const block = new TextBlock(new Date().toISOString())
  for(let iy = 0; iy < block.height; iy++) {
    for(let ix = 0; ix < block.width; ix++) {
      if(block.get(ix, iy) === 1) {
        const time = (new Date()).getTime()
        const r = (Math.cos(time) + 1) / 2
        const g = (Math.cos(time + 123) + 1) / 2
        const b = (Math.cos(time + 1232) + 1) / 2
        voxel.color(ix, iy + 47, 0, r, g, b)
      }
    }
  }

  voxel.matrix = voxel.matrix.rotateZ(0.001).rotateX(0.001)
  renderer.clear(0.1, 0.1, 0.1, 1)
  renderer.render(camera, scene)
  renderer.render(camera, scene)

}, 1)


