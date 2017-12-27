/*--------------------------------------------------------------------------

hexagon - webgl graphics renderer written in typescript.

The MIT License (MIT)

Copyright (c) 2017 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

export type AnimationTrackFrame = { time: number, value: number, type: "step" | "linear"}
export type AnimationTrackState = {value: number, type: "step" | "linear" }

/**
 * AnimationTrack
 * 
 * A animation track that contains an array of keyframes and produces
 * values over time.
 */
export class AnimationTrack {
  public frames: AnimationTrackFrame[] = []

  /**
   * inserts this frame at the given location.
   * @param {number} time the time of this frame.
   * @param {number} value the value of this frame.
   * @param {InterpolationType} type the interpolation type.
   * @returns {void}
   */
  public add (time: number, value: number, type: "step" | "linear" = "step"): void {
    for (let i = 0; i < this.frames.length; i++){
      if(time === this.frames[i].time) {
        this.frames[i].value = value
        this.frames[i].type = type
        return
      }
    }
    this.frames.push({time, value, type})
    this.frames = this.frames.sort((a, b) => {
      if(a.time > b.time)   { return  1 }
      if(a.time < b.time)   { return -1 }
      return 0
    })
  }

  /**
   * removes a frame at the given time index.
   * @param {number} time the time of this frame.
   * @returns {void}
   */
  public remove (time: number): void {
    this.frames = this.frames.filter(n => n.time !== time)
  }

  /**
   * gets a value at the given time offset.
   * @param {number} time the time offset.
   * @returns {number}
   */
  public get(time: number): AnimationTrackState {
    // if zero frames, return 0
    if (this.frames.length === 0) { 
      return { value: 0, type: "step" } 
    }
    // if one frame, return that frames value.
    if (this.frames.length === 1) { 
      return { value: this.frames[0].value, type: this.frames[0].type } 
    }
    // if less than first time bounds, return 0.
    if (time < this.frames[0].time) { 
      return { value: this.frames[0].value, type: "step" }
    }
    // if greater than or equal to max time bounds, return last value.
    if (time >= this.frames[this.frames.length - 1].time) { 
      return { 
        value: this.frames[this.frames.length - 1].value, 
        type:  this.frames[this.frames.length - 1].type 
      } 
    }
    // select current and next frames
    let current_index = -1
    let next_index    = -1
    for (let i = 0; i < (this.frames.length - 1); i++) {
      if (time >= this.frames[i].time && time < this.frames[i + 1].time) {
        current_index = (i)
        next_index    = (i+1)
        break
      }
    }
    // calculate frame offset.
    const current = this.frames[current_index]
    const next    = this.frames[next_index]
    switch (current.type) {
      case "step": {
        return { 
          value: current.value, 
          type: current.type 
        }
      }
      case "linear": {
        if (time === current.time) { 
          return { 
            value: current.value, 
            type: current.type 
          }
        } else {
          const delta_a = next.time - current.time
          const delta_b = time - current.time
          const scalar  = delta_b / delta_a
          const delta_c = next.value - current.value
          return { 
            value: current.value + (delta_c * scalar), 
            type: current.type 
          }
        }
      }
    }
  }
}