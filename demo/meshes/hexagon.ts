import * as hexagon from "../../src/index"

function toRadian(angle: number): number {
  return (angle * 0.01745329)
}
const createHexagonTemplate = () => ({
  positions: [
    // top
    new hexagon.Vector3(Math.sin(toRadian(60 * 0)), 1, Math.cos(toRadian(60 * 0))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 1)), 1, Math.cos(toRadian(60 * 1))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 2)), 1, Math.cos(toRadian(60 * 2))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 3)), 1, Math.cos(toRadian(60 * 3))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 4)), 1, Math.cos(toRadian(60 * 4))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 5)), 1, Math.cos(toRadian(60 * 5))),
    // bottom
    new hexagon.Vector3(Math.sin(toRadian(60 * 0)), 0, Math.cos(toRadian(60 * 0))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 1)), 0, Math.cos(toRadian(60 * 1))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 2)), 0, Math.cos(toRadian(60 * 2))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 3)), 0, Math.cos(toRadian(60 * 3))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 4)), 0, Math.cos(toRadian(60 * 4))),
    new hexagon.Vector3(Math.sin(toRadian(60 * 5)), 0, Math.cos(toRadian(60 * 5))),
  ],
  indices: [
    // top
    0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 5, 4,
    // botton
    6, 7, 8, 6, 8, 9, 6, 9, 10, 6, 10, 11,
    // sides
    0, 1, 7, 7, 6, 0, 1, 2, 8, 8, 7, 1, 2, 3, 9, 9, 8, 2,
    3, 4, 10, 10, 9, 3, 4, 5, 11, 11, 10, 4, 5, 0, 6, 6, 11, 5
  ]
})

function createHexagonGeometry() {
  let template  = createHexagonTemplate()
  let positions = new Array<hexagon.Vector3>();
  let normals   = new Array<hexagon.Vector3>();
  let texcoords = new Array<hexagon.Vector2>();
  let indices   = new Array<number>();

  for (let i = 0; i < template.indices.length; i += 3) {
    let v0 = template.positions[template.indices[i + 0]]
    let v1 = template.positions[template.indices[i + 1]]
    let v2 = template.positions[template.indices[i + 2]]

    positions.push(v0)
    positions.push(v1)
    positions.push(v2)

    let d0 = v0.sub(v1)
    let d1 = v0.sub(v2)
    let normal = d1.cross(d0).normalize()
    normals.push(normal)
    normals.push(normal)
    normals.push(normal)

    texcoords.push(new hexagon.Vector2(0, 0))
    texcoords.push(new hexagon.Vector2(0, 0))
    texcoords.push(new hexagon.Vector2(0, 0))

    indices.push(i + 0)
    indices.push(i + 1)
    indices.push(i + 2)
  }
  return new hexagon.Geometry({
    attributes: {
      vertex_position : hexagon.Attribute.fromArray(positions),
      vertex_normal   : hexagon.Attribute.fromArray(normals),
      vertex_texcoord : hexagon.Attribute.fromArray(texcoords)
    },
    indices: new hexagon.Attribute(new Uint16Array(indices), 1)
  })
}

