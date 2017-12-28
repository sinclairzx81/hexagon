import * as hex      from "@hexagon/index"
import { Voxel }     from "./meshes/voxel"
import { TextBlock } from "./meshes/text-block"
import { Video }     from "./meshes/video"
import { RenderTarget } from "../src/graphics/render-target";

const canvas  = document.getElementById("canvas") as HTMLCanvasElement
const context = canvas.getContext("webgl2")

const target = new hex.RenderTarget(512, 512)
const renderer = new hex.Renderer(context)
const camera   = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, -0, -280),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(320, 200, 2)
const scene = new hex.Scene()
scene.objects.push(voxel)

// animation test
const animation = new hex.Animation()
animation.add("explode", 0,     1,     "linear")
animation.add("explode", 2000,  0.02,  "linear")
animation.add("explode", 3000,  0,     "linear")
animation.add("explode", 5000,  0,     "linear")
animation.add("explode", 5500,  0.004, "linear")
animation.add("explode", 6000,  0,     "linear")
animation.add("explode", 8000,  0,     "linear")
animation.add("explode", 10000, 1,     "linear")


const video = new Video(context, 320, 200)
voxel.matrix = voxel.matrix.rotateX(180 * Math.PI / 180)
const start = Date.now()
const loop = () => requestAnimationFrame(() =>{
  const buffer = video.get()
  renderer.viewport(0, 0, canvas.width, canvas.height)
  voxel.clear(0, 0, 0)
  const state = animation.get((Date.now() - start) % 10000)["explode"]
  const amount = state.value
  // render ocean
  for(let iy = 0; iy < 200; iy++) {
    for(let ix = 0; ix < 320; ix++) {
      const r = buffer[ ((ix + (iy * 320) ) * 4) + 0] / 255
      const g = buffer[ ((ix + (iy * 320) ) * 4) + 1] / 255
      const b = buffer[ ((ix + (iy * 320) ) * 4) + 2] / 255
      voxel.color(ix, iy, 0, r, g, b)
      voxel.explode(ix, iy, 0, amount)
    }
  }
  // render text stuff
  const block = new TextBlock(new Date().toTimeString())
  for(let iy = 0; iy < block.height; iy++) {
    for(let ix = 0; ix < block.width; ix++) {
      if(block.get(ix, iy) === 1) {
        voxel.color(ix + 8, iy + 8, 0, 1, 1, 1)
      }
    }
  }
  voxel.matrix = voxel.matrix.rotateY(0.01)
  renderer.clear(0.1, 0.1, 0.1, 1)
  renderer.render(camera, scene, )
  loop()
})

loop()