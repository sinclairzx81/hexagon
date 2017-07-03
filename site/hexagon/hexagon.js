var hexagon = (function () {
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
                  } else return require(id)
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
  define("src/math/typeinfo", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
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
          Vector4.prototype.typeinfo = function () {
              return "Vector4";
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
  define("src/math/matrix", ["require", "exports", "src/math/plane", "src/math/vector3", "src/math/vector4"], function (require, exports, plane_1, vector3_1, vector4_1) {
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
              return new vector3_1.Vector3(this.v[mi.m21], this.v[mi.m22], this.v[mi.m23]);
          };
          Matrix.prototype.down = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m21] = -vector.v[v3i.x];
                  this.v[mi.m22] = -vector.v[v3i.y];
                  this.v[mi.m23] = -vector.v[v3i.z];
              }
              return new vector3_1.Vector3(-this.v[mi.m21], -this.v[mi.m22], -this.v[mi.m23]);
          };
          Matrix.prototype.right = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m11] = vector.v[v3i.x];
                  this.v[mi.m12] = vector.v[v3i.y];
                  this.v[mi.m13] = vector.v[v3i.z];
              }
              return new vector3_1.Vector3(this.v[mi.m11], this.v[mi.m12], this.v[mi.m13]);
          };
          Matrix.prototype.left = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m11] = -vector.v[v3i.x];
                  this.v[mi.m12] = -vector.v[v3i.y];
                  this.v[mi.m13] = -vector.v[v3i.z];
              }
              return new vector3_1.Vector3(-this.v[mi.m11], -this.v[mi.m12], -this.v[mi.m13]);
          };
          Matrix.prototype.forward = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m31] = -vector.v[v3i.x];
                  this.v[mi.m32] = -vector.v[v3i.y];
                  this.v[mi.m33] = -vector.v[v3i.z];
              }
              return new vector3_1.Vector3(-this.v[mi.m31], -this.v[mi.m32], -this.v[mi.m33]);
          };
          Matrix.prototype.backward = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m31] = vector.v[v3i.x];
                  this.v[mi.m32] = vector.v[v3i.y];
                  this.v[mi.m33] = vector.v[v3i.z];
              }
              return new vector3_1.Vector3(this.v[mi.m31], this.v[mi.m32], this.v[mi.m33]);
          };
          Matrix.prototype.translation = function (vector) {
              if (vector !== undefined) {
                  this.v[mi.m41] = vector.v[v3i.x];
                  this.v[mi.m42] = vector.v[v3i.y];
                  this.v[mi.m43] = vector.v[v3i.z];
              }
              return new vector3_1.Vector3(this.v[mi.m41], this.v[mi.m42], this.v[mi.m43]);
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
          Matrix.prototype.typeinfo = function () {
              return "Matrix";
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
              var v0 = vector3_1.Vector3.normalize(vector3_1.Vector3.sub(position, target));
              var v1 = vector3_1.Vector3.normalize(vector3_1.Vector3.cross(up, v0));
              var v2 = vector3_1.Vector3.cross(v0, v1);
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
              m0.v[mi.m41] = -vector3_1.Vector3.dot(v1, position);
              m0.v[mi.m42] = -vector3_1.Vector3.dot(v2, position);
              m0.v[mi.m43] = -vector3_1.Vector3.dot(v0, position);
              m0.v[mi.m44] = 1.0;
              return m0;
          };
          Matrix.origin = function (m0) {
              var r0 = m0.v[mi.m22] * m0.v[mi.m33] - m0.v[mi.m32] * m0.v[mi.m23];
              var r1 = m0.v[mi.m32] * m0.v[mi.m13] - m0.v[mi.m12] * m0.v[mi.m33];
              var r2 = m0.v[mi.m12] * m0.v[mi.m23] - m0.v[mi.m22] * m0.v[mi.m13];
              var r3 = m0.v[mi.m11] * r0 + m0.v[mi.m21] * r1 + m0.v[mi.m31] * r2;
              if (Math.abs(r3) < 0.0001)
                  return vector3_1.Vector3.create();
              var r4 = m0.v[mi.m31] * m0.v[mi.m23] - m0.v[mi.m21] * m0.v[mi.m33];
              var r5 = m0.v[mi.m11] * m0.v[mi.m33] - m0.v[mi.m31] * m0.v[mi.m13];
              var r6 = m0.v[mi.m21] * m0.v[mi.m13] - m0.v[mi.m11] * m0.v[mi.m23];
              var r7 = m0.v[mi.m21] * m0.v[mi.m32] - m0.v[mi.m31] * m0.v[mi.m22];
              var r8 = m0.v[mi.m31] * m0.v[mi.m12] - m0.v[mi.m11] * m0.v[mi.m32];
              var r9 = m0.v[mi.m11] * m0.v[mi.m22] - m0.v[mi.m21] * m0.v[mi.m12];
              return new vector3_1.Vector3(-((r0 * m0.v[mi.m41] + r4 * m0.v[mi.m42] + r7 * m0.v[mi.m43]) / r3), -((r1 * m0.v[mi.m41] + r5 * m0.v[mi.m42] + r8 * m0.v[mi.m43]) / r3), -((r2 * m0.v[mi.m41] + r6 * m0.v[mi.m42] + r9 * m0.v[mi.m43]) / r3));
          };
          Matrix.world = function (position, forward, up) {
              var m0 = new Matrix();
              var v0 = vector3_1.Vector3.normalize(vector3_1.Vector3.sub(position, forward));
              var v1 = vector3_1.Vector3.normalize(vector3_1.Vector3.cross(up, v0));
              var v2 = vector3_1.Vector3.cross(v0, v1);
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
              m0.v[mi.m14] = -vector3_1.Vector3.dot(v1, position);
              m0.v[mi.m24] = -vector3_1.Vector3.dot(v2, position);
              m0.v[mi.m34] = -vector3_1.Vector3.dot(v0, position);
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
              var p1 = plane_1.Plane.normalize(p0);
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
          Quaternion.prototype.typeinfo = function () {
              return "Quaternion";
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
          Vector3.prototype.typeinfo = function () {
              return "Vector3";
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
          Single.prototype.typeinfo = function () {
              return "Single";
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
  define("src/math/sphere", ["require", "exports", "src/math/single", "src/math/vector3"], function (require, exports, single_1, vector3_2) {
      "use strict";
      exports.__esModule = true;
      var v3i = { x: 0, y: 1, z: 2 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var Sphere = (function () {
          function Sphere(position, radius) {
              this.position = position === undefined ? new vector3_2.Vector3(0, 0, 0) : position;
              this.radius = radius === undefined ? 0.5 : radius;
          }
          Sphere.prototype.toString = function () {
              return "{ position: " + this.position.toString() + ", radius: " + this.radius + "}";
          };
          Sphere.prototype.typeinfo = function () {
              return "Sphere";
          };
          Sphere.prototype.clone = function () {
              return Sphere.clone(this);
          };
          Sphere.equals = function (s0, s1) {
              return (vector3_2.Vector3.equals(s0.position, s1.position) &&
                  s0.radius === s1.radius);
          };
          Sphere.merge = function (s0, s1) {
              var n0 = vector3_2.Vector3.sub(s1.position, s0.position);
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
              var center = vector3_2.Vector3.lerp(b0.min, b0.max, 0.5);
              var distance = vector3_2.Vector3.distance(b0.min, b0.max);
              return new Sphere(center, distance * 0.5);
          };
          Sphere.fromPoints = function (points) {
              var radius = 0.0;
              var center = new vector3_2.Vector3();
              var n0 = new vector3_2.Vector3();
              var n1 = new vector3_2.Vector3();
              var n2 = new vector3_2.Vector3();
              var n3 = new vector3_2.Vector3();
              var n4 = new vector3_2.Vector3();
              var n5 = new vector3_2.Vector3();
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
              var n6 = vector3_2.Vector3.distance(n1, n0);
              var n7 = vector3_2.Vector3.distance(n3, n2);
              var n8 = vector3_2.Vector3.distance(n5, n4);
              if (n6 > n7) {
                  if (n6 > n8) {
                      center = vector3_2.Vector3.lerp(n1, n0, 0.5);
                      radius = n6 * 0.5;
                  }
                  else {
                      center = vector3_2.Vector3.lerp(n5, n4, 0.5);
                      radius = n8 * 0.5;
                  }
              }
              else if (n7 > n8) {
                  center = vector3_2.Vector3.lerp(n3, n2, 0.5);
                  radius = n7 * 0.5;
              }
              else {
                  center = vector3_2.Vector3.lerp(n5, n4, 0.5);
                  radius = n8 * 0.5;
              }
              for (var i = 0; i < points.length; i++) {
                  var v0 = points[i];
                  var v1 = new vector3_2.Vector3(v0.v[v3i.x] - center.v[v3i.x], v0.v[v3i.y] - center.v[v3i.y], v0.v[v3i.z] - center.v[v3i.z]);
                  var num3 = v1.length();
                  if (num3 > radius) {
                      radius = (radius + num3) * 0.5;
                      center = center.add(vector3_2.Vector3.scale(v1, 1.0 - (radius / num3)));
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
          Triangle.prototype.typeinfo = function () {
              return "Triangle";
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
          Ray.prototype.typeinfo = function () {
              return "Ray";
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
  define("src/math/frustum", ["require", "exports", "src/math/matrix", "src/math/vector3", "src/math/plane", "src/math/ray"], function (require, exports, matrix_1, vector3_5, plane_3, ray_1) {
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
          var v0 = vector3_5.Vector3.cross(p0.normal(), p1.normal());
          var n0 = v0.lengthSq();
          var v1 = vector3_5.Vector3.scale(p1.normal(), -p0.d());
          var v2 = vector3_5.Vector3.scale(p0.normal(), p1.d());
          var v3 = vector3_5.Vector3.add(v1, v2);
          var v4 = vector3_5.Vector3.cross(v3, v0);
          var v5 = new vector3_5.Vector3(v4.v[v3i.x] / n0, v4.v[v3i.y] / n0, v4.v[v3i.z] / n0);
          return new ray_1.Ray(v5, v0);
      };
      var computeIntersectionVector = function (plane, ray) {
          var num = (-plane.d() -
              vector3_5.Vector3.dot(plane.normal(), ray.position)) /
              vector3_5.Vector3.dot(plane.normal(), ray.direction);
          return vector3_5.Vector3.add(ray.position, vector3_5.Vector3.scale(ray.direction, num));
      };
      var Frustum = (function () {
          function Frustum(matrix) {
              this.matrix = matrix === undefined ? matrix_1.Matrix.create() : matrix.clone();
              this.planes = new Array(6);
              this.planes[fpi.near] = new plane_3.Plane(-this.matrix.v[mi.m13], -this.matrix.v[mi.m23], -this.matrix.v[mi.m33], -this.matrix.v[mi.m43]);
              this.planes[fpi.far] = new plane_3.Plane(-this.matrix.v[mi.m14] + this.matrix.v[mi.m13], -this.matrix.v[mi.m24] + this.matrix.v[mi.m23], -this.matrix.v[mi.m34] + this.matrix.v[mi.m33], -this.matrix.v[mi.m44] + this.matrix.v[mi.m43]);
              this.planes[fpi.left] = new plane_3.Plane(-this.matrix.v[mi.m14] - this.matrix.v[mi.m11], -this.matrix.v[mi.m24] - this.matrix.v[mi.m21], -this.matrix.v[mi.m34] - this.matrix.v[mi.m31], -this.matrix.v[mi.m44] - this.matrix.v[mi.m41]);
              this.planes[fpi.right] = new plane_3.Plane(-this.matrix.v[mi.m14] + this.matrix.v[mi.m11], -this.matrix.v[mi.m24] + this.matrix.v[mi.m21], -this.matrix.v[mi.m34] + this.matrix.v[mi.m31], -this.matrix.v[mi.m44] + this.matrix.v[mi.m41]);
              this.planes[fpi.top] = new plane_3.Plane(-this.matrix.v[mi.m14] + this.matrix.v[mi.m12], -this.matrix.v[mi.m24] + this.matrix.v[mi.m22], -this.matrix.v[mi.m34] + this.matrix.v[mi.m32], -this.matrix.v[mi.m44] + this.matrix.v[mi.m42]);
              this.planes[fpi.bottom] = new plane_3.Plane(-this.matrix.v[mi.m14] - this.matrix.v[mi.m12], -this.matrix.v[mi.m24] - this.matrix.v[mi.m22], -this.matrix.v[mi.m34] - this.matrix.v[mi.m32], -this.matrix.v[mi.m44] - this.matrix.v[mi.m42]);
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
          Frustum.prototype.typeinfo = function () {
              return "Frustum";
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
          Plane.prototype.typeinfo = function () {
              return "Plane";
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
  define("src/math/box", ["require", "exports", "src/math/vector3", "src/math/ray"], function (require, exports, vector3_7, ray_2) {
      "use strict";
      exports.__esModule = true;
      var v3i = { x: 0, y: 1, z: 2 };
      var pli = { x: 0, y: 1, z: 2, w: 3 };
      var Box = (function () {
          function Box(min, max) {
              this.min = min === undefined ? new vector3_7.Vector3(0, 0, 0) : min;
              this.max = max === undefined ? new vector3_7.Vector3(1, 1, 1) : max;
          }
          Box.prototype.toString = function () {
              return "[" + this.min.toString() + ", " + this.max.toString() + "]";
          };
          Box.prototype.typeinfo = function () {
              return "Box";
          };
          Box.prototype.clone = function () {
              return Box.clone(this);
          };
          Box.prototype.corners = function () {
              return [
                  new vector3_7.Vector3(this.min.v[v3i.x], this.max.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_7.Vector3(this.max.v[v3i.x], this.max.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_7.Vector3(this.max.v[v3i.x], this.min.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_7.Vector3(this.min.v[v3i.x], this.min.v[v3i.y], this.max.v[v3i.z]),
                  new vector3_7.Vector3(this.min.v[v3i.x], this.max.v[v3i.y], this.min.v[v3i.z]),
                  new vector3_7.Vector3(this.max.v[v3i.x], this.max.v[v3i.y], this.min.v[v3i.z]),
                  new vector3_7.Vector3(this.max.v[v3i.x], this.min.v[v3i.y], this.min.v[v3i.z]),
                  new vector3_7.Vector3(this.min.v[v3i.x], this.min.v[v3i.y], this.min.v[v3i.z])
              ];
          };
          Box.equals = function (b0, b1) {
              return (vector3_7.Vector3.equals(b0.min, b1.min) &&
                  vector3_7.Vector3.equals(b0.max, b1.max));
          };
          Box.merge = function (b0, b1) {
              return new Box(vector3_7.Vector3.min(b0.min, b1.min), vector3_7.Vector3.max(b0.max, b1.max));
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
              var n1 = new vector3_7.Vector3((p0.v[pli.x] >= 0.0) ? b0.min.v[v3i.x] : b0.max.v[v3i.x], (p0.v[pli.y] >= 0.0) ? b0.min.v[v3i.y] : b0.max.v[v3i.y], (p0.v[pli.z] >= 0.0) ? b0.min.v[v3i.z] : b0.max.v[v3i.z]);
              var n0 = new vector3_7.Vector3((p0.v[pli.x] >= 0.0) ? b0.max.v[v3i.x] : b0.min.v[v3i.x], (p0.v[pli.y] >= 0.0) ? b0.max.v[v3i.y] : b0.min.v[v3i.y], (p0.v[pli.z] >= 0.0) ? b0.max.v[v3i.z] : b0.min.v[v3i.z]);
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
              var vector = vector3_7.Vector3.clamp(s0.position, b0.min, b0.max);
              var num = vector3_7.Vector3.distanceSq(s0.position, vector);
              return (num <= (s0.radius * s0.radius));
          };
          Box.fromSphere = function (s0) {
              return new Box(new vector3_7.Vector3(s0.position.v[v3i.x] - s0.radius, s0.position.v[v3i.y] - s0.radius, s0.position.v[v3i.z] - s0.radius), new vector3_7.Vector3(s0.position.v[v3i.x] + s0.radius, s0.position.v[v3i.y] + s0.radius, s0.position.v[v3i.z] + s0.radius));
          };
          Box.fromPoints = function (points) {
              var max = vector3_7.Vector3.MAX_VALUE;
              var min = vector3_7.Vector3.MIN_VALUE;
              for (var i = 0; i < points.length; i++) {
                  max = vector3_7.Vector3.min(max, points[i]);
                  min = vector3_7.Vector3.max(min, points[i]);
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
          Vector2.prototype.typeinfo = function () {
              return "Vector2";
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
          VectorN.prototype.typename = function () {
              return "VectorN";
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
  define("src/graphics/typeinfo", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
  });
  define("src/graphics/attribute", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Attribute = (function () {
          function Attribute(array, size) {
              this.array = array;
              this.size = size;
              if (array.length % size !== 0)
                  throw Error("attribute: (array.length % size) does not equal 0");
              this.context = undefined;
              this.buffer = undefined;
              this.disposed = false;
          }
          Attribute.prototype.typeinfo = function () {
              return "Attribute";
          };
          Attribute.prototype.sync = function (context, target) {
              this.context = context;
              this.buffer = (this.buffer === undefined)
                  ? this.context.createBuffer()
                  : this.buffer;
              this.context.bindBuffer(target, this.buffer);
              this.context.bufferData(target, this.array, this.context.STATIC_DRAW);
          };
          Attribute.prototype.dispose = function () {
              if (this.disposed === true)
                  return;
              if (this.context === undefined)
                  return;
              if (this.buffer === undefined)
                  return;
              this.context.deleteBuffer(this.buffer);
              this.context = undefined;
              this.buffer = undefined;
              this.disposed = true;
          };
          Attribute.fromArray = function (array) {
              if (array.length === 0)
                  throw new Error("array is empty");
              var length = 0;
              var size = 0;
              switch (array[0].typeinfo()) {
                  case "Single":
                      length = array.length * 1;
                      size = 1;
                      break;
                  case "Vector2":
                      length = array.length * 2;
                      size = 2;
                      break;
                  case "Vector3":
                      length = array.length * 3;
                      size = 3;
                      break;
                  case "Vector4":
                      length = array.length * 4;
                      size = 4;
                      break;
                  default: throw new Error("unknown array type.");
              }
              var index = 0;
              var buffer = new Float32Array(length);
              for (var i = 0; i < array.length; i++) {
                  for (var j = 0; j < array[i].v.length; j++) {
                      buffer[index] = array[i].v[j];
                      index += 1;
                  }
              }
              return new Attribute(buffer, size);
          };
          return Attribute;
      }());
      exports.Attribute = Attribute;
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
          Object3D.prototype.typeinfo = function () {
              return "Object3D";
          };
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
          Camera.prototype.typeinfo = function () {
              return "Camera";
          };
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
          function Geometry(options) {
              options = options || { attributes: undefined, indices: undefined };
              this.attributes = options.attributes || {};
              this.indices = options.indices;
              this.indices_wireframe = undefined;
              this.needsupdate = true;
              this.disposed = false;
          }
          Geometry.prototype.typeinfo = function () {
              return "Geometry";
          };
          Geometry.prototype.sync = function (context) {
              var _this = this;
              if (!this.needsupdate)
                  return;
              this.needsupdate = false;
              this.indices.sync(context, context.ELEMENT_ARRAY_BUFFER);
              var wireframe = new Uint16Array(this.indices.array.length * 2);
              for (var i = 0, j = 0; i < this.indices.array.length; i += 3, j += 6) {
                  wireframe[j + 0] = this.indices.array[i + 0];
                  wireframe[j + 1] = this.indices.array[i + 1];
                  wireframe[j + 2] = this.indices.array[i + 1];
                  wireframe[j + 3] = this.indices.array[i + 2];
                  wireframe[j + 4] = this.indices.array[i + 2];
                  wireframe[j + 5] = this.indices.array[i + 0];
              }
              this.indices_wireframe = new attribute_1.Attribute(wireframe, 1);
              this.indices_wireframe.sync(context, context.ELEMENT_ARRAY_BUFFER);
              Object.keys(this.attributes).forEach(function (key) {
                  var attribute = _this.attributes[key];
                  attribute.sync(context, context.ARRAY_BUFFER);
              });
          };
          Geometry.prototype.dispose = function () {
              var _this = this;
              if (this.disposed === true)
                  return;
              if (this.indices === undefined)
                  return;
              if (this.attributes === undefined)
                  return;
              this.indices.dispose();
              Object.keys(this.attributes).forEach(function (key) {
                  _this.attributes[key].dispose();
              });
              this.disposed = true;
          };
          return Geometry;
      }());
      exports.Geometry = Geometry;
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
          Light.prototype.typeinfo = function () {
              return "Light";
          };
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
          Shader.prototype.typeinfo = function () {
              return "Object3D";
          };
          Shader.prototype.sync = function (context) {
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
          function Texture2D(pixels, width, height, format) {
              this.pixels = pixels;
              this.width = width;
              this.height = height;
              this.format = format;
              this.needsupdate = true;
              this.disposed = false;
          }
          Texture2D.prototype.typeinfo = function () {
              return "Texture2D";
          };
          Texture2D.prototype.sync = function (context) {
              if (this.needsupdate === false)
                  return;
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
          TextureCube.prototype.typeinfo = function () {
              return "TextureCube";
          };
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
          Material.prototype.typeinfo = function () {
              return "Material";
          };
          Material.prototype.sync = function (context) {
              var _this = this;
              if (!this.needsupdate)
                  return;
              this.needsupdate = false;
              this.shader.sync(context);
              Object.keys(this.uniforms).forEach(function (key) {
                  var uniform = _this.uniforms[key];
                  if (uniform instanceof texture2D_1.Texture2D) {
                      uniform.sync(context);
                  }
              });
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
              _this.instances = {};
              _this.needsupdate = true;
              return _this;
          }
          Mesh.prototype.instanceCount = function () {
              var keys = Object.keys(this.instances);
              return (keys.length > 0)
                  ? this.instances[keys[0]].array.length /
                      this.instances[keys[0]].size
                  : 0;
          };
          Mesh.prototype.typeinfo = function () {
              return "Mesh";
          };
          Mesh.prototype.sync = function (context) {
              var _this = this;
              if (this.needsupdate) {
                  this.needsupdate = false;
                  if (Object.keys(this.instances).length > 1) {
                      var lens_1 = Object.keys(this.instances).map(function (key) {
                          return _this.instances[key].array.length /
                              _this.instances[key].size;
                      });
                      if (lens_1.every(function (n) { return n === lens_1[0]; }) === false) {
                          throw Error("geometry: instance length mismatch.");
                      }
                  }
                  Object.keys(this.instances).forEach(function (key) {
                      var instance = _this.instances[key];
                      instance.sync(context, context.ARRAY_BUFFER);
                  });
              }
              this.material.sync(context);
              this.geometry.sync(context);
          };
          return Mesh;
      }(object_2.Object3D));
      exports.Mesh = Mesh;
  });
  define("src/graphics/extensions", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var Extensions = (function () {
          function Extensions(context) {
              this.context = context;
              this.cache = {};
          }
          Extensions.prototype.get = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var extension = args[0];
              if (this.cache[extension] !== undefined) {
                  return this.cache[extension];
              }
              var ext = this.context.getExtension(extension);
              if (ext !== undefined) {
                  this.cache[extension] = ext;
              }
              return ext;
          };
          return Extensions;
      }());
      exports.Extensions = Extensions;
  });
  define("src/graphics/scene", ["require", "exports", "src/graphics/object"], function (require, exports, object_3) {
      "use strict";
      exports.__esModule = true;
      var Scene = (function (_super) {
          __extends(Scene, _super);
          function Scene() {
              var _this = _super.call(this) || this;
              _this.lights = new Array();
              return _this;
          }
          Scene.prototype.typeinfo = function () {
              return "Object3D";
          };
          return Scene;
      }(object_3.Object3D));
      exports.Scene = Scene;
  });
  define("src/graphics/renderer", ["require", "exports", "src/math/matrix", "src/graphics/extensions"], function (require, exports, matrix_5, extensions_1) {
      "use strict";
      exports.__esModule = true;
      var Renderer = (function () {
          function Renderer(canvas) {
              this.canvas = canvas;
              this.context = (this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl"));
              this.extensions = new extensions_1.Extensions(this.context);
              this.lights = new Array();
          }
          Renderer.prototype.typeinfo = function () {
              return "Renderer";
          };
          Renderer.prototype.viewport = function (x, y, width, height) {
              this.context.viewport(x, y, width, height);
          };
          Renderer.prototype.clear = function (r, g, b, a) {
              this.context.clearColor(r, g, b, a);
              this.context.enable(this.context.DEPTH_TEST);
              this.context.depthFunc(this.context.LEQUAL);
              this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
          };
          Renderer.prototype.renderObject = function (camera, transform, object) {
              if (object.visible === false)
                  return;
              this.renderObjects(camera, transform, object.objects);
          };
          Renderer.prototype.renderMesh = function (camera, transform, mesh) {
              var _this = this;
              if (mesh.visible === false)
                  return;
              mesh.sync(this.context);
              this.context.useProgram(mesh.material.shader.program);
              for (var i = 0; i < this.lights.length; i++) {
                  var light_position = this.context.getUniformLocation(mesh.material.shader.program, "lights[" + i + "].position");
                  var light_diffuse = this.context.getUniformLocation(mesh.material.shader.program, "lights[" + i + "].diffuse");
                  var light_ambient = this.context.getUniformLocation(mesh.material.shader.program, "lights[" + i + "].ambient");
                  var light_specular = this.context.getUniformLocation(mesh.material.shader.program, "lights[" + i + "].specular");
                  var light_attenuation = this.context.getUniformLocation(mesh.material.shader.program, "lights[" + i + "].attenuation");
                  var light_intensity = this.context.getUniformLocation(mesh.material.shader.program, "lights[" + i + "].intensity");
                  this.context.uniform3fv(light_position, this.lights[i].position.v);
                  this.context.uniform3fv(light_diffuse, this.lights[i].diffuse.v);
                  this.context.uniform3fv(light_ambient, this.lights[i].ambient.v);
                  this.context.uniform3fv(light_specular, this.lights[i].specular.v);
                  this.context.uniform1f(light_attenuation, this.lights[i].attenuation.v[0]);
                  this.context.uniform1f(light_intensity, this.lights[i].intensity.v[0]);
              }
              var camera_position = this.context.getUniformLocation(mesh.material.shader.program, "camera_position");
              var camera_projection = this.context.getUniformLocation(mesh.material.shader.program, "camera_projection");
              var camera_view = this.context.getUniformLocation(mesh.material.shader.program, "camera_view");
              this.context.uniform3fv(camera_position, matrix_5.Matrix.origin(camera.matrix).v);
              this.context.uniformMatrix4fv(camera_projection, false, camera.projection.v);
              this.context.uniformMatrix4fv(camera_view, false, camera.matrix.v);
              var object_matrix = this.context.getUniformLocation(mesh.material.shader.program, "object_matrix");
              this.context.uniformMatrix4fv(object_matrix, false, transform.v);
              var texture_index = 0;
              Object.keys(mesh.material.uniforms).forEach(function (key) {
                  var location = _this.context.getUniformLocation(mesh.material.shader.program, key);
                  var uniform = mesh.material.uniforms[key];
                  switch (uniform.typeinfo()) {
                      case "Matrix":
                          _this.context.uniformMatrix4fv(location, false, uniform.v);
                          break;
                      case "Single":
                          _this.context.uniform1fv(location, uniform.v);
                          break;
                      case "Vector2":
                          _this.context.uniform2fv(location, uniform.v);
                          break;
                      case "Vector3":
                          _this.context.uniform3fv(location, uniform.v);
                          break;
                      case "Vector4":
                          _this.context.uniform4fv(location, uniform.v);
                          break;
                      case "Plane":
                          _this.context.uniform4fv(location, uniform.v);
                          break;
                      case "Quaternion":
                          _this.context.uniform4fv(location, uniform.v);
                          break;
                      case "Texture2D":
                          _this.context.activeTexture(_this.context.TEXTURE0 + texture_index);
                          _this.context.bindTexture(_this.context.TEXTURE_2D, uniform.texture);
                          _this.context.uniform1i(location, texture_index);
                          texture_index += 1;
                          break;
                      case "TextureCube":
                          texture_index += 1;
                          break;
                  }
              });
              if (Object.keys(mesh.instances).length > 0) {
                  var ext_1 = this.extensions.get("ANGLE_instanced_arrays");
                  Object.keys(mesh.instances).forEach(function (key) {
                      var instance = mesh.instances[key];
                      var location = _this.context.getAttribLocation(mesh.material.shader.program, key);
                      if (location === -1)
                          return;
                      _this.context.bindBuffer(_this.context.ARRAY_BUFFER, instance.buffer);
                      _this.context.enableVertexAttribArray(location);
                      _this.context.vertexAttribPointer(location, instance.size, _this.context.FLOAT, false, 0, 0);
                      ext_1.vertexAttribDivisorANGLE(location, 1);
                  });
              }
              Object.keys(mesh.geometry.attributes).forEach(function (key) {
                  var attribute = mesh.geometry.attributes[key];
                  var location = _this.context.getAttribLocation(mesh.material.shader.program, key);
                  if (location === -1)
                      return;
                  _this.context.bindBuffer(_this.context.ARRAY_BUFFER, attribute.buffer);
                  _this.context.enableVertexAttribArray(location);
                  _this.context.vertexAttribPointer(location, attribute.size, _this.context.FLOAT, false, 0, 0);
              });
              if (mesh.material.wireframe) {
                  var target = this.context.ELEMENT_ARRAY_BUFFER;
                  var buffer = mesh.geometry.indices_wireframe.buffer;
                  this.context.bindBuffer(target, buffer);
                  if (Object.keys(mesh.instances).length === 0) {
                      var mode = this.context.LINES;
                      var count = mesh.geometry.indices_wireframe.array.length;
                      var offset = 0;
                      var type = (mesh.geometry.indices_wireframe.array instanceof Uint8Array)
                          ? this.context.UNSIGNED_BYTE
                          : this.context.UNSIGNED_SHORT;
                      this.context.drawElements(mode, count, type, offset);
                  }
                  else {
                      var ext = this.extensions.get("ANGLE_instanced_arrays");
                      var mode = this.context.LINES;
                      var length_1 = mesh.geometry.indices_wireframe.array.length;
                      var offset = 0;
                      var iterations = mesh.instanceCount();
                      var type = (mesh.geometry.indices_wireframe.array instanceof Uint8Array)
                          ? this.context.UNSIGNED_BYTE
                          : this.context.UNSIGNED_SHORT;
                      ext.drawElementsInstancedANGLE(mode, length_1, type, offset, iterations);
                  }
              }
              else {
                  var target = this.context.ELEMENT_ARRAY_BUFFER;
                  var buffer = mesh.geometry.indices.buffer;
                  this.context.bindBuffer(target, buffer);
                  if (Object.keys(mesh.instances).length === 0) {
                      var mode = this.context.TRIANGLES;
                      var count = mesh.geometry.indices.array.length;
                      var offset = 0;
                      var type = (mesh.geometry.indices.array instanceof Uint8Array)
                          ? this.context.UNSIGNED_BYTE
                          : this.context.UNSIGNED_SHORT;
                      this.context.drawElements(mode, count, type, offset);
                  }
                  else {
                      var ext = this.extensions.get("ANGLE_instanced_arrays");
                      var mode = this.context.TRIANGLES;
                      var count = mesh.geometry.indices.array.length;
                      var offset = 0;
                      var iterations = mesh.instanceCount();
                      var type = (mesh.geometry.indices.array instanceof Uint8Array)
                          ? this.context.UNSIGNED_BYTE
                          : this.context.UNSIGNED_SHORT;
                      ext.drawElementsInstancedANGLE(mode, count, type, offset, iterations);
                  }
              }
              this.renderObjects(camera, transform, mesh.objects);
          };
          Renderer.prototype.renderObjects = function (camera, transform, objects) {
              var _this = this;
              objects.forEach(function (object) {
                  switch (object.typeinfo()) {
                      case "Object3D":
                          _this.renderObject(camera, matrix_5.Matrix.mul(object.matrix, transform), object);
                          break;
                      case "Mesh":
                          _this.renderMesh(camera, matrix_5.Matrix.mul(object.matrix, transform), object);
                          break;
                  }
              });
          };
          Renderer.prototype.render = function (camera, scene) {
              if (scene.visible === false)
                  return;
              this.lights = scene.lights;
              this.renderObjects(camera, scene.matrix, scene.objects);
          };
          return Renderer;
      }());
      exports.Renderer = Renderer;
  });
  define("src/graphics/rendertarget", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      var RenderTarget = (function () {
          function RenderTarget(width, height) {
              this.width = width;
              this.height = height;
          }
          RenderTarget.prototype.typeinfo = function () {
              return "Object3D";
          };
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
  define("src/index", ["require", "exports", "src/math/box", "src/math/frustum", "src/math/matrix", "src/math/plane", "src/math/quaternion", "src/math/radian", "src/math/ray", "src/math/single", "src/math/sphere", "src/math/triangle", "src/math/vector2", "src/math/vector3", "src/math/vector4", "src/math/vectorN", "src/graphics/attribute", "src/graphics/camera", "src/graphics/geometry", "src/graphics/light", "src/graphics/material", "src/graphics/mesh", "src/graphics/object", "src/graphics/renderer", "src/graphics/rendertarget", "src/graphics/scene", "src/graphics/shader", "src/graphics/texture2D", "src/graphics/textureCube"], function (require, exports, box_2, frustum_2, matrix_6, plane_5, quaternion_2, radian_2, ray_4, single_4, sphere_2, triangle_2, vector2_2, vector3_10, vector4_3, vectorN_2, attribute_2, camera_1, geometry_1, light_1, material_1, mesh_1, object_4, renderer_1, rendertarget_1, scene_1, shader_1, texture2D_2, textureCube_1) {
      "use strict";
      exports.__esModule = true;
      exports.Box = box_2.Box;
      exports.Frustum = frustum_2.Frustum;
      exports.Matrix = matrix_6.Matrix;
      exports.Plane = plane_5.Plane;
      exports.Quaternion = quaternion_2.Quaternion;
      exports.Radian = radian_2.Radian;
      exports.Ray = ray_4.Ray;
      exports.Single = single_4.Single;
      exports.Sphere = sphere_2.Sphere;
      exports.Triangle = triangle_2.Triangle;
      exports.Vector2 = vector2_2.Vector2;
      exports.Vector3 = vector3_10.Vector3;
      exports.Vector4 = vector4_3.Vector4;
      exports.VectorN = vectorN_2.VectorN;
      exports.Attribute = attribute_2.Attribute;
      exports.Camera = camera_1.Camera;
      exports.PerspectiveCamera = camera_1.PerspectiveCamera;
      exports.OrthoCamera = camera_1.OrthoCamera;
      exports.Geometry = geometry_1.Geometry;
      exports.Light = light_1.Light;
      exports.Material = material_1.Material;
      exports.Mesh = mesh_1.Mesh;
      exports.Object3D = object_4.Object3D;
      exports.Renderer = renderer_1.Renderer;
      exports.RenderTarget = rendertarget_1.RenderTarget;
      exports.Scene = scene_1.Scene;
      exports.Shader = shader_1.Shader;
      exports.Texture2D = texture2D_2.Texture2D;
      exports.TextureCube = textureCube_1.TextureCube;
  });
  define("test/meshes/hexagon", ["require", "exports", "src/index"], function (require, exports, hexagon) {
      "use strict";
      exports.__esModule = true;
      function toRadian(angle) {
          return (angle * 0.01745329);
      }
      var createHexagonTemplate = function () { return ({
          positions: [
              new hexagon.Vector3(Math.sin(toRadian(60 * 0)), 1, Math.cos(toRadian(60 * 0))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 1)), 1, Math.cos(toRadian(60 * 1))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 2)), 1, Math.cos(toRadian(60 * 2))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 3)), 1, Math.cos(toRadian(60 * 3))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 4)), 1, Math.cos(toRadian(60 * 4))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 5)), 1, Math.cos(toRadian(60 * 5))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 0)), 0, Math.cos(toRadian(60 * 0))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 1)), 0, Math.cos(toRadian(60 * 1))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 2)), 0, Math.cos(toRadian(60 * 2))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 3)), 0, Math.cos(toRadian(60 * 3))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 4)), 0, Math.cos(toRadian(60 * 4))),
              new hexagon.Vector3(Math.sin(toRadian(60 * 5)), 0, Math.cos(toRadian(60 * 5))),
          ],
          indices: [
              0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 5, 4,
              6, 7, 8, 6, 8, 9, 6, 9, 10, 6, 10, 11,
              0, 1, 7, 7, 6, 0, 1, 2, 8, 8, 7, 1, 2, 3, 9, 9, 8, 2,
              3, 4, 10, 10, 9, 3, 4, 5, 11, 11, 10, 4, 5, 0, 6, 6, 11, 5
          ]
      }); };
      function createHexagonGeometry() {
          var template = createHexagonTemplate();
          var positions = new Array();
          var normals = new Array();
          var texcoords = new Array();
          var indices = new Array();
          for (var i = 0; i < template.indices.length; i += 3) {
              var v0 = template.positions[template.indices[i + 0]];
              var v1 = template.positions[template.indices[i + 1]];
              var v2 = template.positions[template.indices[i + 2]];
              positions.push(v0);
              positions.push(v1);
              positions.push(v2);
              var d0 = v0.sub(v1);
              var d1 = v0.sub(v2);
              var normal = d1.cross(d0).normalize();
              normals.push(normal);
              normals.push(normal);
              normals.push(normal);
              texcoords.push(new hexagon.Vector2(0, 0));
              texcoords.push(new hexagon.Vector2(0, 0));
              texcoords.push(new hexagon.Vector2(0, 0));
              indices.push(i + 0);
              indices.push(i + 1);
              indices.push(i + 2);
          }
          return new hexagon.Geometry({
              attributes: {
                  vertex_position: hexagon.Attribute.fromArray(positions),
                  vertex_normal: hexagon.Attribute.fromArray(normals),
                  vertex_texcoord: hexagon.Attribute.fromArray(texcoords)
              },
              indices: new hexagon.Attribute(new Uint16Array(indices), 1)
          });
      }
      function createHexagonMesh() {
          var material = new hexagon.Material(new hexagon.Shader("\n    precision highp float;\n\n    uniform vec3  camera_position;\n    uniform mat4  camera_projection;\n    uniform mat4  camera_view;\n    uniform mat4  object_matrix;\n\n    attribute vec4  instance_model_0;\n    attribute vec4  instance_model_1;\n    attribute vec4  instance_model_2;\n    attribute vec4  instance_model_3;\n    attribute vec3  instance_color;\n    attribute float instance_height;\n\n    attribute vec3  vertex_position;\n    attribute vec3  vertex_normal;\n    attribute vec2  vertex_texcoord;\n\n    varying   vec3  position;\n    varying   vec3  color;\n    varying   vec3  normal;\n    varying   vec2  texcoord;\n\n    void main(void) {\n      mat4 instance_model = object_matrix * mat4(\n        instance_model_0,\n        instance_model_1,\n        instance_model_2,\n        instance_model_3\n      );\n      vec3 adjusted     = vec3(vertex_position.x, vertex_position.y * instance_height, vertex_position.z);\n      vec4 translated   = instance_model * vec4(adjusted, 1.0);\n      position          = translated.xyz;\n      color             = instance_color;\n      normal            = (instance_model * vec4(vertex_normal, 0.0)).xyz;\n      texcoord          = vertex_texcoord;\n      gl_Position       = camera_projection * camera_view * (instance_model * vec4(adjusted, 1.0));\n    }\n    ", "\n    precision highp float;\n\n    struct Light {\n      vec3  position;\n      vec3  diffuse;\n      vec3  ambient;\n      vec3  specular;\n      float attenuation;\n      float intensity;\n    };\n    uniform Light lights[16];\n\n    uniform vec3 camera_position;\n    uniform mat4 camera_projection;\n    uniform mat4 camera_view;\n    uniform mat4 object_matrix;\n\n    varying vec3 position;\n    varying vec3 color;\n    varying vec3 normal;\n    varying vec2 texcoord;\n\n    vec3 diffuse(vec3 position, vec3 normal, vec3 color, Light light) {\n      vec3   surfaceToLight     = normalize(light.position - position);\n      float  diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));\n      return diffuseCoefficient * color * light.intensity;\n    }\n    \n    vec3 ambient(vec3 color, Light light) {\n      return light.ambient * color * light.intensity;\n    }\n\n    vec3 specular(vec3 position, vec3 normal, vec3 color, vec3 camera_position, Light light) {\n      vec3 surfaceToLight   = normalize(light.position - position);\n      vec3 incidenceVector  = -surfaceToLight;                         // a unit vector\n      vec3 reflectionVector = reflect(incidenceVector, normal);        // also a unit vector\n      vec3 surfaceToCamera = normalize(camera_position - position);    // also a unit vector\n      float cosAngle = max(0.0, dot(surfaceToCamera, reflectionVector));\n      float specularCoefficient = pow(cosAngle, 1.0);                  // where 1.0 is shininess;\n      return specularCoefficient * vec3(1, 1, 1) * light.intensity;    // where vec is specular  \n    }\n\n    float attenuation(vec3 position, Light light) {\n      float distanceToLight = length(light.position - position);\n      float attenuation = 0.001;\n      if(light.attenuation > 0.0) { attenuation = light.attenuation; }\n      return 1.0 / (1.0 + attenuation * pow(distanceToLight, 2.0));\n    }\n\n    void main(void) {\n      vec3  _diffuse      = diffuse(position, normal, color, lights[0]);\n      vec3  _ambient      = ambient(color, lights[0]);\n      vec3  _specular     = specular(position, normal, color, camera_position, lights[0]);\n      float _attenuation  = attenuation(position, lights[0]);\n      vec3  _linear       = _ambient + (_attenuation * (_diffuse * _specular));\n      vec3 _gamma         = vec3(1.0/2.2, 1.0/2.2, 1.0/2.2);\n      vec3 _final         = vec3(pow(_linear.x, _gamma.x),\n                                 pow(_linear.y, _gamma.y),\n                                 pow(_linear.z, _gamma.z));\n      gl_FragColor        = vec4(_final, 1.0);\n    }\n  "));
          console.log(1.0 / (1.0 + 0.01 * Math.pow(100, 2)));
          var x0 = Math.sin(toRadian(60 * 1)) * 2;
          var y0 = Math.cos(toRadian(60 * 1)) * 3;
          var geometry = createHexagonGeometry();
          var width = 200;
          var height = 200;
          var half_width = (width * 0.5);
          var half_height = (height * 0.5);
          var count = width * height;
          var models_0 = new Array(count);
          var models_1 = new Array(count);
          var models_2 = new Array(count);
          var models_3 = new Array(count);
          var colors = new Array(count);
          var heights = new Array(count);
          var index = 0;
          for (var y = 0; y < height; y++) {
              for (var x = 0; x < width; x++) {
                  var xx = (x % 2 != 0) ? (x0 * y) : (x0 * y) + (x0 * 0.5);
                  var yy = (y0 * x);
                  var cols = hexagon.Matrix.translation(new hexagon.Vector3(xx - width, 0, yy - height)).rows();
                  models_0[index] = cols[0];
                  models_1[index] = cols[1];
                  models_2[index] = cols[2];
                  models_3[index] = cols[3];
                  heights[index] = new hexagon.Single(1);
                  colors[index] = (Math.random() > 0.8)
                      ? new hexagon.Vector3(0.8, 0.4, 0)
                      : new hexagon.Vector3(0.25, 0.25, 0.25);
                  index += 1;
              }
          }
          var mesh = new hexagon.Mesh(material, geometry);
          mesh.instances.instance_model_0 = hexagon.Attribute.fromArray(models_0);
          mesh.instances.instance_model_0 = hexagon.Attribute.fromArray(models_0);
          mesh.instances.instance_model_1 = hexagon.Attribute.fromArray(models_1);
          mesh.instances.instance_model_2 = hexagon.Attribute.fromArray(models_2);
          mesh.instances.instance_model_3 = hexagon.Attribute.fromArray(models_3);
          mesh.instances.instance_height = hexagon.Attribute.fromArray(heights);
          mesh.instances.instance_color = hexagon.Attribute.fromArray(colors);
          return mesh;
      }
      exports.createHexagonMesh = createHexagonMesh;
  });
  define("test/index", ["require", "exports", "src/index", "test/meshes/hexagon"], function (require, exports, hexagon, hexagon_1) {
      "use strict";
      exports.__esModule = true;
      window.addEventListener("load", function () {
          var renderer = new hexagon.Renderer(document.querySelector("#canvas"));
          var camera = new hexagon.PerspectiveCamera(45, 800 / 480, 0.1, 4000);
          var scene = new hexagon.Scene();
          var mesh = hexagon_1.createHexagonMesh();
          var light = new hexagon.Light();
          light.position = new hexagon.Vector3(0, 20, 0);
          light.intensity = new hexagon.Single(1.4);
          light.attenuation = new hexagon.Single(0.0001);
          scene.objects.push(mesh);
          scene.lights.push(light);
          var t = 0.1;
          (function loop() {
              requestAnimationFrame(function () {
                  var array = mesh.instances["instance_height"].array;
                  for (var i = 0; i < array.length; i++) {
                      array[i] = (Math.cos((i * 0.16) + (t * 0.1)) * 1) + 3;
                  }
                  mesh.needsupdate = true;
                  mesh.matrix = mesh.matrix.rotateY(0.0025);
                  camera.lookAt(new hexagon.Vector3((t * 0.14) % 30, 10, (t * 0.04) % 30), new hexagon.Vector3(0, 0, 0), new hexagon.Vector3(-0.5, 1, 0));
                  renderer.render(camera, scene);
                  renderer.clear(0.11, 0.11, 0.11, 1);
                  renderer.render(camera, scene);
                  t += 1.0;
                  loop();
              });
          })();
      });
  });
  
  return collect(); 
})();