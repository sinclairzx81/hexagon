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

import { AnimationTrack }     from "./animation-track"
import { AnimationTrackState} from "./animation-track"

/**
 * Animation
 * 
 * Contains a sequence of animation tracks, and houses them by name. Provides
 * a interface to return the state of tracks at a given time.
 */
export class Animation {
  public tracks: {[name: string] : AnimationTrack } = {}

  /**
   * adds a new animation track to this animation.
   * @param {string} name the name of this track.
   * @param {number} time the time value.
   * @param {number} value the value at this time.
   * @param {string} type the interpolation type.
   * @returns {void}
   */
  public add(name: string, time: number, value: number, type: "step" | "linear" = "step"): void {
    if (this.tracks[name] === undefined) {
      this.tracks[name] = new AnimationTrack()
    }
    this.tracks[name].add(time, value, type)
  }

  /**
   * removes a animation track from this animation.
   * @param {string} name the name of the track to remove.
   * @returns {void}
   */
  public remove(name: string): void {
    delete this.tracks[name]
  }

  /**
   * returns the state of all tracks in this animation.
   * @param {time} time the time offset to get.
   * @returns {[name: string]: AnimationTrackState}
   */
  public get(time: number): {[name: string]: AnimationTrackState} {
    const state = {}
    for(const key in this.tracks) {
      state[key] = this.tracks[key].get(time)
    }
    return state
  } 
}