export function createHexagonMesh(): hexagon.Mesh {
  let material = new hexagon.Material(new hexagon.Shader(
    //-----------------------------------------
    // vertex shader
    //-----------------------------------------
    `
    precision highp float;

    uniform vec3  camera_position;
    uniform mat4  camera_projection;
    uniform mat4  camera_view;
    uniform mat4  object_matrix;

    attribute vec4  instance_model_0;
    attribute vec4  instance_model_1;
    attribute vec4  instance_model_2;
    attribute vec4  instance_model_3;
    attribute vec3  instance_color;
    attribute float instance_height;

    attribute vec3  vertex_position;
    attribute vec3  vertex_normal;
    attribute vec2  vertex_texcoord;

    varying   vec3  position;
    varying   vec3  color;
    varying   vec3  normal;
    varying   vec2  texcoord;

    void main(void) {
      mat4 instance_model = object_matrix * mat4(
        instance_model_0,
        instance_model_1,
        instance_model_2,
        instance_model_3
      );
      vec3 adjusted     = vec3(vertex_position.x, vertex_position.y * instance_height, vertex_position.z);
      vec4 translated   = instance_model * vec4(adjusted, 1.0);
      position          = translated.xyz;
      color             = instance_color;
      normal            = (instance_model * vec4(vertex_normal, 0.0)).xyz;
      texcoord          = vertex_texcoord;
      gl_Position       = camera_projection * camera_view * (instance_model * vec4(adjusted, 1.0));
    }
    `, 
    //-----------------------------------------
    // fragment shader
    //-----------------------------------------
    `
    precision highp float;

    struct Light {
      vec3  position;
      vec3  diffuse;
      vec3  ambient;
      vec3  specular;
      float attenuation;
      float intensity;
    };
    uniform Light lights[16];

    uniform vec3 camera_position;
    uniform mat4 camera_projection;
    uniform mat4 camera_view;
    uniform mat4 object_matrix;

    varying vec3 position;
    varying vec3 color;
    varying vec3 normal;
    varying vec2 texcoord;

    vec3 diffuse(vec3 position, vec3 normal, vec3 color, Light light) {
      vec3   surfaceToLight     = normalize(light.position - position);
      float  diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));
      return diffuseCoefficient * color * light.intensity;
    }
    
    vec3 ambient(vec3 color, Light light) {
      return light.ambient * color * light.intensity;
    }

    vec3 specular(vec3 position, vec3 normal, vec3 color, vec3 camera_position, Light light) {
      vec3 surfaceToLight   = normalize(light.position - position);
      vec3 incidenceVector  = -surfaceToLight;                         // a unit vector
      vec3 reflectionVector = reflect(incidenceVector, normal);        // also a unit vector
      vec3 surfaceToCamera = normalize(camera_position - position);    // also a unit vector
      float cosAngle = max(0.0, dot(surfaceToCamera, reflectionVector));
      float specularCoefficient = pow(cosAngle, 1.0);                  // where 1.0 is shininess;
      return specularCoefficient * vec3(1, 1, 1) * light.intensity;    // where vec is specular  
    }

    float attenuation(vec3 position, Light light) {
      float distanceToLight = length(light.position - position);
      float attenuation = 0.001;
      if(light.attenuation > 0.0) { attenuation = light.attenuation; }
      return 1.0 / (1.0 + attenuation * pow(distanceToLight, 2.0));
    }

    void main(void) {
      vec3  _diffuse      = diffuse(position, normal, color, lights[0]);
      vec3  _ambient      = ambient(color, lights[0]);
      vec3  _specular     = specular(position, normal, color, camera_position, lights[0]);
      float _attenuation  = attenuation(position, lights[0]);
      vec3  _linear       = _ambient + (_attenuation * (_diffuse * _specular));
      vec3 _gamma         = vec3(1.0/2.2, 1.0/2.2, 1.0/2.2);
      vec3 _final         = vec3(pow(_linear.x, _gamma.x),
                                 pow(_linear.y, _gamma.y),
                                 pow(_linear.z, _gamma.z));
      gl_FragColor        = vec4(_final, 1.0);
    }
  `))
  console.log(1.0 / (1.0 + 0.01 * Math.pow(100, 2)))


  let x0           = Math.sin(toRadian(60 * 1)) * 2
  let y0           = Math.cos(toRadian(60 * 1)) * 3

  let geometry     = createHexagonGeometry();
  let width        = 200;
  let height       = 200;
  let half_width   = (width  * 0.5)
  let half_height  = (height * 0.5)
  let count        = width * height;

  let models_0  = new Array<hexagon.Vector4> (count)
  let models_1  = new Array<hexagon.Vector4> (count)
  let models_2  = new Array<hexagon.Vector4> (count)
  let models_3  = new Array<hexagon.Vector4> (count)
  let colors    = new Array<hexagon.Vector3> (count)
  let heights   = new Array<hexagon.Single>  (count)
  
  let index = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let xx = (x % 2 != 0) ? (x0 * y) : (x0 * y) + (x0 * 0.5)
      let yy = (y0 * x)
      let cols = hexagon.Matrix.translation(new hexagon.Vector3(xx - width, 0, yy - height)).rows()
      models_0[index] = cols[0]
      models_1[index] = cols[1]
      models_2[index] = cols[2]
      models_3[index] = cols[3]
      heights [index] = new hexagon.Single(1);
      colors  [index] = (Math.random() > 0.8) 
        ? new hexagon.Vector3(0.8, 0.4, 0)
        : new hexagon.Vector3(0.25, 0.25, 0.25);
      //colors  [index] = new zero.Vector3(0.8, 0.4, 0) 

      index += 1
    }
  }
  const mesh = new hexagon.Mesh(material, geometry)
  mesh.instances.instance_model_0 = hexagon.Attribute.fromArray(models_0)
  mesh.instances.instance_model_0 = hexagon.Attribute.fromArray(models_0)
  mesh.instances.instance_model_1 = hexagon.Attribute.fromArray(models_1)
  mesh.instances.instance_model_2 = hexagon.Attribute.fromArray(models_2)
  mesh.instances.instance_model_3 = hexagon.Attribute.fromArray(models_3)
  mesh.instances.instance_height  = hexagon.Attribute.fromArray(heights)
  mesh.instances.instance_color   = hexagon.Attribute.fromArray(colors)
  return mesh
}


