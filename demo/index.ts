import * as hexagon from "@hexagon/index"

import { createHexagonMesh } from "./meshes/hexagon"

const renderer    = new hexagon.Renderer(document.querySelector("#canvas") as HTMLCanvasElement)
const camera      = new hexagon.PerspectiveCamera(45, 800 / 480, 0.1, 4000)
const scene       = new hexagon.Scene()
const mesh        = createHexagonMesh()
const light       = new hexagon.Light()
light.position    = new hexagon.Vector3(0, 20, 0)
light.intensity   = new hexagon.Single(1.4);
light.attenuation = new hexagon.Single(0.0001);
scene.objects.push(mesh)
scene.lights.push (light)

let t = 0.1;
(function loop() {
  requestAnimationFrame(() => {
    const array = mesh.instances["instance_height"].array
    for(let i = 0; i < array.length; i++) {
      array[i] = (Math.cos((i * 0.16) + (t * 0.1)) * 1) + 3;
    }
    
    mesh.needsupdate = true;
    mesh.matrix = mesh.matrix.rotateY(0.0025)
    camera.lookAt(
      new hexagon.Vector3((t * 0.14) % 30, 10, (t * 0.04) % 30),
      new hexagon.Vector3(0, 0,  0),
      new hexagon.Vector3(-0.5, 1,  0)
    )
    renderer.render(camera, scene)
    renderer.clear (0.11, 0.11, 0.11, 1)
    renderer.render(camera, scene)
    t += 1.0
    loop()
  })
})();

