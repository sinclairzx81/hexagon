(function () {
  var main = null;
  var modules = {
      "require": {
          factory: undefined,
          dependencies: [],
          exports: function (args, callback) { return require(args, callback); },
          resolved: true
      }
  };
  function define(id, dependencies, factory) {
      return main = modules[id] = {
          dependencies: dependencies,
          factory: factory,
          exports: {},
          resolved: false
      };
  }
  function resolve(definition) {
      if (definition.resolved === true)
          return;
      definition.resolved = true;
      var dependencies = definition.dependencies.map(function (id) {
          return (id === "exports")
              ? definition.exports
              : (function () {
                  if(modules[id] !== undefined) {
                    resolve(modules[id]);
                    return modules[id].exports;
                  } else {
                    try {
                      return require(id);
                    } catch(e) {
                      throw Error("module '" + id + "' not found.");
                    }
                  }
              })();
      });
      definition.factory.apply(null, dependencies);
  }
  function collect() {
      Object.keys(modules).map(function (key) { return modules[key]; }).forEach(resolve);
      return (main !== null) 
        ? main.exports
        : undefined
  }

  var __extends = (this && this.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  define("src/math/radian", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Radian = (function () {
          function Radian() {
          }
          Radian.toAngle = function (radian) {
              return (radian * 57.29578);
          };
          Radian.toRadian = function (angle) {
              return (angle * 0.01745329);
          };
          return Radian;
      }());
      exports.Radian = Radian;
  });
  define("src/math/vector3", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var f32 = { max: 2147483647, min: -2147483647 };
      var v3i = { x: 0, y: 1, z: 2 };
      var qi = { x: 0, y: 1, z: 2, w: 3 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var Vector3 = (function () {
          function Vector3(x, y, z) {
              this.v = new Float32Array(3);
              this.v[v3i.x] = x === undefined ? 0.0 : x;
              this.v[v3i.y] = y === undefined ? 0.0 : y;
              this.v[v3i.z] = z === undefined ? 0.0 : z;
          }
          Vector3.prototype.toString = function () {
              return "[" + this.v[v3i.x] + ", " + this.v[v3i.y] + ", " + this.v[v3i.z] + "]";
          };
          Vector3.prototype.clone = function () {
              return Vector3.clone(this);
          };
          Vector3.prototype.x = function (value) {
              if (value !== undefined) {
                  this.v[v3i.x] = value;
              }
              return this.v[v3i.x];
          };
          Vector3.prototype.y = function (value) {
              if (value !== undefined) {
                  this.v[v3i.y] = value;
              }
              return this.v[v3i.y];
          };
          Vector3.prototype.z = function (value) {
              if (value !== undefined) {
                  this.v[v3i.z] = value;
              }
              return this.v[v3i.z];
          };
          Vector3.prototype.length = function () {
              return Vector3.getLength(this);
          };
          Vector3.prototype.lengthSq = function () {
              return Vector3.getLengthSq(this);
          };
          Vector3.prototype.normalize = function () {
              return Vector3.normalize(this);
          };
          Vector3.prototype.dot = function (v0) {
              return Vector3.dot(this, v0);
          };
          Vector3.prototype.cross = function (v0) {
              return Vector3.cross(this, v0);
          };
          Vector3.prototype.add = function (v0) {
              return Vector3.add(this, v0);
          };
          Vector3.prototype.sub = function (v0) {
              return Vector3.sub(this, v0);
          };
          Vector3.prototype.mul = function (v0) {
              return Vector3.mul(this, v0);
          };
          Vector3.prototype.div = function (v0) {
              return Vector3.div(this, v0);
          };
          Vector3.prototype.scale = function (s0) {
              return Vector3.scale(this, s0);
          };
          Vector3.prototype.negate = function () {
              return Vector3.negate(this);
          };
          Vector3.zero = function () {
              return new Vector3(0.0, 0.0, 0.0);
          };
          Vector3.one = function () {
              return new Vector3(1.0, 1.0, 1.0);
          };
          Vector3.unitX = function () {
              return new Vector3(1.0, 0.0, 0.0);
          };
          Vector3.unitY = function () {
              return new Vector3(0.0, 1.0, 0.0);
          };
          Vector3.unitZ = function () {
              return new Vector3(0.0, 0.0, 1.0);
          };
          Vector3.left = function () {
              return new Vector3(-1.0, 0.0, 0.0);
          };
          Vector3.right = function () {
              return new Vector3(1.0, 0.0, 0.0);
          };
          Vector3.up = function () {
              return new Vector3(0.0, 1.0, 0.0);
          };
          Vector3.down = function () {
              return new Vector3(0.0, -1.0, 0.0);
          };
          Vector3.forward = function () {
              return new Vector3(0.0, 0.0, 1.0);
          };
          Vector3.backward = function () {
              return new Vector3(0.0, 0.0, -1.0);
          };
          Vector3.equals = function (v0, v1) {
              return (v0.v[v3i.x] === v1.v[v3i.x] &&
                  v0.v[v3i.y] === v1.v[v3i.y] &&
                  v0.v[v3i.z] === v1.v[v3i.z]);
          };
          Vector3.getLength = function (v0) {
              return Math.sqrt((v0.v[v3i.x] * v0.v[v3i.x]) +
                  (v0.v[v3i.y] * v0.v[v3i.y]) +
                  (v0.v[v3i.z] * v0.v[v3i.z]));
          };
          Vector3.getLengthSq = function (v0) {
              return ((v0.v[v3i.x] * v0.v[v3i.x]) +
                  (v0.v[v3i.y] * v0.v[v3i.y]) +
                  (v0.v[v3i.z] * v0.v[v3i.z]));
          };
          Vector3.distance = function (v0, v1) {
              var x = v0.v[v3i.x] - v1.v[v3i.x];
              var y = v0.v[v3i.y] - v1.v[v3i.y];
              var z = v0.v[v3i.z] - v1.v[v3i.z];
              return Math.sqrt((x * x) + (y * y) + (z * z));
          };
          Vector3.distanceSq = function (v0, v1) {
              var x = v0.v[v3i.x] - v1.v[v3i.x];
              var y = v0.v[v3i.y] - v1.v[v3i.y];
              var z = v0.v[v3i.z] - v1.v[v3i.z];
              return ((x * x) + (y * y) + (z * z));
          };
          Vector3.dot = function (v0, v1) {
              return ((v0.v[v3i.x] * v1.v[v3i.x]) +
                  (v0.v[v3i.y] * v1.v[v3i.y]) +
                  (v0.v[v3i.z] * v1.v[v3i.z]));
          };
          Vector3.normalize = function (v0) {
              var len = 1.0 / Math.sqrt((v0.v[v3i.x] * v0.v[v3i.x]) +
                  (v0.v[v3i.y] * v0.v[v3i.y]) +
                  (v0.v[v3i.z] * v0.v[v3i.z]));
              return new Vector3(v0.v[v3i.x] * len, v0.v[v3i.y] * len, v0.v[v3i.z] * len);
          };
          Vector3.cross = function (v0, v1) {
              return new Vector3((v0.v[v3i.y] * v1.v[v3i.z]) - (v0.v[v3i.z] * v1.v[v3i.y]), (v0.v[v3i.z] * v1.v[v3i.x]) - (v0.v[v3i.x] * v1.v[v3i.z]), (v0.v[v3i.x] * v1.v[v3i.y]) - (v0.v[v3i.y] * v1.v[v3i.x]));
          };
          Vector3.reflect = function (v0, n0) {
              var dot = ((v0.v[v3i.x] * n0.v[v3i.x]) +
                  (v0.v[v3i.y] * n0.v[v3i.y]) +
                  (v0.v[v3i.z] * n0.v[v3i.z]));
              return new Vector3(v0.v[v3i.x] - ((2.0 * dot) * n0.v[v3i.x]), v0.v[v3i.y] - ((2.0 * dot) * n0.v[v3i.y]), v0.v[v3i.z] - ((2.0 * dot) * n0.v[v3i.z]));
          };
          Vector3.abs = function (v0) {
              return new Vector3(Math.abs(v0.v[v3i.x]), Math.abs(v0.v[v3i.y]), Math.abs(v0.v[v3i.z]));
          };
          Vector3.min = function (v0, v1) {
              return new Vector3((v0.v[v3i.x] < v1.v[v3i.x]) ? v0.v[v3i.x] : v1.v[v3i.x], (v0.v[v3i.y] < v1.v[v3i.y]) ? v0.v[v3i.y] : v1.v[v3i.y], (v0.v[v3i.z] < v1.v[v3i.z]) ? v0.v[v3i.z] : v1.v[v3i.z]);
          };
          Vector3.max = function (v0, v1) {
              return new Vector3((v0.v[v3i.x] > v1.v[v3i.x]) ? v0.v[v3i.x] : v1.v[v3i.x], (v0.v[v3i.y] > v1.v[v3i.y]) ? v0.v[v3i.y] : v1.v[v3i.y], (v0.v[v3i.z] > v1.v[v3i.z]) ? v0.v[v3i.z] : v1.v[v3i.z]);
          };
          Vector3.clamp = function (v0, min, max) {
              var x = v0.v[v3i.x];
              var y = v0.v[v3i.y];
              var z = v0.v[v3i.z];
              x = (x > max.v[v3i.x]) ? max.v[v3i.x] : x;
              x = (x < min.v[v3i.x]) ? min.v[v3i.x] : x;
              y = (y > max.v[v3i.y]) ? max.v[v3i.y] : y;
              y = (y < min.v[v3i.y]) ? min.v[v3i.y] : y;
              z = (z > max.v[v3i.z]) ? max.v[v3i.z] : z;
              z = (z < min.v[v3i.z]) ? min.v[v3i.z] : z;
              return new Vector3(x, y, z);
          };
          Vector3.lerp = function (v0, v1, amount) {
              return new Vector3(v0.v[v3i.x] + ((v1.v[v3i.x] - v0.v[v3i.x]) * amount), v0.v[v3i.y] + ((v1.v[v3i.y] - v0.v[v3i.y]) * amount), v0.v[v3i.z] + ((v1.v[v3i.z] - v0.v[v3i.z]) * amount));
          };
          Vector3.barycentric = function (v0, v1, v2, amount0, amount1) {
              return new Vector3((v0.v[v3i.x] + (amount0 * (v1.v[v3i.x] - v0.v[v3i.x]))) + (amount1 * (v2.v[v3i.x] - v0.v[v3i.x])), (v0.v[v3i.y] + (amount0 * (v1.v[v3i.y] - v0.v[v3i.y]))) + (amount1 * (v2.v[v3i.y] - v0.v[v3i.y])), (v0.v[v3i.z] + (amount0 * (v1.v[v3i.z] - v0.v[v3i.z]))) + (amount1 * (v2.v[v3i.z] - v0.v[v3i.z])));
          };
          Vector3.smoothstep = function (v0, v1, amount) {
              amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount);
              amount = (amount * amount) * (3.0 - (2.0 * amount));
              return new Vector3(v0.v[v3i.x] + ((v1.v[v3i.x] - v0.v[v3i.x]) * amount), v0.v[v3i.y] + ((v1.v[v3i.y] - v0.v[v3i.y]) * amount), v0.v[v3i.z] + ((v1.v[v3i.z] - v0.v[v3i.z]) * amount));
          };
          Vector3.catmullrom = function (v0, v1, v2, v3, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              return new Vector3(0.5 * ((((2.0 * v1.v[v3i.x])
                  + ((-v0.v[v3i.x] + v2.v[v3i.x]) * amount))
                  + (((((2.0 * v0.v[v3i.x]) - (5.0 * v1.v[v3i.x]))
                      + (4.0 * v2.v[v3i.x])) - v3.v[v3i.x]) * n0))
                  + ((((-v0.v[v3i.x] + (3.0 * v1.v[v3i.x]))
                      - (3.0 * v2.v[v3i.x])) + v3.v[v3i.x]) * n1)), 0.5 * ((((2.0 * v1.v[v3i.y])
                  + ((-v0.v[v3i.y] + v2.v[v3i.y]) * amount))
                  + (((((2.0 * v0.v[v3i.y]) - (5.0 * v1.v[v3i.y]))
                      + (4.0 * v2.v[v3i.y])) - v3.v[v3i.y]) * n0))
                  + ((((-v0.v[v3i.y] + (3.0 * v1.v[v3i.y]))
                      - (3.0 * v2.v[v3i.y])) + v3.v[v3i.y]) * n1)), 0.5 * ((((2.0 * v1.v[v3i.z])
                  + ((-v0.v[v3i.z] + v2.v[v3i.z]) * amount))
                  + (((((2.0 * v0.v[v3i.z]) - (5.0 * v1.v[v3i.z]))
                      + (4.0 * v2.v[v3i.z])) - v3.v[v3i.z]) * n0))
                  + ((((-v0.v[v3i.z] + (3.0 * v1.v[v3i.z]))
                      - (3.0 * v2.v[v3i.z])) + v3.v[v3i.z]) * n1)));
          };
          Vector3.hermite = function (v0, t0, v1, t1, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              var n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0;
              var n3 = (-2.0 * n1) + (3.0 * n0);
              var n4 = (n1 - (2.0 * n0)) + amount;
              var n5 = n1 - n0;
              return new Vector3((((v0.v[v3i.x] * n2) + (v1.v[v3i.x] * n3)) + (t0.v[v3i.x] * n4)) + (t1.v[v3i.x] * n5), (((v0.v[v3i.y] * n2) + (v1.v[v3i.y] * n3)) + (t0.v[v3i.y] * n4)) + (t1.v[v3i.y] * n5), (((v0.v[v3i.z] * n2) + (v1.v[v3i.z] * n3)) + (t0.v[v3i.z] * n4)) + (t1.v[v3i.z] * n5));
          };
          Vector3.transform = function (v0, m0) {
              return new Vector3((((v0.v[v3i.x] * m0.v[mi.m11]) + (v0.v[v3i.y] * m0.v[mi.m21])) + (v0.v[v3i.z] * m0.v[mi.m31])) + m0.v[mi.m41], (((v0.v[v3i.x] * m0.v[mi.m12]) + (v0.v[v3i.y] * m0.v[mi.m22])) + (v0.v[v3i.z] * m0.v[mi.m32])) + m0.v[mi.m42], (((v0.v[v3i.x] * m0.v[mi.m13]) + (v0.v[v3i.y] * m0.v[mi.m23])) + (v0.v[v3i.z] * m0.v[mi.m33])) + m0.v[mi.m43]);
          };
          Vector3.transformNormal = function (n0, m0) {
              return new Vector3(((n0.v[v3i.x] * m0.v[mi.m11]) + (n0.v[v3i.y] * m0.v[mi.m21])) + (n0.v[v3i.z] * m0.v[mi.m31]), ((n0.v[v3i.x] * m0.v[mi.m12]) + (n0.v[v3i.y] * m0.v[mi.m22])) + (n0.v[v3i.z] * m0.v[mi.m32]), ((n0.v[v3i.x] * m0.v[mi.m13]) + (n0.v[v3i.y] * m0.v[mi.m23])) + (n0.v[v3i.z] * m0.v[mi.m33]));
          };
          Vector3.transformQuaternion = function (v0, q0) {
              var n0 = q0.v[qi.x] + q0.v[qi.x];
              var n1 = q0.v[qi.y] + q0.v[qi.y];
              var n2 = q0.v[qi.z] + q0.v[qi.z];
              var n3 = q0.v[qi.w] * n0;
              var n4 = q0.v[qi.w] * n1;
              var n5 = q0.v[qi.w] * n2;
              var n6 = q0.v[qi.x] * n0;
              var n7 = q0.v[qi.x] * n1;
              var n8 = q0.v[qi.x] * n2;
              var n9 = q0.v[qi.y] * n1;
              var n10 = q0.v[qi.y] * n2;
              var n11 = q0.v[qi.z] * n2;
              return new Vector3(((v0.v[v3i.x] * ((1.0 - n9) - n11)) + (v0.v[v3i.y] * (n7 - n5))) + (v0.v[v3i.z] * (n8 + n4)), ((v0.v[v3i.x] * (n7 + n5)) + (v0.v[v3i.y] * ((1.0 - n6) - n11))) + (v0.v[v3i.z] * (n10 - n3)), ((v0.v[v3i.x] * (n8 - n4)) + (v0.v[v3i.y] * (n10 + n3))) + (v0.v[v3i.z] * ((1.0 - n6) - n9)));
          };
          Vector3.add = function (v0, v1) {
              return new Vector3(v0.v[v3i.x] + v1.v[v3i.x], v0.v[v3i.y] + v1.v[v3i.y], v0.v[v3i.z] + v1.v[v3i.z]);
          };
          Vector3.sub = function (v0, v1) {
              return new Vector3(v0.v[v3i.x] - v1.v[v3i.x], v0.v[v3i.y] - v1.v[v3i.y], v0.v[v3i.z] - v1.v[v3i.z]);
          };
          Vector3.mul = function (v0, v1) {
              return new Vector3(v0.v[v3i.x] - v1.v[v3i.x], v0.v[v3i.y] - v1.v[v3i.y], v0.v[v3i.z] - v1.v[v3i.z]);
          };
          Vector3.div = function (v0, v1) {
              return new Vector3(v0.v[v3i.x] / v1.v[v3i.x], v0.v[v3i.y] / v1.v[v3i.y], v0.v[v3i.z] / v1.v[v3i.z]);
          };
          Vector3.scale = function (v0, scalar) {
              return new Vector3(v0.v[v3i.x] * scalar, v0.v[v3i.y] * scalar, v0.v[v3i.z] * scalar);
          };
          Vector3.negate = function (v0) {
              return new Vector3(-v0.v[v3i.x], -v0.v[v3i.y], -v0.v[v3i.z]);
          };
          Vector3.clone = function (v0) {
              return new Vector3(v0.v[v3i.x], v0.v[v3i.y], v0.v[v3i.z]);
          };
          Vector3.create = function (x, y, z) {
              return new Vector3(x, y, z);
          };
          Vector3.MAX_VALUE = new Vector3(f32.max, f32.max, f32.max);
          Vector3.MIN_VALUE = new Vector3(f32.min, f32.min, f32.min);
          return Vector3;
      }());
      exports.Vector3 = Vector3;
  });
  define("src/math/quaternion", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var qui = { x: 0, y: 1, z: 2, w: 3 };
      var v3i = { x: 0, y: 1, z: 2 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var Quaternion = (function () {
          function Quaternion(x, y, z, w) {
              this.v = new Float32Array(4);
              this.v[qui.x] = x === undefined ? 0.0 : x;
              this.v[qui.y] = y === undefined ? 0.0 : y;
              this.v[qui.z] = z === undefined ? 0.0 : z;
              this.v[qui.w] = w === undefined ? 1.0 : w;
          }
          Quaternion.prototype.toString = function () {
              return "[" + this.v[qui.x] + ", " + this.v[qui.y] + ", " + this.v[qui.z] + ", " + this.v[qui.w] + "]";
          };
          Quaternion.prototype.clone = function () {
              return Quaternion.clone(this);
          };
          Quaternion.prototype.x = function (value) {
              if (value !== undefined) {
                  this.v[qui.x] = value;
              }
              return this.v[qui.x];
          };
          Quaternion.prototype.y = function (value) {
              if (value !== undefined) {
                  this.v[qui.y] = value;
              }
              return this.v[qui.y];
          };
          Quaternion.prototype.z = function (value) {
              if (value !== undefined) {
                  this.v[qui.z] = value;
              }
              return this.v[qui.z];
          };
          Quaternion.prototype.w = function (value) {
              if (value !== undefined) {
                  this.v[qui.w] = value;
              }
              return this.v[qui.w];
          };
          Quaternion.prototype.length = function () {
              return Quaternion.getLength(this);
          };
          Quaternion.prototype.lengthSq = function () {
              return Quaternion.getLengthSq(this);
          };
          Quaternion.prototype.normalize = function () {
              return Quaternion.normalize(this);
          };
          Quaternion.prototype.dot = function (v0) {
              return Quaternion.dot(this, v0);
          };
          Quaternion.prototype.concat = function (q0) {
              return Quaternion.concat(this, q0);
          };
          Quaternion.prototype.add = function (q0) {
              return Quaternion.add(this, q0);
          };
          Quaternion.prototype.sub = function (q0) {
              return Quaternion.sub(this, q0);
          };
          Quaternion.prototype.mul = function (q0) {
              return Quaternion.mul(this, q0);
          };
          Quaternion.prototype.div = function (q0) {
              return Quaternion.div(this, q0);
          };
          Quaternion.equals = function (q0, q1) {
              return (q0.v[qui.x] === q1.v[qui.x] &&
                  q0.v[qui.y] === q1.v[qui.y] &&
                  q0.v[qui.z] === q1.v[qui.z] &&
                  q0.v[qui.w] === q1.v[qui.w]);
          };
          Quaternion.getLength = function (q0) {
              return Math.sqrt((q0.v[qui.x] * q0.v[qui.x]) +
                  (q0.v[qui.y] * q0.v[qui.y]) +
                  (q0.v[qui.z] * q0.v[qui.z]) +
                  (q0.v[qui.w] * q0.v[qui.w]));
          };
          Quaternion.getLengthSq = function (q0) {
              return ((q0.v[qui.x] * q0.v[qui.x]) +
                  (q0.v[qui.y] * q0.v[qui.y]) +
                  (q0.v[qui.z] * q0.v[qui.z]) +
                  (q0.v[qui.w] * q0.v[qui.w]));
          };
          Quaternion.normalize = function (q0) {
              var len = 1.0 / Math.sqrt((q0.v[qui.x] * q0.v[qui.x]) +
                  (q0.v[qui.y] * q0.v[qui.y]) +
                  (q0.v[qui.z] * q0.v[qui.z]) +
                  (q0.v[qui.w] * q0.v[qui.w]));
              return new Quaternion(q0.v[qui.x] * len, q0.v[qui.y] * len, q0.v[qui.z] * len, q0.v[qui.w] * len);
          };
          Quaternion.dot = function (q0, q1) {
              return ((q0.v[qui.x] * q1.v[qui.x]) +
                  (q0.v[qui.y] * q1.v[qui.y]) +
                  (q0.v[qui.z] * q1.v[qui.z]) +
                  (q0.v[qui.w] * q1.v[qui.w]));
          };
          Quaternion.conjugate = function (q0) {
              return new Quaternion(-q0.v[qui.x], -q0.v[qui.y], -q0.v[qui.z], q0.v[qui.w]);
          };
          Quaternion.inverse = function (q0) {
              var n0 = (((q0.v[qui.x] * q0.v[qui.x]) +
                  (q0.v[qui.y] * q0.v[qui.y])) +
                  (q0.v[qui.z] * q0.v[qui.z])) +
                  (q0.v[qui.w] * q0.v[qui.w]);
              var n1 = 1.0 / n0;
              return new Quaternion(-q0.v[qui.x] * n1, -q0.v[qui.y] * n1, -q0.v[qui.z] * n1, -q0.v[qui.w] * n1);
          };
          Quaternion.slerp = function (q0, q1, amount) {
              var n0 = 0.0;
              var n1 = 0.0;
              var n2 = amount;
              var n3 = (((q0.v[qui.x] * q1.v[qui.x]) +
                  (q0.v[qui.y] * q1.v[qui.y])) +
                  (q0.v[qui.z] * q1.v[qui.z])) +
                  (q0.v[qui.w] * q1.v[qui.w]);
              var flag = false;
              if (n3 < 0.0) {
                  flag = true;
                  n3 = -n3;
              }
              if (n3 > 0.999999) {
                  n1 = 1.0 - n2;
                  n0 = flag ? -n2 : n2;
              }
              else {
                  var n4 = Math.acos(n3);
                  var n5 = 1.0 / Math.sin(n4);
                  n1 = Math.sin(((1.0 - n2) * n4)) * n5;
                  n0 = flag ? (-Math.sin(n2 * n4) * n5) : (Math.sin(n2 * n4) * n5);
              }
              return new Quaternion((n1 * q0.v[qui.x]) + (n0 * q1.v[qui.x]), (n1 * q0.v[qui.y]) + (n0 * q1.v[qui.y]), (n1 * q0.v[qui.z]) + (n0 * q1.v[qui.z]), (n1 * q0.v[qui.w]) + (n0 * q1.v[qui.w]));
          };
          Quaternion.lerp = function (q0, q1, amount) {
              var q2 = new Quaternion();
              var n0 = amount;
              var n1 = 1.0 - n0;
              var n2 = (((q0.v[qui.x] * q1.v[qui.x]) +
                  (q0.v[qui.y] * q1.v[qui.y])) +
                  (q0.v[qui.z] * q1.v[qui.z])) +
                  (q0.v[qui.w] * q1.v[qui.w]);
              if (n2 >= 0.0) {
                  q2.v[qui.x] = (n1 * q0.v[qui.x]) + (n0 * q1.v[qui.x]);
                  q2.v[qui.y] = (n1 * q0.v[qui.y]) + (n0 * q1.v[qui.y]);
                  q2.v[qui.z] = (n1 * q0.v[qui.z]) + (n0 * q1.v[qui.z]);
                  q2.v[qui.w] = (n1 * q0.v[qui.w]) + (n0 * q1.v[qui.w]);
              }
              else {
                  q2.v[qui.x] = (n1 * q0.v[qui.x]) - (n0 * q1.v[qui.x]);
                  q2.v[qui.y] = (n1 * q0.v[qui.y]) - (n0 * q1.v[qui.y]);
                  q2.v[qui.z] = (n1 * q0.v[qui.z]) - (n0 * q1.v[qui.z]);
                  q2.v[qui.w] = (n1 * q0.v[qui.w]) - (n0 * q1.v[qui.w]);
              }
              var n3 = (((q2.v[qui.x] * q2.v[qui.x]) +
                  (q2.v[qui.y] * q2.v[qui.y])) +
                  (q2.v[qui.z] * q2.v[qui.z])) +
                  (q2.v[qui.w] * q2.v[qui.w]);
              var n4 = 1.0 / Math.sqrt(n3);
              q2.v[qui.x] *= n4;
              q2.v[qui.y] *= n4;
              q2.v[qui.z] *= n4;
              q2.v[qui.w] *= n4;
              return q2;
          };
          Quaternion.fromAxisAngle = function (v0, angle) {
              var n0 = angle * 0.5;
              var n1 = Math.sin(n0);
              var n2 = Math.cos(n0);
              return new Quaternion(v0.v[v3i.x] * n1, v0.v[v3i.y] * n1, v0.v[v3i.z] * n1, n2);
          };
          Quaternion.fromMatrix = function (m0) {
              var n0 = (m0.v[mi.m11] + m0.v[mi.m22]) + m0.v[mi.m33];
              if (n0 > 0.0) {
                  var n1 = Math.sqrt(n0 + 1.0);
                  var n2 = 0.5 / n1;
                  return new Quaternion((m0.v[mi.m23] - m0.v[mi.m32]) * n2, (m0.v[mi.m31] - m0.v[mi.m13]) * n2, (m0.v[mi.m12] - m0.v[mi.m21]) * n2, n1 * 0.5);
              }
              else if ((m0.v[mi.m11] >= m0.v[mi.m22]) && (m0.v[mi.m11] >= m0.v[mi.m33])) {
                  var n1 = Math.sqrt(((1.0 + m0.v[mi.m11]) - m0.v[mi.m22]) - m0.v[mi.m33]);
                  var n2 = 0.5 / n1;
                  return new Quaternion(0.5 * n1, (m0.v[mi.m12] + m0.v[mi.m21]) * n2, (m0.v[mi.m13] + m0.v[mi.m31]) * n2, (m0.v[mi.m23] - m0.v[mi.m32]) * n2);
              }
              else if (m0.v[mi.m22] > m0.v[mi.m33]) {
                  var n1 = Math.sqrt(((1.0 + m0.v[mi.m22]) - m0.v[mi.m11]) - m0.v[mi.m33]);
                  var n2 = 0.5 / n1;
                  return new Quaternion((m0.v[mi.m21] + m0.v[mi.m12]) * n2, 0.5 * n1, (m0.v[mi.m32] + m0.v[mi.m23]) * n2, (m0.v[mi.m31] - m0.v[mi.m13]) * n2);
              }
              else {
                  var n1 = Math.sqrt(((1.0 + m0.v[mi.m33]) - m0.v[mi.m11]) - m0.v[mi.m22]);
                  var n2 = 0.5 / n1;
                  return new Quaternion((m0.v[mi.m31] + m0.v[mi.m13]) * n2, (m0.v[mi.m32] + m0.v[mi.m23]) * n2, 0.5 * n1, (m0.v[mi.m12] - m0.v[mi.m21]) * n2);
              }
          };
          Quaternion.concat = function (q0, q1) {
              var n0 = q1.v[qui.x];
              var n1 = q1.v[qui.y];
              var n2 = q1.v[qui.z];
              var n3 = q1.v[qui.w];
              var n4 = q0.v[qui.x];
              var n5 = q0.v[qui.y];
              var n6 = q0.v[qui.z];
              var n7 = q0.v[qui.w];
              var n8 = (n1 * n6) - (n2 * n5);
              var n9 = (n2 * n4) - (n0 * n6);
              var n10 = (n0 * n5) - (n1 * n4);
              var n11 = ((n0 * n4) + (n1 * n5)) + (n2 * n6);
              return new Quaternion(((n0 * n7) + (n4 * n3)) + n8, ((n1 * n7) + (n5 * n3)) + n9, ((n2 * n7) + (n6 * n3)) + n10, (n3 * n7) - n11);
          };
          Quaternion.add = function (q0, q1) {
              return new Quaternion(q0.v[qui.x] + q1.v[qui.x], q0.v[qui.y] + q1.v[qui.y], q0.v[qui.z] + q1.v[qui.z], q0.v[qui.w] + q1.v[qui.w]);
          };
          Quaternion.sub = function (q0, q1) {
              return new Quaternion(q0.v[qui.x] - q1.v[qui.x], q0.v[qui.y] - q1.v[qui.y], q0.v[qui.z] - q1.v[qui.z], q0.v[qui.w] - q1.v[qui.w]);
          };
          Quaternion.mul = function (q0, q1) {
              var n0 = q0.v[qui.x];
              var n1 = q0.v[qui.y];
              var n2 = q0.v[qui.z];
              var n3 = q0.v[qui.w];
              var n4 = q1.v[qui.x];
              var n5 = q1.v[qui.y];
              var n6 = q1.v[qui.z];
              var n7 = q1.v[qui.w];
              var n8 = (n1 * n6) - (n2 * n5);
              var n9 = (n2 * n4) - (n0 * n6);
              var n10 = (n0 * n5) - (n1 * n4);
              var n11 = ((n0 * n4) + (n1 * n5)) + (n2 * n6);
              return new Quaternion(((n0 * n7) + (n4 * n3)) + n8, ((n1 * n7) + (n5 * n3)) + n9, ((n2 * n7) + (n6 * n3)) + n10, (n3 * n7) - n11);
          };
          Quaternion.div = function (q0, q1) {
              var n0 = q0.v[qui.x];
              var n1 = q0.v[qui.y];
              var n2 = q0.v[qui.z];
              var n3 = q0.v[qui.w];
              var n4 = (((q1.v[qui.x] * q1.v[qui.x]) +
                  (q1.v[qui.y] * q1.v[qui.y])) +
                  (q1.v[qui.z] * q1.v[qui.z])) +
                  (q1.v[qui.w] * q1.v[qui.w]);
              var n5 = 1.0 / n4;
              var n6 = -q1.v[qui.x] * n5;
              var n7 = -q1.v[qui.y] * n5;
              var n8 = -q1.v[qui.z] * n5;
              var n9 = q1.v[qui.w] * n5;
              var n10 = (n1 * n8) - (n2 * n7);
              var n11 = (n2 * n6) - (n0 * n8);
              var n12 = (n0 * n7) - (n1 * n6);
              var n13 = ((n0 * n6) + (n1 * n7)) + (n2 * n8);
              return new Quaternion(((n0 * n9) + (n6 * n3)) + n10, ((n1 * n9) + (n7 * n3)) + n11, ((n2 * n9) + (n8 * n3)) + n12, (n3 * n9) - n13);
          };
          Quaternion.negate = function (q0) {
              return new Quaternion(-q0.v[qui.x], -q0.v[qui.y], -q0.v[qui.z], -q0.v[qui.w]);
          };
          Quaternion.clone = function (q0) {
              return new Quaternion(q0.v[qui.x], q0.v[qui.y], q0.v[qui.z], q0.v[qui.w]);
          };
          Quaternion.create = function (x, y, z, w) {
              return new Quaternion(x, y, z, w);
          };
          return Quaternion;
      }());
      exports.Quaternion = Quaternion;
  });
  define("src/math/vector4", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var f32 = { max: 2147483647, min: -2147483647 };
      var v4i = { x: 0, y: 1, z: 2, w: 3 };
      var qi = { x: 0, y: 1, z: 2, w: 3 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var Vector4 = (function () {
          function Vector4(x, y, z, w) {
              this.v = new Float32Array(4);
              this.v[v4i.x] = x === undefined ? 0.0 : x;
              this.v[v4i.y] = y === undefined ? 0.0 : y;
              this.v[v4i.z] = z === undefined ? 0.0 : z;
              this.v[v4i.w] = w === undefined ? 0.0 : w;
          }
          Vector4.prototype.toString = function () {
              return "[" + this.v[v4i.x] + ", " + this.v[v4i.y] + ", " + this.v[v4i.z] + ", " + this.v[v4i.w] + "]";
          };
          Vector4.prototype.clone = function () {
              return Vector4.clone(this);
          };
          Vector4.prototype.x = function (value) {
              if (value !== undefined) {
                  this.v[v4i.x] = value;
              }
              return this.v[v4i.x];
          };
          Vector4.prototype.y = function (value) {
              if (value !== undefined) {
                  this.v[v4i.y] = value;
              }
              return this.v[v4i.y];
          };
          Vector4.prototype.z = function (value) {
              if (value !== undefined) {
                  this.v[v4i.z] = value;
              }
              return this.v[v4i.z];
          };
          Vector4.prototype.w = function (value) {
              if (value !== undefined) {
                  this.v[v4i.w] = value;
              }
              return this.v[v4i.w];
          };
          Vector4.prototype.length = function () {
              return Vector4.getLength(this);
          };
          Vector4.prototype.lengthSq = function () {
              return Vector4.getLengthSq(this);
          };
          Vector4.prototype.normalize = function () {
              return Vector4.normalize(this);
          };
          Vector4.prototype.dot = function (v0) {
              return Vector4.dot(this, v0);
          };
          Vector4.prototype.add = function (v0) {
              return Vector4.add(this, v0);
          };
          Vector4.prototype.sub = function (v0) {
              return Vector4.sub(this, v0);
          };
          Vector4.prototype.mul = function (v0) {
              return Vector4.mul(this, v0);
          };
          Vector4.prototype.div = function (v0) {
              return Vector4.div(this, v0);
          };
          Vector4.prototype.scale = function (s0) {
              return Vector4.scale(this, s0);
          };
          Vector4.prototype.negate = function () {
              return Vector4.negate(this);
          };
          Vector4.zero = function () {
              return new Vector4(0.0, 0.0, 0.0, 0.0);
          };
          Vector4.one = function () {
              return new Vector4(1.0, 1.0, 1.0, 1.0);
          };
          Vector4.left = function () {
              return new Vector4(-1.0, 0.0, 0.0);
          };
          Vector4.unitX = function () {
              return new Vector4(1.0, 0.0, 0.0, 0.0);
          };
          Vector4.unitY = function () {
              return new Vector4(0.0, 1.0, 0.0, 0.0);
          };
          Vector4.unitZ = function () {
              return new Vector4(0.0, 0.0, 1.0, 0.0);
          };
          Vector4.unitW = function () {
              return new Vector4(0.0, 0.0, 0.0, 1.0);
          };
          Vector4.equals = function (v0, v1) {
              return (v0.v[v4i.x] === v1.v[v4i.x] &&
                  v0.v[v4i.y] === v1.v[v4i.y] &&
                  v0.v[v4i.z] === v1.v[v4i.z] &&
                  v0.v[v4i.w] === v1.v[v4i.w]);
          };
          Vector4.getLength = function (v0) {
              return Math.sqrt((v0.v[v4i.x] * v0.v[v4i.x]) +
                  (v0.v[v4i.y] * v0.v[v4i.y]) +
                  (v0.v[v4i.z] * v0.v[v4i.z]) +
                  (v0.v[v4i.w] * v0.v[v4i.w]));
          };
          Vector4.getLengthSq = function (v0) {
              return ((v0.v[v4i.x] * v0.v[v4i.x]) +
                  (v0.v[v4i.y] * v0.v[v4i.y]) +
                  (v0.v[v4i.z] * v0.v[v4i.z]) +
                  (v0.v[v4i.w] * v0.v[v4i.w]));
          };
          Vector4.distance = function (v0, v1) {
              var x = v0.v[v4i.x] - v1.v[v4i.x];
              var y = v0.v[v4i.y] - v1.v[v4i.y];
              var z = v0.v[v4i.z] - v1.v[v4i.z];
              var w = v0.v[v4i.w] - v1.v[v4i.w];
              return Math.sqrt((x * x) + (y * y) + (z * z) + (w * w));
          };
          Vector4.distanceSq = function (v0, v1) {
              var x = v0.v[v4i.x] - v1.v[v4i.x];
              var y = v0.v[v4i.y] - v1.v[v4i.y];
              var z = v0.v[v4i.z] - v1.v[v4i.z];
              var w = v0.v[v4i.w] - v1.v[v4i.w];
              return ((x * x) + (y * y) + (z * z) + (w * w));
          };
          Vector4.dot = function (v0, v1) {
              return ((v0.v[v4i.x] * v1.v[v4i.x]) +
                  (v0.v[v4i.y] * v1.v[v4i.y]) +
                  (v0.v[v4i.z] * v1.v[v4i.z]) +
                  (v0.v[v4i.w] * v1.v[v4i.w]));
          };
          Vector4.normalize = function (v0) {
              var len = 1.0 / Math.sqrt((v0.v[v4i.x] * v0.v[v4i.x]) +
                  (v0.v[v4i.y] * v0.v[v4i.y]) +
                  (v0.v[v4i.z] * v0.v[v4i.z]) +
                  (v0.v[v4i.w] * v0.v[v4i.w]));
              return new Vector4(v0.v[v4i.x] * len, v0.v[v4i.y] * len, v0.v[v4i.z] * len, v0.v[v4i.w] * len);
          };
          Vector4.abs = function (v0) {
              return new Vector4(Math.abs(v0.v[v4i.x]), Math.abs(v0.v[v4i.y]), Math.abs(v0.v[v4i.z]), Math.abs(v0.v[v4i.w]));
          };
          Vector4.min = function (v0, v1) {
              return new Vector4((v0.v[v4i.x] < v1.v[v4i.x]) ? v0.v[v4i.x] : v1.v[v4i.x], (v0.v[v4i.y] < v1.v[v4i.y]) ? v0.v[v4i.y] : v1.v[v4i.y], (v0.v[v4i.z] < v1.v[v4i.z]) ? v0.v[v4i.z] : v1.v[v4i.z], (v0.v[v4i.w] < v1.v[v4i.w]) ? v0.v[v4i.w] : v1.v[v4i.w]);
          };
          Vector4.max = function (v0, v1) {
              return new Vector4((v0.v[v4i.x] > v1.v[v4i.x]) ? v0.v[v4i.x] : v1.v[v4i.x], (v0.v[v4i.y] > v1.v[v4i.y]) ? v0.v[v4i.y] : v1.v[v4i.y], (v0.v[v4i.z] > v1.v[v4i.z]) ? v0.v[v4i.z] : v1.v[v4i.z], (v0.v[v4i.w] > v1.v[v4i.w]) ? v0.v[v4i.w] : v1.v[v4i.w]);
          };
          Vector4.clamp = function (v0, min, max) {
              var x = v0.v[v4i.x];
              var y = v0.v[v4i.y];
              var z = v0.v[v4i.z];
              var w = v0.v[v4i.w];
              x = (x > max.v[v4i.x]) ? max.v[v4i.x] : x;
              x = (x < min.v[v4i.x]) ? min.v[v4i.x] : x;
              y = (y > max.v[v4i.y]) ? max.v[v4i.y] : y;
              y = (y < min.v[v4i.y]) ? min.v[v4i.y] : y;
              z = (z > max.v[v4i.z]) ? max.v[v4i.z] : z;
              z = (z < min.v[v4i.z]) ? min.v[v4i.z] : z;
              w = (w > max.v[v4i.w]) ? max.v[v4i.w] : w;
              w = (w < min.v[v4i.w]) ? min.v[v4i.w] : w;
              return new Vector4(x, y, z, w);
          };
          Vector4.lerp = function (v0, v1, amount) {
              return new Vector4(v0.v[v4i.x] + ((v1.v[v4i.x] - v0.v[v4i.x]) * amount), v0.v[v4i.y] + ((v1.v[v4i.y] - v0.v[v4i.y]) * amount), v0.v[v4i.z] + ((v1.v[v4i.z] - v0.v[v4i.z]) * amount), v0.v[v4i.w] + ((v1.v[v4i.w] - v0.v[v4i.w]) * amount));
          };
          Vector4.barycentric = function (v0, v1, v2, amount0, amount1) {
              return new Vector4((v0.v[v4i.x] + (amount0 * (v1.v[v4i.x] - v0.v[v4i.x]))) + (amount1 * (v2.v[v4i.x] - v0.v[v4i.x])), (v0.v[v4i.y] + (amount0 * (v1.v[v4i.y] - v0.v[v4i.y]))) + (amount1 * (v2.v[v4i.y] - v0.v[v4i.y])), (v0.v[v4i.z] + (amount0 * (v1.v[v4i.z] - v0.v[v4i.z]))) + (amount1 * (v2.v[v4i.z] - v0.v[v4i.z])), (v0.v[v4i.w] + (amount0 * (v1.v[v4i.w] - v0.v[v4i.w]))) + (amount1 * (v2.v[v4i.w] - v0.v[v4i.w])));
          };
          Vector4.smoothstep = function (v0, v1, amount) {
              amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount);
              amount = (amount * amount) * (3.0 - (2.0 * amount));
              return new Vector4(v0.v[v4i.x] + ((v1.v[v4i.x] - v0.v[v4i.x]) * amount), v0.v[v4i.y] + ((v1.v[v4i.y] - v0.v[v4i.y]) * amount), v0.v[v4i.z] + ((v1.v[v4i.z] - v0.v[v4i.z]) * amount), v0.v[v4i.w] + ((v1.v[v4i.w] - v0.v[v4i.w]) * amount));
          };
          Vector4.catmullrom = function (v0, v1, v2, v3, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              return new Vector4(0.5 * ((((2.0 * v1.v[v4i.x])
                  + ((-v0.v[v4i.x] + v2.v[v4i.x]) * amount))
                  + (((((2.0 * v0.v[v4i.x]) - (5.0 * v1.v[v4i.x]))
                      + (4.0 * v2.v[v4i.x])) - v3.v[v4i.x]) * n0))
                  + ((((-v0.v[v4i.x] + (3.0 * v1.v[v4i.x]))
                      - (3.0 * v2.v[v4i.x])) + v3.v[v4i.x]) * n1)), 0.5 * ((((2.0 * v1.v[v4i.y])
                  + ((-v0.v[v4i.y] + v2.v[v4i.y]) * amount))
                  + (((((2.0 * v0.v[v4i.y]) - (5.0 * v1.v[v4i.y]))
                      + (4.0 * v2.v[v4i.y])) - v3.v[v4i.y]) * n0))
                  + ((((-v0.v[v4i.y] + (3.0 * v1.v[v4i.y]))
                      - (3.0 * v2.v[v4i.y])) + v3.v[v4i.y]) * n1)), 0.5 * ((((2.0 * v1.v[v4i.z])
                  + ((-v0.v[v4i.z] + v2.v[v4i.z]) * amount))
                  + (((((2.0 * v0.v[v4i.z]) - (5.0 * v1.v[v4i.z]))
                      + (4.0 * v2.v[v4i.z])) - v3.v[v4i.z]) * n0))
                  + ((((-v0.v[v4i.z] + (3.0 * v1.v[v4i.z]))
                      - (3.0 * v2.v[v4i.z])) + v3.v[v4i.z]) * n1)), 0.5 * ((((2.0 * v1.v[v4i.w])
                  + ((-v0.v[v4i.w] + v2.v[v4i.w]) * amount))
                  + (((((2.0 * v0.v[v4i.w]) - (5.0 * v1.v[v4i.w]))
                      + (4.0 * v2.v[v4i.w])) - v3.v[v4i.w]) * n0))
                  + ((((-v0.v[v4i.w] + (3.0 * v1.v[v4i.w]))
                      - (3.0 * v2.v[v4i.w])) + v3.v[v4i.w]) * n1)));
          };
          Vector4.hermite = function (v0, t0, v1, t1, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              var n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0;
              var n3 = (-2.0 * n1) + (3.0 * n0);
              var n4 = (n1 - (2.0 * n0)) + amount;
              var n5 = n1 - n0;
              return new Vector4((((v0.v[v4i.x] * n2) + (v1.v[v4i.x] * n3)) + (t0.v[v4i.x] * n4)) + (t1.v[v4i.x] * n5), (((v0.v[v4i.y] * n2) + (v1.v[v4i.y] * n3)) + (t0.v[v4i.y] * n4)) + (t1.v[v4i.y] * n5), (((v0.v[v4i.z] * n2) + (v1.v[v4i.z] * n3)) + (t0.v[v4i.z] * n4)) + (t1.v[v4i.z] * n5), (((v0.v[v4i.w] * n2) + (v1.v[v4i.w] * n3)) + (t0.v[v4i.w] * n4)) + (t1.v[v4i.w] * n5));
          };
          Vector4.transform = function (v0, m0) {
              return new Vector4((((v0.v[v4i.x] * m0.v[mi.m11]) + (v0.v[v4i.y] * m0.v[mi.m21])) + (v0.v[v4i.z] * m0.v[mi.m31])) + (v0.v[v4i.w] * m0.v[mi.m41]), (((v0.v[v4i.x] * m0.v[mi.m12]) + (v0.v[v4i.y] * m0.v[mi.m22])) + (v0.v[v4i.z] * m0.v[mi.m32])) + (v0.v[v4i.w] * m0.v[mi.m42]), (((v0.v[v4i.x] * m0.v[mi.m13]) + (v0.v[v4i.y] * m0.v[mi.m23])) + (v0.v[v4i.z] * m0.v[mi.m33])) + (v0.v[v4i.w] * m0.v[mi.m43]), (((v0.v[v4i.x] * m0.v[mi.m14]) + (v0.v[v4i.y] * m0.v[mi.m24])) + (v0.v[v4i.z] * m0.v[mi.m34])) + (v0.v[v4i.w] * m0.v[mi.m44]));
          };
          Vector4.transformQuaternion = function (v0, q0) {
              var n0 = q0.v[qi.x] + q0.v[qi.x];
              var n1 = q0.v[qi.y] + q0.v[qi.y];
              var n2 = q0.v[qi.z] + q0.v[qi.z];
              var n3 = q0.v[qi.w] * n0;
              var n4 = q0.v[qi.w] * n1;
              var n5 = q0.v[qi.w] * n2;
              var n6 = q0.v[qi.x] * n0;
              var n7 = q0.v[qi.x] * n1;
              var n8 = q0.v[qi.x] * n2;
              var n9 = q0.v[qi.y] * n1;
              var n10 = q0.v[qi.y] * n2;
              var n11 = q0.v[qi.z] * n2;
              return new Vector4((v0.v[v4i.x] * ((1.0 - n9) - n11)) + (v0.v[v4i.y] * (n7 - n5)), (v0.v[v4i.x] * (n7 + n5)) + (v0.v[v4i.y] * ((1.0 - n6) - n11)), (v0.v[v4i.x] * (n8 - n4)) + (v0.v[v4i.y] * (n10 + n3)));
          };
          Vector4.add = function (v0, v1) {
              return new Vector4(v0.v[v4i.x] + v1.v[v4i.x], v0.v[v4i.y] + v1.v[v4i.y], v0.v[v4i.z] + v1.v[v4i.z], v0.v[v4i.w] + v1.v[v4i.w]);
          };
          Vector4.sub = function (v0, v1) {
              return new Vector4(v0.v[v4i.x] - v1.v[v4i.x], v0.v[v4i.y] - v1.v[v4i.y], v0.v[v4i.z] - v1.v[v4i.z], v0.v[v4i.w] - v1.v[v4i.w]);
          };
          Vector4.mul = function (v0, v1) {
              return new Vector4(v0.v[v4i.x] - v1.v[v4i.x], v0.v[v4i.y] - v1.v[v4i.y], v0.v[v4i.z] - v1.v[v4i.z], v0.v[v4i.w] - v1.v[v4i.w]);
          };
          Vector4.div = function (v0, v1) {
              return new Vector4(v0.v[v4i.x] / v1.v[v4i.x], v0.v[v4i.y] / v1.v[v4i.y], v0.v[v4i.z] / v1.v[v4i.z], v0.v[v4i.w] / v1.v[v4i.w]);
          };
          Vector4.scale = function (v0, scalar) {
              return new Vector4(v0.v[v4i.x] * scalar, v0.v[v4i.y] * scalar, v0.v[v4i.z] * scalar, v0.v[v4i.w] * scalar);
          };
          Vector4.negate = function (v0) {
              return new Vector4(-v0.v[v4i.x], -v0.v[v4i.y], -v0.v[v4i.z], -v0.v[v4i.w]);
          };
          Vector4.clone = function (v0) {
              return new Vector4(v0.v[v4i.x], v0.v[v4i.y], v0.v[v4i.z], v0.v[v4i.w]);
          };
          Vector4.create = function (x, y, z, w) {
              return new Vector4(x, y, z, w);
          };
          Vector4.MAX_VALUE = new Vector4(f32.max, f32.max, f32.max, f32.max);
          Vector4.MIN_VALUE = new Vector4(f32.min, f32.min, f32.min, f32.min);
          return Vector4;
      }());
      exports.Vector4 = Vector4;
  });
  define("src/math/single", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var si = { x: 0 };
      var Single = (function () {
          function Single(x) {
              this.v = new Float32Array(1);
              this.v[si.x] = x === undefined ? 0.0 : x;
          }
          Single.prototype.toString = function () {
              return "" + this.v[si.x];
          };
          Single.prototype.clone = function () {
              return Single.clone(this);
          };
          Single.prototype.x = function (value) {
              if (value !== undefined) {
                  this.v[si.x] = value;
              }
              return this.v[si.x];
          };
          Single.prototype.negate = function () {
              return Single.negate(this);
          };
          Single.prototype.add = function (s0) {
              return Single.add(this, s0);
          };
          Single.prototype.sub = function (s0) {
              return Single.sub(this, s0);
          };
          Single.prototype.mul = function (s0) {
              return Single.mul(this, s0);
          };
          Single.prototype.div = function (s0) {
              return Single.div(this, s0);
          };
          Single.distance = function (s0, s1) {
              return Math.abs(s0.v[si.x] - s1.v[si.x]);
          };
          Single.barycentric = function (s0, s1, s2, amount0, amount1) {
              return new Single((s0.v[si.x] + (amount0 * (s1.v[si.x] - s0.v[si.x]))) + (amount0 * (s2.v[si.x] - s0.v[si.x])));
          };
          Single.catmullrom = function (s0, s1, s2, s3, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              return new Single((0.5 * ((((2.0 * s1.v[si.x]) + ((-s0.v[si.x] + s2.v[si.x]) * amount)) +
                  (((((2.0 * s0.v[si.x]) - (5.0 * s1.v[si.x])) +
                      (4.0 * s2.v[si.x])) - s3.v[si.x]) * n0)) +
                  ((((-s0.v[si.x] + (3.0 * s1.v[si.x])) -
                      (3.0 * s2.v[si.x])) + s3.v[si.x]) * n1))));
          };
          Single.hermite = function (s0, t0, s1, t1, amount) {
              var n0 = amount;
              var n1 = n0 * n0;
              var n2 = n0 * n1;
              var n3 = ((2.0 * n2) - (3.0 * n1)) + 1.0;
              var n4 = (-2.0 * n2) + (3.0 * n1);
              var n5 = (n2 - (2.0 * n1)) + n0;
              var n6 = n2 - n1;
              return new Single((((s0.v[si.x] * n3) + (s1.v[si.x] * n4)) + (t0.v[si.x] * n5)) + (t1.v[si.x] * n6));
          };
          Single.lerp = function (s0, s1, amount) {
              return new Single(s0.v[si.x] + ((s1.v[si.x] - s0.v[si.x]) * amount));
          };
          Single.smoothstep = function (value1, value2, amount) {
              var num = Single.clamp(new Single(amount), 0.0, 1.0).x();
              return Single.lerp(value1, value2, (num * num) * (3.0 - (2.0 * num)));
          };
          Single.clamp = function (s0, min, max) {
              var n0 = (s0.v[si.x] > max) ? max : s0.v[si.x];
              var n1 = (n0 < max) ? min : n0;
              return new Single(n1);
          };
          Single.abs = function (s0) {
              return new Single(Math.abs(s0.v[si.x]));
          };
          Single.min = function (s0, s1) {
              return (s0.v[si.x] < s1.v[si.x])
                  ? new Single(s0.v[si.x])
                  : new Single(s1.v[si.x]);
          };
          Single.max = function (s0, s1) {
              return (s0.v[si.x] > s1.v[si.x])
                  ? new Single(s0.v[si.x])
                  : new Single(s1.v[si.x]);
          };
          Single.negate = function (s0) {
              return new Single(-s0.v[si.x]);
          };
          Single.add = function (s0, s1) {
              return new Single(s0.v[si.x] + s1.v[si.x]);
          };
          Single.sub = function (s0, s1) {
              return new Single(s0.v[si.x] - s1.v[si.x]);
          };
          Single.mul = function (s0, s1) {
              return new Single(s0.v[si.x] * s1.v[si.x]);
          };
          Single.div = function (s0, s1) {
              return new Single(s0.v[si.x] / s1.v[si.x]);
          };
          Single.clone = function (s0) {
              return new Single(s0.v[si.x]);
          };
          Single.create = function (x) {
              return new Single(x);
          };
          return Single;
      }());
      exports.Single = Single;
  });
  define("src/math/sphere", ["require", "exports", "src/math/single", "src/math/vector3"], function (require, exports, single_1, vector3_1) {
      "use strict";
      exports.__esModule = true;
      var v3i = { x: 0, y: 1, z: 2 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var Sphere = (function () {
          function Sphere(position, radius) {
              this.position = position === undefined ? new vector3_1.Vector3(0, 0, 0) : position;
              this.radius = radius === undefined ? 0.5 : radius;
          }
          Sphere.prototype.toString = function () {
              return "{ position: " + this.position.toString() + ", radius: " + this.radius + "}";
          };
          Sphere.prototype.clone = function () {
              return Sphere.clone(this);
          };
          Sphere.equals = function (s0, s1) {
              return (vector3_1.Vector3.equals(s0.position, s1.position) &&
                  s0.radius === s1.radius);
          };
          Sphere.merge = function (s0, s1) {
              var n0 = vector3_1.Vector3.sub(s1.position, s0.position);
              var n1 = n0.length();
              var n2 = s0.radius;
              var n3 = s1.radius;
              if ((n2 + n3) >= n1) {
                  if ((n2 - n3) >= n1) {
                      return s0.clone();
                  }
                  if ((n3 - n2) >= n1) {
                      return s1.clone();
                  }
              }
              var n4 = n0.scale(1.0 / n1);
              var n5 = single_1.Single.min(new single_1.Single(-n2), new single_1.Single(n1 - n3));
              var n6 = single_1.Single.sub(single_1.Single.max(new single_1.Single(n2), new single_1.Single(n1 + n3)), n5)
                  .mul(new single_1.Single(0.5));
              return new Sphere(s0.position.add(n4.scale(n6.add(n5).x())), n6.x());
          };
          Sphere.fromBox = function (b0) {
              var center = vector3_1.Vector3.lerp(b0.min, b0.max, 0.5);
              var distance = vector3_1.Vector3.distance(b0.min, b0.max);
              return new Sphere(center, distance * 0.5);
          };
          Sphere.fromPoints = function (points) {
              var radius = 0.0;
              var center = new vector3_1.Vector3();
              var n0 = new vector3_1.Vector3();
              var n1 = new vector3_1.Vector3();
              var n2 = new vector3_1.Vector3();
              var n3 = new vector3_1.Vector3();
              var n4 = new vector3_1.Vector3();
              var n5 = new vector3_1.Vector3();
              for (var i = 0; i < points.length; i++) {
                  var p = points[i];
                  if (p.v[v3i.x] < n0.v[v3i.x]) {
                      n0 = p.clone();
                  }
                  if (p.v[v3i.x] > n1.v[v3i.x]) {
                      n1 = p.clone();
                  }
                  if (p.v[v3i.y] < n2.v[v3i.y]) {
                      n2 = p.clone();
                  }
                  if (p.v[v3i.y] > n3.v[v3i.y]) {
                      n3 = p.clone();
                  }
                  if (p.v[v3i.z] < n4.v[v3i.z]) {
                      n4 = p.clone();
                  }
                  if (p.v[v3i.z] > n5.v[v3i.z]) {
                      n5 = p.clone();
                  }
              }
              var n6 = vector3_1.Vector3.distance(n1, n0);
              var n7 = vector3_1.Vector3.distance(n3, n2);
              var n8 = vector3_1.Vector3.distance(n5, n4);
              if (n6 > n7) {
                  if (n6 > n8) {
                      center = vector3_1.Vector3.lerp(n1, n0, 0.5);
                      radius = n6 * 0.5;
                  }
                  else {
                      center = vector3_1.Vector3.lerp(n5, n4, 0.5);
                      radius = n8 * 0.5;
                  }
              }
              else if (n7 > n8) {
                  center = vector3_1.Vector3.lerp(n3, n2, 0.5);
                  radius = n7 * 0.5;
              }
              else {
                  center = vector3_1.Vector3.lerp(n5, n4, 0.5);
                  radius = n8 * 0.5;
              }
              for (var i = 0; i < points.length; i++) {
                  var v0 = points[i];
                  var v1 = new vector3_1.Vector3(v0.v[v3i.x] - center.v[v3i.x], v0.v[v3i.y] - center.v[v3i.y], v0.v[v3i.z] - center.v[v3i.z]);
                  var num3 = v1.length();
                  if (num3 > radius) {
                      radius = (radius + num3) * 0.5;
                      center = center.add(vector3_1.Vector3.scale(v1, 1.0 - (radius / num3)));
                  }
              }
              return new Sphere(center, radius);
          };
          Sphere.clone = function (s0) {
              return new Sphere(s0.position.clone(), s0.radius);
          };
          Sphere.create = function (center, radius) {
              return new Sphere(center, radius);
          };
          return Sphere;
      }());
      exports.Sphere = Sphere;
  });
  define("src/math/frustum", ["require", "exports", "src/math/matrix", "src/math/vector3", "src/math/plane", "src/math/ray"], function (require, exports, matrix_1, vector3_2, plane_1, ray_1) {
      "use strict";
      exports.__esModule = true;
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var v3i = { x: 0, y: 1, z: 2 };
      var fpi = { near: 0, far: 1, left: 2, right: 3, top: 4, bottom: 5 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var computeIntersectionRay = function (p0, p1) {
          var v0 = vector3_2.Vector3.cross(p0.normal(), p1.normal());
          var n0 = v0.lengthSq();
          var v1 = vector3_2.Vector3.scale(p1.normal(), -p0.d());
          var v2 = vector3_2.Vector3.scale(p0.normal(), p1.d());
          var v3 = vector3_2.Vector3.add(v1, v2);
          var v4 = vector3_2.Vector3.cross(v3, v0);
          var v5 = new vector3_2.Vector3(v4.v[v3i.x] / n0, v4.v[v3i.y] / n0, v4.v[v3i.z] / n0);
          return new ray_1.Ray(v5, v0);
      };
      var computeIntersectionVector = function (plane, ray) {
          var num = (-plane.d() -
              vector3_2.Vector3.dot(plane.normal(), ray.position)) /
              vector3_2.Vector3.dot(plane.normal(), ray.direction);
          return vector3_2.Vector3.add(ray.position, vector3_2.Vector3.scale(ray.direction, num));
      };
      var Frustum = (function () {
          function Frustum(matrix) {
              this.matrix = matrix === undefined ? matrix_1.Matrix.create() : matrix.clone();
              this.planes = new Array(6);
              this.planes[fpi.near] = new plane_1.Plane(-this.matrix.v[mi.m13], -this.matrix.v[mi.m23], -this.matrix.v[mi.m33], -this.matrix.v[mi.m43]);
              this.planes[fpi.far] = new plane_1.Plane(-this.matrix.v[mi.m14] + this.matrix.v[mi.m13], -this.matrix.v[mi.m24] + this.matrix.v[mi.m23], -this.matrix.v[mi.m34] + this.matrix.v[mi.m33], -this.matrix.v[mi.m44] + this.matrix.v[mi.m43]);
              this.planes[fpi.left] = new plane_1.Plane(-this.matrix.v[mi.m14] - this.matrix.v[mi.m11], -this.matrix.v[mi.m24] - this.matrix.v[mi.m21], -this.matrix.v[mi.m34] - this.matrix.v[mi.m31], -this.matrix.v[mi.m44] - this.matrix.v[mi.m41]);
              this.planes[fpi.right] = new plane_1.Plane(-this.matrix.v[mi.m14] + this.matrix.v[mi.m11], -this.matrix.v[mi.m24] + this.matrix.v[mi.m21], -this.matrix.v[mi.m34] + this.matrix.v[mi.m31], -this.matrix.v[mi.m44] + this.matrix.v[mi.m41]);
              this.planes[fpi.top] = new plane_1.Plane(-this.matrix.v[mi.m14] + this.matrix.v[mi.m12], -this.matrix.v[mi.m24] + this.matrix.v[mi.m22], -this.matrix.v[mi.m34] + this.matrix.v[mi.m32], -this.matrix.v[mi.m44] + this.matrix.v[mi.m42]);
              this.planes[fpi.bottom] = new plane_1.Plane(-this.matrix.v[mi.m14] - this.matrix.v[mi.m12], -this.matrix.v[mi.m24] - this.matrix.v[mi.m22], -this.matrix.v[mi.m34] - this.matrix.v[mi.m32], -this.matrix.v[mi.m44] - this.matrix.v[mi.m42]);
              for (var i = 0; i < this.planes.length; i++) {
                  var len = this.planes[i].normal().length();
                  this.planes[i].v[pli.x] = this.planes[i].v[pli.x] / len;
                  this.planes[i].v[pli.y] = this.planes[i].v[pli.y] / len;
                  this.planes[i].v[pli.z] = this.planes[i].v[pli.z] / len;
                  this.planes[i].v[pli.w] = this.planes[i].v[pli.w] / len;
              }
              this.corners = new Array(8);
              var ray = computeIntersectionRay(this.planes[0], this.planes[2]);
              this.corners[0] = computeIntersectionVector(this.planes[4], ray);
              this.corners[3] = computeIntersectionVector(this.planes[5], ray);
              ray = computeIntersectionRay(this.planes[3], this.planes[0]);
              this.corners[1] = computeIntersectionVector(this.planes[4], ray);
              this.corners[2] = computeIntersectionVector(this.planes[5], ray);
              ray = computeIntersectionRay(this.planes[2], this.planes[1]);
              this.corners[4] = computeIntersectionVector(this.planes[4], ray);
              this.corners[7] = computeIntersectionVector(this.planes[5], ray);
              ray = computeIntersectionRay(this.planes[1], this.planes[3]);
              this.corners[5] = computeIntersectionVector(this.planes[4], ray);
              this.corners[6] = computeIntersectionVector(this.planes[5], ray);
          }
          Frustum.prototype.toString = function () {
              var buf = new Array();
              buf.push('{');
              buf.push("  planes: {");
              buf.push("    near  : " + this.planes[fpi.near].toString() + ",");
              buf.push("    far   : " + this.planes[fpi.far].toString() + ",");
              buf.push("    left  : " + this.planes[fpi.left].toString() + ",");
              buf.push("    right : " + this.planes[fpi.right].toString() + ",");
              buf.push("    top   : " + this.planes[fpi.top].toString() + ",");
              buf.push("    bottom: " + this.planes[fpi.bottom].toString());
              buf.push("  },");
              buf.push("  corners: [");
              buf.push("    " + this.corners[0].toString() + ",");
              buf.push("    " + this.corners[1].toString() + ",");
              buf.push("    " + this.corners[2].toString() + ",");
              buf.push("    " + this.corners[3].toString() + ",");
              buf.push("    " + this.corners[4].toString() + ",");
              buf.push("    " + this.corners[5].toString() + ",");
              buf.push("    " + this.corners[6].toString() + ",");
              buf.push("    " + this.corners[7].toString());
              buf.push("  ]");
              buf.push("}");
              return buf.join('\n');
          };
          Frustum.prototype.clone = function () {
              return Frustum.clone(this);
          };
          Frustum.equals = function (f0, f1) {
              return (f0.matrix === f1.matrix);
          };
          Frustum.prototype.near = function () {
              return this.planes[fpi.near];
          };
          Frustum.prototype.far = function () {
              return this.planes[fpi.far];
          };
          Frustum.prototype.left = function () {
              return this.planes[fpi.left];
          };
          Frustum.prototype.right = function () {
              return this.planes[fpi.right];
          };
          Frustum.prototype.top = function () {
              return this.planes[fpi.top];
          };
          Frustum.prototype.bottom = function () {
              return this.planes[fpi.bottom];
          };
          Frustum.clone = function (f0) {
              return new Frustum(f0.matrix.clone());
          };
          Frustum.create = function (matrix) {
              return new Frustum(matrix);
          };
          return Frustum;
      }());
      exports.Frustum = Frustum;
  });
  define("src/math/triangle", ["require", "exports", "src/math/vector3", "src/math/plane"], function (require, exports, vector3_3, plane_2) {
      "use strict";
      exports.__esModule = true;
      var Triangle = (function () {
          function Triangle(v0, v1, v2) {
              this.v0 = v0;
              this.v1 = v1;
              this.v2 = v2;
          }
          Triangle.prototype.toString = function () {
              return "{v0: " + this.v0.toString() + ", v1: " + this.v0.toString() + ", v2: " + this.v0.toString() + "}";
          };
          Triangle.prototype.clone = function () {
              return Triangle.clone(this);
          };
          Triangle.prototype.plane = function () {
              return plane_2.Plane.fromPoints(this.v0, this.v1, this.v2);
          };
          Triangle.equals = function (t0, t1) {
              return (vector3_3.Vector3.equals(t0.v0, t1.v0) &&
                  vector3_3.Vector3.equals(t0.v1, t1.v1) &&
                  vector3_3.Vector3.equals(t0.v2, t1.v2));
          };
          Triangle.clone = function (t0) {
              return new Triangle(t0.v0, t0.v1, t0.v2);
          };
          Triangle.create = function (v0, v1, v2) {
              return new Triangle(v0, v1, v2);
          };
          return Triangle;
      }());
      exports.Triangle = Triangle;
  });
  define("src/math/ray", ["require", "exports", "src/math/vector3"], function (require, exports, vector3_4) {
      "use strict";
      exports.__esModule = true;
      var f32 = { max: 2147483647, min: -2147483647 };
      var v3i = { x: 0, y: 1, z: 2 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var min = function (a, b) { return a < b ? a : b; };
      var max = function (a, b) { return a > b ? a : b; };
      var Ray = (function () {
          function Ray(position, direction) {
              this.position = position === undefined ? new vector3_4.Vector3(0, 0, 0) : position;
              this.direction = direction === undefined ? new vector3_4.Vector3(0, 0, 0) : direction;
          }
          Ray.prototype.toString = function () {
              return "{ position: " + this.position.toString() + ", direction: " + this.direction.toString() + " }";
          };
          Ray.equals = function (r0, r1) {
              return (vector3_4.Vector3.equals(r0.position, r1.position) &&
                  vector3_4.Vector3.equals(r0.direction, r1.direction));
          };
          Ray.intersectPlane = function (ray, plane) {
              var n0 = ((plane.v[pli.x] * ray.direction.v[v3i.x]) +
                  (plane.v[pli.y] * ray.direction.v[v3i.y])) +
                  (plane.v[pli.z] * ray.direction.v[v3i.z]);
              if (Math.abs(n0) < 1E-05) {
                  return undefined;
              }
              var n1 = ((plane.v[pli.x] * ray.position.v[v3i.x]) +
                  (plane.v[pli.y] * ray.position.v[v3i.y])) +
                  (plane.v[pli.z] * ray.position.v[v3i.z]);
              var n2 = (-plane.v[pli.w] - n1) / n0;
              if (n2 < 0.0) {
                  if (n2 < -1E-05) {
                      return undefined;
                  }
                  n2 = 0.0;
              }
              return n2;
          };
          Ray.intersectTriangle = function (ray, triangle) {
              var result = undefined;
              var v0 = vector3_4.Vector3.sub(triangle.v1, triangle.v0);
              var v1 = vector3_4.Vector3.sub(triangle.v2, triangle.v0);
              var v2 = vector3_4.Vector3.cross(ray.direction, v1);
              var n0 = vector3_4.Vector3.dot(v0, v2);
              if (n0 > -0.00001) {
                  return undefined;
              }
              var n1 = 1.0 / n0;
              var v3 = vector3_4.Vector3.sub(ray.position, triangle.v0);
              var n2 = vector3_4.Vector3.dot(v3, v2) * n1;
              if (n2 < -0.001 || n2 > 1.001) {
                  return undefined;
              }
              var v4 = vector3_4.Vector3.cross(v3, v0);
              var n3 = vector3_4.Vector3.dot(ray.direction, v4) * n1;
              if (n3 < -0.001 || n2 + n3 > 1.001) {
                  return undefined;
              }
              result = vector3_4.Vector3.dot(v1, v4) * n1;
              if (result <= 0) {
                  return undefined;
              }
              return result;
          };
          Ray.intersectBox = function (r0, b0) {
              var result = 0.0;
              var maxValue = f32.max;
              if (Math.abs(r0.direction.v[v3i.x]) < 1E-06) {
                  if ((r0.position.v[v3i.x] < b0.min.v[v3i.x]) ||
                      (r0.position.v[v3i.x] > b0.max.v[v3i.x])) {
                      return undefined;
                  }
              }
              else {
                  var n0 = 1.0 / r0.direction.v[v3i.x];
                  var n1 = (b0.min.v[v3i.x] - r0.position.v[v3i.x]) * n0;
                  var n2 = (b0.max.v[v3i.x] - r0.position.v[v3i.x]) * n0;
                  if (n1 > n2) {
                      var n3 = n1;
                      n1 = n2;
                      n2 = n3;
                  }
                  result = max(n1, result);
                  maxValue = min(n2, result);
                  if (result > maxValue) {
                      return undefined;
                  }
              }
              if (Math.abs(r0.direction.v[v3i.y]) < 1E-06) {
                  if ((r0.position.v[v3i.y] < b0.min.v[v3i.y]) ||
                      (r0.position.v[v3i.y] > b0.max.v[v3i.y])) {
                      return undefined;
                  }
              }
              else {
                  var n0 = 1.0 / r0.direction.v[v3i.y];
                  var n1 = (b0.min.v[v3i.y] - r0.position.v[v3i.y]) * n0;
                  var n2 = (b0.max.v[v3i.y] - r0.position.v[v3i.y]) * n0;
                  if (n1 > n2) {
                      var n3 = n1;
                      n1 = n2;
                      n2 = n3;
                  }
                  result = max(n1, result);
                  maxValue = min(n2, maxValue);
                  if (result > maxValue) {
                      return undefined;
                  }
              }
              if (Math.abs(r0.direction.v[v3i.z]) < 1E-06) {
                  if ((r0.position.v[v3i.z] < b0.min.v[v3i.z]) ||
                      (r0.position.v[v3i.z] > b0.max.v[v3i.z])) {
                      return undefined;
                  }
              }
              else {
                  var n0 = 1.0 / r0.direction.v[v3i.z];
                  var n1 = (b0.min.v[v3i.z] - r0.position.v[v3i.z]) * n0;
                  var n2 = (b0.max.v[v3i.z] - r0.position.v[v3i.z]) * n0;
                  if (n1 > n2) {
                      var n3 = n1;
                      n1 = n2;
                      n2 = n3;
                  }
                  result = max(n1, result);
                  maxValue = min(n2, maxValue);
                  if (result > maxValue) {
                      return undefined;
                  }
              }
              return result;
          };
          Ray.intersectSphere = function (r0, s0) {
              var n0 = s0.position.v[v3i.x] - r0.position.v[v3i.x];
              var n1 = s0.position.v[v3i.y] - r0.position.v[v3i.y];
              var n2 = s0.position.v[v3i.z] - r0.position.v[v3i.z];
              var n3 = ((n0 * n0) + (n1 * n1)) + (n2 * n2);
              var n4 = s0.radius * s0.radius;
              if (n3 <= n4) {
                  return 0.0;
              }
              var n5 = ((n0 * r0.direction.v[v3i.x]) +
                  (n1 * r0.direction.v[v3i.y])) +
                  (n2 * r0.direction.v[v3i.z]);
              if (n5 < 0.0) {
                  return undefined;
              }
              var n6 = n3 - (n5 * n5);
              if (n6 > n4) {
                  return undefined;
              }
              var n7 = Math.sqrt(n4 - n6);
              return n5 - n7;
          };
          Ray.intersectFrustum = function (ray, frustum) {
              return null;
          };
          Ray.create = function (position, direction) {
              return new Ray(position, direction);
          };
          return Ray;
      }());
      exports.Ray = Ray;
  });
  define("src/math/box", ["require", "exports", "src/math/vector3", "src/math/ray"], function (require, exports, vector3_5, ray_2) {
      "use strict";
      exports.__esModule = true;
      var v3i = { x: 0, y: 1, z: 2 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var Box = (function () {
          function Box(min, max) {
              this.min = min === undefined ? new vector3_5.Vector3(0, 0, 0) : min;
              this.max = max === undefined ? new vector3_5.Vector3(1, 1, 1) : max;
          }
          Box.prototype.toString = function () {
              return "[" + this.min.toString() + ", " + this.max.toString() + "]";
          };
          Box.prototype.clone = function () {
              return Box.clone(this);
          };
          Box.prototype.corners = function () {
              return [
                  new vector3_5.Vector3(this.min.v[v3i.x], this.max.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_5.Vector3(this.max.v[v3i.x], this.max.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_5.Vector3(this.max.v[v3i.x], this.min.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_5.Vector3(this.min.v[v3i.x], this.min.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_5.Vector3(this.min.v[v3i.x], this.max.v[v3i.y], this.min.v[v3i.z]),
                  new vector3_5.Vector3(this.max.v[v3i.x], this.max.v[v3i.y], this.min.v[v3i.z]),
                  new vector3_5.Vector3(this.max.v[v3i.x], this.min.v[v3i.y], this.min.v[v3i.z]),
                  new vector3_5.Vector3(this.min.v[v3i.x], this.min.v[v3i.y], this.min.v[v3i.z])
              ];
          };
          Box.equals = function (b0, b1) {
              return (vector3_5.Vector3.equals(b0.min, b1.min) &&
                  vector3_5.Vector3.equals(b0.max, b1.max));
          };
          Box.merge = function (b0, b1) {
              return new Box(vector3_5.Vector3.min(b0.min, b1.min), vector3_5.Vector3.max(b0.max, b1.max));
          };
          Box.intersectBox = function (b0, b1) {
              if ((b0.max.v[v3i.x] < b1.min.v[v3i.x]) ||
                  (b0.min.v[v3i.x] > b1.max.v[v3i.x])) {
                  return false;
              }
              if ((b0.max.v[v3i.y] < b1.min.v[v3i.y]) ||
                  (b0.min.v[v3i.y] > b1.max.v[v3i.y])) {
                  return false;
              }
              return ((b0.max.v[v3i.z] >= b1.min.v[v3i.z]) &&
                  (b0.min.v[v3i.z] <= b1.max.v[v3i.z]));
          };
          Box.intersectPlane = function (b0, p0) {
              var n1 = new vector3_5.Vector3((p0.v[pli.x] >= 0.0) ? b0.min.v[v3i.x] : b0.max.v[v3i.x], (p0.v[pli.y] >= 0.0) ? b0.min.v[v3i.y] : b0.max.v[v3i.y], (p0.v[pli.z] >= 0.0) ? b0.min.v[v3i.z] : b0.max.v[v3i.z]);
              var n0 = new vector3_5.Vector3((p0.v[pli.x] >= 0.0) ? b0.max.v[v3i.x] : b0.min.v[v3i.x], (p0.v[pli.y] >= 0.0) ? b0.max.v[v3i.y] : b0.min.v[v3i.y], (p0.v[pli.z] >= 0.0) ? b0.max.v[v3i.z] : b0.min.v[v3i.z]);
              var n2 = ((p0.v[pli.x] * n1.v[v3i.x]) +
                  (p0.v[pli.y] * n1.v[v3i.y])) +
                  (p0.v[pli.y] * n1.v[v3i.z]);
              if ((n2 + p0.v[pli.w]) > 0.0) {
                  return "front";
              }
              n2 = ((p0.v[pli.x] * n0.v[v3i.x]) +
                  (p0.v[pli.y] * n0.v[v3i.y])) +
                  (p0.v[pli.z] * n0.v[v3i.z]);
              if ((n2 + p0.v[pli.w]) < 0.0) {
                  return "back";
              }
              return "intersect";
          };
          Box.intersectRay = function (b0, r0) {
              return ray_2.Ray.intersectBox(r0, b0);
          };
          Box.intersectSphere = function (b0, s0) {
              var vector = vector3_5.Vector3.clamp(s0.position, b0.min, b0.max);
              var num = vector3_5.Vector3.distanceSq(s0.position, vector);
              return (num <= (s0.radius * s0.radius));
          };
          Box.fromSphere = function (s0) {
              return new Box(new vector3_5.Vector3(s0.position.v[v3i.x] - s0.radius, s0.position.v[v3i.y] - s0.radius, s0.position.v[v3i.z] - s0.radius), new vector3_5.Vector3(s0.position.v[v3i.x] + s0.radius, s0.position.v[v3i.y] + s0.radius, s0.position.v[v3i.z] + s0.radius));
          };
          Box.fromPoints = function (points) {
              var max = vector3_5.Vector3.MAX_VALUE;
              var min = vector3_5.Vector3.MIN_VALUE;
              for (var i = 0; i < points.length; i++) {
                  max = vector3_5.Vector3.min(max, points[i]);
                  min = vector3_5.Vector3.max(min, points[i]);
              }
              return new Box(min, max);
          };
          Box.clone = function (b0) {
              return new Box(b0.min.clone(), b0.max.clone());
          };
          Box.create = function (min, max) {
              return new Box(min, max);
          };
          return Box;
      }());
      exports.Box = Box;
  });
  define("src/math/plane", ["require", "exports", "src/math/vector3", "src/math/matrix"], function (require, exports, vector3_6, matrix_2) {
      "use strict";
      exports.__esModule = true;
      var qi = { x: 0, y: 1, z: 2, w: 3 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var v4i = { x: 0, y: 1, z: 2, w: 3 };
      var v3i = { x: 0, y: 1, z: 2 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var Plane = (function () {
          function Plane(a, b, c, d) {
              this.v = new Float32Array(4);
              this.v[pli.x] = a === undefined ? 0.0 : a;
              this.v[pli.y] = b === undefined ? 0.0 : b;
              this.v[pli.z] = c === undefined ? 0.0 : c;
              this.v[pli.w] = d === undefined ? 0.0 : d;
          }
          Plane.prototype.a = function (value) {
              if (value !== undefined) {
                  this.v[pli.x] = value;
              }
              return this.v[pli.x];
          };
          Plane.prototype.b = function (value) {
              if (value !== undefined) {
                  this.v[pli.y] = value;
              }
              return this.v[pli.y];
          };
          Plane.prototype.c = function (value) {
              if (value !== undefined) {
                  this.v[pli.z] = value;
              }
              return this.v[pli.z];
          };
          Plane.prototype.d = function (value) {
              if (value !== undefined) {
                  this.v[pli.w] = value;
              }
              return this.v[pli.w];
          };
          Plane.prototype.normal = function () {
              return new vector3_6.Vector3(this.v[pli.x], this.v[pli.y], this.v[pli.z]);
          };
          Plane.prototype.toString = function () {
              return "[" + this.v[pli.x] + ", " + this.v[pli.y] + ", " + this.v[pli.z] + ", " + this.v[pli.w] + "]";
          };
          Plane.prototype.clone = function () {
              return Plane.clone(this);
          };
          Plane.equals = function (p0, p1) {
              return ((p0.v[pli.x] === p1.v[pli.x]) &&
                  (p0.v[pli.y] === p1.v[pli.y]) &&
                  (p0.v[pli.z] === p1.v[pli.z]));
          };
          Plane.normalize = function (p0) {
              var n0 = ((p0.v[pli.x] * p0.v[pli.x]) +
                  (p0.v[pli.y] * p0.v[pli.y])) +
                  (p0.v[pli.z] * p0.v[pli.z]);
              if (Math.abs((n0 - 1.0)) < 1.192093E-07) {
                  var p1 = new Plane();
                  p1.v[pli.x] = p0.v[pli.x];
                  p1.v[pli.y] = p0.v[pli.y];
                  p1.v[pli.z] = p0.v[pli.z];
                  p1.v[pli.w] = p0.v[pli.w];
                  return p1;
              }
              else {
                  var p1 = new Plane();
                  var n1 = 1.0 / Math.sqrt(n0);
                  p1.v[pli.x] = p0.v[pli.x] * n1;
                  p1.v[pli.y] = p0.v[pli.y] * n1;
                  p1.v[pli.z] = p0.v[pli.z] * n1;
                  p1.v[pli.w] = p0.v[pli.w] * n1;
                  return p1;
              }
          };
          Plane.fromPoints = function (point1, point2, point3) {
              var p0 = new Plane();
              var n0 = point2.v[v3i.x] - point1.v[v3i.x];
              var n1 = point2.v[v3i.y] - point1.v[v3i.y];
              var n2 = point2.v[v3i.z] - point1.v[v3i.z];
              var n3 = point3.v[v3i.x] - point1.v[v3i.x];
              var n4 = point3.v[v3i.y] - point1.v[v3i.y];
              var n5 = point3.v[v3i.z] - point1.v[v3i.z];
              var n6 = (n1 * n5) - (n2 * n4);
              var n7 = (n2 * n3) - (n0 * n5);
              var n8 = (n0 * n4) - (n1 * n3);
              var n9 = ((n6 * n6) + (n7 * n7)) + (n8 * n8);
              var n10 = 1.0 / Math.sqrt(n9);
              p0.v[pli.x] = n6 * n10;
              p0.v[pli.y] = n7 * n10;
              p0.v[pli.z] = n8 * n10;
              p0.v[pli.w] = -(((p0.v[pli.x] * point1.v[v3i.x]) +
                  (p0.v[pli.y] * point1.v[v3i.y])) +
                  (p0.v[pli.z] * point1.v[v3i.z]));
              return p0;
          };
          Plane.transform = function (p0, m0) {
              var p1 = new Plane();
              var m1 = matrix_2.Matrix.invert(m0);
              var x = p0.v[pli.x];
              var y = p0.v[pli.y];
              var z = p0.v[pli.z];
              var d = p0.v[pli.w];
              p1.v[pli.x] = (((x * m1.v[mi.m11]) + (y * m1.v[mi.m12])) + (z * m1.v[mi.m13])) + (d * m1.v[mi.m14]);
              p1.v[pli.y] = (((x * m1.v[mi.m21]) + (y * m1.v[mi.m22])) + (z * m1.v[mi.m23])) + (d * m1.v[mi.m24]);
              p1.v[pli.z] = (((x * m1.v[mi.m31]) + (y * m1.v[mi.m32])) + (z * m1.v[mi.m33])) + (d * m1.v[mi.m34]);
              p1.v[pli.w] = (((x * m1.v[mi.m41]) + (y * m1.v[mi.m42])) + (z * m1.v[mi.m43])) + (d * m1.v[mi.m44]);
              return p1;
          };
          Plane.dot4 = function (p0, v0) {
              return ((((p0.v[pli.x] * v0.v[v4i.x]) +
                  (p0.v[pli.y] * v0.v[v4i.y])) +
                  (p0.v[pli.z] * v0.v[v4i.z])) +
                  (p0.v[pli.w] * v0.v[v4i.w]));
          };
          Plane.dot3 = function (p0, v0) {
              return ((((p0.v[pli.x] * v0.v[v3i.x]) +
                  (p0.v[pli.y] * v0.v[v3i.y])) +
                  (p0.v[pli.z] * v0.v[v3i.z])) +
                  p0.v[pli.w]);
          };
          Plane.dotN = function (plane, normal) {
              return (((plane.v[pli.x] * normal.v[v3i.x]) +
                  (plane.v[pli.y] * normal.v[v3i.y])) +
                  (plane.v[pli.z] * normal.v[v3i.z]));
          };
          Plane.intersectBox = function (p0, b0) {
              var n0 = new vector3_6.Vector3((p0.v[pli.x] >= 0.0) ? b0.min.v[v3i.x] : b0.max.v[v3i.x], (p0.v[pli.y] >= 0.0) ? b0.min.v[v3i.y] : b0.max.v[v3i.y], (p0.v[pli.z] >= 0.0) ? b0.min.v[v3i.z] : b0.max.v[v3i.z]);
              var n1 = new vector3_6.Vector3((p0.v[pli.x] >= 0.0) ? b0.max.v[v3i.x] : b0.min.v[v3i.x], (p0.v[pli.y] >= 0.0) ? b0.max.v[v3i.y] : b0.min.v[v3i.y], (p0.v[pli.z] >= 0.0) ? b0.max.v[v3i.z] : b0.min.v[v3i.z]);
              var num = ((p0.v[pli.x] * n0.v[v3i.x]) +
                  (p0.v[pli.y] * n0.v[v3i.y])) +
                  (p0.v[pli.z] * n0.v[v3i.z]);
              if ((num + p0.v[pli.w]) > 0.0) {
                  return "front";
              }
              num = ((p0.v[pli.x] * n1.v[v3i.x]) +
                  (p0.v[pli.y] * n1.v[v3i.y])) +
                  (p0.v[pli.z] * n1.v[v3i.z]);
              if ((num + p0.v[pli.w]) < 0.0) {
                  return "back";
              }
              return "intersect";
          };
          Plane.intersectSphere = function (plane, sphere) {
              var n0 = ((sphere.position.v[v3i.x] * plane.v[pli.x]) +
                  (sphere.position.v[v3i.y] * plane.v[pli.y]) +
                  (sphere.position.v[v3i.z] * plane.v[pli.z]));
              var n1 = n0 + plane.v[pli.w];
              if (n1 > sphere.radius) {
                  return "front";
              }
              if (n1 < -sphere.radius) {
                  return "back";
              }
              return "intersect";
          };
          Plane.intersectFrustum = function (p0, f0) {
              var n0 = 0;
              for (var i = 0; i < 8; i++) {
                  var n1 = vector3_6.Vector3.dot(f0.corners[i], p0.normal());
                  if ((n1 + p0.v[pli.w]) > 0.0) {
                      n0 |= 1;
                  }
                  else {
                      n0 |= 2;
                  }
                  if (n0 == 3) {
                      return "intersect";
                  }
              }
              return (n0 == 1)
                  ? "front"
                  : "back";
          };
          Plane.clone = function (p0) {
              return new Plane(p0.v[pli.x], p0.v[pli.y], p0.v[pli.z], p0.v[pli.w]);
          };
          Plane.create = function (a, b, c, d) {
              return new Plane(a, b, c, d);
          };
          return Plane;
      }());
      exports.Plane = Plane;
  });
  define("src/math/matrix", ["require", "exports", "src/math/plane", "src/math/vector3", "src/math/vector4"], function (require, exports, plane_3, vector3_7, vector4_1) {
      "use strict";
      exports.__esModule = true;
      var qui = { x: 0, y: 1, z: 2, w: 3 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var v3i = { x: 0, y: 1, z: 2 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var Matrix = (function () {
          function Matrix(array) {
              this.v = new Float32Array(16);
              if (array !== undefined) {
                  for (var i = 0; i < array.length; i++) {
                      this.v[i] = array[i];
                  }
              }
              else {
                  this.v[mi.m11] = 1;
                  this.v[mi.m12] = 0;
                  this.v[mi.m13] = 0;
                  this.v[mi.m14] = 0;
                  this.v[mi.m21] = 0;
                  this.v[mi.m22] = 1;
                  this.v[mi.m23] = 0;
                  this.v[mi.m24] = 0;
                  this.v[mi.m31] = 0;
                  this.v[mi.m32] = 0;
                  this.v[mi.m33] = 1;
                  this.v[mi.m34] = 0;
                  this.v[mi.m41] = 0;
                  this.v[mi.m42] = 0;
                  this.v[mi.m43] = 0;
                  this.v[mi.m44] = 1;
              }
          }
          Matrix.prototype.m11 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m11] = value;
              }
              return this.v[mi.m11];
          };
          Matrix.prototype.m12 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m12] = value;
              }
              return this.v[mi.m12];
          };
          Matrix.prototype.m13 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m13] = value;
              }
              return this.v[mi.m13];
          };
          Matrix.prototype.m14 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m14] = value;
              }
              return this.v[mi.m14];
          };
          Matrix.prototype.m21 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m21] = value;
              }
              return this.v[mi.m21];
          };
          Matrix.prototype.m22 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m22] = value;
              }
              return this.v[mi.m22];
          };
          Matrix.prototype.m23 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m23] = value;
              }
              return this.v[mi.m23];
          };
          Matrix.prototype.m24 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m24] = value;
              }
              return this.v[mi.m24];
          };
          Matrix.prototype.m31 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m31] = value;
              }
              return this.v[mi.m31];
          };
          Matrix.prototype.m32 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m32] = value;
              }
              return this.v[mi.m32];
          };
          Matrix.prototype.m33 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m33] = value;
              }
              return this.v[mi.m33];
          };
          Matrix.prototype.m34 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m34] = value;
              }
              return this.v[mi.m34];
          };
          Matrix.prototype.m41 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m41] = value;
              }
              return this.v[mi.m41];
          };
          Matrix.prototype.m42 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m42] = value;
              }
              return this.v[mi.m42];
          };
          Matrix.prototype.m43 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m43] = value;
              }
              return this.v[mi.m43];
          };
          Matrix.prototype.m44 = function (value) {
              if (value !== undefined) {
                  this.v[mi.m44] = value;
              }
              return this.v[mi.m44];
          };
          Matrix.prototype.cols = function () {
              return [
                  new vector4_1.Vector4(this.v[mi.m11], this.v[mi.m21], this.v[mi.m31], this.v[mi.m41]),
                  new vector4_1.Vector4(this.v[mi.m12], this.v[mi.m22], this.v[mi.m32], this.v[mi.m42]),
                  new vector4_1.Vector4(this.v[mi.m13], this.v[mi.m23], this.v[mi.m33], this.v[mi.m43]),
                  new vector4_1.Vector4(this.v[mi.m14], this.v[mi.m24], this.v[mi.m34], this.v[mi.m44])
              ];
          };
          Matrix.prototype.rows = function () {
              return [
                  new vector4_1.Vector4(this.v[mi.m11], this.v[mi.m12], this.v[mi.m13], this.v[mi.m14]),
                  new vector4_1.Vector4(this.v[mi.m21], this.v[mi.m22], this.v[mi.m23], this.v[mi.m24]),
                  new vector4_1.Vector4(this.v[mi.m31], this.v[mi.m32], this.v[mi.m33], this.v[mi.m34]),
                  new vector4_1.Vector4(this.v[mi.m41], this.v[mi.m42], this.v[mi.m43], this.v[mi.m44])
              ];
          };
          Matrix.prototype.up = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m21] = vector.v[v3i.x];
                  this.v[mi.m22] = vector.v[v3i.y];
                  this.v[mi.m23] = vector.v[v3i.z];
              }
              return new vector3_7.Vector3(this.v[mi.m21], this.v[mi.m22], this.v[mi.m23]);
          };
          Matrix.prototype.down = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m21] = -vector.v[v3i.x];
                  this.v[mi.m22] = -vector.v[v3i.y];
                  this.v[mi.m23] = -vector.v[v3i.z];
              }
              return new vector3_7.Vector3(-this.v[mi.m21], -this.v[mi.m22], -this.v[mi.m23]);
          };
          Matrix.prototype.right = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m11] = vector.v[v3i.x];
                  this.v[mi.m12] = vector.v[v3i.y];
                  this.v[mi.m13] = vector.v[v3i.z];
              }
              return new vector3_7.Vector3(this.v[mi.m11], this.v[mi.m12], this.v[mi.m13]);
          };
          Matrix.prototype.left = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m11] = -vector.v[v3i.x];
                  this.v[mi.m12] = -vector.v[v3i.y];
                  this.v[mi.m13] = -vector.v[v3i.z];
              }
              return new vector3_7.Vector3(-this.v[mi.m11], -this.v[mi.m12], -this.v[mi.m13]);
          };
          Matrix.prototype.forward = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m31] = -vector.v[v3i.x];
                  this.v[mi.m32] = -vector.v[v3i.y];
                  this.v[mi.m33] = -vector.v[v3i.z];
              }
              return new vector3_7.Vector3(-this.v[mi.m31], -this.v[mi.m32], -this.v[mi.m33]);
          };
          Matrix.prototype.backward = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m31] = vector.v[v3i.x];
                  this.v[mi.m32] = vector.v[v3i.y];
                  this.v[mi.m33] = vector.v[v3i.z];
              }
              return new vector3_7.Vector3(this.v[mi.m31], this.v[mi.m32], this.v[mi.m33]);
          };
          Matrix.prototype.translation = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m41] = vector.v[v3i.x];
                  this.v[mi.m42] = vector.v[v3i.y];
                  this.v[mi.m43] = vector.v[v3i.z];
              }
              return new vector3_7.Vector3(this.v[mi.m41], this.v[mi.m42], this.v[mi.m43]);
          };
          Matrix.prototype.translate = function (v0) {
              return Matrix.mul(this, Matrix.translation(v0));
          };
          Matrix.prototype.scale = function (v0) {
              return Matrix.mul(this, Matrix.scale(v0));
          };
          Matrix.prototype.rotateX = function (radian) {
              return Matrix.mul(this, Matrix.rotationX(radian));
          };
          Matrix.prototype.rotateY = function (radian) {
              return Matrix.mul(this, Matrix.rotationY(radian));
          };
          Matrix.prototype.rotateZ = function (radian) {
              return Matrix.mul(this, Matrix.rotationZ(radian));
          };
          Matrix.prototype.toString = function () {
              var buf = new Array();
              buf.push("[" + this.v[mi.m11] + ", " + this.v[mi.m12] + ", " + this.v[mi.m13] + ", " + this.v[mi.m14]);
              buf.push(" " + this.v[mi.m21] + ", " + this.v[mi.m22] + ", " + this.v[mi.m23] + ", " + this.v[mi.m24]);
              buf.push(" " + this.v[mi.m31] + ", " + this.v[mi.m32] + ", " + this.v[mi.m33] + ", " + this.v[mi.m34]);
              buf.push(" " + this.v[mi.m41] + ", " + this.v[mi.m42] + ", " + this.v[mi.m43] + ", " + this.v[mi.m44] + "]");
              return buf.join('\n');
          };
          Matrix.prototype.clone = function () {
              return Matrix.clone(this);
          };
          Matrix.identity = function () {
              return new Matrix();
          };
          Matrix.translation = function (v0) {
              return new Matrix([
                  1, 0, 0, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  v0.v[v3i.x], v0.v[v3i.y], v0.v[v3i.z], 1
              ]);
          };
          Matrix.scale = function (v0) {
              return new Matrix([
                  v0.v[v3i.x], 0, 0, 0,
                  0, v0.v[v3i.y], 0, 0,
                  0, 0, v0.v[v3i.z], 0,
                  0, 0, 0, 1
              ]);
          };
          Matrix.rotationX = function (radians) {
              var cos = Math.cos(radians);
              var sin = Math.sin(radians);
              return new Matrix([
                  1, 0, 0, 0,
                  0, cos, sin, 0,
                  0, -sin, cos, 0,
                  0, 0, 0, 1
              ]);
          };
          Matrix.rotationY = function (radians) {
              var cos = Math.cos(radians);
              var sin = Math.sin(radians);
              return new Matrix([
                  cos, 0, -sin, 0,
                  0, 1, 0, 0,
                  sin, 0, cos, 0,
                  0, 0, 0, 1
              ]);
          };
          Matrix.rotationZ = function (radians) {
              var cos = Math.cos(radians);
              var sin = Math.sin(radians);
              return new Matrix([
                  cos, sin, 0, 0,
                  -sin, cos, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1
              ]);
          };
          Matrix.fromAxisAngle = function (axis, radians) {
              var x = axis.v[v3i.x];
              var y = axis.v[v3i.y];
              var z = axis.v[v3i.z];
              var n0 = Math.sin(radians);
              var n1 = Math.cos(radians);
              var n2 = x * x;
              var n3 = y * y;
              var n4 = z * z;
              var n5 = x * y;
              var n6 = x * z;
              var n7 = y * z;
              return new Matrix([
                  n2 + (n1 * (1.0 - n2)),
                  (n5 - (n1 * n5)) + (n0 * z),
                  (n6 - (n1 * n6)) - (n0 * y),
                  0.0,
                  (n5 - (n1 * n5)) - (n0 * z),
                  n3 + (n1 * (1.0 - n3)),
                  (n7 - (n1 * n7)) + (n0 * x),
                  0.0,
                  (n6 - (n1 * n6)) + (n0 * y),
                  (n7 - (n1 * n7)) - (n0 * x),
                  n4 + (n1 * (1.0 - n4)),
                  0.0,
                  0.0, 0.0, 0.0, 1.0
              ]);
          };
          Matrix.perspectiveFov = function (fov, aspect, near, far) {
              var n0 = 1.0 / Math.tan(fov * 0.5);
              var n1 = n0 / aspect;
              var m0 = new Matrix();
              m0.v[mi.m11] = n1;
              m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0;
              m0.v[mi.m22] = n0;
              m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0;
              m0.v[mi.m31] = m0.v[mi.m32] = 0;
              m0.v[mi.m33] = far / (near - far);
              m0.v[mi.m34] = -1;
              m0.v[mi.m41] = m0.v[mi.m42] = m0.v[mi.m44] = 0;
              m0.v[mi.m43] = (near * far) / (near - far);
              return m0;
          };
          Matrix.perspective = function (width, height, near, far) {
              var m0 = new Matrix();
              m0.v[mi.m11] = (2.0 * near) / width;
              m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0;
              m0.v[mi.m22] = (2.0 * near) / height;
              m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0;
              m0.v[mi.m33] = far / (near - far);
              m0.v[mi.m31] = m0.v[mi.m32] = 0.0;
              m0.v[mi.m34] = -1.0;
              m0.v[mi.m41] = m0.v[mi.m42] = m0.v[mi.m44] = 0.0;
              m0.v[mi.m43] = (near * far) / (near - far);
              return m0;
          };
          Matrix.perspectiveOffset = function (left, right, bottom, top, near, far) {
              var m0 = new Matrix();
              m0.v[mi.m11] = (2.0 * near) / (right - left);
              m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0;
              m0.v[mi.m22] = (2.0 * near) / (top - bottom);
              m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0;
              m0.v[mi.m31] = (left + right) / (right - left);
              m0.v[mi.m32] = (top + bottom) / (top - bottom);
              m0.v[mi.m33] = far / (near - far);
              m0.v[mi.m34] = -1.0;
              m0.v[mi.m43] = (near * far) / (near - far);
              m0.v[mi.m41] = m0.v[mi.m42] = m0.v[mi.m44] = 0.0;
              return m0;
          };
          Matrix.orthographic = function (width, height, near, far) {
              var m0 = new Matrix();
              m0.v[mi.m11] = 2.0 / width;
              m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0;
              m0.v[mi.m22] = 2.0 / height;
              m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0;
              m0.v[mi.m33] = 1.0 / (near - far);
              m0.v[mi.m31] = m0.v[mi.m32] = m0.v[mi.m34] = 0.0;
              m0.v[mi.m41] = m0.v[mi.m42] = 0.0;
              m0.v[mi.m43] = near / (near - far);
              m0.v[mi.m44] = 1.0;
              return m0;
          };
          Matrix.orthographicOffset = function (left, right, bottom, top, near, far) {
              var m0 = new Matrix();
              m0.v[mi.m11] = 2.0 / (right - left);
              m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0;
              m0.v[mi.m22] = 2.0 / (top - bottom);
              m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0;
              m0.v[mi.m33] = 1.0 / (near - far);
              m0.v[mi.m31] = m0.v[mi.m32] = m0.v[mi.m34] = 0.0;
              m0.v[mi.m41] = (left + right) / (left - right);
              m0.v[mi.m42] = (top + bottom) / (bottom - top);
              m0.v[mi.m43] = near / (near - far);
              m0.v[mi.m44] = 1.0;
              return m0;
          };
          Matrix.lookAt = function (position, target, up) {
              var m0 = new Matrix();
              var v0 = vector3_7.Vector3.normalize(vector3_7.Vector3.sub(position, target));
              var v1 = vector3_7.Vector3.normalize(vector3_7.Vector3.cross(up, v0));
              var v2 = vector3_7.Vector3.cross(v0, v1);
              m0.v[mi.m11] = v1.v[v3i.x];
              m0.v[mi.m12] = v2.v[v3i.x];
              m0.v[mi.m13] = v0.v[v3i.x];
              m0.v[mi.m14] = 0.0;
              m0.v[mi.m21] = v1.v[v3i.y];
              m0.v[mi.m22] = v2.v[v3i.y];
              m0.v[mi.m23] = v0.v[v3i.y];
              m0.v[mi.m24] = 0.0;
              m0.v[mi.m31] = v1.v[v3i.z];
              m0.v[mi.m32] = v2.v[v3i.z];
              m0.v[mi.m33] = v0.v[v3i.z];
              m0.v[mi.m34] = 0.0;
              m0.v[mi.m41] = -vector3_7.Vector3.dot(v1, position);
              m0.v[mi.m42] = -vector3_7.Vector3.dot(v2, position);
              m0.v[mi.m43] = -vector3_7.Vector3.dot(v0, position);
              m0.v[mi.m44] = 1.0;
              return m0;
          };
          Matrix.origin = function (m0) {
              var r0 = m0.v[mi.m22] * m0.v[mi.m33] - m0.v[mi.m32] * m0.v[mi.m23];
              var r1 = m0.v[mi.m32] * m0.v[mi.m13] - m0.v[mi.m12] * m0.v[mi.m33];
              var r2 = m0.v[mi.m12] * m0.v[mi.m23] - m0.v[mi.m22] * m0.v[mi.m13];
              var r3 = m0.v[mi.m11] * r0 + m0.v[mi.m21] * r1 + m0.v[mi.m31] * r2;
              if (Math.abs(r3) < 0.0001)
                  return vector3_7.Vector3.create();
              var r4 = m0.v[mi.m31] * m0.v[mi.m23] - m0.v[mi.m21] * m0.v[mi.m33];
              var r5 = m0.v[mi.m11] * m0.v[mi.m33] - m0.v[mi.m31] * m0.v[mi.m13];
              var r6 = m0.v[mi.m21] * m0.v[mi.m13] - m0.v[mi.m11] * m0.v[mi.m23];
              var r7 = m0.v[mi.m21] * m0.v[mi.m32] - m0.v[mi.m31] * m0.v[mi.m22];
              var r8 = m0.v[mi.m31] * m0.v[mi.m12] - m0.v[mi.m11] * m0.v[mi.m32];
              var r9 = m0.v[mi.m11] * m0.v[mi.m22] - m0.v[mi.m21] * m0.v[mi.m12];
              return new vector3_7.Vector3(-((r0 * m0.v[mi.m41] + r4 * m0.v[mi.m42] + r7 * m0.v[mi.m43]) / r3), -((r1 * m0.v[mi.m41] + r5 * m0.v[mi.m42] + r8 * m0.v[mi.m43]) / r3), -((r2 * m0.v[mi.m41] + r6 * m0.v[mi.m42] + r9 * m0.v[mi.m43]) / r3));
          };
          Matrix.world = function (position, forward, up) {
              var m0 = new Matrix();
              var v0 = vector3_7.Vector3.normalize(vector3_7.Vector3.sub(position, forward));
              var v1 = vector3_7.Vector3.normalize(vector3_7.Vector3.cross(up, v0));
              var v2 = vector3_7.Vector3.cross(v0, v1);
              m0.v[mi.m11] = v1.v[v3i.x];
              m0.v[mi.m12] = v1.v[v3i.y];
              m0.v[mi.m13] = v1.v[v3i.z];
              m0.v[mi.m21] = v2.v[v3i.x];
              m0.v[mi.m22] = v2.v[v3i.y];
              m0.v[mi.m23] = v2.v[v3i.z];
              m0.v[mi.m31] = v0.v[v3i.x];
              m0.v[mi.m32] = v0.v[v3i.y];
              m0.v[mi.m33] = v0.v[v3i.z];
              m0.v[mi.m41] = 0.0;
              m0.v[mi.m42] = 0.0;
              m0.v[mi.m43] = 0.0;
              m0.v[mi.m44] = 1.0;
              m0.v[mi.m14] = -vector3_7.Vector3.dot(v1, position);
              m0.v[mi.m24] = -vector3_7.Vector3.dot(v2, position);
              m0.v[mi.m34] = -vector3_7.Vector3.dot(v0, position);
              return m0;
          };
          Matrix.fromQuaternion = function (q0) {
              var m0 = new Matrix();
              var n0 = q0.v[qui.x] * q0.v[qui.x];
              var n1 = q0.v[qui.y] * q0.v[qui.y];
              var n2 = q0.v[qui.z] * q0.v[qui.z];
              var n3 = q0.v[qui.x] * q0.v[qui.y];
              var n4 = q0.v[qui.z] * q0.v[qui.w];
              var n5 = q0.v[qui.z] * q0.v[qui.x];
              var n6 = q0.v[qui.y] * q0.v[qui.w];
              var n7 = q0.v[qui.y] * q0.v[qui.z];
              var n8 = q0.v[qui.x] * q0.v[qui.w];
              m0.v[mi.m11] = 1.0 - (2.0 * (n1 + n2));
              m0.v[mi.m12] = 2.0 * (n3 + n4);
              m0.v[mi.m13] = 2.0 * (n5 - n6);
              m0.v[mi.m14] = 0.0;
              m0.v[mi.m21] = 2.0 * (n3 - n4);
              m0.v[mi.m22] = 1.0 - (2.0 * (n2 + n0));
              m0.v[mi.m23] = 2.0 * (n7 + n8);
              m0.v[mi.m24] = 0.0;
              m0.v[mi.m31] = 2.0 * (n5 + n6);
              m0.v[mi.m32] = 2.0 * (n7 - n8);
              m0.v[mi.m33] = 1.0 - (2.0 * (n1 + n0));
              m0.v[mi.m34] = 0.0;
              m0.v[mi.m41] = 0.0;
              m0.v[mi.m42] = 0.0;
              m0.v[mi.m43] = 0.0;
              m0.v[mi.m44] = 1.0;
              return m0;
          };
          Matrix.reflection = function (p0) {
              var m0 = new Matrix();
              var p1 = plane_3.Plane.normalize(p0);
              var x = p1.v[pli.x];
              var y = p1.v[pli.y];
              var z = p1.v[pli.z];
              var n0 = -2.0 * x;
              var n1 = -2.0 * y;
              var n2 = -2.0 * z;
              m0.v[mi.m11] = (n0 * x) + 1.0;
              m0.v[mi.m12] = n1 * x;
              m0.v[mi.m13] = n2 * x;
              m0.v[mi.m14] = 0.0;
              m0.v[mi.m21] = n0 * y;
              m0.v[mi.m22] = (n1 * y) + 1.0;
              m0.v[mi.m23] = n2 * y;
              m0.v[mi.m24] = 0.0;
              m0.v[mi.m31] = n0 * z;
              m0.v[mi.m32] = n1 * z;
              m0.v[mi.m33] = (n2 * z) + 1.0;
              m0.v[mi.m34] = 0.0;
              m0.v[mi.m41] = n0 * p1.v[pli.w];
              m0.v[mi.m42] = n1 * p1.v[pli.w];
              m0.v[mi.m43] = n2 * p1.v[pli.w];
              m0.v[mi.m44] = 1.0;
              return m0;
          };
          Matrix.invert = function (m0) {
              var m1 = new Matrix();
              var n0 = m0.v[mi.m11];
              var n1 = m0.v[mi.m12];
              var n2 = m0.v[mi.m13];
              var n3 = m0.v[mi.m14];
              var n4 = m0.v[mi.m21];
              var n5 = m0.v[mi.m22];
              var n6 = m0.v[mi.m23];
              var n7 = m0.v[mi.m24];
              var n8 = m0.v[mi.m31];
              var n9 = m0.v[mi.m32];
              var n10 = m0.v[mi.m33];
              var n11 = m0.v[mi.m34];
              var n12 = m0.v[mi.m41];
              var n13 = m0.v[mi.m42];
              var n14 = m0.v[mi.m43];
              var n15 = m0.v[mi.m44];
              var n16 = (n10 * n15) - (n11 * n14);
              var n17 = (n9 * n15) - (n11 * n13);
              var n18 = (n9 * n14) - (n10 * n13);
              var n19 = (n8 * n15) - (n11 * n12);
              var n20 = (n8 * n14) - (n10 * n12);
              var n21 = (n8 * n13) - (n9 * n12);
              var n22 = ((n5 * n16) - (n6 * n17)) + (n7 * n18);
              var n23 = -(((n4 * n16) - (n6 * n19)) + (n7 * n20));
              var n24 = ((n4 * n17) - (n5 * n19)) + (n7 * n21);
              var n25 = -(((n4 * n18) - (n5 * n20)) + (n6 * n21));
              var n26 = 1.0 / ((((n0 * n22) + (n1 * n23)) + (n2 * n24)) + (n3 * n25));
              m1.v[mi.m11] = n22 * n26;
              m1.v[mi.m21] = n23 * n26;
              m1.v[mi.m31] = n24 * n26;
              m1.v[mi.m41] = n25 * n26;
              m1.v[mi.m12] = -(((n1 * n16) - (n2 * n17)) + (n3 * n18)) * n26;
              m1.v[mi.m22] = (((n0 * n16) - (n2 * n19)) + (n3 * n20)) * n26;
              m1.v[mi.m32] = -(((n0 * n17) - (n1 * n19)) + (n3 * n21)) * n26;
              m1.v[mi.m42] = (((n0 * n18) - (n1 * n20)) + (n2 * n21)) * n26;
              var n27 = (n6 * n15) - (n7 * n14);
              var n28 = (n5 * n15) - (n7 * n13);
              var n29 = (n5 * n14) - (n6 * n13);
              var n30 = (n4 * n15) - (n7 * n12);
              var n32 = (n4 * n14) - (n6 * n12);
              var n33 = (n4 * n13) - (n5 * n12);
              m1.v[mi.m13] = (((n1 * n27) - (n2 * n28)) + (n3 * n29)) * n26;
              m1.v[mi.m23] = -(((n0 * n27) - (n2 * n30)) + (n3 * n32)) * n26;
              m1.v[mi.m33] = (((n0 * n28) - (n1 * n30)) + (n3 * n33)) * n26;
              m1.v[mi.m43] = -(((n0 * n29) - (n1 * n32)) + (n2 * n33)) * n26;
              var n34 = (n6 * n11) - (n7 * n10);
              var n35 = (n5 * n11) - (n7 * n9);
              var n36 = (n5 * n10) - (n6 * n9);
              var n37 = (n4 * n11) - (n7 * n8);
              var n38 = (n4 * n10) - (n6 * n8);
              var n39 = (n4 * n9) - (n5 * n8);
              m1.v[mi.m14] = -(((n1 * n34) - (n2 * n35)) + (n3 * n36)) * n26;
              m1.v[mi.m24] = (((n0 * n34) - (n2 * n37)) + (n3 * n38)) * n26;
              m1.v[mi.m34] = -(((n0 * n35) - (n1 * n37)) + (n3 * n39)) * n26;
              m1.v[mi.m44] = (((n0 * n36) - (n1 * n38)) + (n2 * n39)) * n26;
              return m1;
          };
          Matrix.transpose = function (m0) {
              var m1 = new Matrix();
              m1.v[mi.m11] = m0.v[mi.m11];
              m1.v[mi.m12] = m0.v[mi.m21];
              m1.v[mi.m13] = m0.v[mi.m31];
              m1.v[mi.m14] = m0.v[mi.m41];
              m1.v[mi.m21] = m0.v[mi.m12];
              m1.v[mi.m22] = m0.v[mi.m22];
              m1.v[mi.m23] = m0.v[mi.m32];
              m1.v[mi.m24] = m0.v[mi.m42];
              m1.v[mi.m31] = m0.v[mi.m13];
              m1.v[mi.m32] = m0.v[mi.m23];
              m1.v[mi.m33] = m0.v[mi.m33];
              m1.v[mi.m34] = m0.v[mi.m43];
              m1.v[mi.m41] = m0.v[mi.m14];
              m1.v[mi.m42] = m0.v[mi.m24];
              m1.v[mi.m43] = m0.v[mi.m34];
              m1.v[mi.m44] = m0.v[mi.m44];
              return m1;
          };
          Matrix.determinant = function (m0) {
              var n0 = m0.v[mi.m11];
              var n1 = m0.v[mi.m12];
              var n2 = m0.v[mi.m13];
              var n3 = m0.v[mi.m14];
              var n4 = m0.v[mi.m21];
              var n5 = m0.v[mi.m22];
              var n6 = m0.v[mi.m23];
              var n7 = m0.v[mi.m24];
              var n8 = m0.v[mi.m31];
              var n9 = m0.v[mi.m32];
              var n10 = m0.v[mi.m33];
              var n11 = m0.v[mi.m34];
              var n12 = m0.v[mi.m41];
              var n13 = m0.v[mi.m42];
              var n14 = m0.v[mi.m43];
              var n15 = m0.v[mi.m44];
              var n16 = (n10 * n15) - (n11 * n14);
              var n17 = (n9 * n15) - (n11 * n13);
              var n18 = (n9 * n14) - (n10 * n13);
              var n19 = (n8 * n15) - (n11 * n12);
              var n20 = (n8 * n14) - (n10 * n12);
              var n21 = (n8 * n13) - (n9 * n12);
              return ((((n0 * (((n5 * n16) - (n6 * n17)) + (n7 * n18))) -
                  (n1 * (((n4 * n16) - (n6 * n19)) + (n7 * n20)))) + (n2 * (((n4 * n17) -
                  (n5 * n19)) + (n7 * n21)))) - (n3 * (((n4 * n18) - (n5 * n20)) + (n6 * n21))));
          };
          Matrix.lerp = function (m0, m1, amount) {
              var m2 = new Matrix();
              m2.v[mi.m11] = m0.v[mi.m11] + ((m1.v[mi.m11] - m0.v[mi.m11]) * amount);
              m2.v[mi.m12] = m0.v[mi.m12] + ((m1.v[mi.m12] - m0.v[mi.m12]) * amount);
              m2.v[mi.m13] = m0.v[mi.m13] + ((m1.v[mi.m13] - m0.v[mi.m13]) * amount);
              m2.v[mi.m14] = m0.v[mi.m14] + ((m1.v[mi.m14] - m0.v[mi.m14]) * amount);
              m2.v[mi.m21] = m0.v[mi.m21] + ((m1.v[mi.m21] - m0.v[mi.m21]) * amount);
              m2.v[mi.m22] = m0.v[mi.m22] + ((m1.v[mi.m22] - m0.v[mi.m22]) * amount);
              m2.v[mi.m23] = m0.v[mi.m23] + ((m1.v[mi.m23] - m0.v[mi.m23]) * amount);
              m2.v[mi.m24] = m0.v[mi.m24] + ((m1.v[mi.m24] - m0.v[mi.m24]) * amount);
              m2.v[mi.m31] = m0.v[mi.m31] + ((m1.v[mi.m31] - m0.v[mi.m31]) * amount);
              m2.v[mi.m32] = m0.v[mi.m32] + ((m1.v[mi.m32] - m0.v[mi.m32]) * amount);
              m2.v[mi.m33] = m0.v[mi.m33] + ((m1.v[mi.m33] - m0.v[mi.m33]) * amount);
              m2.v[mi.m34] = m0.v[mi.m34] + ((m1.v[mi.m34] - m0.v[mi.m34]) * amount);
              m2.v[mi.m41] = m0.v[mi.m41] + ((m1.v[mi.m41] - m0.v[mi.m41]) * amount);
              m2.v[mi.m42] = m0.v[mi.m42] + ((m1.v[mi.m42] - m0.v[mi.m42]) * amount);
              m2.v[mi.m43] = m0.v[mi.m43] + ((m1.v[mi.m43] - m0.v[mi.m43]) * amount);
              m2.v[mi.m44] = m0.v[mi.m44] + ((m1.v[mi.m44] - m0.v[mi.m44]) * amount);
              return m2;
          };
          Matrix.negate = function (m0) {
              var m1 = new Matrix();
              m1.v[mi.m11] = -m0.v[mi.m11];
              m1.v[mi.m12] = -m0.v[mi.m12];
              m1.v[mi.m13] = -m0.v[mi.m13];
              m1.v[mi.m14] = -m0.v[mi.m14];
              m1.v[mi.m21] = -m0.v[mi.m21];
              m1.v[mi.m22] = -m0.v[mi.m22];
              m1.v[mi.m23] = -m0.v[mi.m23];
              m1.v[mi.m24] = -m0.v[mi.m24];
              m1.v[mi.m31] = -m0.v[mi.m31];
              m1.v[mi.m32] = -m0.v[mi.m32];
              m1.v[mi.m33] = -m0.v[mi.m33];
              m1.v[mi.m34] = -m0.v[mi.m34];
              m1.v[mi.m41] = -m0.v[mi.m41];
              m1.v[mi.m42] = -m0.v[mi.m42];
              m1.v[mi.m43] = -m0.v[mi.m43];
              m1.v[mi.m44] = -m0.v[mi.m44];
              return m1;
          };
          Matrix.add = function (m0, m1) {
              var m2 = new Matrix();
              m2.v[mi.m11] = m0.v[mi.m11] + m1.v[mi.m11];
              m2.v[mi.m12] = m0.v[mi.m12] + m1.v[mi.m12];
              m2.v[mi.m13] = m0.v[mi.m13] + m1.v[mi.m13];
              m2.v[mi.m14] = m0.v[mi.m14] + m1.v[mi.m14];
              m2.v[mi.m21] = m0.v[mi.m21] + m1.v[mi.m21];
              m2.v[mi.m22] = m0.v[mi.m22] + m1.v[mi.m22];
              m2.v[mi.m23] = m0.v[mi.m23] + m1.v[mi.m23];
              m2.v[mi.m24] = m0.v[mi.m24] + m1.v[mi.m24];
              m2.v[mi.m31] = m0.v[mi.m31] + m1.v[mi.m31];
              m2.v[mi.m32] = m0.v[mi.m32] + m1.v[mi.m32];
              m2.v[mi.m33] = m0.v[mi.m33] + m1.v[mi.m33];
              m2.v[mi.m34] = m0.v[mi.m34] + m1.v[mi.m34];
              m2.v[mi.m41] = m0.v[mi.m41] + m1.v[mi.m41];
              m2.v[mi.m42] = m0.v[mi.m42] + m1.v[mi.m42];
              m2.v[mi.m43] = m0.v[mi.m43] + m1.v[mi.m43];
              m2.v[mi.m44] = m0.v[mi.m44] + m1.v[mi.m44];
              return m2;
          };
          Matrix.sub = function (m0, m1) {
              var m2 = new Matrix();
              m2.v[mi.m11] = m0.v[mi.m11] - m1.v[mi.m11];
              m2.v[mi.m12] = m0.v[mi.m12] - m1.v[mi.m12];
              m2.v[mi.m13] = m0.v[mi.m13] - m1.v[mi.m13];
              m2.v[mi.m14] = m0.v[mi.m14] - m1.v[mi.m14];
              m2.v[mi.m21] = m0.v[mi.m21] - m1.v[mi.m21];
              m2.v[mi.m22] = m0.v[mi.m22] - m1.v[mi.m22];
              m2.v[mi.m23] = m0.v[mi.m23] - m1.v[mi.m23];
              m2.v[mi.m24] = m0.v[mi.m24] - m1.v[mi.m24];
              m2.v[mi.m31] = m0.v[mi.m31] - m1.v[mi.m31];
              m2.v[mi.m32] = m0.v[mi.m32] - m1.v[mi.m32];
              m2.v[mi.m33] = m0.v[mi.m33] - m1.v[mi.m33];
              m2.v[mi.m34] = m0.v[mi.m34] - m1.v[mi.m34];
              m2.v[mi.m41] = m0.v[mi.m41] - m1.v[mi.m41];
              m2.v[mi.m42] = m0.v[mi.m42] - m1.v[mi.m42];
              m2.v[mi.m43] = m0.v[mi.m43] - m1.v[mi.m43];
              m2.v[mi.m44] = m0.v[mi.m44] - m1.v[mi.m44];
              return m2;
          };
          Matrix.mul = function (m0, m1) {
              var m2 = new Matrix();
              m2.v[mi.m11] = (((m0.v[mi.m11] * m1.v[mi.m11]) + (m0.v[mi.m12] * m1.v[mi.m21])) + (m0.v[mi.m13] * m1.v[mi.m31])) + (m0.v[mi.m14] * m1.v[mi.m41]);
              m2.v[mi.m12] = (((m0.v[mi.m11] * m1.v[mi.m12]) + (m0.v[mi.m12] * m1.v[mi.m22])) + (m0.v[mi.m13] * m1.v[mi.m32])) + (m0.v[mi.m14] * m1.v[mi.m42]);
              m2.v[mi.m13] = (((m0.v[mi.m11] * m1.v[mi.m13]) + (m0.v[mi.m12] * m1.v[mi.m23])) + (m0.v[mi.m13] * m1.v[mi.m33])) + (m0.v[mi.m14] * m1.v[mi.m43]);
              m2.v[mi.m14] = (((m0.v[mi.m11] * m1.v[mi.m14]) + (m0.v[mi.m12] * m1.v[mi.m24])) + (m0.v[mi.m13] * m1.v[mi.m34])) + (m0.v[mi.m14] * m1.v[mi.m44]);
              m2.v[mi.m21] = (((m0.v[mi.m21] * m1.v[mi.m11]) + (m0.v[mi.m22] * m1.v[mi.m21])) + (m0.v[mi.m23] * m1.v[mi.m31])) + (m0.v[mi.m24] * m1.v[mi.m41]);
              m2.v[mi.m22] = (((m0.v[mi.m21] * m1.v[mi.m12]) + (m0.v[mi.m22] * m1.v[mi.m22])) + (m0.v[mi.m23] * m1.v[mi.m32])) + (m0.v[mi.m24] * m1.v[mi.m42]);
              m2.v[mi.m23] = (((m0.v[mi.m21] * m1.v[mi.m13]) + (m0.v[mi.m22] * m1.v[mi.m23])) + (m0.v[mi.m23] * m1.v[mi.m33])) + (m0.v[mi.m24] * m1.v[mi.m43]);
              m2.v[mi.m24] = (((m0.v[mi.m21] * m1.v[mi.m14]) + (m0.v[mi.m22] * m1.v[mi.m24])) + (m0.v[mi.m23] * m1.v[mi.m34])) + (m0.v[mi.m24] * m1.v[mi.m44]);
              m2.v[mi.m31] = (((m0.v[mi.m31] * m1.v[mi.m11]) + (m0.v[mi.m32] * m1.v[mi.m21])) + (m0.v[mi.m33] * m1.v[mi.m31])) + (m0.v[mi.m34] * m1.v[mi.m41]);
              m2.v[mi.m32] = (((m0.v[mi.m31] * m1.v[mi.m12]) + (m0.v[mi.m32] * m1.v[mi.m22])) + (m0.v[mi.m33] * m1.v[mi.m32])) + (m0.v[mi.m34] * m1.v[mi.m42]);
              m2.v[mi.m33] = (((m0.v[mi.m31] * m1.v[mi.m13]) + (m0.v[mi.m32] * m1.v[mi.m23])) + (m0.v[mi.m33] * m1.v[mi.m33])) + (m0.v[mi.m34] * m1.v[mi.m43]);
              m2.v[mi.m34] = (((m0.v[mi.m31] * m1.v[mi.m14]) + (m0.v[mi.m32] * m1.v[mi.m24])) + (m0.v[mi.m33] * m1.v[mi.m34])) + (m0.v[mi.m34] * m1.v[mi.m44]);
              m2.v[mi.m41] = (((m0.v[mi.m41] * m1.v[mi.m11]) + (m0.v[mi.m42] * m1.v[mi.m21])) + (m0.v[mi.m43] * m1.v[mi.m31])) + (m0.v[mi.m44] * m1.v[mi.m41]);
              m2.v[mi.m42] = (((m0.v[mi.m41] * m1.v[mi.m12]) + (m0.v[mi.m42] * m1.v[mi.m22])) + (m0.v[mi.m43] * m1.v[mi.m32])) + (m0.v[mi.m44] * m1.v[mi.m42]);
              m2.v[mi.m43] = (((m0.v[mi.m41] * m1.v[mi.m13]) + (m0.v[mi.m42] * m1.v[mi.m23])) + (m0.v[mi.m43] * m1.v[mi.m33])) + (m0.v[mi.m44] * m1.v[mi.m43]);
              m2.v[mi.m44] = (((m0.v[mi.m41] * m1.v[mi.m14]) + (m0.v[mi.m42] * m1.v[mi.m24])) + (m0.v[mi.m43] * m1.v[mi.m34])) + (m0.v[mi.m44] * m1.v[mi.m44]);
              return m2;
          };
          Matrix.div = function (m0, m1) {
              var m2 = new Matrix();
              m2.v[mi.m11] = m0.v[mi.m11] / m1.v[mi.m11];
              m2.v[mi.m12] = m0.v[mi.m12] / m1.v[mi.m12];
              m2.v[mi.m13] = m0.v[mi.m13] / m1.v[mi.m13];
              m2.v[mi.m14] = m0.v[mi.m14] / m1.v[mi.m14];
              m2.v[mi.m21] = m0.v[mi.m21] / m1.v[mi.m21];
              m2.v[mi.m22] = m0.v[mi.m22] / m1.v[mi.m22];
              m2.v[mi.m23] = m0.v[mi.m23] / m1.v[mi.m23];
              m2.v[mi.m24] = m0.v[mi.m24] / m1.v[mi.m24];
              m2.v[mi.m31] = m0.v[mi.m31] / m1.v[mi.m31];
              m2.v[mi.m32] = m0.v[mi.m32] / m1.v[mi.m32];
              m2.v[mi.m33] = m0.v[mi.m33] / m1.v[mi.m33];
              m2.v[mi.m34] = m0.v[mi.m34] / m1.v[mi.m34];
              m2.v[mi.m41] = m0.v[mi.m41] / m1.v[mi.m41];
              m2.v[mi.m42] = m0.v[mi.m42] / m1.v[mi.m42];
              m2.v[mi.m43] = m0.v[mi.m43] / m1.v[mi.m43];
              m2.v[mi.m44] = m0.v[mi.m44] / m1.v[mi.m44];
              return m2;
          };
          Matrix.clone = function (m0) {
              return new Matrix([
                  m0.v[mi.m11], m0.v[mi.m12], m0.v[mi.m13], m0.v[mi.m14],
                  m0.v[mi.m21], m0.v[mi.m22], m0.v[mi.m23], m0.v[mi.m24],
                  m0.v[mi.m31], m0.v[mi.m32], m0.v[mi.m33], m0.v[mi.m34],
                  m0.v[mi.m41], m0.v[mi.m42], m0.v[mi.m43], m0.v[mi.m44]
              ]);
          };
          Matrix.create = function (array) {
              return new Matrix(array);
          };
          return Matrix;
      }());
      exports.Matrix = Matrix;
  });
  define("src/math/vector2", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var f32 = { max: 2147483647, min: -2147483647 };
      var v2i = { x: 0, y: 1 };
      var qi = { x: 0, y: 1, z: 2, w: 3 };
      var mi = {
          m11: 0, m12: 1, m13: 2, m14: 3,
          m21: 4, m22: 5, m23: 6, m24: 7,
          m31: 8, m32: 9, m33: 10, m34: 11,
          m41: 12, m42: 13, m43: 14, m44: 15
      };
      var Vector2 = (function () {
          function Vector2(x, y) {
              this.v = new Float32Array(2);
              this.v[v2i.x] = x === undefined ? 0.0 : x;
              this.v[v2i.y] = y === undefined ? 0.0 : y;
          }
          Vector2.prototype.toString = function () {
              return "[" + this.v[v2i.x] + ", " + this.v[v2i.y] + "]";
          };
          Vector2.prototype.clone = function () {
              return Vector2.clone(this);
          };
          Vector2.prototype.x = function (value) {
              if (value !== undefined) {
                  this.v[v2i.x] = value;
              }
              return this.v[v2i.x];
          };
          Vector2.prototype.y = function (value) {
              if (value !== undefined) {
                  this.v[v2i.y] = value;
              }
              return this.v[v2i.y];
          };
          Vector2.prototype.length = function () {
              return Vector2.getLength(this);
          };
          Vector2.prototype.lengthSq = function () {
              return Vector2.getLengthSq(this);
          };
          Vector2.prototype.normalize = function () {
              return Vector2.normalize(this);
          };
          Vector2.prototype.dot = function (v0) {
              return Vector2.dot(this, v0);
          };
          Vector2.prototype.add = function (v0) {
              return Vector2.add(this, v0);
          };
          Vector2.prototype.sub = function (v0) {
              return Vector2.sub(this, v0);
          };
          Vector2.prototype.mul = function (v0) {
              return Vector2.mul(this, v0);
          };
          Vector2.prototype.div = function (v0) {
              return Vector2.div(this, v0);
          };
          Vector2.prototype.scale = function (s0) {
              return Vector2.scale(this, s0);
          };
          Vector2.prototype.negate = function () {
              return Vector2.negate(this);
          };
          Vector2.zero = function () {
              return new Vector2(0.0, 0.0);
          };
          Vector2.one = function () {
              return new Vector2(1.0, 1.0);
          };
          Vector2.unitX = function () {
              return new Vector2(1.0, 0.0);
          };
          Vector2.unitY = function () {
              return new Vector2(0.0, 1.0);
          };
          Vector2.left = function () {
              return new Vector2(-1.0, 0.0);
          };
          Vector2.right = function () {
              return new Vector2(1.0, 0.0);
          };
          Vector2.up = function () {
              return new Vector2(0.0, 1.0);
          };
          Vector2.down = function () {
              return new Vector2(0.0, -1.0);
          };
          Vector2.equals = function (v0, v1) {
              return (v0.v[v2i.x] === v1.v[v2i.x] &&
                  v0.v[v2i.y] === v1.v[v2i.y]);
          };
          Vector2.getLength = function (v0) {
              return Math.sqrt((v0.v[v2i.x] * v0.v[v2i.x]) +
                  (v0.v[v2i.y] * v0.v[v2i.y]));
          };
          Vector2.getLengthSq = function (v0) {
              return ((v0.v[v2i.x] * v0.v[v2i.x]) +
                  (v0.v[v2i.y] * v0.v[v2i.y]));
          };
          Vector2.distance = function (v0, v1) {
              var x = v0.v[v2i.x] - v1.v[v2i.x];
              var y = v0.v[v2i.y] - v1.v[v2i.y];
              return Math.sqrt((x * x) + (y * y));
          };
          Vector2.distanceSq = function (v0, v1) {
              var x = v0.v[v2i.x] - v1.v[v2i.x];
              var y = v0.v[v2i.y] - v1.v[v2i.y];
              return ((x * x) + (y * y));
          };
          Vector2.dot = function (v0, v1) {
              return ((v0.v[v2i.x] * v1.v[v2i.x]) +
                  (v0.v[v2i.y] * v1.v[v2i.y]));
          };
          Vector2.normalize = function (v0) {
              var len = 1.0 / Math.sqrt((v0.v[v2i.x] * v0.v[v2i.x]) +
                  (v0.v[v2i.y] * v0.v[v2i.y]));
              return new Vector2(v0.v[v2i.x] * len, v0.v[v2i.y] * len);
          };
          Vector2.reflect = function (v0, n0) {
              var dot = ((v0.v[v2i.x] * n0.v[v2i.x]) +
                  (v0.v[v2i.y] * n0.v[v2i.y]));
              return new Vector2(v0.v[v2i.x] - ((2.0 * dot) * n0.v[v2i.x]), v0.v[v2i.y] - ((2.0 * dot) * n0.v[v2i.y]));
          };
          Vector2.abs = function (v0) {
              return new Vector2(Math.abs(v0.v[v2i.x]), Math.abs(v0.v[v2i.y]));
          };
          Vector2.min = function (v0, v1) {
              return new Vector2((v0.v[v2i.x] < v1.v[v2i.x]) ? v0.v[v2i.x] : v1.v[v2i.x], (v0.v[v2i.y] < v1.v[v2i.y]) ? v0.v[v2i.y] : v1.v[v2i.y]);
          };
          Vector2.max = function (v0, v1) {
              return new Vector2((v0.v[v2i.x] > v1.v[v2i.x]) ? v0.v[v2i.x] : v1.v[v2i.x], (v0.v[v2i.y] > v1.v[v2i.y]) ? v0.v[v2i.y] : v1.v[v2i.y]);
          };
          Vector2.clamp = function (v0, min, max) {
              var x = v0.v[v2i.x];
              var y = v0.v[v2i.y];
              x = (x > max.v[v2i.x]) ? max.v[v2i.x] : x;
              x = (x < min.v[v2i.x]) ? min.v[v2i.x] : x;
              y = (y > max.v[v2i.y]) ? max.v[v2i.y] : y;
              y = (y < min.v[v2i.y]) ? min.v[v2i.y] : y;
              return new Vector2(x, y);
          };
          Vector2.lerp = function (v0, v1, amount) {
              return new Vector2(v0.v[v2i.x] + ((v1.v[v2i.x] - v0.v[v2i.x]) * amount), v0.v[v2i.y] + ((v1.v[v2i.y] - v0.v[v2i.y]) * amount));
          };
          Vector2.barycentric = function (v0, v1, v2, amount0, amount1) {
              return new Vector2((v0.v[v2i.x] + (amount0 * (v1.v[v2i.x] - v0.v[v2i.x]))) + (amount1 * (v2.v[v2i.x] - v0.v[v2i.x])), (v0.v[v2i.y] + (amount0 * (v1.v[v2i.y] - v0.v[v2i.y]))) + (amount1 * (v2.v[v2i.y] - v0.v[v2i.y])));
          };
          Vector2.smoothstep = function (v0, v1, amount) {
              amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount);
              amount = (amount * amount) * (3.0 - (2.0 * amount));
              return new Vector2(v0.v[v2i.x] + ((v1.v[v2i.x] - v0.v[v2i.x]) * amount), v0.v[v2i.y] + ((v1.v[v2i.y] - v0.v[v2i.y]) * amount));
          };
          Vector2.catmullrom = function (v0, v1, v2, v3, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              return new Vector2(0.5 * ((((2.0 * v1.v[v2i.x])
                  + ((-v0.v[v2i.x] + v2.v[v2i.x]) * amount))
                  + (((((2.0 * v0.v[v2i.x]) - (5.0 * v1.v[v2i.x]))
                      + (4.0 * v2.v[v2i.x])) - v3.v[v2i.x]) * n0))
                  + ((((-v0.v[v2i.x] + (3.0 * v1.v[v2i.x]))
                      - (3.0 * v2.v[v2i.x])) + v3.v[v2i.x]) * n1)), 0.5 * ((((2.0 * v1.v[v2i.y])
                  + ((-v0.v[v2i.y] + v2.v[v2i.y]) * amount))
                  + (((((2.0 * v0.v[v2i.y]) - (5.0 * v1.v[v2i.y]))
                      + (4.0 * v2.v[v2i.y])) - v3.v[v2i.y]) * n0))
                  + ((((-v0.v[v2i.y] + (3.0 * v1.v[v2i.y]))
                      - (3.0 * v2.v[v2i.y])) + v3.v[v2i.y]) * n1)));
          };
          Vector2.hermite = function (v0, t0, v1, t1, amount) {
              var n0 = amount * amount;
              var n1 = amount * n0;
              var n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0;
              var n3 = (-2.0 * n1) + (3.0 * n0);
              var n4 = (n1 - (2.0 * n0)) + amount;
              var n5 = n1 - n0;
              return new Vector2((((v0.v[v2i.x] * n2) + (v1.v[v2i.x] * n3)) + (t0.v[v2i.x] * n4)) + (t1.v[v2i.x] * n5), (((v0.v[v2i.y] * n2) + (v1.v[v2i.y] * n3)) + (t0.v[v2i.y] * n4)) + (t1.v[v2i.y] * n5));
          };
          Vector2.transform = function (v0, m0) {
              return new Vector2(((v0.v[v2i.x] * m0.v[mi.m11]) + (v0.v[v2i.y] * m0.v[mi.m21])) + m0.v[mi.m41], ((v0.v[v2i.x] * m0.v[mi.m12]) + (v0.v[v2i.y] * m0.v[mi.m22])) + m0.v[mi.m42]);
          };
          Vector2.transformNormal = function (n0, m0) {
              return new Vector2((n0.v[v2i.x] * m0.v[mi.m11]) + (n0.v[v2i.y] * m0.v[mi.m21]), (n0.v[v2i.x] * m0.v[mi.m12]) + (n0.v[v2i.y] * m0.v[mi.m22]));
          };
          Vector2.transformQuaternion = function (v0, q0) {
              var n0 = q0.v[qi.x] + q0.v[qi.x];
              var n1 = q0.v[qi.y] + q0.v[qi.y];
              var n2 = q0.v[qi.z] + q0.v[qi.z];
              var n3 = q0.v[qi.w] * n2;
              var n4 = q0.v[qi.x] * n0;
              var n5 = q0.v[qi.x] * n1;
              var n6 = q0.v[qi.y] * n1;
              var n7 = q0.v[qi.z] * n2;
              return new Vector2((v0.v[v2i.x] * ((1.0 - n6) - n7)) + (v0.v[v2i.y] * (n5 - n3)), (v0.v[v2i.x] * (n5 + n3)) + (v0.v[v2i.y] * ((1.0 - n4) - n7)));
          };
          Vector2.add = function (v0, v1) {
              return new Vector2(v0.v[v2i.x] + v1.v[v2i.x], v0.v[v2i.y] + v1.v[v2i.y]);
          };
          Vector2.sub = function (v0, v1) {
              return new Vector2(v0.v[v2i.x] - v1.v[v2i.x], v0.v[v2i.y] - v1.v[v2i.y]);
          };
          Vector2.mul = function (v0, v1) {
              return new Vector2(v0.v[v2i.x] - v1.v[v2i.x], v0.v[v2i.y] - v1.v[v2i.y]);
          };
          Vector2.div = function (v0, v1) {
              return new Vector2(v0.v[v2i.x] / v1.v[v2i.x], v0.v[v2i.y] / v1.v[v2i.y]);
          };
          Vector2.scale = function (v0, scalar) {
              return new Vector2(v0.v[v2i.x] * scalar, v0.v[v2i.y] * scalar);
          };
          Vector2.negate = function (v0) {
              return new Vector2(-v0.v[v2i.x], -v0.v[v2i.y]);
          };
          Vector2.clone = function (v0) {
              return new Vector2(v0.v[v2i.x], v0.v[v2i.y]);
          };
          Vector2.create = function (x, y) {
              return new Vector2(x, y);
          };
          Vector2.MAX_VALUE = new Vector2(f32.max, f32.max);
          Vector2.MIN_VALUE = new Vector2(f32.min, f32.min);
          return Vector2;
      }());
      exports.Vector2 = Vector2;
  });
  define("src/math/vectorN", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var VectorN = (function () {
          function VectorN(array) {
              this.v = new Float32Array(array.length);
              for (var i = 0; i < array.length; i++) {
                  this.v[i] = array[i];
              }
          }
          VectorN.prototype.toString = function () {
              var buf = new Array();
              buf.push("[");
              for (var i = 0; i < this.v.length; i++) {
                  buf.push(i < (this.v.length - 1) ? this.v[i] + ", " : "" + this.v[i]);
              }
              buf.push(']');
              return buf.join("");
          };
          VectorN.prototype.clone = function () {
              return VectorN.clone(this);
          };
          VectorN.prototype.length = function () {
              return VectorN.getLength(this);
          };
          VectorN.prototype.lengthSq = function () {
              return VectorN.getLengthSq(this);
          };
          VectorN.prototype.normalize = function () {
              return VectorN.normalize(this);
          };
          VectorN.prototype.dot = function (v0) {
              return VectorN.dot(this, v0);
          };
          VectorN.prototype.add = function (v0) {
              return VectorN.add(this, v0);
          };
          VectorN.prototype.sub = function (v0) {
              return VectorN.sub(this, v0);
          };
          VectorN.prototype.mul = function (v0) {
              return VectorN.mul(this, v0);
          };
          VectorN.prototype.div = function (v0) {
              return VectorN.div(this, v0);
          };
          VectorN.prototype.scale = function (s0) {
              return VectorN.scale(this, s0);
          };
          VectorN.prototype.negate = function () {
              return VectorN.negate(this);
          };
          VectorN.add = function (v0, v1) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] + v1.v[i];
              }
              return new VectorN(result);
          };
          VectorN.sub = function (v0, v1) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] - v1.v[i];
              }
              return new VectorN(result);
          };
          VectorN.mul = function (v0, v1) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] * v1.v[i];
              }
              return new VectorN(result);
          };
          VectorN.div = function (v0, v1) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] / v1.v[i];
              }
              return new VectorN(result);
          };
          VectorN.scale = function (v0, scalar) {
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] * scalar;
              }
              return new VectorN(result);
          };
          VectorN.distance = function (left, right) {
              if (left.v.length !== right.v.length)
                  throw Error("dimension mismatch.");
              var _a = [0, 1], acc = _a[0], mul = _a[1];
              for (var i = 0; i < left.v.length; i++) {
                  var offset = right.v[i] - left.v[i];
                  acc += (offset * offset);
              }
              return Math.sqrt(acc);
          };
          VectorN.equals = function (left, right) {
              if (left.v.length !== right.v.length)
                  throw Error("dimension mismatch.");
              for (var i = 0; i < left.v.length; i++)
                  if (left.v[i] !== right.v[i])
                      return false;
              return true;
          };
          VectorN.clamp = function (v0, min, max) {
              var result = new Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i];
                  result[i] = (result[i] > max.v[i]) ? max.v[i] : result[i];
                  result[i] = (result[i] < min.v[i]) ? min.v[i] : result[i];
              }
              return new VectorN(result);
          };
          VectorN.lerp = function (v0, v1, amount) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] + ((v1.v[i] - v0.v[i]) * amount);
              }
              return new VectorN(result);
          };
          VectorN.getLength = function (v0) {
              var num = 0;
              for (var i = 0; i < v0.v.length; i++) {
                  num += (v0.v[i] * v0.v[i]);
              }
              return Math.sqrt(num);
          };
          VectorN.getLengthSq = function (v0) {
              var num = 0;
              for (var i = 0; i < v0.v.length; i++) {
                  num += (v0.v[i] * v0.v[i]);
              }
              return num;
          };
          VectorN.reflect = function (v0, n0) {
              if (v0.v.length !== n0.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              var n1 = 0;
              for (var i = 0; i < v0.v.length; i++)
                  n1 += (v0.v[i] * n0.v[i]);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = (v0.v[i] - ((2.0 * n1) * n0.v[i]));
              }
              return new VectorN(result);
          };
          VectorN.abs = function (v0) {
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = Math.abs(v0.v[i]);
              }
              return new VectorN(result);
          };
          VectorN.min = function (v0, v1) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] < v1.v[i] ? v0.v[i] : v1.v[i];
              }
              return new VectorN(result);
          };
          VectorN.max = function (v0, v1) {
              if (v0.v.length !== v1.v.length)
                  throw Error("dimension mismatch.");
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] > v1.v[i] ? v0.v[i] : v1.v[i];
              }
              return new VectorN(result);
          };
          VectorN.negate = function (v0) {
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = -v0.v[i];
              }
              return new VectorN(result);
          };
          VectorN.dot = function (v0, n0) {
              if (v0.v.length !== n0.v.length)
                  throw Error("dimension mismatch.");
              var num = 0;
              for (var i = 0; i < v0.v.length; i++) {
                  num += (v0.v[i] * n0.v[i]);
              }
              return num;
          };
          VectorN.normalize = function (v0) {
              var result = new Float32Array(v0.v.length);
              var n0 = 0;
              for (var i = 0; i < v0.v.length; i++)
                  n0 += (v0.v[i] * v0.v[i]);
              var n1 = 1.0 / Math.sqrt(n0);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i] * n1;
              }
              return new VectorN(result);
          };
          VectorN.clone = function (v0) {
              var result = new Float32Array(v0.v.length);
              for (var i = 0; i < v0.v.length; i++) {
                  result[i] = v0.v[i];
              }
              return new VectorN(result);
          };
          VectorN.create = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              return new VectorN(args);
          };
          return VectorN;
      }());
      exports.VectorN = VectorN;
  });
  define("src/math/index", ["require", "exports", "src/math/radian", "src/math/matrix", "src/math/plane", "src/math/quaternion", "src/math/single", "src/math/vector2", "src/math/vector3", "src/math/vector4", "src/math/vectorN", "src/math/ray", "src/math/triangle", "src/math/box", "src/math/sphere", "src/math/frustum"], function (require, exports, radian_1, matrix_3, plane_4, quaternion_1, single_2, vector2_1, vector3_8, vector4_2, vectorN_1, ray_3, triangle_1, box_1, sphere_1, frustum_1) {
      "use strict";
      exports.__esModule = true;
      exports.Radian = radian_1.Radian;
      exports.Matrix = matrix_3.Matrix;
      exports.Plane = plane_4.Plane;
      exports.Quaternion = quaternion_1.Quaternion;
      exports.Single = single_2.Single;
      exports.Vector2 = vector2_1.Vector2;
      exports.Vector3 = vector3_8.Vector3;
      exports.Vector4 = vector4_2.Vector4;
      exports.VectorN = vectorN_1.VectorN;
      exports.Ray = ray_3.Ray;
      exports.Triangle = triangle_1.Triangle;
      exports.Box = box_1.Box;
      exports.Sphere = sphere_1.Sphere;
      exports.Frustum = frustum_1.Frustum;
  });
  define("src/compute/dispose", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
  });
  define("src/compute/color", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      exports.compute_texture_dimensions = function (length) {
          var x = Math.ceil(Math.sqrt(length));
          x = (x < 4) ? 4 : x;
          return { width: x, height: x };
      };
      var Color1D = (function () {
          function Color1D(context, framebuf, length) {
              var _a = exports.compute_texture_dimensions(length), width = _a.width, height = _a.height;
              this.type = "Color1D";
              this.context = context;
              this.framebuf = framebuf;
              this.width = length;
              this.textureWidth = width;
              this.textureHeight = height;
              this.textureData = new Uint8Array((width * height) * 4);
              this.data = new Uint8Array(this.textureData.buffer, 0, (length * 4));
              this.texture = this.context.createTexture();
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              this.push();
          }
          Color1D.prototype.get = function (x) {
              var index = (x * 4);
              return [
                  this.data[index + 0],
                  this.data[index + 1],
                  this.data[index + 2],
                  this.data[index + 3]
              ];
          };
          Color1D.prototype.set = function (x, c) {
              var index = (x * 4);
              this.data[index + 0] = c[0];
              this.data[index + 1] = c[1];
              this.data[index + 2] = c[2];
              this.data[index + 3] = c[3];
              return this;
          };
          Color1D.prototype.map = function (func) {
              for (var x = 0; x < this.width; x++) {
                  this.set(x, func(x));
              }
              return this;
          };
          Color1D.prototype.push = function () {
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.textureWidth, this.textureHeight, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              return this;
          };
          Color1D.prototype.pull = function () {
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
              if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) != this.context.FRAMEBUFFER_COMPLETE) {
                  console.warn("Color1D: unable to read array due to incomplete framebuffer attachement");
              }
              this.context.readPixels(0, 0, this.textureWidth, this.textureHeight, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData, 0);
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
              return this;
          };
          Color1D.prototype.dispose = function () {
              this.context.deleteTexture(this.texture);
          };
          return Color1D;
      }());
      exports.Color1D = Color1D;
      var Color2D = (function () {
          function Color2D(context, framebuf, width, height) {
              this.type = "Color2D";
              this.context = context;
              this.framebuf = framebuf;
              this.width = width;
              this.height = height;
              this.textureWidth = width;
              this.textureHeight = height;
              this.textureData = new Uint8Array(width * height * 4);
              this.data = new Uint8Array(this.textureData.buffer);
              this.texture = this.context.createTexture();
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              this.push();
          }
          Color2D.prototype.get = function (x, y) {
              var index = (x + (y * this.width)) * 4;
              return [
                  this.data[index + 0],
                  this.data[index + 1],
                  this.data[index + 2],
                  this.data[index + 3]
              ];
          };
          Color2D.prototype.set = function (x, y, c) {
              var index = (x + (y * this.width)) * 4;
              this.data[index + 0] = c[0];
              this.data[index + 1] = c[1];
              this.data[index + 2] = c[2];
              this.data[index + 3] = c[3];
              return this;
          };
          Color2D.prototype.map = function (func) {
              for (var y = 0; y < this.height; y++) {
                  for (var x = 0; x < this.width; x++) {
                      this.set(x, y, func(x, y));
                  }
              }
              return this;
          };
          Color2D.prototype.push = function () {
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.textureWidth, this.textureHeight, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              return this;
          };
          Color2D.prototype.pull = function () {
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
              if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) != this.context.FRAMEBUFFER_COMPLETE) {
                  console.warn("Color2D: unable to read array due to incomplete framebuffer attachement");
              }
              this.context.readPixels(0, 0, this.textureWidth, this.textureHeight, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData, 0);
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
              return this;
          };
          Color2D.prototype.dispose = function () {
              this.context.deleteTexture(this.texture);
          };
          return Color2D;
      }());
      exports.Color2D = Color2D;
      var Color3D = (function () {
          function Color3D(context, framebuf, width, height, depth) {
              var size = exports.compute_texture_dimensions(width * height * depth);
              this.type = "Color3D";
              this.context = context;
              this.framebuf = framebuf;
              this.width = width;
              this.height = height;
              this.depth = depth;
              this.textureWidth = size.width;
              this.textureHeight = size.height;
              this.textureData = new Uint8Array(size.width * size.height * 4);
              this.data = new Uint8Array(this.textureData.buffer, 0, (width * height * depth) * 4);
              this.texture = this.context.createTexture();
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              this.push();
          }
          Color3D.prototype.get = function (x, y, z) {
              var index = (x + (y * this.width) + (z * (this.width * this.height))) * 4;
              return [
                  this.data[index + 0],
                  this.data[index + 1],
                  this.data[index + 2],
                  this.data[index + 3]
              ];
          };
          Color3D.prototype.set = function (x, y, z, c) {
              var index = (x + (y * this.width) + (z * (this.width * this.height))) * 4;
              this.data[index + 0] = c[0];
              this.data[index + 1] = c[1];
              this.data[index + 2] = c[2];
              this.data[index + 3] = c[3];
              return this;
          };
          Color3D.prototype.map = function (func) {
              for (var z = 0; z < this.depth; z++) {
                  for (var y = 0; y < this.height; y++) {
                      for (var x = 0; x < this.width; x++) {
                          this.set(x, y, z, func(x, y, z));
                      }
                  }
              }
              return this;
          };
          Color3D.prototype.push = function () {
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.textureWidth, this.textureHeight, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              return this;
          };
          Color3D.prototype.pull = function () {
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
              if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) != this.context.FRAMEBUFFER_COMPLETE) {
                  console.warn("Color3D: unable to read array due to incomplete framebuffer attachement");
              }
              this.context.readPixels(0, 0, this.textureWidth, this.textureHeight, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData, 0);
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
              return this;
          };
          Color3D.prototype.dispose = function () {
              this.context.deleteTexture(this.texture);
          };
          return Color3D;
      }());
      exports.Color3D = Color3D;
  });
  define("src/compute/float", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      exports.compute_texture_dimensions = function (length) {
          var x = Math.ceil(Math.sqrt(length));
          x = (x < 4) ? 4 : x;
          return { width: x, height: x };
      };
      var Float1D = (function () {
          function Float1D(context, framebuf, length) {
              var _a = exports.compute_texture_dimensions(length), width = _a.width, height = _a.height;
              this.type = "Float1D";
              this.context = context;
              this.framebuf = framebuf;
              this.width = length;
              this.textureWidth = width;
              this.textureHeight = height;
              this.textureData = new Uint8Array(width * height * 4);
              this.data = new Float32Array(this.textureData.buffer, 0, this.width);
              this.texture = this.context.createTexture();
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              this.push();
          }
          Float1D.prototype.get = function (x) {
              return this.data[x];
          };
          Float1D.prototype.set = function (x, v) {
              this.data[x] = v;
              return this;
          };
          Float1D.prototype.map = function (func) {
              for (var x = 0; x < this.width; x++) {
                  this.set(x, func(x));
              }
              return this;
          };
          Float1D.prototype.push = function () {
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.textureWidth, this.textureHeight, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              return this;
          };
          Float1D.prototype.pull = function () {
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
              if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) != this.context.FRAMEBUFFER_COMPLETE) {
                  console.warn("Float1D: unable to read array due to incomplete framebuffer attachement");
              }
              this.context.readPixels(0, 0, this.textureWidth, this.textureHeight, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData, 0);
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
              return this;
          };
          Float1D.prototype.dispose = function () {
              this.context.deleteTexture(this.texture);
          };
          return Float1D;
      }());
      exports.Float1D = Float1D;
      var Float2D = (function () {
          function Float2D(context, framebuf, width, height) {
              this.type = "Float2D";
              this.context = context;
              this.framebuf = framebuf;
              this.width = width;
              this.height = height;
              this.textureWidth = width;
              this.textureHeight = height;
              this.textureData = new Uint8Array(width * height * 4);
              this.data = new Float32Array(this.textureData.buffer);
              this.texture = this.context.createTexture();
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              this.push();
          }
          Float2D.prototype.get = function (x, y) {
              return this.data[x + (y * this.width)];
          };
          Float2D.prototype.set = function (x, y, v) {
              this.data[x + (y * this.width)] = v;
              return this;
          };
          Float2D.prototype.map = function (func) {
              for (var y = 0; y < this.height; y++) {
                  for (var x = 0; x < this.width; x++) {
                      this.set(x, y, func(x, y));
                  }
              }
              return this;
          };
          Float2D.prototype.push = function () {
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.textureWidth, this.textureHeight, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              return this;
          };
          Float2D.prototype.pull = function () {
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
              if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) != this.context.FRAMEBUFFER_COMPLETE) {
                  console.warn("Float2D: unable to read array due to incomplete framebuffer attachement");
              }
              this.context.readPixels(0, 0, this.textureWidth, this.textureHeight, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData, 0);
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
              return this;
          };
          Float2D.prototype.dispose = function () {
              this.context.deleteTexture(this.texture);
          };
          return Float2D;
      }());
      exports.Float2D = Float2D;
      var Float3D = (function () {
          function Float3D(context, framebuf, width, height, depth) {
              var size = exports.compute_texture_dimensions(width * height * depth);
              this.type = "Float3D";
              this.context = context;
              this.framebuf = framebuf;
              this.width = width;
              this.height = height;
              this.depth = depth;
              this.textureWidth = size.width;
              this.textureHeight = size.height;
              this.textureData = new Uint8Array(size.width * size.height * 4);
              this.data = new Float32Array(this.textureData.buffer, 0, (width * height * depth));
              this.texture = this.context.createTexture();
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
              this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              this.push();
          }
          Float3D.prototype.get = function (x, y, z) {
              return this.data[x + (y * this.width) + (z * (this.width * this.height))];
          };
          Float3D.prototype.set = function (x, y, z, v) {
              this.data[x + (y * this.width) + (z * (this.width * this.height))] = v;
              return this;
          };
          Float3D.prototype.map = function (func) {
              for (var z = 0; z < this.depth; z++) {
                  for (var y = 0; y < this.height; y++) {
                      for (var x = 0; x < this.width; x++) {
                          this.set(x, y, z, func(x, y, z));
                      }
                  }
              }
              return this;
          };
          Float3D.prototype.push = function () {
              this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
              this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.textureWidth, this.textureHeight, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData);
              this.context.bindTexture(this.context.TEXTURE_2D, null);
              return this;
          };
          Float3D.prototype.pull = function () {
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
              if (this.context.checkFramebufferStatus(this.context.FRAMEBUFFER) != this.context.FRAMEBUFFER_COMPLETE) {
                  console.warn("Float3D: unable to read array due to incomplete framebuffer attachement");
              }
              this.context.readPixels(0, 0, this.textureWidth, this.textureHeight, this.context.RGBA, this.context.UNSIGNED_BYTE, this.textureData, 0);
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
              return this;
          };
          Float3D.prototype.dispose = function () {
              this.context.deleteTexture(this.texture);
          };
          return Float3D;
      }());
      exports.Float3D = Float3D;
  });
  define("src/compute/plane", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Plane = (function () {
          function Plane(context) {
              this.context = context;
              this.position = this.context.createBuffer();
              this.context.bindBuffer(this.context.ARRAY_BUFFER, this.position);
              this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([
                  -1.0, -1.0, 0.0,
                  -1.0, 1.0, 0.0,
                  1.0, 1.0, 0.0,
                  1.0, -1.0, 0.0
              ]), this.context.STATIC_DRAW);
              this.texcoord = this.context.createBuffer();
              this.context.bindBuffer(this.context.ARRAY_BUFFER, this.texcoord);
              this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([
                  0.0, 0.0,
                  0.0, 1.0,
                  1.0, 1.0,
                  1.0, 0.0
              ]), this.context.STATIC_DRAW);
              this.indices = this.context.createBuffer();
              this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indices);
              this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                  0, 1, 2, 2, 3, 0
              ]), this.context.STATIC_DRAW);
          }
          Plane.prototype.dispose = function () {
              this.context.deleteBuffer(this.position);
              this.context.deleteBuffer(this.texcoord);
              this.context.deleteBuffer(this.indices);
          };
          return Plane;
      }());
      exports.Plane = Plane;
  });
  define("src/compute/script", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var matcher = function (_expr) {
          if (_expr === void 0) { _expr = ""; }
          var extract = function (code, regex) {
              var buffer = [];
              while (true) {
                  var match = regex.exec(code);
                  if (!match) {
                      return buffer;
                  }
                  else {
                      if (match[0].length === 0)
                          throw Error("zero length match.");
                      code = code.substr(match.index + match[0].length);
                      var literal = match.shift();
                      var captures = match;
                      buffer.push({ literal: literal, captures: captures });
                  }
              }
          };
          return {
              literal: function (x) { return matcher(_expr + x); },
              alphanumeric: function () { return matcher(_expr + "\\w+"); },
              numberic: function () { return matcher(_expr + "[0-9]+"); },
              anything: function () { return matcher(_expr + ".*"); },
              codeblock: function () { return matcher(_expr + "[\\w\\s\\+\\-\\*\\/%\\(\),:;]+"); },
              space: function () { return matcher(_expr + "\\s"); },
              space_optional: function () { return matcher(_expr + "\\s*"); },
              space_mandated: function () { return matcher(_expr + "\\s+"); },
              colon: function () { return matcher(_expr + ":"); },
              semicolon: function () { return matcher(_expr + ";"); },
              dot: function () { return matcher(_expr + "\\."); },
              comma: function () { return matcher(_expr + "\\,"); },
              bracket_open: function () { return matcher(_expr + "\\["); },
              bracket_close: function () { return matcher(_expr + "\\]"); },
              parentheses_open: function () { return matcher(_expr + "\\("); },
              parentheses_close: function () { return matcher(_expr + "\\)"); },
              curly_open: function () { return matcher(_expr + "\\{"); },
              curly_close: function () { return matcher(_expr + "\\}"); },
              capture: function (_inner) { return matcher(_expr + "(" + _inner.expr() + ")"); },
              upto: function (_inner) { return matcher(_expr + _inner.expr() + "?"); },
              anyof: function (_inner) { return matcher(_expr + "[" + _inner.map(function (n) { return n.expr(); }).join("|") + "]*"); },
              optional: function (_inner) { return matcher(_expr + "[" + _inner.expr() + "]*"); },
              expr: function () { return _expr; },
              match: function (s) { return extract(s, new RegExp(_expr)); }
          };
      };
      exports.read_program_thread_function = function (code) {
          var expression = matcher()
              .bracket_open()
              .capture(matcher().codeblock())
              .bracket_close()
              .space_optional()
              .literal("thread")
              .space_optional()
              .parentheses_open()
              .capture(matcher().codeblock())
              .parentheses_close();
          var results = expression.match(code);
          if (results.length === 0) {
              return {
                  indexing: "error",
                  outputs: []
              };
          }
          var outputs = results[0].captures[0].split(",").map(function (n) { return n.trim(); });
          for (var i = 0; i < outputs.length; i++) {
              if (outputs[i] !== "float" && outputs[i] !== "color") {
                  return {
                      indexing: "error",
                      outputs: []
                  };
              }
          }
          var argumentCount = results[0].captures[1].split(",").length;
          var indexing = "error";
          switch (argumentCount) {
              case 1:
                  indexing = "1D";
                  break;
              case 2:
                  indexing = "2D";
                  break;
              case 3:
                  indexing = "3D";
                  break;
              default:
                  indexing = "error";
                  break;
          }
          return {
              indexing: indexing,
              outputs: outputs
          };
      };
      exports.read_program_uniforms = function (code) {
          var expression = matcher()
              .literal("uniform")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .upto(matcher().semicolon());
          return expression.match(code).map(function (match) { return ({
              type: match.captures[0],
              name: match.captures[1]
          }); });
      };
      exports.replace_thread_output_indexer = function (code) {
          var results = matcher()
              .bracket_open()
              .capture(matcher().codeblock())
              .bracket_close()
              .space_optional()
              .literal("thread")
              .space_optional()
              .parentheses_open()
              .codeblock()
              .parentheses_close()
              .space_optional()
              .curly_open()
              .match(code);
          var outputs = results[0].captures[0].split(",").map(function (n) { return n.trim(); });
          return outputs.reduce(function (code, output, index) {
              return matcher()
                  .literal("thread")
                  .space_optional()
                  .bracket_open()
                  .space_optional()
                  .capture(matcher().literal(index.toString()))
                  .space_optional()
                  .bracket_close()
                  .match(code).reduce(function (acc, match) {
                  switch (output) {
                      case "float": return acc.replace(match.literal, "nc_thread_output_" + index + ".r");
                      case "color": return acc.replace(match.literal, "nc_thread_output_" + index);
                  }
                  return acc;
              }, code);
          }, code);
      };
      exports.replace_thread_output_dimensions = function (code) {
          return code.replace(/thread.width/g, "nc_thread_output_width")
              .replace(/thread.height/g, "nc_thread_output_height")
              .replace(/thread.depth/g, "nc_thread_output_depth");
      };
      exports.replace_thread_signature = function (code) {
          var results = matcher()
              .bracket_open()
              .codeblock()
              .bracket_close()
              .space_optional()
              .literal("thread")
              .space_optional()
              .parentheses_open()
              .capture(matcher().codeblock())
              .parentheses_close()
              .match(code);
          return results.reduce(function (acc, extraction) {
              return acc.replace(extraction.literal, "void thread(" + extraction.captures[0] + ")");
          }, code);
      };
      exports.replace_float1D_uniform = function (code) {
          var results = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float1D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code);
          return results.reduce(function (acc, result) {
              var replacement = ["\n"];
              replacement.push("uniform sampler2D nc_uniform_" + result.captures[0] + "_texture;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureWidth;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureHeight;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_width;");
              return acc.replace(result.literal, replacement.join("\n"));
          }, code);
      };
      exports.replace_float1D_indexer = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float1D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher()
                  .literal(name)
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_decode (\n          texture ( \n            nc_uniform_" + name + "_texture,\n            nc_select_1D (\n              nc_uniform_" + name + "_textureWidth,\n              nc_uniform_" + name + "_textureHeight,\n              nc_uniform_" + name + "_width,\n              " + result.captures[0] + "\n            )\n          )\n        )");
              }, acc);
          }, code);
      };
      exports.replace_float1D_width = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float1D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("width").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_width");
              }, acc);
          }, code);
      };
      exports.replace_float2D_uniform = function (code) {
          var results = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code);
          return results.reduce(function (acc, result) {
              var replacement = ["\n"];
              replacement.push("uniform sampler2D nc_uniform_" + result.captures[0] + "_texture;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureWidth;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureHeight;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_width;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_height;");
              return acc.replace(result.literal, replacement.join("\n"));
          }, code);
      };
      exports.replace_float2D_indexer = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher()
                  .literal(name)
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_decode (\n          texture ( \n            nc_uniform_" + name + "_texture,\n            nc_select_2D (\n              nc_uniform_" + name + "_textureWidth,\n              nc_uniform_" + name + "_textureHeight,\n              nc_uniform_" + name + "_width,\n              nc_uniform_" + name + "_height,\n              " + result.captures[0] + ",\n              " + result.captures[1] + "\n            )\n          )\n        )");
              }, acc);
          }, code);
      };
      exports.replace_float2D_width = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("width").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_width");
              }, acc);
          }, code);
      };
      exports.replace_float2D_height = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("height").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_height");
              }, acc);
          }, code);
      };
      exports.replace_float3D_uniform = function (code) {
          var results = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code);
          return results.reduce(function (acc, result) {
              var replacement = ["\n"];
              replacement.push("uniform sampler2D nc_uniform_" + result.captures[0] + "_texture;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureWidth;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureHeight;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_width;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_height;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_depth;");
              return acc.replace(result.literal, replacement.join("\n"));
          }, code);
      };
      exports.replace_float3D_indexer = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher()
                  .literal(name)
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_decode(\n          texture( \n            nc_uniform_" + name + "_texture,\n            nc_select_3D (\n              nc_uniform_" + name + "_textureWidth,\n              nc_uniform_" + name + "_textureHeight,\n              nc_uniform_" + name + "_width,\n              nc_uniform_" + name + "_height,\n              nc_uniform_" + name + "_depth,\n              " + result.captures[0] + ",\n              " + result.captures[1] + ",\n              " + result.captures[2] + "\n            )\n          )\n        )");
              }, acc);
          }, code);
      };
      exports.replace_float3D_width = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("width").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_width");
              }, acc);
          }, code);
      };
      exports.replace_float3D_height = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("height").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_height");
              }, acc);
          }, code);
      };
      exports.replace_float3D_depth = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Float3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("depth").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_depth");
              }, acc);
          }, code);
      };
      exports.replace_color1D_uniform = function (code) {
          var results = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color1D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code);
          return results.reduce(function (acc, result) {
              var replacement = ["\n"];
              replacement.push("uniform sampler2D nc_uniform_" + result.captures[0] + "_texture;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureWidth;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureHeight;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_width;");
              return acc.replace(result.literal, replacement.join("\n"));
          }, code);
      };
      exports.replace_color1D_indexer = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color1D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher()
                  .literal(name)
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "texture( \n        nc_uniform_" + name + "_texture,\n        nc_select_1D (\n          nc_uniform_" + name + "_textureWidth,\n          nc_uniform_" + name + "_textureHeight,\n          nc_uniform_" + name + "_width,\n          " + result.captures[0] + "\n        )\n      )");
              }, acc);
          }, code);
      };
      exports.replace_color1D_width = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color1D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("width").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_width");
              }, acc);
          }, code);
      };
      exports.replace_color2D_uniform = function (code) {
          var results = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code);
          return results.reduce(function (acc, result) {
              var replacement = ["\n"];
              replacement.push("uniform sampler2D nc_uniform_" + result.captures[0] + "_texture;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureWidth;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureHeight;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_width;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_height;");
              return acc.replace(result.literal, replacement.join("\n"));
          }, code);
      };
      exports.replace_color2D_indexer = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher()
                  .literal(name)
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "texture( \n        nc_uniform_" + name + "_texture,\n        nc_select_2D (\n          nc_uniform_" + name + "_textureWidth,\n          nc_uniform_" + name + "_textureHeight,\n          nc_uniform_" + name + "_width,\n          nc_uniform_" + name + "_height,\n          " + result.captures[0] + ",\n          " + result.captures[1] + "\n        )\n      )");
              }, acc);
          }, code);
      };
      exports.replace_color2D_width = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("width").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_width");
              }, acc);
          }, code);
      };
      exports.replace_color2D_height = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color2D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("height").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_height");
              }, acc);
          }, code);
      };
      exports.replace_color3D_uniform = function (code) {
          var results = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code);
          return results.reduce(function (acc, result) {
              var replacement = ["\n"];
              replacement.push("uniform sampler2D nc_uniform_" + result.captures[0] + "_texture;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureWidth;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_textureHeight;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_width;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_height;");
              replacement.push("uniform int       nc_uniform_" + result.captures[0] + "_depth;");
              return acc.replace(result.literal, replacement.join("\n"));
          }, code);
      };
      exports.replace_color3D_indexer = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher()
                  .literal(name)
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .space_optional()
                  .bracket_open()
                  .capture(matcher().codeblock())
                  .bracket_close()
                  .match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "texture( \n          nc_uniform_" + name + "_texture,\n          nc_select_3D (\n            nc_uniform_" + name + "_textureWidth,\n            nc_uniform_" + name + "_textureHeight,\n            nc_uniform_" + name + "_width,\n            nc_uniform_" + name + "_height,\n            nc_uniform_" + name + "_depth,\n            " + result.captures[0] + ",\n            " + result.captures[1] + ",\n            " + result.captures[2] + "\n          )\n        )");
              }, acc);
          }, code);
      };
      exports.replace_color3D_width = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("width").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_width");
              }, acc);
          }, code);
      };
      exports.replace_color3D_height = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("height").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_height");
              }, acc);
          }, code);
      };
      exports.replace_color3D_depth = function (code) {
          var names = matcher()
              .literal("uniform")
              .space_mandated()
              .literal("Color3D")
              .space_mandated()
              .capture(matcher().alphanumeric())
              .space_optional()
              .semicolon()
              .match(code)
              .map(function (n) { return n.captures[0]; });
          return names.reduce(function (acc, name) {
              var results = matcher().literal(name).dot().literal("depth").match(acc);
              return results.reduce(function (acc, result) {
                  return acc.replace(result.literal, "nc_uniform_" + name + "_depth");
              }, acc);
          }, code);
      };
      var endianness = (function () {
          var b = new ArrayBuffer(4);
          var a = new Uint32Array(b);
          var c = new Uint8Array(b);
          a[0] = 0xdeadbeef;
          if (c[0] === 0xef)
              return 'LE';
          if (c[0] === 0xde)
              return 'BE';
          throw new Error('unknown endianness');
      })();
      exports.get_thread_directives = function () { return [
          "#version 300 es",
          "precision highp float;",
          ""
      ].join("\n"); };
      exports.get_thread_integer_mod = function () { return [
          "vec2 nc_int_mod(vec2 x, float y) {",
          "  vec2 res = floor(mod(x, y));",
          "  return res * step(1.0 - floor(y), -res);",
          "}",
          "vec3 nc_int_mod(vec3 x, float y) {",
          "  vec3 res = floor(mod(x, y));",
          "  return res * step(1.0 - floor(y), -res);",
          "}",
          "vec4 nc_int_mod(vec4 x, vec4 y) {",
          "  vec4 res = floor(mod(x, y));",
          "  return res * step(1.0 - floor(y), -res);",
          "}",
          "highp float nc_int_mod(highp float x, highp float y) {",
          "  highp float res = floor(mod(x, y));",
          "  return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);",
          "}",
          "highp int nc_int_mod(highp int x, highp int y) {",
          "  return int(nc_int_mod(float(x), float(y)));",
          "}",
          ""
      ].join("\n"); };
      exports.get_thread_encode_functions = function () { return [
          "const vec2 MAGIC_VEC        = vec2(1.0, -256.0);",
          "const vec4 SCALE_FACTOR     = vec4(1.0, 256.0, 65536.0, 0.0);",
          "const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536);",
          "",
          "highp float nc_decode(highp vec4 rgba) {",
          (endianness === "BE") ? " rgba.rgba = rgba.abgr;" : "",
          "  rgba *= 255.0;",
          "  vec2 gte128;",
          "  gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;",
          "  gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;",
          "  float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);",
          "  float res = exp2(round(exponent));",
          "  rgba.b = rgba.b - 128.0 * gte128.x;",
          "  res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;",
          "  res *= gte128.y * -2.0 + 1.0;",
          "  return res;",
          "}",
          "",
          "highp vec4 nc_encode(highp float f) {",
          "  highp float F = abs(f);",
          "  highp float sign = f < 0.0 ? 1.0 : 0.0;",
          "  highp float exponent = floor(log2(F));",
          "  highp float mantissa = (exp2(-exponent) * F);",
          "  // exponent += floor(log2(mantissa));",
          "  vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;",
          "  rgba.rg = nc_int_mod(rgba.rg, 256.0);",
          "  rgba.b = nc_int_mod(rgba.b, 128.0);",
          "  rgba.a = exponent*0.5 + 63.5;",
          "  rgba.ba += vec2(nc_int_mod(exponent+127.0, 2.0), sign) * 128.0;",
          "  rgba = floor(rgba);",
          "  rgba *= 0.003921569; // 1/255",
          (endianness === "BE") ? " rgba.rgba = rgba.abgr;" : "",
          "  return rgba;",
          "}",
          ""
      ].join("\n"); };
      exports.get_thread_select_functions = function () { return [
          "vec2 nc_select_1D (int textureWidth, int textureHeight, int width, int index_x) {",
          "  float x = float(index_x % textureWidth) + 0.5;",
          "  float y = float(index_x / textureWidth) + 0.5;",
          "  return vec2 (",
          "    x / float(textureWidth),",
          "    y / float(textureHeight)",
          ");",
          "}",
          "",
          "vec2 nc_select_2D (int textureWidth, int textureHeight, int width, int height, int index_x, int index_y) {",
          "  float mx = (1.0 / ( float(textureWidth ) ) );",
          "  float my = (1.0 / ( float(textureHeight) ) );",
          "  float x  = ( float(index_x) + 0.5) * mx;",
          "  float y  = ( float(index_y) + 0.5) * my;",
          "  return vec2(x, y);",
          "}",
          "",
          "vec2 nc_select_3D (int textureWidth, int textureHeight, int width, int height, int depth, int index_x, int index_y, int index_z) {",
          "  int i = index_x + (index_y * width) + (index_z * (width * height));",
          "  float x = float(i % textureWidth) + 0.5;",
          "  float y = float(i / textureWidth) + 0.5;",
          "  return vec2 (",
          "    x / float(textureWidth),",
          "    y / float(textureHeight)",
          ");",
          "}",
          ""
      ].join("\n"); };
      exports.get_thread_uniforms = function () { return [
          "uniform int   nc_thread_viewport_width;",
          "uniform int   nc_thread_viewport_height;",
          "",
          "uniform int   nc_thread_output_width;",
          "uniform int   nc_thread_output_height;",
          "uniform int   nc_thread_output_depth;",
          "",
          "in      vec2  nc_thread_uv;",
          ""
      ].join("\n"); };
      exports.get_thread_output_register = function (thread) {
          return thread.outputs.reduce(function (acc, output, index) {
              return acc + ("layout(location = " + index + ") out vec4 nc_thread_output_" + index + ";\n");
          }, "") + "\n";
      };
      exports.get_thread_main = function (thread) {
          var buffer = [];
          switch (thread.indexing) {
              case "1D":
                  buffer.push("void main() {");
                  buffer.push("  int x = int( nc_thread_uv.x * float( nc_thread_viewport_width  ) );");
                  buffer.push("  int y = int( nc_thread_uv.y * float( nc_thread_viewport_height ) );");
                  buffer.push("  int ix = x + ( y * nc_thread_viewport_width );");
                  buffer.push("  ");
                  buffer.push("  thread (ix);");
                  break;
              case "2D":
                  buffer.push("void main() {");
                  buffer.push("  int ix = int( nc_thread_uv.x * float ( nc_thread_viewport_width  ) );");
                  buffer.push("  int iy = int( nc_thread_uv.y * float ( nc_thread_viewport_height ) );");
                  buffer.push("  thread(ix, iy);");
                  break;
              case "3D":
                  buffer.push("void main() {");
                  buffer.push("  int x  = int( nc_thread_uv.x * float ( nc_thread_viewport_width  ) );");
                  buffer.push("  int y  = int( nc_thread_uv.y * float ( nc_thread_viewport_height ) );");
                  buffer.push("  int i  = x + ( y * nc_thread_viewport_width );");
                  buffer.push("");
                  buffer.push("  int ix = ( i / ( 1                                               ) ) % nc_thread_output_width;");
                  buffer.push("  int iy = ( i / ( nc_thread_output_width                          ) ) % nc_thread_output_height;");
                  buffer.push("  int iz = ( i / ( nc_thread_output_width * nc_thread_output_height) ) % nc_thread_output_depth;");
                  buffer.push("  thread(ix, iy, iz);");
                  break;
          }
          if (thread.indexing !== "error") {
              thread.outputs.forEach(function (output, index) {
                  switch (output) {
                      case "float":
                          buffer.push("  nc_thread_output_" + index + " = nc_encode(nc_thread_output_" + index + ".r);");
                          break;
                  }
              });
              buffer.push("}");
          }
          return buffer.join("\n");
      };
      exports.get_vertex_program = function () { return [
          "#version 300 es",
          "precision highp float;",
          "",
          "in  vec3 nc_thread_position;",
          "in  vec2 nc_thread_texcoord;",
          "out vec2 nc_thread_uv;",
          "",
          "void main() {",
          "  nc_thread_uv  = nc_thread_texcoord;",
          "",
          "  gl_Position = vec4 (",
          "    nc_thread_position.x,",
          "    nc_thread_position.y,",
          "    nc_thread_position.z,",
          "    1.0);",
          "}"
      ].join("\n"); };
      exports.transform = function (code) {
          code = code.split("\n").map(function (line) {
              var index = line.indexOf("//");
              return (index !== -1)
                  ? line.slice(0, index)
                  : line;
          }).join("\n");
          var thread = exports.read_program_thread_function(code);
          var uniforms = exports.read_program_uniforms(code);
          if (thread.indexing === "error") {
              throw Error("program is invalid.");
          }
          code = exports.replace_float1D_indexer(code);
          code = exports.replace_float1D_width(code);
          code = exports.replace_float1D_uniform(code);
          code = exports.replace_float2D_indexer(code);
          code = exports.replace_float2D_width(code);
          code = exports.replace_float2D_height(code);
          code = exports.replace_float2D_uniform(code);
          code = exports.replace_float3D_indexer(code);
          code = exports.replace_float3D_width(code);
          code = exports.replace_float3D_height(code);
          code = exports.replace_float3D_depth(code);
          code = exports.replace_float3D_uniform(code);
          code = exports.replace_color1D_indexer(code);
          code = exports.replace_color1D_width(code);
          code = exports.replace_color1D_uniform(code);
          code = exports.replace_color2D_indexer(code);
          code = exports.replace_color2D_width(code);
          code = exports.replace_color2D_height(code);
          code = exports.replace_color2D_uniform(code);
          code = exports.replace_color3D_indexer(code);
          code = exports.replace_color3D_width(code);
          code = exports.replace_color3D_height(code);
          code = exports.replace_color3D_depth(code);
          code = exports.replace_color3D_uniform(code);
          code = exports.replace_thread_output_indexer(code);
          code = exports.replace_thread_output_dimensions(code);
          code = exports.replace_thread_signature(code);
          var fragment = [
              exports.get_thread_directives(),
              exports.get_thread_uniforms(),
              exports.get_thread_output_register(thread),
              exports.get_thread_integer_mod(),
              exports.get_thread_encode_functions(),
              exports.get_thread_select_functions(),
              code,
              exports.get_thread_main(thread)
          ].join("\n");
          return {
              thread: thread,
              uniforms: uniforms,
              vertex: exports.get_vertex_program(),
              fragment: fragment
          };
      };
  });
  define("src/compute/program", ["require", "exports", "src/compute/script"], function (require, exports, script_1) {
      "use strict";
      exports.__esModule = true;
      var Program = (function () {
          function Program(context, framebuf, plane, source) {
              this.context = context;
              this.framebuf = framebuf;
              this.plane = plane;
              this.script = script_1.transform(source);
              this.compile();
          }
          Program.prototype.compile = function () {
              var _this = this;
              this.program = this.context.createProgram();
              this.vertexshader = this.context.createShader(this.context.VERTEX_SHADER);
              this.context.shaderSource(this.vertexshader, this.script.vertex);
              this.context.compileShader(this.vertexshader);
              if (this.context.getShaderParameter(this.vertexshader, this.context.COMPILE_STATUS) === false) {
                  var error = this.context.getShaderInfoLog(this.vertexshader);
                  this.context.deleteShader(this.vertexshader);
                  throw new Error(error);
              }
              this.fragmentshader = this.context.createShader(this.context.FRAGMENT_SHADER);
              this.context.shaderSource(this.fragmentshader, this.script.fragment);
              this.context.compileShader(this.fragmentshader);
              if (this.context.getShaderParameter(this.fragmentshader, this.context.COMPILE_STATUS) === false) {
                  var error = this.context.getShaderInfoLog(this.fragmentshader);
                  this.context.deleteShader(this.fragmentshader);
                  throw new Error(error);
              }
              this.context.attachShader(this.program, this.vertexshader);
              this.context.attachShader(this.program, this.fragmentshader);
              this.context.linkProgram(this.program);
              this.cache = { attributes: {}, uniforms: {} };
              this.cache.attributes["nc_thread_position"] = this.context.getAttribLocation(this.program, "nc_thread_position");
              this.cache.attributes["nc_thread_texcoord"] = this.context.getAttribLocation(this.program, "nc_thread_texcoord");
              this.cache.uniforms["nc_thread_viewport_width"] = this.context.getUniformLocation(this.program, "nc_thread_viewport_width");
              this.cache.uniforms["nc_thread_viewport_height"] = this.context.getUniformLocation(this.program, "nc_thread_viewport_height");
              this.cache.uniforms["nc_thread_output_width"] = this.context.getUniformLocation(this.program, "nc_thread_output_width");
              this.cache.uniforms["nc_thread_output_height"] = this.context.getUniformLocation(this.program, "nc_thread_output_height");
              this.cache.uniforms["nc_thread_output_depth"] = this.context.getUniformLocation(this.program, "nc_thread_output_depth");
              this.script.uniforms.forEach(function (script_uniform) {
                  switch (script_uniform.type) {
                      case "float":
                      case "vec2":
                      case "vec3":
                      case "vec4":
                      case "int":
                      case "ivec2":
                      case "ivec3":
                      case "ivec4":
                      case "mat3":
                      case "mat4": {
                          _this.cache.uniforms[script_uniform.name] = _this.context.getUniformLocation(_this.program, script_uniform.name);
                          break;
                      }
                      case "Color1D":
                      case "Float1D": {
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_texture");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_textureWidth");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_textureHeight");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_width");
                          break;
                      }
                      case "Color2D":
                      case "Float2D": {
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_texture");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_textureWidth");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_textureHeight");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_width");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_height"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_height");
                          break;
                      }
                      case "Color3D":
                      case "Float3D": {
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_texture");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_textureWidth");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_textureHeight");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_width");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_height"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_height");
                          _this.cache.uniforms["nc_uniform_" + script_uniform.name + "_depth"] = _this.context.getUniformLocation(_this.program, "nc_uniform_" + script_uniform.name + "_depth");
                          break;
                      }
                  }
              });
          };
          Program.prototype.execute = function (outputs, uniforms) {
              var _this = this;
              var typecheck = this.typecheck(outputs, uniforms);
              if (!typecheck.success) {
                  console.warn(typecheck.errors.join("\n"));
                  throw Error("unable to execute.");
              }
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.framebuf);
              this.context.drawBuffers(outputs.map(function (output, index) { return _this.context.COLOR_ATTACHMENT0 + index; }));
              outputs.forEach(function (output, index) {
                  _this.context.framebufferTexture2D(_this.context.FRAMEBUFFER, _this.context.COLOR_ATTACHMENT0 + index, _this.context.TEXTURE_2D, output.texture, 0);
                  if (!(_this.context.checkFramebufferStatus(_this.context.FRAMEBUFFER) === _this.context.FRAMEBUFFER_COMPLETE)) {
                      console.warn("unable to attach output[" + index + "] as render target.");
                      return;
                  }
              });
              this.context.useProgram(this.program);
              var output = outputs[0];
              switch (output.type) {
                  case "Float1D":
                  case "Color1D":
                      this.context.viewport(0, 0, output.textureWidth, output.textureHeight);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_viewport_width"], output.textureWidth);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_viewport_height"], output.textureHeight);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_output_width"], output.width);
                      break;
                  case "Float2D":
                  case "Color2D":
                      this.context.viewport(0, 0, output.textureWidth, output.textureHeight);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_viewport_width"], output.textureWidth);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_viewport_height"], output.textureHeight);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_output_width"], output.width);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_output_height"], output.height);
                      break;
                  case "Float3D":
                  case "Color3D":
                      this.context.viewport(0, 0, output.textureWidth, output.textureHeight);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_viewport_width"], output.textureWidth);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_viewport_height"], output.textureHeight);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_output_width"], output.width);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_output_height"], output.height);
                      this.context.uniform1i(this.cache.uniforms["nc_thread_output_depth"], output.depth);
                      break;
              }
              var texture_index = 0;
              this.script.uniforms.forEach(function (script_uniform) {
                  if (uniforms[script_uniform.name] === undefined)
                      return;
                  switch (script_uniform.type) {
                      case "float": {
                          _this.context.uniform1f(_this.cache.uniforms[script_uniform.name], uniforms[script_uniform.name]);
                          break;
                      }
                      case "vec2": {
                          var v = uniforms[script_uniform.name];
                          _this.context.uniform2f(_this.cache.uniforms[script_uniform.name], v[0], v[1]);
                          break;
                      }
                      case "vec3": {
                          var v = uniforms[script_uniform.name];
                          _this.context.uniform3f(_this.cache.uniforms[script_uniform.name], v[0], v[1], v[2]);
                          break;
                      }
                      case "vec4": {
                          var v = uniforms[script_uniform.name];
                          _this.context.uniform4f(_this.cache.uniforms[script_uniform.name], v[0], v[1], v[2], v[3]);
                          break;
                      }
                      case "int": {
                          _this.context.uniform1i(_this.cache.uniforms[script_uniform.name], uniforms[script_uniform.name]);
                          break;
                      }
                      case "ivec2": {
                          var v = uniforms[script_uniform.name];
                          _this.context.uniform2i(_this.cache.uniforms[script_uniform.name], v[0], v[1]);
                          break;
                      }
                      case "ivec3": {
                          var v = uniforms[script_uniform.name];
                          _this.context.uniform3i(_this.cache.uniforms[script_uniform.name], v[0], v[1], v[2]);
                          break;
                      }
                      case "ivec4": {
                          var v = uniforms[script_uniform.name];
                          _this.context.uniform4i(_this.cache.uniforms[script_uniform.name], v[0], v[1], v[2], v[3]);
                          break;
                      }
                      case "mat3": {
                          var v = new Float32Array(uniforms[script_uniform.name]);
                          _this.context.uniformMatrix3fv(_this.cache.uniforms[script_uniform.name], false, v);
                          break;
                      }
                      case "mat4": {
                          var v = new Float32Array(uniforms[script_uniform.name]);
                          _this.context.uniformMatrix4fv(_this.cache.uniforms[script_uniform.name], false, v);
                          break;
                      }
                      case "Color1D":
                      case "Float1D": {
                          var data = uniforms[script_uniform.name];
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"], data.textureWidth);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"], data.textureHeight);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"], data.width);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"], texture_index);
                              _this.context.activeTexture(_this.context.TEXTURE0 + texture_index);
                              _this.context.bindTexture(_this.context.TEXTURE_2D, data.texture);
                              texture_index += 1;
                          }
                          break;
                      }
                      case "Color2D":
                      case "Float2D": {
                          var data = uniforms[script_uniform.name];
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"], data.textureWidth);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"], data.textureHeight);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"], data.width);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_height"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_height"], data.height);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"], texture_index);
                              _this.context.activeTexture(_this.context.TEXTURE0 + texture_index);
                              _this.context.bindTexture(_this.context.TEXTURE_2D, data.texture);
                              texture_index += 1;
                          }
                          break;
                      }
                      case "Color3D":
                      case "Float3D": {
                          var data = uniforms[script_uniform.name];
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureWidth"], data.textureWidth);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_textureHeight"], data.textureHeight);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_width"], data.width);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_height"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_height"], data.height);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_depth"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_depth"], data.depth);
                          }
                          if (_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"]) {
                              _this.context.uniform1i(_this.cache.uniforms["nc_uniform_" + script_uniform.name + "_texture"], texture_index);
                              _this.context.activeTexture(_this.context.TEXTURE0 + texture_index);
                              _this.context.bindTexture(_this.context.TEXTURE_2D, data.texture);
                              texture_index += 1;
                          }
                          break;
                      }
                  }
              });
              this.context.bindBuffer(this.context.ARRAY_BUFFER, this.plane.position);
              this.context.enableVertexAttribArray(this.cache.attributes["nc_thread_position"]);
              this.context.vertexAttribPointer(this.cache.attributes["nc_thread_position"], 3, this.context.FLOAT, false, 0, 0);
              if (this.cache.attributes["nc_thread_texcoord"] !== -1) {
                  this.context.bindBuffer(this.context.ARRAY_BUFFER, this.plane.texcoord);
                  this.context.enableVertexAttribArray(this.cache.attributes["nc_thread_texcoord"]);
                  this.context.vertexAttribPointer(this.cache.attributes["nc_thread_texcoord"], 2, this.context.FLOAT, false, 0, 0);
              }
              this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.plane.indices);
              this.context.drawElements(this.context.TRIANGLES, 6, this.context.UNSIGNED_SHORT, 0);
              outputs.forEach(function (_, index) {
                  _this.context.framebufferTexture2D(_this.context.FRAMEBUFFER, _this.context.COLOR_ATTACHMENT0 + index, _this.context.TEXTURE_2D, null, 0);
              });
              this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
          };
          Program.prototype.typecheck = function (outputs, uniforms) {
              var _this = this;
              var errors = [];
              if (this.script.thread.outputs.length !== outputs.length) {
                  errors.push("typecheck: expected " + this.script.thread.outputs.length + " outputs, " + outputs.length + " given.");
              }
              outputs.forEach(function (output, index) {
                  if (output.type.indexOf(_this.script.thread.indexing) === -1) {
                      errors.push("typecheck: a " + outputs[index].type + " is an invalid output for " + _this.script.thread.indexing + " indexed thread functions.");
                  }
              });
              if (!outputs.every(function (output) { return outputs[0].textureWidth === output.textureWidth && outputs[0].textureHeight === output.textureHeight; })) {
                  errors.push("typecheck: all output dimensions must be the same for all outputs.");
              }
              this.script.uniforms.forEach(function (script_uniform) {
                  if (uniforms[script_uniform.name] === undefined)
                      return;
                  var uniform = uniforms[script_uniform.name];
                  switch (script_uniform.type) {
                      case "int":
                      case "float":
                          if (typeof uniform !== "number")
                              errors.push("typecheck: " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ".");
                          break;
                      case "Float1D":
                          if (uniform.type !== "Float1D")
                              errors.push("typecheck: uniform " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ", got " + uniform.type + ".");
                          break;
                      case "Color1D":
                          if (uniform.type !== "Color1D")
                              errors.push("typecheck: uniform " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ", got " + uniform.type + ".");
                          break;
                      case "Float2D":
                          if (uniform.type !== "Float2D")
                              errors.push("typecheck: uniform " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ", got " + uniform.type + ".");
                          break;
                      case "Color2D":
                          if (uniform.type !== "Color2D")
                              errors.push("typecheck: uniform " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ", got " + uniform.type + ".");
                          break;
                      case "Float3D":
                          if (uniform.type !== "Float3D")
                              errors.push("typecheck: uniform " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ", got " + uniform.type + ".");
                          break;
                      case "Color3D":
                          if (uniform.type !== "Color3D")
                              errors.push("typecheck: uniform " + script_uniform.name + " is invalid. Expected " + script_uniform.type + ", got " + uniform.type + ".");
                          break;
                  }
              });
              return {
                  success: errors.length === 0,
                  errors: errors
              };
          };
          Program.prototype.dispose = function () {
              this.context.deleteShader(this.vertexshader);
              this.context.deleteShader(this.fragmentshader);
              this.context.deleteProgram(this.program);
          };
          return Program;
      }());
      exports.Program = Program;
  });
  define("src/compute/present", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Present = (function () {
          function Present(context, plane) {
              this.context = context;
              this.plane = plane;
              this.program = this.context.createProgram();
              this.vertexshader = this.context.createShader(this.context.VERTEX_SHADER);
              this.context.shaderSource(this.vertexshader, [
                  "#version 300 es",
                  "precision highp float;",
                  "",
                  "in  vec3 nc_present_position;",
                  "in  vec2 nc_present_texcoord;",
                  "out vec2 nc_present_uv;",
                  "",
                  "void main() {",
                  "  nc_present_uv  = vec2(nc_present_texcoord.x, (-nc_present_texcoord.y) + 1.0);",
                  "",
                  "  gl_Position = vec4 (",
                  "    nc_present_position.x,",
                  "    nc_present_position.y,",
                  "    nc_present_position.z,",
                  "    1.0);",
                  "}"
              ].join("\n"));
              this.context.compileShader(this.vertexshader);
              if (this.context.getShaderParameter(this.vertexshader, this.context.COMPILE_STATUS) === false) {
                  console.warn(this.context.getShaderInfoLog(this.vertexshader));
                  this.context.deleteShader(this.vertexshader);
                  return;
              }
              this.fragmentshader = this.context.createShader(this.context.FRAGMENT_SHADER);
              this.context.shaderSource(this.fragmentshader, [
                  "#version 300 es",
                  "precision highp   float;",
                  "uniform sampler2D nc_present_texture;",
                  "in      vec2      nc_present_uv;",
                  "layout(location = 0) out vec4 nc_present_output;",
                  "",
                  "void main() {",
                  "  nc_present_output = texture(nc_present_texture, nc_present_uv);",
                  "}"
              ].join("\n"));
              this.context.compileShader(this.fragmentshader);
              if (this.context.getShaderParameter(this.fragmentshader, this.context.COMPILE_STATUS) === false) {
                  console.warn(this.context.getShaderInfoLog(this.fragmentshader));
                  this.context.deleteShader(this.fragmentshader);
                  return;
              }
              this.context.attachShader(this.program, this.vertexshader);
              this.context.attachShader(this.program, this.fragmentshader);
              this.context.linkProgram(this.program);
              this.cache = { attributes: {}, uniforms: {} };
              this.cache.attributes["nc_present_position"] = this.context.getAttribLocation(this.program, "nc_present_position");
              this.cache.attributes["nc_present_texcoord"] = this.context.getAttribLocation(this.program, "nc_present_texcoord");
              this.cache.uniforms["nc_present_texture"] = this.context.getUniformLocation(this.program, "nc_present_texture");
          }
          Present.prototype.present = function (buffer) {
              this.context.useProgram(this.program);
              this.context.uniform1i(this.cache.uniforms["nc_present_texture"], 0);
              this.context.activeTexture(this.context.TEXTURE0);
              this.context.bindTexture(this.context.TEXTURE_2D, buffer.texture);
              this.context.bindBuffer(this.context.ARRAY_BUFFER, this.plane.position);
              this.context.enableVertexAttribArray(this.cache.attributes["nc_present_position"]);
              this.context.vertexAttribPointer(this.cache.attributes["nc_present_position"], 3, this.context.FLOAT, false, 0, 0);
              if (this.cache.attributes["nc_present_texcoord"] !== -1) {
                  this.context.bindBuffer(this.context.ARRAY_BUFFER, this.plane.texcoord);
                  this.context.enableVertexAttribArray(this.cache.attributes["nc_present_texcoord"]);
                  this.context.vertexAttribPointer(this.cache.attributes["nc_present_texcoord"], 2, this.context.FLOAT, false, 0, 0);
              }
              this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.plane.indices);
              this.context.drawElements(this.context.TRIANGLES, 6, this.context.UNSIGNED_SHORT, 0);
          };
          Present.prototype.dispose = function () {
              this.context.deleteShader(this.vertexshader);
              this.context.deleteShader(this.fragmentshader);
              this.context.deleteProgram(this.program);
          };
          return Present;
      }());
      exports.Present = Present;
  });
  define("src/compute/context", ["require", "exports", "src/compute/color", "src/compute/float", "src/compute/program", "src/compute/plane", "src/compute/present"], function (require, exports, color_1, float_1, program_1, plane_5, present_1) {
      "use strict";
      exports.__esModule = true;
      var Context = (function () {
          function Context(context) {
              if (context === void 0) { context = undefined; }
              this.context = context;
              if (context === undefined) {
                  var canvas = document.createElement("canvas");
                  this.context = canvas.getContext("webgl2", {
                      alpha: false,
                      depth: false,
                      antialias: false
                  });
              }
              this.framebuf = this.context.createFramebuffer();
              this.plane = new plane_5.Plane(this.context);
              this.present = new present_1.Present(this.context, this.plane);
          }
          Context.prototype.createProgram = function (source) {
              return new program_1.Program(this.context, this.framebuf, this.plane, source);
          };
          Context.prototype.createColor1D = function (length) {
              return new color_1.Color1D(this.context, this.framebuf, length);
          };
          Context.prototype.createColor2D = function (width, height) {
              return new color_1.Color2D(this.context, this.framebuf, width, height);
          };
          Context.prototype.createColor3D = function (width, height, depth) {
              return new color_1.Color3D(this.context, this.framebuf, width, height, depth);
          };
          Context.prototype.createFloat1D = function (length) {
              return new float_1.Float1D(this.context, this.framebuf, length);
          };
          Context.prototype.createFloat2D = function (width, height) {
              return new float_1.Float2D(this.context, this.framebuf, width, height);
          };
          Context.prototype.createFloat3D = function (width, height, depth) {
              return new float_1.Float3D(this.context, this.framebuf, width, height, depth);
          };
          Context.prototype.render = function (buffer) {
              this.present.present(buffer);
          };
          Context.prototype.dispose = function () {
              this.context.deleteFramebuffer(this.framebuf);
              this.present.dispose();
              this.plane.dispose();
          };
          return Context;
      }());
      exports.Context = Context;
  });
  define("src/compute/index", ["require", "exports", "src/compute/context", "src/compute/program", "src/compute/script", "src/compute/float", "src/compute/color"], function (require, exports, context_1, program_2, script_2, float_2, color_2) {
      "use strict";
      exports.__esModule = true;
      exports.Context = context_1.Context;
      exports.Program = program_2.Program;
      exports.transform = script_2.transform;
      exports.Float1D = float_2.Float1D;
      exports.Float2D = float_2.Float2D;
      exports.Float3D = float_2.Float3D;
      exports.Color1D = color_2.Color1D;
      exports.Color2D = color_2.Color2D;
      exports.Color3D = color_2.Color3D;
  });
  define("src/graphics/attribute", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Attribute = (function () {
          function Attribute(stride, data) {
              this.stride = stride;
              this.data = data;
              if (data.length % stride !== 0) {
                  throw Error("attribute stride mismatch with given data length.");
              }
              this.context = undefined;
              this.buffer = undefined;
              this.disposed = false;
              this.needsupdate = true;
          }
          Attribute.prototype.update = function (context, target) {
              if (this.needsupdate) {
                  this.context = context;
                  this.buffer = (this.buffer === undefined) ? this.context.createBuffer() : this.buffer;
                  var data = this.resolve_data(context, this.data, target);
                  this.context.bindBuffer(target, this.buffer);
                  this.context.bufferData(target, data, this.context.STATIC_DRAW);
                  this.needsupdate = false;
              }
          };
          Attribute.prototype.dispose = function () {
              if (!this.disposed) {
                  if (this.context === undefined)
                      return;
                  if (this.buffer === undefined)
                      return;
                  this.context.deleteBuffer(this.buffer);
                  this.context = undefined;
                  this.buffer = undefined;
                  this.disposed = true;
              }
          };
          Attribute.prototype.resolve_data = function (context, buffer, target) {
              if (buffer instanceof Float32Array || buffer instanceof Uint8Array || buffer instanceof Uint16Array) {
                  return buffer;
              }
              else {
                  switch (target) {
                      case context.ELEMENT_ARRAY_BUFFER: return new Uint16Array(buffer);
                      case context.ARRAY_BUFFER: return new Float32Array(buffer);
                      default: throw Error("unable to resolve js array from target");
                  }
              }
          };
          return Attribute;
      }());
      exports.Attribute = Attribute;
  });
  define("src/graphics/guid", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Guid = (function () {
          function Guid() {
          }
          Guid.next = function () {
              return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                  return v.toString(16);
              });
          };
          return Guid;
      }());
      exports.Guid = Guid;
  });
  define("src/graphics/object", ["require", "exports", "src/math/index", "src/graphics/guid"], function (require, exports, index_1, guid_1) {
      "use strict";
      exports.__esModule = true;
      var Object3D = (function () {
          function Object3D() {
              this.id = guid_1.Guid.next();
              this.name = undefined;
              this.matrix = index_1.Matrix.identity();
              this.objects = new Array();
              this.visible = true;
          }
          return Object3D;
      }());
      exports.Object3D = Object3D;
  });
  define("src/graphics/camera", ["require", "exports", "src/math/matrix", "src/graphics/object"], function (require, exports, matrix_4, object_1) {
      "use strict";
      exports.__esModule = true;
      var Camera = (function (_super) {
          __extends(Camera, _super);
          function Camera(projection) {
              var _this = _super.call(this) || this;
              _this.matrix = matrix_4.Matrix.identity();
              _this.projection = projection;
              return _this;
          }
          Camera.prototype.lookAt = function (position, target, up) {
              this.matrix = matrix_4.Matrix.lookAt(position, target, up);
          };
          Camera.prototype.position = function () {
              return matrix_4.Matrix.origin(this.matrix);
          };
          return Camera;
      }(object_1.Object3D));
      exports.Camera = Camera;
      var PerspectiveCamera = (function (_super) {
          __extends(PerspectiveCamera, _super);
          function PerspectiveCamera(field, aspect, near, far) {
              return _super.call(this, matrix_4.Matrix.perspectiveFov(field, aspect, near, far)) || this;
          }
          return PerspectiveCamera;
      }(Camera));
      exports.PerspectiveCamera = PerspectiveCamera;
      var OrthoCamera = (function (_super) {
          __extends(OrthoCamera, _super);
          function OrthoCamera(width, height, near, far) {
              return _super.call(this, matrix_4.Matrix.orthographic(width, height, near, far)) || this;
          }
          return OrthoCamera;
      }(Camera));
      exports.OrthoCamera = OrthoCamera;
  });
  define("src/graphics/geometry", ["require", "exports", "src/graphics/attribute"], function (require, exports, attribute_1) {
      "use strict";
      exports.__esModule = true;
      var Geometry = (function () {
          function Geometry() {
              this.attributes = {};
              this.indices = undefined;
              this.needsupdate = true;
              this.disposed = false;
          }
          Geometry.prototype.addAttribute = function (name, attribute) {
              if (this.disposed) {
                  throw Error("cannot add attribute on disposed geometry.");
              }
              this.attributes[name] = attribute;
              this.needsupdate = true;
          };
          Geometry.prototype.addIndex = function (attribute) {
              if (this.disposed) {
                  throw Error("cannot add indexing attribute on disposed geometry.");
              }
              this.indices = attribute;
              this.needsupdate = true;
          };
          Geometry.prototype.update = function (context) {
              if (this.needsupdate) {
                  if (this.indices !== undefined) {
                      this.indices.update(context, context.ELEMENT_ARRAY_BUFFER);
                  }
                  for (var name_1 in this.attributes) {
                      this.attributes[name_1].update(context, context.ARRAY_BUFFER);
                  }
                  this.needsupdate = false;
              }
          };
          Geometry.prototype.dispose = function () {
              if (this.disposed) {
                  return;
              }
              if (this.indices !== undefined) {
                  this.indices.dispose();
              }
              for (var name_2 in this.attributes) {
                  this.attributes[name_2].dispose();
              }
              this.disposed = true;
          };
          return Geometry;
      }());
      exports.Geometry = Geometry;
      var CubeGeometry = (function (_super) {
          __extends(CubeGeometry, _super);
          function CubeGeometry() {
              var _this = _super.call(this) || this;
              _this.build();
              return _this;
          }
          CubeGeometry.prototype.build = function () {
              var s = 1;
              this.addAttribute("position", new attribute_1.Attribute(4, [
                  -s, -s, s, 1.0,
                  s, -s, s, 1.0,
                  s, s, s, 1.0,
                  -s, s, s, 1.0,
                  -s, -s, -s, 1.0,
                  -s, s, -s, 1.0,
                  s, s, -s, 1.0,
                  s, -s, -s, 1.0,
                  -s, s, -s, 1.0,
                  -s, s, s, 1.0,
                  s, s, s, 1.0,
                  s, s, -s, 1.0,
                  -s, -s, -s, 1.0,
                  s, -s, -s, 1.0,
                  s, -s, s, 1.0,
                  -s, -s, s, 1.0,
                  s, -s, -s, 1.0,
                  s, s, -s, 1.0,
                  s, s, s, 1.0,
                  s, -s, s, 1.0,
                  -s, -s, s, 1.0,
                  -s, s, s, 1.0,
                  -s, s, -s, 1.0,
                  -s, -s, -s, 1.0
              ]));
              this.addAttribute("normal", new attribute_1.Attribute(3, [
                  0.0, 0.0, 1.0,
                  0.0, 0.0, 1.0,
                  0.0, 0.0, 1.0,
                  0.0, 0.0, 1.0,
                  0.0, 0.0, -1.0,
                  0.0, 0.0, -1.0,
                  0.0, 0.0, -1.0,
                  0.0, 0.0, -1.0,
                  0.0, 1.0, 0.0,
                  0.0, 1.0, 0.0,
                  0.0, 1.0, 0.0,
                  0.0, 1.0, 0.0,
                  0.0, -1.0, 0.0,
                  0.0, -1.0, 0.0,
                  0.0, -1.0, 0.0,
                  0.0, -1.0, 0.0,
                  1.0, 0.0, 0.0,
                  1.0, 0.0, 0.0,
                  1.0, 0.0, 0.0,
                  1.0, 0.0, 0.0,
                  -1.0, 0.0, 0.0,
                  -1.0, 0.0, 0.0,
                  -1.0, 0.0, 0.0,
                  -1.0, 0.0, 0.0
              ]));
              this.addAttribute("texcoord", new attribute_1.Attribute(2, [
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0,
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0,
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0,
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0,
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0,
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0
              ]));
              this.addIndex(new attribute_1.Attribute(1, [
                  0, 1, 2, 0, 2, 3,
                  4, 5, 6, 4, 6, 7,
                  8, 9, 10, 8, 10, 11,
                  12, 13, 14, 12, 14, 15,
                  16, 17, 18, 16, 18, 19,
                  20, 21, 22, 20, 22, 23
              ]));
          };
          return CubeGeometry;
      }(Geometry));
      exports.CubeGeometry = CubeGeometry;
  });
  define("src/graphics/geometry-array", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var GeometryArray = (function () {
          function GeometryArray(instance, length) {
              this.instance = instance;
              this.length = length;
              this.attributes = {};
              this.disposed = false;
              this.needsupdate = true;
          }
          GeometryArray.prototype.addAttribute = function (name, attribute) {
              var elements = (attribute.data.length / attribute.stride);
              if (elements !== this.length) {
                  throw Error("invalid attribute length for " + name + ". expected " + this.length + " elements but computed " + elements + " from stride.");
              }
              this.attributes[name] = attribute;
          };
          GeometryArray.prototype.update = function (context) {
              this.instance.update(context);
              if (this.needsupdate) {
                  for (var name_3 in this.attributes) {
                      this.attributes[name_3].update(context, context.ARRAY_BUFFER);
                  }
                  this.needsupdate = false;
              }
          };
          GeometryArray.prototype.dispose = function () {
              if (!this.disposed) {
                  for (var name_4 in this.attributes) {
                      this.attributes[name_4].dispose();
                  }
                  this.disposed = true;
              }
          };
          return GeometryArray;
      }());
      exports.GeometryArray = GeometryArray;
  });
  define("src/graphics/light", ["require", "exports", "src/math/single", "src/math/vector3"], function (require, exports, single_3, vector3_9) {
      "use strict";
      exports.__esModule = true;
      var Light = (function () {
          function Light(options) {
              if (options === void 0) { options = {}; }
              this.position = options.position || new vector3_9.Vector3(0, 0, 0);
              this.diffuse = options.diffuse || new vector3_9.Vector3(1, 1, 1);
              this.ambient = options.ambient || new vector3_9.Vector3(0, 0, 0);
              this.specular = options.specular || new vector3_9.Vector3(1, 1, 1);
              this.attenuation = options.attenuation || new single_3.Single(0.0);
              this.intensity = options.intensity || new single_3.Single(1.0);
          }
          return Light;
      }());
      exports.Light = Light;
  });
  define("src/graphics/shader", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Shader = (function () {
          function Shader(vertexSource, fragmentSource) {
              this.vertexSource = vertexSource;
              this.fragmentSource = fragmentSource;
              this.context = undefined;
              this.needsupdate = true;
              this.disposed = false;
          }
          Shader.prototype.update = function (context) {
              if (this.needsupdate === false)
                  return;
              this.context = context;
              this.needsupdate = false;
              this.program = this.program || this.context.createProgram();
              this.vertexShader = this.vertexShader || this.context.createShader(this.context.VERTEX_SHADER);
              this.context.shaderSource(this.vertexShader, this.vertexSource);
              this.context.compileShader(this.vertexShader);
              if (this.context.getShaderParameter(this.vertexShader, this.context.COMPILE_STATUS) === false) {
                  console.log(this.context.getShaderInfoLog(this.vertexShader));
                  this.context.deleteShader(this.vertexShader);
                  return;
              }
              this.fragmentShader = this.fragmentShader || this.context.createShader(this.context.FRAGMENT_SHADER);
              this.context.shaderSource(this.fragmentShader, this.fragmentSource);
              this.context.compileShader(this.fragmentShader);
              if (this.context.getShaderParameter(this.fragmentShader, this.context.COMPILE_STATUS) === false) {
                  console.log(this.context.getShaderInfoLog(this.fragmentShader));
                  this.context.deleteShader(this.fragmentShader);
                  return;
              }
              this.context.attachShader(this.program, this.vertexShader);
              this.context.attachShader(this.program, this.fragmentShader);
              this.context.linkProgram(this.program);
          };
          Shader.prototype.dispose = function () {
              if (this.disposed === true)
                  return;
              this.disposed = true;
              if (this.context !== undefined) {
                  if (this.program !== undefined)
                      this.context.deleteProgram(this.program);
                  if (this.vertexShader !== undefined)
                      this.context.deleteShader(this.vertexShader);
                  if (this.fragmentShader !== undefined)
                      this.context.deleteShader(this.fragmentShader);
                  this.program = undefined;
                  this.vertexShader = undefined;
                  this.fragmentShader = undefined;
              }
          };
          return Shader;
      }());
      exports.Shader = Shader;
  });
  define("src/graphics/texture2D", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var to_format = function (context, format) {
          switch (format) {
              case "rgb": return context.RGB;
              case "rgba": return context.RGBA;
              case "float": return context.FLOAT;
              default: throw Error("unsupported texture format " + format);
          }
      };
      var Texture2D = (function () {
          function Texture2D(width, height, format, pixels) {
              this.width = width;
              this.height = height;
              this.format = format;
              this.pixels = pixels;
              this.needsupdate = true;
              this.disposed = false;
          }
          Texture2D.prototype.update = function (context) {
              if (this.needsupdate) {
                  this.context = this.context || context;
                  this.texture = this.texture || context.createTexture();
                  var format = to_format(context, this.format);
                  context.bindTexture(context.TEXTURE_2D, this.texture);
                  context.texImage2D(context.TEXTURE_2D, 0, format, this.width, this.height, 0, format, context.UNSIGNED_BYTE, this.pixels);
                  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
                  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
                  context.generateMipmap(context.TEXTURE_2D);
                  context.bindTexture(context.TEXTURE_2D, null);
                  this.needsupdate = false;
              }
          };
          Texture2D.prototype.dispose = function () {
              if (this.disposed === true)
                  return;
              if (this.context === undefined)
                  return;
              if (this.texture === undefined)
                  return;
              this.context.deleteTexture(this.texture);
              this.disposed = true;
          };
          return Texture2D;
      }());
      exports.Texture2D = Texture2D;
  });
  define("src/graphics/textureCube", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var TextureCube = (function () {
          function TextureCube() {
          }
          return TextureCube;
      }());
      exports.TextureCube = TextureCube;
  });
  define("src/graphics/material", ["require", "exports", "src/graphics/texture2D"], function (require, exports, texture2D_1) {
      "use strict";
      exports.__esModule = true;
      var Material = (function () {
          function Material(shader) {
              this.shader = shader;
              this.uniforms = {};
              this.wireframe = false;
              this.needsupdate = true;
          }
          Material.prototype.update = function (context) {
              this.shader.update(context);
              if (this.needsupdate) {
                  for (var key in this.uniforms) {
                      var uniform = this.uniforms[key];
                      if (uniform instanceof texture2D_1.Texture2D) {
                          uniform.update(context);
                      }
                  }
                  this.needsupdate = false;
              }
          };
          return Material;
      }());
      exports.Material = Material;
  });
  define("src/graphics/mesh", ["require", "exports", "src/graphics/object"], function (require, exports, object_2) {
      "use strict";
      exports.__esModule = true;
      var Mesh = (function (_super) {
          __extends(Mesh, _super);
          function Mesh(material, geometry) {
              var _this = _super.call(this) || this;
              _this.material = material;
              _this.geometry = geometry;
              _this.needsupdate = true;
              return _this;
          }
          Mesh.prototype.update = function (context) {
              this.material.update(context);
              this.geometry.update(context);
              if (this.needsupdate) {
                  this.needsupdate = false;
              }
          };
          return Mesh;
      }(object_2.Object3D));
      exports.Mesh = Mesh;
  });
  define("src/graphics/scene", ["require", "exports", "src/graphics/object"], function (require, exports, object_3) {
      "use strict";
      exports.__esModule = true;
      var Scene = (function (_super) {
          __extends(Scene, _super);
          function Scene() {
              return _super.call(this) || this;
          }
          return Scene;
      }(object_3.Object3D));
      exports.Scene = Scene;
  });
  define("src/graphics/renderer", ["require", "exports", "src/math/matrix", "src/math/single", "src/math/vector2", "src/math/vector3", "src/math/vector4", "src/math/plane", "src/math/quaternion", "src/graphics/geometry", "src/graphics/geometry-array", "src/graphics/mesh", "src/graphics/object", "src/graphics/texture2D", "src/graphics/textureCube"], function (require, exports, matrix_5, single_4, vector2_2, vector3_10, vector4_3, plane_6, quaternion_2, geometry_1, geometry_array_1, mesh_1, object_4, texture2D_2, textureCube_1) {
      "use strict";
      exports.__esModule = true;
      var Renderer = (function () {
          function Renderer(canvas) {
              this.canvas = canvas;
              this.context = this.canvas.getContext("webgl2");
          }
          Renderer.prototype.viewport = function (x, y, width, height) {
              this.context.viewport(x, y, width, height);
          };
          Renderer.prototype.clear = function (r, g, b, a) {
              if (a === void 0) { a = 1.0; }
              this.context.clearColor(r, g, b, a);
              this.context.enable(this.context.DEPTH_TEST);
              this.context.depthFunc(this.context.LEQUAL);
              this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
          };
          Renderer.prototype.render_object = function (camera, transform, object) {
              if (object.visible === false) {
                  this.render_object_list(camera, transform, object.objects);
              }
          };
          Renderer.prototype.render_mesh = function (camera, transform, mesh) {
              if (mesh.visible) {
                  mesh.update(this.context);
                  this.context.useProgram(mesh.material.shader.program);
                  var camera_projection = this.context.getUniformLocation(mesh.material.shader.program, "projection");
                  var camera_view = this.context.getUniformLocation(mesh.material.shader.program, "view");
                  this.context.uniformMatrix4fv(camera_projection, false, camera.projection.v);
                  this.context.uniformMatrix4fv(camera_view, false, camera.matrix.v);
                  var object_matrix = this.context.getUniformLocation(mesh.material.shader.program, "model");
                  this.context.uniformMatrix4fv(object_matrix, false, transform.v);
                  var texture_index = 0;
                  for (var key in mesh.material.uniforms) {
                      var location_1 = this.context.getUniformLocation(mesh.material.shader.program, key);
                      var uniform = mesh.material.uniforms[key];
                      if (uniform instanceof matrix_5.Matrix) {
                          this.context.uniformMatrix4fv(location_1, false, uniform.v);
                      }
                      else if (uniform instanceof single_4.Single) {
                          this.context.uniform1fv(location_1, uniform.v);
                      }
                      else if (uniform instanceof vector2_2.Vector2) {
                          this.context.uniform2fv(location_1, uniform.v);
                      }
                      else if (uniform instanceof vector3_10.Vector3) {
                          this.context.uniform3fv(location_1, uniform.v);
                      }
                      else if (uniform instanceof vector4_3.Vector4) {
                          this.context.uniform4fv(location_1, uniform.v);
                      }
                      else if (uniform instanceof plane_6.Plane) {
                          this.context.uniform4fv(location_1, uniform.v);
                      }
                      else if (uniform instanceof quaternion_2.Quaternion) {
                          this.context.uniform4fv(location_1, uniform.v);
                      }
                      else if (uniform instanceof texture2D_2.Texture2D) {
                          this.context.activeTexture(this.context.TEXTURE0 + texture_index);
                          this.context.bindTexture(this.context.TEXTURE_2D, uniform.texture);
                          this.context.uniform1i(location_1, texture_index);
                          texture_index += 1;
                      }
                      else if (uniform instanceof textureCube_1.TextureCube) {
                          texture_index += 1;
                      }
                  }
                  if (mesh.geometry instanceof geometry_array_1.GeometryArray) {
                      for (var key in mesh.geometry.attributes) {
                          var instance = mesh.geometry.attributes[key];
                          var location_2 = this.context.getAttribLocation(mesh.material.shader.program, key);
                          if (location_2 === -1) {
                              continue;
                          }
                          this.context.bindBuffer(this.context.ARRAY_BUFFER, instance.buffer);
                          this.context.enableVertexAttribArray(location_2);
                          this.context.vertexAttribPointer(location_2, instance.stride, this.context.FLOAT, false, 0, 0);
                          this.context.vertexAttribDivisor(location_2, 1);
                      }
                      for (var key in mesh.geometry.instance.attributes) {
                          var attribute = mesh.geometry.instance.attributes[key];
                          var location_3 = this.context.getAttribLocation(mesh.material.shader.program, key);
                          if (location_3 === -1) {
                              continue;
                          }
                          this.context.bindBuffer(this.context.ARRAY_BUFFER, attribute.buffer);
                          this.context.enableVertexAttribArray(location_3);
                          this.context.vertexAttribPointer(location_3, attribute.stride, this.context.FLOAT, false, 0, 0);
                      }
                      var target = this.context.ELEMENT_ARRAY_BUFFER;
                      var buffer = mesh.geometry.instance.indices.buffer;
                      this.context.bindBuffer(target, buffer);
                      var mode = this.context.TRIANGLES;
                      var count = mesh.geometry.instance.indices.data.length;
                      var offset = 0;
                      var iterations = mesh.geometry.length;
                      var type = (mesh.geometry.instance.indices.data instanceof Uint8Array)
                          ? this.context.UNSIGNED_BYTE
                          : this.context.UNSIGNED_SHORT;
                      this.context.drawElementsInstanced(mode, count, type, offset, iterations);
                  }
                  if (mesh.geometry instanceof geometry_1.Geometry) {
                      for (var key in mesh.geometry.attributes) {
                          var attribute = mesh.geometry.attributes[key];
                          var location_4 = this.context.getAttribLocation(mesh.material.shader.program, key);
                          if (location_4 === -1) {
                              continue;
                          }
                          this.context.bindBuffer(this.context.ARRAY_BUFFER, attribute.buffer);
                          this.context.enableVertexAttribArray(location_4);
                          this.context.vertexAttribPointer(location_4, attribute.stride, this.context.FLOAT, false, 0, 0);
                      }
                      var target = this.context.ELEMENT_ARRAY_BUFFER;
                      var buffer = mesh.geometry.indices.buffer;
                      this.context.bindBuffer(target, buffer);
                      var mode = this.context.TRIANGLES;
                      var count = mesh.geometry.indices.data.length;
                      var offset = 0;
                      var type = (mesh.geometry.indices.data instanceof Uint8Array)
                          ? this.context.UNSIGNED_BYTE
                          : this.context.UNSIGNED_SHORT;
                      this.context.drawElements(mode, count, type, offset);
                  }
                  this.render_object_list(camera, transform, mesh.objects);
              }
          };
          Renderer.prototype.render_object_list = function (camera, transform, objects) {
              for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
                  var object = objects_1[_i];
                  if (object instanceof mesh_1.Mesh) {
                      this.render_mesh(camera, matrix_5.Matrix.mul(object.matrix, transform), object);
                  }
                  else if (object instanceof object_4.Object3D) {
                      this.render_object(camera, matrix_5.Matrix.mul(object.matrix, transform), object);
                  }
                  else {
                  }
              }
          };
          Renderer.prototype.render = function (camera, scene) {
              if (scene.visible) {
                  this.render_object_list(camera, scene.matrix, scene.objects);
              }
          };
          return Renderer;
      }());
      exports.Renderer = Renderer;
  });
  define("src/graphics/render-target", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var RenderTarget = (function () {
          function RenderTarget(width, height) {
              this.width = width;
              this.height = height;
          }
          RenderTarget.prototype.dispose = function () {
              if (this.disposed === true)
                  return;
              if (this.context === undefined)
                  return;
              if (this.buffer === undefined)
                  return;
              this.context.deleteFramebuffer(this.buffer);
              this.disposed = true;
          };
          return RenderTarget;
      }());
      exports.RenderTarget = RenderTarget;
  });
  define("src/graphics/index", ["require", "exports", "src/graphics/attribute", "src/graphics/camera", "src/graphics/geometry", "src/graphics/geometry", "src/graphics/geometry-array", "src/graphics/light", "src/graphics/material", "src/graphics/mesh", "src/graphics/object", "src/graphics/renderer", "src/graphics/render-target", "src/graphics/scene", "src/graphics/shader", "src/graphics/texture2D", "src/graphics/textureCube"], function (require, exports, attribute_2, camera_1, geometry_2, geometry_3, geometry_array_2, light_1, material_1, mesh_2, object_5, renderer_1, render_target_1, scene_1, shader_1, texture2D_3, textureCube_2) {
      "use strict";
      exports.__esModule = true;
      exports.Attribute = attribute_2.Attribute;
      exports.Camera = camera_1.Camera;
      exports.PerspectiveCamera = camera_1.PerspectiveCamera;
      exports.OrthoCamera = camera_1.OrthoCamera;
      exports.Geometry = geometry_2.Geometry;
      exports.CubeGeometry = geometry_3.CubeGeometry;
      exports.GeometryArray = geometry_array_2.GeometryArray;
      exports.Light = light_1.Light;
      exports.Material = material_1.Material;
      exports.Mesh = mesh_2.Mesh;
      exports.Object3D = object_5.Object3D;
      exports.Renderer = renderer_1.Renderer;
      exports.RenderTarget = render_target_1.RenderTarget;
      exports.Scene = scene_1.Scene;
      exports.Shader = shader_1.Shader;
      exports.Texture2D = texture2D_3.Texture2D;
      exports.TextureCube = textureCube_2.TextureCube;
  });
  define("src/index", ["require", "exports", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/math/index", "src/compute/index", "src/compute/index", "src/compute/index", "src/compute/index", "src/compute/index", "src/compute/index", "src/compute/index", "src/compute/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/index", "src/graphics/scene", "src/graphics/index", "src/graphics/index", "src/graphics/index"], function (require, exports, index_2, index_3, index_4, index_5, index_6, index_7, index_8, index_9, index_10, index_11, index_12, index_13, index_14, index_15, index_16, index_17, index_18, index_19, index_20, index_21, index_22, index_23, index_24, index_25, index_26, index_27, index_28, index_29, index_30, index_31, index_32, index_33, index_34, index_35, index_36, scene_2, index_37, index_38, index_39) {
      "use strict";
      exports.__esModule = true;
      exports.Box = index_2.Box;
      exports.Frustum = index_3.Frustum;
      exports.Matrix = index_4.Matrix;
      exports.Plane = index_5.Plane;
      exports.Quaternion = index_6.Quaternion;
      exports.Radian = index_7.Radian;
      exports.Ray = index_8.Ray;
      exports.Single = index_9.Single;
      exports.Sphere = index_10.Sphere;
      exports.Triangle = index_11.Triangle;
      exports.Vector2 = index_12.Vector2;
      exports.Vector3 = index_13.Vector3;
      exports.Vector4 = index_14.Vector4;
      exports.VectorN = index_15.VectorN;
      exports.Context = index_16.Context;
      exports.Program = index_17.Program;
      exports.Float1D = index_18.Float1D;
      exports.Float2D = index_19.Float2D;
      exports.Float3D = index_20.Float3D;
      exports.Color1D = index_21.Color1D;
      exports.Color2D = index_22.Color2D;
      exports.Color3D = index_23.Color3D;
      exports.Attribute = index_24.Attribute;
      exports.Camera = index_25.Camera;
      exports.PerspectiveCamera = index_26.PerspectiveCamera;
      exports.OrthoCamera = index_27.OrthoCamera;
      exports.Geometry = index_28.Geometry;
      exports.CubeGeometry = index_29.CubeGeometry;
      exports.GeometryArray = index_30.GeometryArray;
      exports.Light = index_31.Light;
      exports.Material = index_32.Material;
      exports.Mesh = index_33.Mesh;
      exports.Object3D = index_34.Object3D;
      exports.Renderer = index_35.Renderer;
      exports.RenderTarget = index_36.RenderTarget;
      exports.Scene = scene_2.Scene;
      exports.Shader = index_37.Shader;
      exports.Texture2D = index_38.Texture2D;
      exports.TextureCube = index_39.TextureCube;
  });
  define("demo/index", ["require", "exports", "src/index"], function (require, exports, hex) {
      "use strict";
      exports.__esModule = true;
      var canvas = document.getElementById("canvas");
      var renderer = new hex.Renderer(canvas);
      var camera = new hex.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
      camera.matrix = hex.Matrix.lookAt(new hex.Vector3(0, 0, -36), new hex.Vector3(0, 0, 0), new hex.Vector3(0, 1, 0));
      var cube = new hex.CubeGeometry();
      var geometry = new hex.GeometryArray(cube, 10000);
      var data = [];
      for (var i = 0; i < 10000; i++) {
          data.push((Math.random() - 0.5) * 30);
          data.push((Math.random() - 0.5) * 30);
          data.push((Math.random() - 0.5) * 30);
          data.push(1);
      }
      geometry.addAttribute("offset", new hex.Attribute(4, data));
      var shader = new hex.Shader("#version 300 es\n  \n  precision highp float;\n  \n  uniform mat4   model;\n  uniform mat4   view;\n  uniform mat4   projection;\n\n  in vec4 position;\n  in vec2 texcoord;\n  in vec3 normal;\n  in vec4 offset;\n\n  out vec2 out_texcoord;\n  out vec4 out_position;\n  void main() {\n    vec4 temp = position + offset;\n    out_texcoord = texcoord;\n    out_position = (model * temp);\n    gl_Position  = projection * view * (model * temp);\n  }\n", "#version 300 es\n\n  precision highp float;\n\n  uniform sampler2D map;\n  in vec2 out_texcoord;\n  in vec4 out_position;\n  out vec4 color;\n  \n  void main() {\n    int a = int(80.0);\n    int b = int(out_position.x * 20.0);\n    int c = int(out_position.y * 20.0);\n    int d = int(out_position.z * 20.0);\n    \n    if (((b % a) == 0) || ((c % a) == 0) || ((d % a) == 0)) {\n      // color = vec4(0.8, 0.8, 0.8, 1.0);\n      color = texture(map, out_texcoord);\n    } else {\n      //color = texture(map, out_texcoord);\n      color = vec4(0.3, 0.3, 0.3, 0.1);\n      //discard;\n    }\n\n    // float x = 0.1;\n    // if((out_position.x > -x && out_position.x < x) || \n    //    (out_position.y > -x && out_position.y < x) || \n    //    (out_position.z > -x && out_position.z < x) ) {\n    //     color = vec4(1.0, 1.0, 1.0, 1.0);\n    // } else {\n    //   discard;\n    //   //gl_FragColor = texture2D(texture, out_texcoord);\n    // }\n    \n  }\n");
      var material = new hex.Material(shader);
      var mesh = new hex.Mesh(material, geometry);
      var scene = new hex.Scene();
      scene.objects.push(mesh);
      var texture = new hex.Texture2D(16, 16, "rgb", new Uint8Array(16 * 16 * 3));
      var t = 0;
      setInterval(function () {
          var data = texture.pixels;
          for (var i = 0; i < data.length; i += 3) {
              var r = Math.random();
              if (r > 0.995) {
                  var x_1 = Math.floor(Math.random() * 256);
                  data[i] = x_1;
                  data[i + 1] = x_1;
                  data[i + 2] = x_1;
              }
          }
          texture.needsupdate = true;
          var x = (Math.cos(t) + 1) / 2;
          var y = (Math.sin(t) + 1) / 2;
          t += 0.01;
          material.uniforms.color = new hex.Vector4(x, y, 0, 1);
          material.uniforms.map = texture;
          mesh.matrix = mesh.matrix.rotateZ(0.001).rotateY(0.001).rotateX(0.002);
          renderer.clear(0.2, 0.2, 0.2, 1);
          renderer.render(camera, scene);
      }, 1);
  });
  
  return collect(); 
})();