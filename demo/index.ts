import * as hex      from "@hexagon/index"
import { Voxel }     from "./meshes/voxel"
import { TextBlock } from "./meshes/text-block"
import { Video }     from "./meshes/video"

const canvas  = document.getElementById("canvas") as HTMLCanvasElement
const context = canvas.getContext("webgl2")


const renderer = new hex.Renderer(context)
const camera   = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.matrix = hex.Matrix.lookAt (
  new hex.Vector3(0, -0, -250),
  new hex.Vector3(0, 0, 0),
  new hex.Vector3(0, 1, 0)
)
const voxel = new Voxel(256, 96, 2)
const scene = new hex.Scene()
scene.objects.push(voxel)

const video = new Video(context, 256, 96)
voxel.matrix = voxel.matrix.rotateX(180 * Math.PI / 180)
const loop = () => requestAnimationFrame(() =>{
  const buffer = video.get()
  renderer.viewport(0, 0, canvas.width, canvas.height)
  voxel.clear(0, 0, 0)

  // // render ocean
  for(let iy = 0; iy < 96; iy++) {
    for(let ix = 0; ix < 256; ix++) {
      const r = buffer[ ((ix + (iy * 256) ) * 4) + 0] / 255
      const g = buffer[ ((ix + (iy * 256) ) * 4) + 1] / 255
      const b = buffer[ ((ix + (iy * 256) ) * 4) + 2] / 255
      voxel.color(ix, iy, 0, r, g, b)
      const amount = Math.cos(Date.now() * 0.0005)
      voxel.amount(ix, iy, 0, amount >= 0 ? amount : 0)
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
  renderer.render(camera, scene)
  renderer.render(camera, scene)
  loop()
})

loop()